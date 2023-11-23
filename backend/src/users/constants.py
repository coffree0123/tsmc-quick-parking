'''User constants'''
from enum import Enum
from pydantic import BaseModel, Field


class Role(str, Enum):
    '''User roles'''
    ENGINEER = "engineer"
    MANAGER = "manager"
    QA = "qa"
    PM = "pm"


class Gender(str, Enum):
    '''User genders'''
    MALE = "male"
    FEMALE = "female"


class UserRequest(BaseModel):
    '''User request data'''
    user_id: int = Field(default=None)
    first_name: str
    last_name: str
    email: str
    phone_num: str
    gender: Gender
    age: int
    job_title: Role
    special_role: str = "None"
