'''Vehicles management module'''
import psycopg
from fastapi import APIRouter, Request, HTTPException, status, Depends
from src.constants import VehicleAndOwner, VehicleData, VehicleState, ParkingRecord
from src.security import authentication, get_user_id, is_guard
from src.parkinglots.utils import fmt

router = APIRouter(
    dependencies=[Depends(authentication)]
)


@router.post("/users/vehicles/", tags=['user'])
def add_vehicle(r: Request, vehicle_data: VehicleData) -> None:
    '''Add a new vehicle to the database'''
    vehicle_data.user_id = get_user_id(r)
    try:
        r.app.state.database.add_vehicle(vehicle_data.user_id, vehicle_data.license_plate_no,
                                         vehicle_data.nick_name, vehicle_data.car_size)
    except psycopg.errors.UniqueViolation as unique_error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This vehicle has already been added to the database"
        ) from unique_error


@router.put("/users/vehicles/", tags=['user'])
def update_vehicle(r: Request, vehicle_data: VehicleData) -> None:
    '''Update vehicle information'''
    try:
        r.app.state.database.update_vehicle(vehicle_data.license_plate_no,
                                            vehicle_data.nick_name, vehicle_data.car_size)
    except ValueError as exc:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail="The requested vehicle is not found in the database"
        ) from exc


@router.get("/users/vehicles/{license_plate_no}", tags=['user'])
def get_vehicle(r: Request, license_plate_no: str) -> VehicleData:
    '''Get a vehicle from the database'''
    user_id = get_user_id(r)
    try:
        vehicle_data = r.app.state.database.get_vehicle(license_plate_no)
    except ValueError as exc:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail="The requested vehicle is not found in the database"
        ) from exc
    if vehicle_data.user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="Permission denied"
        )

    return vehicle_data


@router.delete("/users/vehicles/{license_plate_no}", tags=['user'])
def delete_vehicle(r: Request, license_plate_no: str) -> None:
    '''Delete a vehicle to the database'''
    user_id = get_user_id(r)
    try:
        vehicle_data = r.app.state.database.get_vehicle(license_plate_no)
    except ValueError as exc:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail="The requested vehicle is not found in the database"
        ) from exc
    if vehicle_data.user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="Permission denied"
        )
    r.app.state.database.delete_vehicle(license_plate_no)


@router.get("/guards/vehicles/{license_plate_no}", tags=['guard'])
def get_vehicle_and_owner_info(r: Request, license_plate_no: str) -> VehicleAndOwner:
    '''Get info of the vehicle and its owner'''
    if not is_guard(r):
        raise HTTPException(
            status_code=403,
            detail="Permission denied"
        )
    # get records of the query vehicle
    raw_records = r.app.state.database.get_latest_records(
        license_plate_no, None)
    vehicle_records = [
        ParkingRecord(
            position=fmt(**record),
            **record
        ) for record in raw_records
    ]
    if not vehicle_records:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail="The requested vehicle is not found in the database"
        )

    # get the info of the owner and other vehicles owned by him/her
    owner_info = r.app.state.database.get_vehicle_owner_info(license_plate_no)
    if not owner_info.id:
        owner_other_vehicles = []
    else:
        owner_other_vehicles = [
            VehicleState(
                position=fmt(**vehicle),
                **vehicle
            )
            for vehicle in r.app.state.database.get_user_vehicle_states(owner_info.id)
            if vehicle["license_plate_no"] != license_plate_no
        ]

    return VehicleAndOwner(
        vehicle_records=vehicle_records,
        owner_info=owner_info,
        owner_other_vehicles=owner_other_vehicles
    )
