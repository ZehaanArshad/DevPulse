# DevPulse

A FastAPI + PostgreSQL backend that aggregates competitive programming
profiles (Codeforces, LeetCode) into one place.

## Setup

1. Create and activate a virtual environment, then install dependencies:
   `python3 -m venv .venv && source .venv/bin/activate`
   `pip install -r requirements.txt`
2. Create a Postgres database named `devpulse`.
3. Create a `.env` file in the project root:

   ```
   DATABASE_URL=postgresql+psycopg://<user>@localhost/devpulse
   SECRET_KEY=<long random string>
   ```

   Generate a key with: `python3 -c "import secrets; print(secrets.token_hex(32))"`

4. Apply migrations: `alembic upgrade head`
5. Run the server: `uvicorn main:app --reload`

Interactive API docs are at http://127.0.0.1:8000/docs.

## Frontend

`cd Frontend && npm install && npm run dev` (runs on http://localhost:5173)

## Endpoints

| POST | `/signup` | Register with `username`, `email`, `password` (201; 409 if username or email exists) |
| POST | `/login` | Log in with `email` and `password`, returns a JWT (401 on bad credentials) |
| GET | `/me` | Get the current user (requires token) |
| GET | `/auth/google/login` | Start Google sign-in (redirects to Google) |
| GET | `/auth/google/callback` | Google returns here; redirects to the frontend with the JWT |
| GET | `/auth/github/login` | Start GitHub sign-in (redirects to GitHub) |
| GET | `/auth/github/callback` | GitHub returns here; redirects to the frontend with the JWT |

| DELETE | `/users/{user_id}?confirm=true` | Delete a user and their profiles (409 without `confirm`) |
| GET | `/users/{user_id}/profiles` | List a user's platform profiles |
| POST | `/users/{user_id}/profiles` | Add a profile (`platform`: `codeforces` or `leetcode`, `handle`) |
| GET | `/users/{user_id}/stats` | Fetch live stats for every profile of a user |

*Note: `/me` and `/users/{user_id}/...` endpoints require `Authorization: Bearer <token>`. Missing/invalid token returns 401; accessing another user's `/users/{user_id}/...` routes returns 403.*

## Social login flow

1. The frontend sends the browser to `http://localhost:8000/auth/google/login`
   or `/auth/github/login` (a full-page navigation, not `fetch`).
2. The user approves on Google/GitHub, which returns to our callback route.
3. The backend verifies the `state`, exchanges the code, requires a verified
   email, then finds the user by provider id, links an existing account with
   the same email, or creates a new one.
4. The backend redirects to `http://localhost:5173/auth/callback#token=<JWT>`.
   The frontend reads the token from the URL fragment and sends it as
   `Authorization: Bearer <JWT>` on later requests.

Accounts created through Google or GitHub have no password, so password
login for them returns 401.

## Design notes

- Passwords are stored as argon2 hashes, tokens are JWTs signed with `SECRET_KEY`, and routes only allow a user to access their own data.
- Stats are fetched live from each platform on request; a failed or
  unknown handle returns `"stats": null` instead of an error.
- LeetCode data comes from its unofficial GraphQL endpoint, so it is
  best-effort.
- Adding a platform = add a `fetch_<platform>` function in
  `platforms.py`, add it to the `Literal` in `schemas.py`, and add a
  branch in `/stats`.
- Multiple accounts per platform are allowed; question-level deduplication across accounts is not implemented, so totals may overlap.
