from typing import Literal

from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    username: str
    password: str


class ProfileCreate(BaseModel):
    platform: Literal["codeforces", "leetcode"]
    handle: str


class UserLogin(BaseModel):
    username: str
    password: str = Field(min_length=8, max_length=64)


class UserOut(BaseModel):

    id: int
    username: str

    model_config = {"from_attributes": True}


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
