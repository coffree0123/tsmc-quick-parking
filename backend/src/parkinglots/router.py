'''Parking Space Management Module'''
from collections import defaultdict
from fastapi import APIRouter, Request, HTTPException, status, Depends
from src.constants import ParkingLot, FloorInfo
from src.security import authentication


router = APIRouter(
    dependencies=[Depends(authentication)]
)

# user api
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
    free_slots = defaultdict(list)
    for floor, idx in sorted(r.app.state.database.get_free_spaces(parkinglot_id)):
        free_slots[floor].append(idx)
    floor_info = [
        FloorInfo(floor=f"B{k}", free_slots=v) for k, v in sorted(free_slots.items())
    ]

    return ParkingLot(
        num_row=parkinglot_info["numRow"],
        num_col=parkinglot_info["numCol"],
        num_floor=parkinglot_info["numFloor"],
        floor_info=floor_info,
    )


# guard api
@router.get(path="/guards/parkinglots/{parkinglot_id}/long-term-occupants", tags=['guard'])
def get_long_term_occupants(r: Request, parkinglot_id: int) -> list[dict]:
    '''Search the vehicles that park the longest in a parking lot'''
    token_claims = r.state.token_claims
    if token_claims.get('roles', None) is None:
        raise HTTPException(
            status_code=403,
            detail="Permission denied"
        )
    return r.app.state.database.get_long_term_occupants(parkinglot_id)
