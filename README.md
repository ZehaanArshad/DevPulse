# DevPulse

A FastAPI + PostgreSQL backend that aggregates competitive programming
profiles (Codeforces, LeetCode) into one place.

## Setup

1. Create and activate a virtual environment, then install dependencies:
   `python3 -m venv .venv && source .venv/bin/activate`
   `pip install -r requirements.txt`
2. Create a Postgres database named `devpulse`.
3. Create a `.env` file in the project root:
   `DATABASE_URL=postgresql+psycopg://<user>@localhost/devpulse`
4. Apply migrations: `alembic upgrade head`
5. Run the server: `uvicorn main:app --reload`

Interactive API docs are at http://127.0.0.1:8000/docs.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/users` | List all users |
| POST | `/users` | Create a user (`{"username": "..."}`) |
| GET | `/users/{user_id}` | Get one user (404 if missing) |
| DELETE | `/users/{user_id}?confirm=true` | Delete a user and their profiles (409 without `confirm`) |
| GET | `/users/{user_id}/profiles` | List a user's platform profiles |
| POST | `/users/{user_id}/profiles` | Add a profile (`platform`: `codeforces` or `leetcode`, `handle`) |
| GET | `/users/{user_id}/stats` | Fetch live stats for every profile of a user |

## Design notes

- Stats are fetched live from each platform on request; a failed or
  unknown handle returns `"stats": null` instead of an error.
- LeetCode data comes from its unofficial GraphQL endpoint, so it is
  best-effort.
- Adding a platform = add a `fetch_<platform>` function in
  `platforms.py`, add it to the `Literal` in `schemas.py`, and add a
  branch in `/stats`.
