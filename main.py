from fastapi import FastAPI
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserCreate

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
