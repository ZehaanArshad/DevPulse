from typing import Literal

from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str


class ProfileCreate(BaseModel):
    platform: Literal["codeforces", "leetcode"]
    handle: str
