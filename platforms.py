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


LC_URL = "https://leetcode.com/graphql"
LC_QUERY = """

query($username: String!) {
    matchedUser(username: $username) {
        submitStats: submitStatsGlobal {
            acSubmissionNum {difficulty count}
        }
    }
}
"""


def fetch_leetcode(handle: str) -> Optional[dict]:
    try:
        resp = httpx.post(
            LC_URL,
            json={"query": LC_QUERY, "variables": {"username": handle}},
            headers={"Referer": "https://leetcode.com"},
            timeout=10,
        )
        data = resp.json()

    except (httpx.HTTPError, ValueError):
        return None

    user = (data.get("data") or {}).get("matchedUser")

    if not user:
        return None

    solved = {
        row["difficulty"].lower(): row["count"]
        for row in user["submitStats"]["acSubmissionNum"]
    }

    return solved
