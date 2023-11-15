'''User constants'''
from enum import Enum


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


class VehicleSize(str, Enum):
    '''Vehicle sizes'''
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"
    HUGE = "huge"


class VehicleCategory(str, Enum):
    '''Vehicle categories'''
    CAR = "car"
