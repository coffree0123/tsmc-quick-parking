'''Utils for parking lot related'''
from typing import Union


# pylint: disable=unused-argument
def fmt(floor: int, index: int, num_row: int, num_col: int, *kwargs) -> Union[str, None]:
    '''Returns the formatted position of a parking slot'''
    if floor is None or index is None:
        return None

    padding_len = len(str(num_row * num_col))
    return f"B{floor}#{floor}{index+1:0{padding_len}}"
