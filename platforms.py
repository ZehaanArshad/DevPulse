import httpx,json
from urllib.parse import quote
from typing import Optional
from collections import Counter
from datetime import datetime, timezone, timedelta

CF_URL = "https://codeforces.com/api/user.info"


def fetch_codeforces(handle: str) -> tuple[Optional[dict], Optional[str]]:
    try:
        resp = httpx.get(CF_URL, params={"handles": handle}, timeout=10)
        data = resp.json()

    except (httpx.HTTPError, ValueError):
        return None, "unavailable"

    if data.get("status") != "OK":
        comment=data.get("comment", "")

        if "not found" in comment:
            return None, "not_found"

        if "limit" in comment.lower():
            return None, "rate_limited"

        return None, "unavailable"

    info = data["result"][0]

    return {
        "rating": info.get("rating"),
        "max_rating": info.get("maxRating"),
        "rank": info.get("rank"),
        "max_rank": info.get("maxRank"),
    }, None


LC_URL = "https://leetcode.com/graphql"
LC_QUERY = """query($username: String!) {
    matchedUser(username: $username) {
        submitStats: submitStatsGlobal {
            acSubmissionNum {difficulty count}
        }
        submissionCalendar
        tagProblemCounts {
            fundamental { tagName problemsSolved }
            intermediate { tagName problemsSolved }
            advanced { tagName problemsSolved }
        }
    }
}"""

def fetch_leetcode(handle: str) -> tuple[Optional[dict], Optional[str]]:
    try:
        resp = httpx.post(
            LC_URL,
            json={"query": LC_QUERY, "variables": {"username": handle}},
            headers={
                "Referer": "https://leetcode.com",
                "User-Agent": "Mozilla/5.0 (compatible; DevPulse/1.0)",
            },
            timeout=10,
        )
    except httpx.HTTPError:
        return None, "unavailable"

    if resp.status_code == 429:
        return None, "rate_limited"

    try:
        data = resp.json()
    except ValueError:
        return None, "unavailable"

    payload = data.get("data")
    if payload is None:
        return None, "unavailable"

    user = payload.get("matchedUser")
    if not user:
        return None, "not_found"

    solved = {
        row["difficulty"].lower(): row["count"]
        for row in user["submitStats"]["acSubmissionNum"]
    }

    calendar=json.loads(user.get("submissionCalendar") or "{}")

    activity={}

    for ts,count in calendar.items():
        day=datetime.fromtimestamp(int(ts), tz=timezone.utc).date().isoformat()
        activity[day]=count

    solved["activity"]=activity

    groups=user.get("tagProblemCounts") or {}

    tags=[]

    for level in ("fundamental", "intermediate", "advanced"):

        tags.extend(groups.get(level) or [])

    topics =sorted(
        (
        {"name": t["tagName"], "count": t["problemsSolved"]}
        for t in tags
        if t["problemsSolved"]>0
    ),
    key=lambda t: t["count"],
    reverse=True,
    )[:]

    solved["topics"]=topics

    return solved, None

CF_STATUS_URL= "https://codeforces.com/api/user.status"

def bucket_from_rating(rating : int) ->str:

    if rating<=1200:
        return "easy"

    elif rating<=1800:
        return "medium"

    return "hard"


def bucket_from_index(index : str) -> str:

    letter=index[0]

    if letter in "AB":
        return "easy"
    elif letter in "C":
        return "medium"

    return "hard"


def fetch_codeforces_solved(handle:str) -> tuple[Optional[dict], Optional[str]]:

    try:
        resp=httpx.get(CF_STATUS_URL, params={"handle":handle }, timeout=10)
        data=resp.json()

    except (httpx.HTTPError, ValueError):

        return None, "unavailable"

    if data.get("status") != "OK":
        comment = data.get("comment", "")
        if "not found" in comment:
            return None, "not_found"
        if "limit" in comment.lower():
            return None, "rate_limited"
        return None, "unavailable"


    solved= {}
    tags_by_problem={}
    activity=Counter()

    for sub in data["result"]:
        day=datetime.fromtimestamp(sub["creationTimeSeconds"], tz=timezone.utc).date().isoformat()
        activity[day]+=1

        if sub.get("verdict")!="OK":
            continue

        problem=sub["problem"]

        key= (problem.get("contestId"), problem["index"])

        solved[key]=problem.get("rating")
        tags_by_problem[key]=problem.get("tags",[])

    counts={"easy":0,"medium":0,"hard":0}

    topic_counts=Counter()

    for tags in tags_by_problem.values():
        topic_counts.update(tags)

    topics=[
        {"name":name,"count":count}
        for name,count in topic_counts.most_common()
    ]

    


    for (contest_id, index), rating in solved.items():

        if rating is not None:

            counts[bucket_from_rating(rating)]+=1

        else:
            counts[bucket_from_index(index)]+=1

    return {"all": sum(counts.values()), **counts, "topics": topics,"activity":dict(activity)},None

