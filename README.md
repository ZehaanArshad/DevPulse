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
   DATABASE_URL=postgresql+psycopg://<user>:<password>@localhost/devpulse
   SECRET_KEY=<long random string>
   ```

   Generate a key with: `python3 -c "import secrets; print(secrets.token_hex(32))"`

4. Apply migrations: `alembic upgrade head`
5. Run the server: `uvicorn main:app --reload`

Interactive API docs are at http://127.0.0.1:8000/docs.

## Frontend

`cd Frontend && npm install && npm run dev` (runs on http://localhost:5173)

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| POST | `/signup` | Register a new user (201, 409 if user exists) |
| POST | `/login` | Authenticate user and return token (401 on bad credentials) |
| GET | `/me` | Get current user info |
| DELETE | `/users/{user_id}?confirm=true` | Delete a user and their profiles (409 without `confirm`) |
| GET | `/users/{user_id}/profiles` | List a user's platform profiles |
| POST | `/users/{user_id}/profiles` | Add a profile (`platform`: `codeforces` or `leetcode`, `handle`) |
| GET | `/users/{user_id}/stats` | Fetch live stats for every profile of a user |

*Note: `/me` and `/users/{user_id}/...` endpoints require `Authorization: Bearer <token>`. Missing/invalid token returns 401; accessing another user's `/users/{user_id}/...` routes returns 403.*

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
