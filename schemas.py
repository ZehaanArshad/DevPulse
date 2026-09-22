from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str


class ProfileCreate(BaseModel):
    platform: str
    handle: str
