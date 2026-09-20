from fastapi import FastAPI
from fastapi import Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "DevPulse is alive"}


@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()
