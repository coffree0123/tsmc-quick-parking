'''Maintain the constants used in the project'''
from enum import Enum
from dataclasses import dataclass
from datetime import datetime
from typing import Union
from pydantic import BaseModel, Field

# Enum
class VehicleSize(str, Enum):
    '''Vehicle sizes'''
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"
    HUGE = "huge"


class VehicleCategory(str, Enum):
    '''Vehicle categories'''
    CAR = "car"


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


class Priority(str, Enum):
    '''Priority Level'''
    NORMAL = "normal"
    PREGNANCY = "pregnancy"
    DISABILITY = "disability"


# Parking Constants
class ParkingRecord(BaseModel):
    '''return type of parking record'''
    license_plate_no: Union[str, None] = None
    parkinglot_name: Union[str, None] = None
    position: Union[str, None] = None
    start_time: Union[datetime, None] = None
    end_time: Union[datetime, None] = None


# Vehicles constants
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
    priority: Union[Priority, None] = None


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


class UserData(BaseModel):
    '''User info data'''
    user_id: str
    name: str
    email: str
    phone_num: str
    gender: Gender
    age: int
    job_title: Role
    priority: Union[Priority, None] = ""


class Slot(BaseModel):
    '''Object containing information of one slot'''
    floor: Union[int, None] = None
    index: Union[int, None] = None
    license_plate_no: Union[str, None] = None

class FloorInfo(BaseModel):
    '''Object containing information of one parking lot floor'''
    floor: Union[str, None] = ""
    free_slots: Union[list[int], None] = None
    priority_slots: Union[list[int], None] = None
    parked_slots: Union[list[Slot], None] = None

class ParkingLot(BaseModel):
    '''Return class of parking lot (for user)'''
    id: Union[int, None] = None
    name: Union[str, None] = None
    num_row: Union[int, None] = None
    num_col: Union[int, None] = None
    num_floor: Union[int, None] = None
    floor_info: Union[list[FloorInfo], None] = None
