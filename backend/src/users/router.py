'''User management module'''
from fastapi import APIRouter, Request
from src.users.utils import get_user_favorite_parkinglot
from src.users.constants import Role, Gender, VehicleSize

router = APIRouter()


@router.post("/users/")
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


@router.get("/users/user_info/{user_id}")
def get_user_info(r: Request, user_id: int) -> dict[str, list[str]]:
    '''Get user information'''
    # Get user's favorite parking lot
    favorite_list = get_user_favorite_parkinglot()
    favorite_building_list = [favorite[1]
                              for favorite in favorite_list]
    free_num_list = [str(len(r.app.state.database.get_free_spaces(favorite[0])))
                     for favorite in favorite_list]

    # Get user's parked vehicles
    license_list, nickname_list = r.app.state.database.get_user_vehicles(
        user_id)
    position_list = [r.app.state.database.get_location(
        license_id) for license_id in license_list]
    location_list = [
        f"B{str(pos[1])}#{str(pos[0])}" for pos in position_list if pos[0] != ""]
    parkinglot_list = [r.app.state.database.get_parkinglot(
        license_id) for license_id in license_list]
    return {"favorite_buildings": favorite_building_list, "free_numbers": free_num_list,
            "parked_vehicles": nickname_list, "parking_lots": parkinglot_list,
            "locations": location_list}
