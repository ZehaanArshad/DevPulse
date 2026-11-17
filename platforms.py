import httpx,json
from typing import Optional
from collections import Counter
from datetime import datetime, timezone

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

    return solved

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
        stats = fetch_leetcode(handle)
        return None if stats is not None else "not_found"

    return "unsupported_platform"