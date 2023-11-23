'''User management module'''
from fastapi import APIRouter, Request
from src.users.utils import get_user_favorite_parkinglot
from src.users.constants import Role, Gender

router = APIRouter()


@router.post("/users/")
def create_user(r: Request, first_name: str, last_name: str, email: str,
                phone_num: str, gender: Gender, age: int, job_title: Role,
                special_role: str = "None") -> dict[str, int]:
    '''Create a new user'''
    user_id = r.app.state.database.add_user(first_name, last_name, email, phone_num,
                                            gender, age, job_title, special_role)

    return {"user_id": user_id}


@router.put("/users/")
def update_user(r: Request, user_id: int, first_name: str, last_name: str, email: str,
                phone_num: str, gender: Gender, age: int, job_title: Role,
                special_role: str = "None") -> None:
    '''Update user information'''
    user_id = r.app.state.database.update_user(user_id, first_name, last_name, email,
                                               phone_num, gender, age, job_title, special_role)


@router.delete("/users/")
def delete_user(r: Request, user_id: int) -> None:
    '''Delete user'''
    user_id = r.app.state.database.delete_user(user_id)


@router.get("/users/{user_id}")
def get_user_info(r: Request, user_id: int) -> dict[str, list]:
    '''Get user information'''
    # Get user's favorite parking lot
    favorite_list = get_user_favorite_parkinglot()
    favorite_building_list = [favorite[1]
                              for favorite in favorite_list]
    free_num_list = [str(len(r.app.state.database.get_free_spaces(favorite[0])))
                     for favorite in favorite_list]

    # Get user's parked vehicles
    user_vehicles = r.app.state.database.get_user_vehicles(user_id)

    return {
        "favorite_buildings_and_free_num": tuple(zip(favorite_building_list, free_num_list)),
        "user_vehicles": user_vehicles,
    }
