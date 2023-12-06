'''Parking Space Management Module'''
from fastapi import APIRouter, Request, HTTPException, status, Depends
from src.constants import ParkingLot, FloorInfo
from src.security import authentication, is_guard


router = APIRouter(
    dependencies=[Depends(authentication)]
)


@router.get(path="/users/parkinglots/{parkinglot_id}", tags=['user'])
def get_parkinglot(r: Request, parkinglot_id: int) -> ParkingLot:
    '''Returns a list of free spaces of a parking lot'''
    # parking lot info
    parkinglot_info = r.app.state.database.get_parkinglot_info(parkinglot_id)
    if not parkinglot_info:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=f"Parking lot of id {parkinglot_id} doesn't exist"
        )
    parkinglot_info = parkinglot_info[0]

    # get floor information (currently only free slots)
    free_slots = [[] for _ in range(parkinglot_info["numFloor"] + 1)]
    for floor, idx in sorted(r.app.state.database.get_free_spaces(parkinglot_id)):
        free_slots[floor].append(idx)
    floor_info = [
        FloorInfo(
            floor=f"B{i}",
            free_slots=free_slots[i]
        ) for i in range(1, parkinglot_info["numFloor"] + 1)
    ]

    return ParkingLot(
        num_row=parkinglot_info["numRow"],
        num_col=parkinglot_info["numCol"],
        num_floor=parkinglot_info["numFloor"],
        floor_info=floor_info,
    )


@router.get(path="/guards/parkinglots/{parkinglot_id}/long-term-occupants", tags=['guard'])
def get_long_term_occupants(r: Request, parkinglot_id: int) -> list[dict]:
    '''Search the vehicles that park the longest in a parking lot'''
    if not is_guard(r):
        raise HTTPException(
            status_code=403,
            detail="Permission denied"
        )

    # get number of parking lot in a floor
    parkinglot_info = r.app.state.database.get_parkinglot_info(parkinglot_id)
    if not parkinglot_info:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=f"Parking lot of id {parkinglot_id} doesn't exist"
        )
    parkinglot_info = parkinglot_info[0]

    # format the positions
    num_slots_per_floor = int(parkinglot_info["numRow"]) * int(parkinglot_info["numCol"])
    num_digits = len(str(num_slots_per_floor))
    occupants = r.app.state.database.get_long_term_occupants(parkinglot_id)
    for ocpt in occupants:
        floor, idx = ocpt["floor"], ocpt["index"]
        ocpt["position"] = f"B{floor}#{floor}{idx:0{num_digits}}"

    return [
        {
            "position": ocpt["position"],
            "license_plate_no": ocpt["license_plate_no"],
            "start_time": ocpt["start_time"],
        } for ocpt in occupants
    ]
