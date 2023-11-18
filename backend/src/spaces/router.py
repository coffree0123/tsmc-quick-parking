'''Parking Space Management Module'''
from fastapi import APIRouter, Request, HTTPException, status

router = APIRouter()


@router.get(path="/spaces/free")
def read_free_spaces(r: Request, parkinglot_id: int) -> list[tuple[int, int]]:
    '''Returns a list of free spaces of a parking lot'''
    return r.app.state.database.get_free_spaces(parkinglot_id)


@router.get(path="/spaces/records")
def get_latest_records(r: Request, vehicle_id: str = None, user_id: int = None) -> list[dict]:
    '''Get a list of parking records of a vehicle'''
    if vehicle_id is None and user_id is None:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, 
            detail="At least one of user_id and vehicle_id must be provided"
        )
    if vehicle_id is not None:
        return r.app.state.database.get_vehicle_latest_records(vehicle_id)
    return []
