'''User management module'''
from fastapi import APIRouter, Request, HTTPException, status
from src.users.utils import get_user_favorite_parkinglot
from src.users.constants import UserRequest

router = APIRouter()


@router.post("/users/")
def create_user(r: Request, user_request: UserRequest) -> dict[str, int]:
    '''Create a new user'''
    user_id = r.app.state.database.add_user(user_request.first_name, user_request.last_name,
                                            user_request.email, user_request.phone_num,
                                            user_request.gender, user_request.age,
                                            user_request.job_title, user_request.special_role)

    return {"user_id": user_id}


@router.put("/users/")
def update_user(r: Request, user_request: UserRequest) -> None:
    '''Update user information'''
    if user_request.user_id is None:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail="user_id must be provided"
        )
    r.app.state.database.update_user(user_request.user_id, user_request.first_name,
                                               user_request.last_name, user_request.email,
                                               user_request.phone_num, user_request.gender,
                                               user_request.age, user_request.job_title,
                                               user_request.special_role)


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
