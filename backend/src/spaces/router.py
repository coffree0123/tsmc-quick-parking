'''Parking Space Management Module'''
from fastapi import APIRouter, Request

router = APIRouter()


@router.get(path="/spaces/free")
def read_free_spaces(r: Request, parkinglot_id: int) -> list[tuple[int, int]]:
    '''Returns a list of free spaces of a parking lot'''
    return r.app.state.database.get_free_spaces(parkinglot_id)


@router.get(path="/spaces/vehicle")
def get_latest_records(r: Request, vehicle_id: str) -> list[dict]:
    '''Get a list of parking records of a vehicle'''
    return r.app.state.database.get_vehicle_latest_records(vehicle_id)
