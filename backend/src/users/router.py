'''User management module'''
from fastapi import APIRouter, Request, HTTPException, status, Depends
from src.constants import UserData, UserInfo, Vehicle
from src.security import authentication, get_user_id

router = APIRouter(
    prefix='/users',
    dependencies=[Depends(authentication)]
)


@router.post("/", tags=['user'])
def create_user(r: Request, user_data: UserData) -> dict[str, str]:
    '''Create a new user'''
    user_data.user_id = get_user_id(r)
    user_id = r.app.state.database.add_user(user_data.user_id, user_data.name,
                                            user_data.email, user_data.phone_num,
                                            user_data.gender, user_data.age,
                                            user_data.job_title, user_data.special_role)

    return {"user_id": user_id}


@router.put("/", tags=['user'])
def update_user(r: Request, user_data: UserData) -> None:
    '''Update user information'''
    user_data.user_id = get_user_id(r)
    r.app.state.database.update_user(user_data.user_id, user_data.name,
                                     user_data.email, user_data.phone_num,
                                     user_data.gender, user_data.age,
                                     user_data.job_title, user_data.special_role)


@router.get("/", tags=['user'])
def get_user(r: Request) -> UserData:
    '''Get user information'''
    user_id = get_user_id(r)
    try:
        user_data = r.app.state.database.get_user(user_id)
    except ValueError as exc:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail="The requested user is not found in the database"
        ) from exc

    return user_data


@router.delete("/", tags=['user'])
def delete_user(r: Request) -> None:
    '''Delete user'''
    user_id = get_user_id(r)
    user_id = r.app.state.database.delete_user(user_id)


@router.get("/user_vehicles/", tags=['user'])
def get_user_vehicles(r: Request) -> list[Vehicle]:
    '''Get user's all vehicles'''
    # Get user's favorite parking lot
    user_id = get_user_id(r)

    return r.app.state.database.get_user_vehicles(user_id)


@router.get("/page_info/", tags=['user'])
def get_page_info(r: Request) -> UserInfo:
    '''Get user information'''
    # Get user's favorite parking lot
    user_id = get_user_id(r)
    building_info_list = r.app.state.database.get_user_favorite_parkinglots(user_id)

    # Get user's parked vehicles
    parked_vehicles = [
        vehicle
        for vehicle in r.app.state.database.get_user_vehicles(user_id)
        if vehicle.start_time is not None
    ]

    return UserInfo(favorite_buildings=building_info_list,
                    parked_vehicles=parked_vehicles)
