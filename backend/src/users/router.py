'''User management module'''
from fastapi import APIRouter, Request
from src.users.utils import get_user_favorite_parkinglot
from src.users.constants import UserRequest, UserInfo, BuildingInfo

router = APIRouter()


@router.post("/users/")
def create_user(r: Request, user_request: UserRequest) -> dict[str, int]:
    '''Create a new user'''
    user_id = r.app.state.database.add_user(user_request.first_name, user_request.last_name,
                                            user_request.email, user_request.phone_num,
                                            user_request.gender, user_request.age,
                                            user_request.job_title, user_request.special_role)

    return {"user_id": user_id}


@router.put("/users/{user_id}")
def update_user(r: Request, user_id: int, user_request: UserRequest) -> None:
    '''Update user information'''
    r.app.state.database.update_user(user_id, user_request.first_name,
                                     user_request.last_name, user_request.email,
                                     user_request.phone_num, user_request.gender,
                                     user_request.age, user_request.job_title,
                                     user_request.special_role)


@router.delete("/users/{user_id}")
def delete_user(r: Request, user_id: int) -> None:
    '''Delete user'''
    user_id = r.app.state.database.delete_user(user_id)


@router.get("/users/{user_id}")
def get_user_info(r: Request, user_id: str) -> UserInfo:
    '''Get user information'''
    # Get user's favorite parking lot
    favorite_list = get_user_favorite_parkinglot()
    favorite_building_list = [favorite[1]
                              for favorite in favorite_list]
    free_num_list = [str(len(r.app.state.database.get_free_spaces(favorite[0])))
                     for favorite in favorite_list]
    building_info_list = [BuildingInfo(
        building_name=favorite_building_list[i], free_num=free_num_list[i])
        for i in range(len(favorite_list))]

    # Get user's parked vehicles
    user_vehicles = r.app.state.database.get_user_vehicles(user_id)

    return UserInfo(favorite_buildings_and_free_num=building_info_list,
                    user_vehicles=user_vehicles)
