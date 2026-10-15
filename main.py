from fastapi import FastAPI
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, Profile
from schemas import UserCreate, ProfileCreate
from platforms import fetch_codeforces, fetch_leetcode
from sqlalchemy import func
from schemas import UserCreate, UserOut, UserLogin, TokenOut
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    get_authorised_user,
)

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "DevPulse is alive"}


@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@app.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(id=user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail=f"User with {user_id} not found.")

    return user


@app.post("/signup", response_model=UserOut, status_code=201)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User.username).filter_by(username=user.username).first()

    if existing_user:
        raise HTTPException(
            status_code=409, detail=f"The user already exists,please sign in"
        )

    new_user = User(
        username=user.username, hashed_password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@app.post("/login", response_model=TokenOut)
def login(creds: UserLogin, db: Session = Depends(get_db)):

    user = db.query(User).filter_by(username=creds.username).first()

    if (
        not user
        or not user.hashed_password
        or not verify_password(creds.password, user.hashed_password)
    ):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token(user.id)
    return TokenOut(access_token=token)


@app.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@app.get("/users/{user_id}/profiles")
def get_user_profiles(user: User = Depends(get_authorised_user)):

    return user.profiles


@app.post("/users/{user_id}/profiles")
def create_user_profile(
    profile: ProfileCreate,
    user: User = Depends(get_authorised_user),
    db: Session = Depends(get_db),
):

    existing = (
        db.query(Profile)
        .filter(
            Profile.user_id == user.id,
            Profile.platform == profile.platform,
            func.lower(Profile.handle) == profile.handle.lower(),
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail=f"{profile.platform} handle {profile.handle} is already linked to this user",
        )

    new_profile = Profile(
        user_id=user.id, platform=profile.platform, handle=profile.handle
    )

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return new_profile


@app.delete("/users/{user_id}", status_code=204)
def delete_user(user_id: int, confirm: bool = False, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(id=user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail=f"User with {user_id} not found.")

    if user.profiles and not confirm:
        raise HTTPException(
            status_code=409,
            detail=f"cannot delete user: {len(user.profiles)} profile(s) still exist. Pass confirm=true to proceed",
        )
    db.delete(user)
    db.commit()


@app.get("/users/{user_id}/stats")
def get_user_stats(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(id=user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail=f"User with {user_id} not found")

    results = []

    for p in user.profiles:
        platform = p.platform.lower()
        if platform == "codeforces":
            stats = fetch_codeforces(p.handle)

        elif platform == "leetcode":
            stats = fetch_leetcode(p.handle)

        else:
            stats = None

        results.append({"platform": p.platform, "handle": p.handle, "stats": stats})

    cf_ratings = [
        r["stats"]["rating"]
        for r in results
        if r["platform"].lower() == "codeforces"
        and r["stats"]
        and r["stats"]["rating"] is not None
    ]

    lc_solved = [
        r["stats"]["all"]
        for r in results
        if r["platform"].lower() == "leetcode" and r["stats"]
    ]

    summary = {
        "profiles_linked": len(results),
        "profiles_resolved": sum(1 for r in results if r["stats"]),
        "best_codeforces_rating": max(cf_ratings, default=None),
        "leetcode_total_solved": sum(lc_solved),
    }

    return {"username": user.username, "summary": summary, "profiles": results}
