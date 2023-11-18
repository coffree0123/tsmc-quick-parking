'''User management module'''
from fastapi import APIRouter, Request, HTTPException, status
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


@router.get("/users/")
def get_user(slot_id: int = None, license_id: int = None):
    '''Get the user by slot_id or license_id'''
    if slot_id is None and license_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one of slot_id & license_id must be specified"
        )
