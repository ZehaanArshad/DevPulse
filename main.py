from fastapi import FastAPI
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, Profile
from schemas import UserCreate, ProfileCreate

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


@app.post("/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(username=user.username)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.get("/users/{user_id}/profiles")
def get_user_profiles(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(id=user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail=f"User with {user_id} not found")

    return user.profiles


@app.post("/users/{user_id}/profiles")
def create_user_profile(
    user_id: int, profile: ProfileCreate, db: Session = Depends(get_db)
):
    user = db.query(User).filter_by(id=user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User with {user_id} not found.")

    new_profile = Profile(
        user_id=user_id, platform=profile.platform, handle=profile.handle
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
