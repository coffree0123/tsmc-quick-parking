'''User management module'''
from fastapi import APIRouter, Request
from src.users.utils import get_user_favorite_parkinglot
from src.users.constants import UserRequest, UserInfo

router = APIRouter()


@router.post("/users/")
def create_user(r: Request, user_request: UserRequest) -> dict[str, str]:
    '''Create a new user'''
    user_id = r.app.state.database.add_user(user_request.user_id, user_request.name,
                                            user_request.email, user_request.phone_num,
                                            user_request.gender, user_request.age,
                                            user_request.job_title, user_request.special_role)

    return {"user_id": user_id}


@router.put("/users/{user_id}")
def update_user(r: Request, user_id: str, user_request: UserRequest) -> None:
    '''Update user information'''
    r.app.state.database.update_user(user_id, user_request.name,
                                     user_request.email, user_request.phone_num,
                                     user_request.gender, user_request.age,
                                     user_request.job_title,user_request.special_role)


@router.delete("/users/{user_id}")
def delete_user(r: Request, user_id: str) -> None:
    '''Delete user'''
    user_id = r.app.state.database.delete_user(user_id)


@router.get("/users/{user_id}")
def get_user_info(r: Request, user_id: str) -> UserInfo:
    '''Get user information'''
    # Get user's favorite parking lot
    building_info_list = get_user_favorite_parkinglot()

    # Get user's parked vehicles
    parked_vehicles = [
        vehicle
        for vehicle in r.app.state.database.get_user_vehicles(user_id)
        if vehicle.start_time is not None
    ]

    return UserInfo(favorite_buildings=building_info_list,
                    parked_vehicles=parked_vehicles)
