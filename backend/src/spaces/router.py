'''Parking Space Management Module'''
from fastapi import APIRouter
from src.database import database

router = APIRouter()


@router.get(path="/spaces/")
def read_free_spaces(parkinglot_id: int):
    '''Returns a list of free spaces of a parking lot'''
    return database.get_free_spaces(parkinglot_id)
