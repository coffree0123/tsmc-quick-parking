'''Parking Space Management Module'''
from fastapi import APIRouter, Request

router = APIRouter()


@router.get(path="/spaces/")
def read_free_spaces(r: Request, parkinglot_id: int):
    '''Returns a list of free spaces of a parking lot'''
    return r.app.state.database.get_free_spaces(parkinglot_id)
