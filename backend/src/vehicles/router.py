'''Vehicles management module'''
from fastapi import APIRouter, Request
from src.vehicles.constants import VehicleSize

router = APIRouter()

@router.post("/vehicles/")
def add_vehicle(r: Request, user_id: int, license_plate_no: str, nick_name: str,
                car_size: VehicleSize = "small") -> None:
    '''Add a new vehicle to the database'''
    r.app.state.database.add_vehicle(user_id, license_plate_no, nick_name, car_size)

@router.delete("/vehicles/")
def delete_vehicle(r: Request, license_plate_no: str) -> None:
    '''Add a new vehicle to the database'''
    r.app.state.database.delete_vehicle(license_plate_no)

# @router.get("/vehicles/{license_plate_no}/owner-info")
# def get_vehicle_owner_info(r: Request, license_plate_no: int):
#     '''get info of the owner a vehicle'''
#     pass
