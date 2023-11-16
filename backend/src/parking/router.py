'''User management module'''
from datetime import datetime
from fastapi import APIRouter
from src.database import database

router = APIRouter()


@router.post("/parking/{slot_id}")
def park(plate_num: str, slot_id: int):
    '''Park a car in a slot'''
    start_time = str(datetime.now())
    record_id = database.park_car(plate_num, slot_id, start_time)

    return {"record_id": record_id, 'start_time': start_time}

@router.put("/parking/{slot_id}")
def pick(slot_id: int):
    '''Pick a car according to the record id'''
    end_time = str(datetime.now())
    database.pick_car(slot_id, end_time)

    return {"end_time": end_time}
