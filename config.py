import os

from dotenv import load_dotenv

load_dotenv()

# --- URLs (env on the host, localhost defaults for local dev) ---
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000").rstrip("/")

# Must be identical in the /login and /callback routes, and registered
# exactly like this in the GitHub / Google OAuth consoles.
GITHUB_REDIRECT_URI = f"{BACKEND_URL}/auth/github/callback"
GOOGLE_REDIRECT_URI = f"{BACKEND_URL}/auth/google/callback"

# Cookies are only marked Secure when the backend is served over https
COOKIE_SECURE = BACKEND_URL.startswith("https://")

# --- Database (D2) ---
DATABASE_URL = os.getenv("DATABASE_URL", "")

# Hosts hand out postgres:// or postgresql://; SQLAlchemy needs to be told to use psycopg v3
for _prefix in ("postgres://", "postgresql://"):
    if DATABASE_URL.startswith(_prefix):
        DATABASE_URL = "postgresql+psycopg://" + DATABASE_URL[len(_prefix):]
        break