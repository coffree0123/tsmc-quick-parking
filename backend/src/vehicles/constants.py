'''Vehicles constants'''
from enum import Enum
from datetime import datetime
from dataclasses import dataclass
from pydantic import BaseModel, Field
from src.parking.constants import ParkingRecord


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
    special_role: str = ""


class VehicleAndOwner(BaseModel):
    '''Return model of vehicle and owner info'''
    vehicle_records: list[ParkingRecord] = Field(default_factory=list)
    owner_info: OwnerInfo = Field(default_factory=OwnerInfo)
    owner_other_vehicles: list[Vehicle] = Field(default_factory=list)


class VehicleRequest(BaseModel):
    '''Vehicle request data'''
    user_id: str
    license_plate_no: str
    nick_name: str
    car_size: VehicleSize = Field(default="small")
