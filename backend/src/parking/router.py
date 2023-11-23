'''User management module'''
from datetime import datetime
from fastapi import APIRouter, Request, Body

router = APIRouter()


@router.post("/parking/{slot_id}")
def park(r: Request, slot_id: int, license_plate_no: str=Body(embed=True)):
    '''Park a car in a slot'''
    start_time = str(datetime.now())
    record_id = r.app.state.database.park_car(slot_id, license_plate_no, start_time)

    return {"record_id": record_id, 'start_time': start_time}

@router.put("/parking/{slot_id}")
def pick(r: Request, slot_id: int):
    '''Pick a car according to the record id'''
    end_time = str(datetime.now())
    r.app.state.database.pick_car(slot_id, end_time)

    return {"end_time": end_time}
