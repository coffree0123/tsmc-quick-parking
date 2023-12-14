'''User management module'''
from fastapi import APIRouter, Request, Body, HTTPException

router = APIRouter()

@router.post("/parking/{slot_id}")
def park(r: Request, slot_id: int,
    license_plate_no: str = Body(embed=True), start_time: str = Body(embed=True)):
    '''Park a car in a slot'''
    if not r.app.state.database.check_valid_parking( \
        slot_id, license_plate_no, start_time=start_time):
        raise HTTPException(
            status_code=405,
            detail="Invalid parking"
        )
    record_id = r.app.state.database.park_car(
        slot_id, license_plate_no, start_time)

    return {"record_id": record_id, "start_time": start_time}


@router.put("/parking/{slot_id}")
def pick(r: Request, slot_id: int,
    license_plate_no: str = Body(embed=True), end_time: str = Body(embed=True)):
    '''Pick a car in a slot'''
    if not r.app.state.database.check_valid_parking(slot_id, license_plate_no, end_time=end_time) \
        or not r.app.state.database.pick_car(slot_id, license_plate_no, end_time):
        raise HTTPException(
            status_code=405,
            detail="Invalid parking"
        )

    return {"end_time": end_time}
