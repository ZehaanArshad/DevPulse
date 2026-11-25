# DevPulse

A FastAPI + PostgreSQL backend (with a React frontend) that aggregates a
developer's profiles into one dashboard: **Codeforces, LeetCode, AtCoder**
(problem solving) and **GitHub** (development).

## Setup

1. Create and activate a virtual environment, then install dependencies:
   `python3 -m venv .venv && source .venv/bin/activate`
   `pip install -r requirements.txt`
2. Create a Postgres database named `devpulse`.
3. Create a `.env` file in the project root:

   ```
   DATABASE_URL=postgresql+psycopg://<user>:<password>@localhost/devpulse
   SECRET_KEY=<long random string>
   ```

   Generate a key with: `python3 -c "import secrets; print(secrets.token_hex(32))"`

4. Apply migrations: `alembic upgrade head`
5. Run the server: `uvicorn main:app --reload`

Interactive API docs are at http://127.0.0.1:8000/docs.

## Frontend

`cd Frontend && npm install && npm run dev` (runs on http://localhost:5173)

The frontend reads the API address from `VITE_API_URL` (default
`http://localhost:8000`). Vite bakes it in at build time.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | Postgres connection string. `postgres://` and `postgresql://` are rewritten to `postgresql+psycopg://` automatically. |
| `SECRET_KEY` | yes | Signs the JWTs. Use a new random value in production. |
| `FRONTEND_URL` | deploy | Where the frontend lives (CORS and the redirect after social login). Default `http://localhost:5173`. No trailing slash. |
| `BACKEND_URL` | deploy | Public URL of this API (used for the OAuth redirect URIs). Default `http://localhost:8000`. |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | for GitHub login | GitHub OAuth app credentials. |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | for Google login | Google OAuth client credentials. |
| `GITHUB_TOKEN` | recommended | Personal access token (no scopes) used for GitHub *stats*. Without it GitHub allows 60 requests/hour per IP, with it 5000. |

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| POST | `/signup` | Register with `username`, `email`, `password` (201; 409 if username or email exists) |
| POST | `/login` | Log in with `email` and `password`, returns a JWT (401 on bad credentials) |
| GET | `/me` | Get the current user (requires token) |
| GET | `/auth/google/login` | Start Google sign-in (redirects to Google) |
| GET | `/auth/google/callback` | Google returns here; redirects to the frontend with the JWT |
| GET | `/auth/github/login` | Start GitHub sign-in (redirects to GitHub) |
| GET | `/auth/github/callback` | GitHub returns here; redirects to the frontend with the JWT |
| DELETE | `/users/{user_id}?confirm=true` | Delete a user and their profiles (409 without `confirm`) |
| GET | `/users/{user_id}/profiles` | List a user's platform profiles |
| POST | `/users/{user_id}/profiles` | Link a profile (`platform`: `codeforces`, `leetcode`, `atcoder` or `github`, plus `handle`). The handle is checked first: 404 if it does not exist, 503 if the platform cannot be reached, 409 if already linked. |
| DELETE | `/users/{user_id}/profiles/{profile_id}` | Unlink a profile |
| GET | `/users/{user_id}/stats` | Stats for every linked profile plus a combined summary. Results are cached for 5 minutes; add `?refresh=true` to bypass the cache. |

*Note: `/me` and `/users/{user_id}/...` endpoints require `Authorization: Bearer <token>`. Missing/invalid token returns 401; accessing another user's `/users/{user_id}/...` routes returns 403. Tokens last 24 hours.*

## Stats response

Each entry in `profiles` is `{platform, handle, stats, error}`. `stats` is
`null` when the platform could not be read, and `error` says why:
`not_found`, `rate_limited`, `unavailable` or `unsupported_platform`.

| Platform | Fields in `stats` |
| --- | --- |
| Codeforces | `rating`, `max_rating`, `rank`, `max_rank`, `all`, `easy`, `medium`, `hard`, `topics`, `activity` |
| LeetCode | `all`, `easy`, `medium`, `hard`, `topics`, `activity` |
| AtCoder | `rating`, `max_rating`, `rank` (colour name), `max_rank`, `contests` (rated), `all` (solved), `activity` |
| GitHub | `name`, `avatar_url`, `public_repos`, `followers`, `following`, `stars`, `forks`, `languages`, `top_repos`, `events` |

`activity` and `events` map `YYYY-MM-DD` to a count. The `summary` object
combines the platforms: `profiles_linked`, `profiles_resolved`,
`best_codeforces_rating`, `best_atcoder_rating`, `leetcode_total_solved`,
`total_solved`, `activity`, `active_days`, `submissions`, `current_streak`,
`max_streak` and merged `topics` (Codeforces tags are mapped to shared names,
for example `dp` and `dynamic programming` count together).

## Social login flow

1. The frontend sends the browser to `<BACKEND_URL>/auth/google/login`
   or `/auth/github/login` (a full-page navigation, not `fetch`).
2. The user approves on Google/GitHub, which returns to our callback route.
3. The backend verifies the `state`, exchanges the code, requires a verified
   email, then finds the user by provider id, links an existing account with
   the same email, or creates a new one.
4. The backend redirects to `<FRONTEND_URL>/auth/callback#token=<JWT>`.
   The frontend reads the token from the URL fragment and sends it as
   `Authorization: Bearer <JWT>` on later requests.

Accounts created through Google or GitHub have no password, so password
login for them returns 401.

## Deployment

The backend and frontend are deployed separately.

**Backend (for example Render, with a managed Postgres):**

- Build command: `pip install -r requirements.txt`
- Start command: `alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port $PORT`
- Set the environment variables above. `BACKEND_URL` is the backend's own
  public URL and `FRONTEND_URL` is the frontend's.
- Register the production callback URLs with the OAuth providers:
  `<BACKEND_URL>/auth/github/callback` and `<BACKEND_URL>/auth/google/callback`.
  A GitHub OAuth app has only one callback URL, so use a separate OAuth app
  for production.

**Frontend (for example Vercel):**

- Root directory `Frontend`, build command `npm run build`, output `dist`.
- Set `VITE_API_URL` to the backend URL before building.
- `Frontend/vercel.json` rewrites every path to `index.html`, so client-side
  routes such as `/auth/callback` work on refresh.

## Design notes

- Passwords are stored as argon2 hashes, tokens are JWTs signed with `SECRET_KEY`, and routes only allow a user to access their own data.
- Stats are fetched live from each platform and cached in memory for 5
  minutes per `(platform, handle)`. Only clean successes are cached, so
  failed, rate-limited or partial results are retried on the next request.
  The cache lives in one process and is cleared on restart.
- A handle is validated when it is linked, so a typo is rejected up front
  instead of showing up later as empty stats.
- LeetCode data comes from its unofficial GraphQL endpoint, so it is
  best-effort.
- AtCoder rating and contests come from AtCoder's own JSON; the solved count
  and daily activity come from the community kenkoooo API. If kenkoooo is
  down, the rating still works.
- GitHub stats use the public REST API. Activity covers about the last 90
  days (public events) and is kept separate from the problem-solving
  `activity`, so streaks and submission totals only count problem solving.
- Adding a platform = add a `fetch_<platform>` function returning
  `(stats, error)` in `platforms.py`, add a handle check to `validate_handle`,
  add it to the `Literal` in `schemas.py`, and add a branch in `/stats`.
- Multiple accounts per platform are allowed; question-level deduplication across accounts is not implemented, so totals may overlap.
