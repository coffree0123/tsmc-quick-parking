'''User management module'''
from fastapi import APIRouter, Request
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
