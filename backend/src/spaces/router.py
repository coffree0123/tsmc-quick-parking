'''Parking Space Management Module'''
from fastapi import APIRouter, Request
from src.spaces.constants import VehicleRecord

router = APIRouter()


@router.get(path="/spaces/free")
def read_free_spaces(r: Request, parkinglot_id: int) -> list[tuple[int, int]]:
    '''Returns a list of free spaces of a parking lot'''
    return r.app.state.database.get_free_spaces(parkinglot_id)


@router.get(path="/spaces/vehicle")
def get_latest_records(r: Request, vehicle_id: str) -> list[VehicleRecord]:
    '''Get a list of parking records of a vehicle'''
    raw_results = r.app.state.database.get_vehicle_latest_records(vehicle_id)
    annotated_results = [
        VehicleRecord(
            parkinglot_name=row[0],
            slot_floor=row[1],
            slot_index=row[2],
            start_time=row[3],
            end_time=row[4]
        ) for row in raw_results
    ]
    return annotated_results
