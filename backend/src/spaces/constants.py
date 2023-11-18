'''Parking space constants'''
from datetime import datetime
from pydantic import BaseModel


class VehicleRecord(BaseModel):
    '''Return model of vehicle record'''
    parkinglot_name: str
    slot_floor: int
    slot_index: int
    start_time: datetime
    end_time: datetime
