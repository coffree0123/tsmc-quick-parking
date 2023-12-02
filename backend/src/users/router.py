'''User management module'''
from fastapi import APIRouter, Request, HTTPException, status, Depends
from src.users.utils import get_user_favorite_parkinglot
from src.constants import UserData, UserInfo
from src.security import authentication

router = APIRouter(
    prefix='/users',
    dependencies=[Depends(authentication)]
)


@router.post("/")
def create_user(r: Request, user_data: UserData) -> dict[str, str]:
    '''Create a new user'''
    user_data.user_id = r.state.token_claims['sub']
    user_id = r.app.state.database.add_user(user_data.user_id, user_data.name,
                                            user_data.email, user_data.phone_num,
                                            user_data.gender, user_data.age,
                                            user_data.job_title, user_data.special_role)

    return {"user_id": user_id}


@router.put("/")
def update_user(r: Request, user_data: UserData) -> None:
    '''Update user information'''
    user_data.user_id = r.state.token_claims['sub']
    r.app.state.database.update_user(user_data.user_id, user_data.name,
                                     user_data.email, user_data.phone_num,
                                     user_data.gender, user_data.age,
                                     user_data.job_title, user_data.special_role)


@router.get("/")
def get_user(r: Request) -> UserData:
    '''Get user information'''
    user_id = r.state.token_claims['sub']
    try:
        user_data = r.app.state.database.get_user(user_id)
    except ValueError as exc:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail="The requested user is not found in the database"
        ) from exc

    return user_data


@router.delete("/")
def delete_user(r: Request) -> None:
    '''Delete user'''
    user_id = r.state.token_claims['sub']
    user_id = r.app.state.database.delete_user(user_id)


@router.get("/page_info/")
def get_user_info(r: Request) -> UserInfo:
    '''Get user information'''
    # Get user's favorite parking lot
    user_id = r.state.token_claims['sub']
    building_info_list = get_user_favorite_parkinglot()

    # Get user's parked vehicles
    parked_vehicles = [
        vehicle
        for vehicle in r.app.state.database.get_user_vehicles(user_id)
        if vehicle.start_time is not None
    ]

    return UserInfo(favorite_buildings=building_info_list,
                    parked_vehicles=parked_vehicles)