def validate_handle(platform: str, handle:str) -> Optional[str]:

    """Return None if the handle exists, otherwise a reason string."""

    if platform=="codeforces":
        _,error = fetch_codeforces(handle)

        
        return error

    if platform == "leetcode":
        _, error = fetch_leetcode(handle)
        return error

    if platform == "atcoder":
        return atcoder_exists(handle)

    return "unsupported_platform"

AT_USER_URL = "https://atcoder.jp/users/"
KENKO_URL = "https://kenkoooo.com/atcoder/atcoder-api/v3/user"
AT_HEADERS = {"User-Agent": "DevPulse/1.0"}


def atcoder_rank(rating: Optional[int]) -> Optional[str]:
    """AtCoder's colour tiers: gray <400, brown <800, ... red 2800+."""
    if rating is None:
        return None

    tiers = (
        (400, "gray"),
        (800, "brown"),
        (1200, "green"),
        (1600, "cyan"),
        (2000, "blue"),
        (2400, "yellow"),
        (2800, "orange"),
    )
    for limit, colour in tiers:
        if rating < limit:
            return colour

    return "red"


def atcoder_exists(handle: str) -> Optional[str]:
    """None if the user page exists, otherwise a reason string."""
    try:
        resp = httpx.get(
            AT_USER_URL + quote(handle, safe=""),
            headers=AT_HEADERS,
            timeout=10,
            follow_redirects=True,
        )
    except httpx.HTTPError:
        return "unavailable"

    if resp.status_code == 404:
        return "not_found"
    if resp.status_code == 429:
        return "rate_limited"
    if resp.status_code != 200:
        return "unavailable"

    return None


def fetch_atcoder_extras(handle: str) -> tuple[Optional[int], dict]:
    """Solved count and last-365-days activity from kenkoooo.
    Returns (None, {}) if kenkoooo is down, so rating still works."""
    try:
        resp = httpx.get(
            f"{KENKO_URL}/ac_rank",
            params={"user": handle},
            headers=AT_HEADERS,
            timeout=10,
        )
        solved = resp.json().get("count", 0) if resp.status_code == 200 else 0

        activity = Counter()
        cursor = int((datetime.now(timezone.utc) - timedelta(days=365)).timestamp())

        for _ in range(10):  # hard cap on pages
            resp = httpx.get(
                f"{KENKO_URL}/submissions",
                params={"user": handle, "from_second": cursor},
                headers=AT_HEADERS,
                timeout=15,
            )
            if resp.status_code != 200:
                break

            page = resp.json()
            if not page:
                break

            for sub in page:
                day = (
                    datetime.fromtimestamp(sub["epoch_second"], tz=timezone.utc)
                    .date()
                    .isoformat()
                )
                activity[day] += 1

            cursor = page[-1]["epoch_second"] + 1

    except (httpx.HTTPError, ValueError, KeyError):
        return None, {}

    return solved, dict(activity)


def fetch_atcoder(handle: str) -> tuple[Optional[dict], Optional[str]]:
    try:
        resp = httpx.get(
            f"{AT_USER_URL}{quote(handle, safe='')}/history/json",
            headers=AT_HEADERS,
            timeout=10,
            follow_redirects=True,
        )
        history = resp.json()
    except (httpx.HTTPError, ValueError):
        return None, "unavailable"

    if resp.status_code == 429:
        return None, "rate_limited"
    if resp.status_code != 200 or not isinstance(history, list):
        return None, "unavailable"

    rated = [c for c in history if c.get("IsRated")]
    ratings = [c["NewRating"] for c in rated]

    rating = ratings[-1] if ratings else None
    max_rating = max(ratings) if ratings else None

    solved, activity = fetch_atcoder_extras(handle)

    return {
        "rating": rating,
        "max_rating": max_rating,
        "rank": atcoder_rank(rating),
        "max_rank": atcoder_rank(max_rating),
        "contests": len(rated),
        "all": solved,
        "activity": activity,
    }, None