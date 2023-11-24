'''User constants'''
from enum import Enum
from dataclasses import dataclass
from pydantic import BaseModel, Field
from src.vehicles.constants import Vehicle


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


@dataclass
class BuildingInfo():
    '''Building information'''
    building_name: str
    free_num: str


class UserInfo(BaseModel):
    '''User information'''
    favorite_buildings_and_free_num: list[BuildingInfo]
    user_vehicles: list[Vehicle]
