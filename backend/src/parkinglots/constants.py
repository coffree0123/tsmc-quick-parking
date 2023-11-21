from pydantic import BaseModel


class FreeSpace(BaseModel):
    num_row: int = 0
    num_col: int = 0
    num_floor: int = 0
    free_slots: list[str] = []
