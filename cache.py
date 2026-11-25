import time
from typing import Callable, Optional

TTL_SECONDS = 300  # 5 minutes

# (platform, handle) -> (time stored, stats dict)
_store: dict[tuple[str, str], tuple[float, dict]] = {}


def cached_fetch(
    platform: str,
    handle: str,
    fetch: Callable[[str], tuple[Optional[dict], Optional[str]]],
    force: bool = False,
) -> tuple[Optional[dict], Optional[str]]:
    """Return (stats, error), reusing a result fetched less than TTL_SECONDS ago.
    Only clean successes are cached, so a failed or partial fetch is retried next time."""
    key = (platform, handle.lower())

    if not force:
        hit = _store.get(key)
        if hit and time.monotonic() - hit[0] < TTL_SECONDS:
            return hit[1], None

    stats, error = fetch(handle)

    if stats is not None and error is None:
        _store[key] = (time.monotonic(), stats)

    return stats, error