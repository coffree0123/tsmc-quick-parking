'''User management module'''
from fastapi import APIRouter
from src.users.constants import Role, Gender
from src.database import database

router = APIRouter()


@router.post("/users/registration")
def create_user(first_name: str, last_name: str, email: str, phone_num: str,
                gender: Gender, age: int, job_title: Role, special_role: str = "None"):
    '''Create a new user'''
    user_id = database.add_user(first_name, last_name, email, phone_num,
                       gender, age, job_title, special_role)

    return {"user_id": user_id}
