'''Vehicles management module'''
from fastapi import APIRouter, Request, HTTPException, status
from src.vehicles.constants import VehicleAndOwner, VehicleRequest
from src.parking.constants import ParkingRecord

router = APIRouter()


@router.post("/vehicles/")
def add_vehicle(r: Request, vehicle_request: VehicleRequest) -> None:
    '''Add a new vehicle to the database'''
    r.app.state.database.add_vehicle(vehicle_request.user_id, vehicle_request.license_plate_no,
                                     vehicle_request.nick_name, vehicle_request.car_size)


@router.delete("/vehicles/{license_plate_no}")
def delete_vehicle(r: Request, license_plate_no: str) -> None:
    '''Add a new vehicle to the database'''
    r.app.state.database.delete_vehicle(license_plate_no)


@router.get("/vehicles/{license_plate_no}/")
def get_vehicle_and_owner_info(r: Request, license_plate_no: str) -> VehicleAndOwner:
    '''Get info of the vehicle and its owner'''
    # get records of the query vehicle
    vehicle_records = r.app.state.database.get_latest_records(license_plate_no, None)
    if not vehicle_records:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail="The requested vehicle is not found in the database"
        )

    # get the info of the owner and other vehicles owned by him/her
    owner_info = r.app.state.database.get_vehicle_owner_info(license_plate_no)
    if owner_info.id == "":
        owner_other_vehicles = []
    else:
        owner_other_vehicles = [
            vehicle
            for vehicle in r.app.state.database.get_user_vehicles(owner_info.id)
            if vehicle.license_plate_no != license_plate_no
        ]

    return VehicleAndOwner(
        vehicle_records=vehicle_records,
        owner_info=owner_info,
        owner_other_vehicles=owner_other_vehicles
    )

# need: extend the api, and then deprecate this one
# need: concat floor and index
@router.get(path="/vehicles/records")
def get_latest_records(
    r: Request, vehicle_id: str = None, user_id: str = None
) -> list[ParkingRecord]:
    '''Search the parking records by user id or vehicle id'''
    if vehicle_id is None and user_id is None:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail="At least one of user_id and vehicle_id must be provided"
        )
    return r.app.state.database.get_latest_records(vehicle_id, user_id)
