'''User management module'''
from fastapi import APIRouter, Request
from src.users.constants import Role, Gender, VehicleSize

router = APIRouter()


@router.post("/users/user_registration")
def create_user(r: Request, first_name: str, last_name: str, email: str,
                phone_num: str, gender: Gender, age: int, job_title: Role,
                special_role: str = "None") -> dict[str, int]:
    '''Create a new user'''
    user_id = r.app.state.database.add_user(first_name, last_name, email, phone_num,
                                            gender, age, job_title, special_role)

    return {"user_id": user_id}


@router.post("/users/vehicle_registration")
def add_vehicle(r: Request, user_id: int, license_id: str, nick_name: str,
                car_size: VehicleSize = "small") -> None:
    '''Add a new vehicle to the database'''
    r.app.state.database.add_vehicle(user_id, license_id, nick_name, car_size)
