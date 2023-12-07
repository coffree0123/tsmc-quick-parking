'''Maintain the constants used in the project'''
from enum import Enum
from dataclasses import dataclass
from datetime import datetime
from pydantic import BaseModel, Field


# Parking Constants
class ParkingRecord(BaseModel):
    '''return type of parking record'''
    license_plate_no: str = ""
    parkinglot_name: str = ""
    position: str = ""
    start_time: datetime = None
    end_time: datetime = None

# Vehicles constants
class VehicleSize(str, Enum):
    '''Vehicle sizes'''
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"
    HUGE = "huge"


class VehicleCategory(str, Enum):
    '''Vehicle categories'''
    CAR = "car"


@dataclass
class Vehicle:
    '''Return type of vehicle'''
    license_plate_no: str = ""
    model: str = ""
    start_time: datetime = ""
    parkinglot_name: str = ""
    position: str = ""


@dataclass
class OwnerInfo:
    '''Vehicle owner info shown to guard'''
    id: str = ""
    name: str = ""
    job_title: str = ""
    email: str = ""
    phone: str = ""
    priority: str = ""


class VehicleAndOwner(BaseModel):
    '''Return model of vehicle and owner info'''
    vehicle_records: list[ParkingRecord] = Field(default_factory=list)
    owner_info: OwnerInfo = Field(default_factory=OwnerInfo)
    owner_other_vehicles: list[Vehicle] = Field(default_factory=list)


class VehicleData(BaseModel):
    '''Vehicle data'''
    user_id: str
    license_plate_no: str
    nick_name: str
    car_size: VehicleSize = Field(default="small")


# User constants
@dataclass
class BuildingInfo():
    '''Building information'''
    build_id: int
    building_name: str
    free_num: int


class UserInfo(BaseModel):
    '''User information'''
    favorite_buildings: list[BuildingInfo]
    parked_vehicles: list[Vehicle]


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


class UserData(BaseModel):
    '''User info data'''
    user_id: str
    name: str
    email: str
    phone_num: str
    gender: Gender
    age: int
    job_title: Role
    priority: str = "None"


class FloorInfo(BaseModel):
    '''Object containing information of one parking lot floor'''
    floor: str = ""
    free_slots: list[int] = Field(default_factory=list)
    priority_slots: list[int] = Field(default_factory=list)


class ParkingLot(BaseModel):
    '''Return class of parking lot (for user)'''
    id: int = 0
    name: str = ""
    num_row: int = 0
    num_col: int = 0
    num_floor: int = 0
    floor_info: list[FloorInfo] = Field(default_factory=list)
