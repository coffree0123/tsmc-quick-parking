'''Parking Space Management Module'''
from fastapi import APIRouter, Request
from src.parkinglots.constants import FreeSpace


router = APIRouter()


@router.get(path="/parkinglots/{parkinglot_id}/free-slots")
def get_free_spaces(r: Request, parkinglot_id: int) -> FreeSpace:
    '''Returns a list of free spaces of a parking lot'''
    parkinglot_info = r.app.state.database.get_parkinglot_info(parkinglot_id)
    if not parkinglot_info:
        return FreeSpace()

    parkinglot_info = parkinglot_info[0]
    free_slots = r.app.state.database.get_free_spaces(parkinglot_id)
    free_slots = [f"{floor}#{idx}" for floor, idx in sorted(free_slots)]
    return FreeSpace(
        num_row=parkinglot_info["numRow"],
        num_col=parkinglot_info["numCol"],
        num_floor=parkinglot_info["numFloor"],
        free_slots=free_slots,
    )


@router.get(path="/parkinglots/{parkinglot_id}/long-term-occupants")
def get_long_term_occupants(r: Request, parkinglot_id: int) -> list[dict]:
    '''Search the vehicles that park the longest in a parking lot'''
    return r.app.state.database.get_long_term_occupants(parkinglot_id)
