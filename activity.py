from datetime import date, datetime, timedelta, timezone

def compute_streaks(activity: dict) -> tuple[int,int]:

    days=sorted(date.fromisoformat(d) for d in activity)

    if not days:

        return 0,0

    longest=run=1

    for prev, cur in zip(days, days[1:]):

        if (cur-prev).days == 1:
            run +=1

        else:
            run=1

        longest=max(longest,run)

    today=datetime.now(timezone.utc).date()

    if days[-1] <today-timedelta(days=1):
        return 0, longest

    current=1

    n=len(days)

    for i in range(n-1,0,-1):

        if (days[i]-days[i-1]).days==1:
            current+=1

        else:
            break

    return current,longest
        






