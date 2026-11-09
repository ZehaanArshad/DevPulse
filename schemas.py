from typing import Literal

from pydantic import BaseModel, Field, EmailStr


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=8, max_length=64)
    email: EmailStr


class ProfileCreate(BaseModel):
    platform: Literal["codeforces", "leetcode"]
    handle: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):

    id: int
    username: str

    model_config = {"from_attributes": True}


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
