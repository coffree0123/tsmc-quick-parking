'''Utils for parking lot related'''

def fmt(floor: int, idx: int, num_row: int, num_col: int) -> str:
    '''Returns the formatted position of a parking slot'''
    padding_len = len(str(num_row * num_col))
    return f"B{floor}#{floor}{idx+1:0{padding_len}}"
