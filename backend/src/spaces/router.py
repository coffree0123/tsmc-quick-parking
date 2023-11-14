from fastapi import APIRouter
from src.database import get_free_spaces

router = APIRouter()


@router.get(path="/spaces/")
def read_free_spaces(parkinglot_id: int):
    return get_free_spaces(parkinglot_id)
