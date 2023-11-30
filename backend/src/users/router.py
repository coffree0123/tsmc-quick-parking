'''User management module'''
from fastapi import APIRouter, Request, HTTPException, status
from src.users.utils import get_user_favorite_parkinglot
from src.constants import UserData, UserInfo

router = APIRouter()


@router.post("/users/")
def create_user(r: Request, user_data: UserData) -> dict[str, str]:
    '''Create a new user'''
    user_id = r.app.state.database.add_user(user_data.user_id, user_data.name,
                                            user_data.email, user_data.phone_num,
                                            user_data.gender, user_data.age,
                                            user_data.job_title, user_data.special_role)

    return {"user_id": user_id}


@router.put("/users/")
def update_user(r: Request, user_data: UserData) -> None:
    '''Update user information'''
    r.app.state.database.update_user(user_data.user_id, user_data.name,
                                     user_data.email, user_data.phone_num,
                                     user_data.gender, user_data.age,
                                     user_data.job_title, user_data.special_role)


@router.get("/users/{user_id}")
def get_user(r: Request, user_id: str) -> UserData:
    '''Get user information'''
    try:
        user_data = r.app.state.database.get_user(user_id)
    except ValueError as exc:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail="The requested user is not found in the database"
        ) from exc

    return user_data


@router.delete("/users/{user_id}")
def delete_user(r: Request, user_id: str) -> None:
    '''Delete user'''
    user_id = r.app.state.database.delete_user(user_id)


@router.get("/users/page_info/{user_id}")
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
