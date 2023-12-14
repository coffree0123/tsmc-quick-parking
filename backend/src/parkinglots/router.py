'''Parking Space Management Module'''
from fastapi import APIRouter, Request, HTTPException, status, Depends
from src.constants import ParkingLot, FloorInfo, ParkingRecord, ParkedSlot
from src.security import authentication, is_guard
from src.parkinglots.utils import fmt


router = APIRouter(
    dependencies=[Depends(authentication)]
)


@router.get(
    path="/users/parkinglots/list",
    tags=['user'],
    response_model=list[ParkingLot],
    response_model_exclude_none=True
)
def get_parkinglot_list(r: Request):
    '''Returns a list of (id, name) of all parking lots'''
    res = r.app.state.database.get_parkinglot_list()
    return sorted(
        [ParkingLot(id=int(pklt["id"]), name=pklt["name"]) for pklt in res],
        key=lambda x: x.id
    )


@router.get(
    path="/users/parkinglots/{parkinglot_id}",
    tags=['user'],
    response_model=ParkingLot,
    response_model_exclude_none=True,
)
def get_parkinglot(r: Request, parkinglot_id: int):
    '''Returns a list of free spaces of a parking lot'''
    # parking lot info (num_row, num_col, num_floor)
    parkinglot_info = r.app.state.database.get_parkinglot_info(parkinglot_id)
    if not parkinglot_info:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=f"Parking lot of id {parkinglot_id} doesn't exist"
        )
    parkinglot_info = parkinglot_info[0]

    # get floor information (free slots, priority slots)
    def collect_floor_info(slots: list):
        '''Process data info from slot-level into floor-level'''
        floors = [[] for _ in range(parkinglot_info["numFloor"] + 1)]
        for slot in slots:
            floors[slot["floor"]].append(slot["index"])
        return floors
    free_slots = collect_floor_info(r.app.state.database.get_free_spaces(parkinglot_id))
    priority_slots = collect_floor_info(r.app.state.database.get_priority_spaces(parkinglot_id))
    floor_info = [
        FloorInfo(
            floor=f"B{i}",
            free_slots=free_slots[i],
            priority_slots=priority_slots[i],
        ) for i in range(1, parkinglot_info["numFloor"] + 1)
    ]

    return ParkingLot(
        num_row=parkinglot_info["numRow"],
        num_col=parkinglot_info["numCol"],
        num_floor=parkinglot_info["numFloor"],
        floor_info=floor_info,
    )

@router.get(
    path="/guards/parkinglots/{parkinglot_id}",
    tags=['guard'],
    response_model=ParkingLot,
    response_model_exclude_none=True,
)
def get_parkinglot_for_guard(r: Request, parkinglot_id: int):
    '''This API retrieves parking lot info including parked slots/vehicles & priority seat'''
    # parking lot info (num_row, num_col, num_floor)
    parkinglot_info = r.app.state.database.get_parkinglot_info(parkinglot_id)
    if not parkinglot_info:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=f"Parking lot of id {parkinglot_id} doesn't exist"
        )
    parkinglot_info = parkinglot_info[0]

    # get floor information (parked slots, priority slots)
    def collect_floor_info(slots: list, extract_fn=None):
        '''Process data info from slot-level into floor-level'''
        floors = [[] for _ in range(parkinglot_info["numFloor"] + 1)]
        for slot in slots:
            floors[slot["floor"]].append(extract_fn(slot))
        return floors

    parked_slots = collect_floor_info(
        r.app.state.database.get_parked_spaces(parkinglot_id),
        extract_fn=lambda slot: ParkedSlot(
            license_plate_no=slot["license_plate_no"],
            index=slot["index"],
            illegally_parked=slot["illegally_parked"],
            car_owner_enrolled=slot["car_owner_enrolled"],
        ),
    )
    priority_slots = collect_floor_info(
        r.app.state.database.get_priority_spaces(parkinglot_id),
        extract_fn=lambda slot: slot["index"],
    )
    floor_info = [
        FloorInfo(
            floor=f"B{i}",
            parked_slots=parked_slots[i],
            priority_slots=priority_slots[i],
        ) for i in range(1, parkinglot_info["numFloor"] + 1)
    ]

    return ParkingLot(
        num_row=parkinglot_info["numRow"],
        num_col=parkinglot_info["numCol"],
        num_floor=parkinglot_info["numFloor"],
        floor_info=floor_info,
    )

@router.get(
    path="/guards/parkinglots/{parkinglot_id}/long-term-occupants",
    tags=['guard'],
    response_model=list[ParkingRecord],
    response_model_exclude_none=True
)
def get_long_term_occupants(r: Request, parkinglot_id: int):
    '''Search the vehicles that park the longest in a parking lot'''
    if not is_guard(r):
        raise HTTPException(
            status_code=403,
            detail="Permission denied"
        )

    # get number of parking lot in a floor
    parkinglot_info = r.app.state.database.get_parkinglot_info(parkinglot_id)
    if not parkinglot_info:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=f"Parking lot of id {parkinglot_id} doesn't exist"
        )
    parkinglot_info = parkinglot_info[0]

    # format the positions
    occupants = r.app.state.database.get_long_term_occupants(parkinglot_id)
    for ocpt in occupants:
        ocpt["position"] = fmt(
            ocpt["floor"], ocpt["index"], parkinglot_info["numRow"], parkinglot_info["numCol"]
        )

    return [
        ParkingRecord(
            position=ocpt["position"],
            license_plate_no=ocpt["license_plate_no"],
            start_time=ocpt["start_time"],
        ) for ocpt in occupants
    ]
