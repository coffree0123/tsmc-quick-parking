'''Parking Lot module constants'''
from pydantic import BaseModel


class FreeSpace(BaseModel):
    '''Return class of free space'''
    num_row: int = 0
    num_col: int = 0
    num_floor: int = 0
    free_slots: list[str] = []
