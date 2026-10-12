import httpx
from typing import Optional

CF_URL = "https://codeforces.com/api/user.info"


def fetch_codeforces(handle: str) -> Optional[dict]:
    try:
        resp = httpx.get(CF_URL, params={"handles": handle}, timeout=10)
        data = resp.json()

    except (httpx.HTTPError, ValueError):
        return None

    if data.get("status") != "OK":
        return None

    info = data["result"][0]

    return {
        "rating": info.get("rating"),
        "max_rating": info.get("maxRating"),
        "rank": info.get("rank"),
        "max_rank": info.get("maxRank"),
    }
