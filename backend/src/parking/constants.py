'''Parking Constants'''
from dataclasses import dataclass
from datetime import datetime


@dataclass
class ParkingRecord:
    '''return type of parking record'''
    license_plate_no: str
    parkinglot_name: str
    position: str
    start_time: datetime
    end_time: datetime
