from collections import Counter

ALIASES = {
    "dp": "dynamic programming",
    "sortings": "sorting",
    "strings": "string",
    "dfs and similar": "depth-first search",
    "bitmasks": "bit manipulation",
    "brute force": "enumeration",
    "trees": "tree",
    "graphs": "graph",
    "dsu": "union-find",
    "games": "game theory",
    "matrices": "matrix",
    "shortest paths": "shortest path",
}


def normalize(name: str) -> str:
    key = name.lower()
    return ALIASES.get(key, key)


def merge_topics(topic_lists: list[list[dict]], limit: int | None = None) -> list[dict]:

    totals=Counter()

    for topics in topic_lists:
        for t in topics:
            totals[normalize(t["name"])]+=t["count"]

    return [
        {"name": name.title(), "count": count}
        for name, count in totals.most_common(limit)
    ]