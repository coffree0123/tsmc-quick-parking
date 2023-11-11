'''User management module'''
from fastapi import APIRouter
from src.user.constants import Role, Gender
from src.database import add_user

router = APIRouter()


@router.post("/users/create-user")
def create_user(user_id: str, first_name: str, last_name: str, email: str, phone_num: str,
                gender: Gender, age: int, job_title: Role, special_role: str = None):
    '''Create a new user'''
    user_id = add_user(user_id, first_name, last_name, email, phone_num,
                       gender, age, job_title, special_role)

    return {"user_id": user_id}
