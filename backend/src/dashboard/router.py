'''Guard Dashboard Module'''
from dataclasses import dataclass
from fastapi import APIRouter, Request, HTTPException, Depends, Query
import pandas as pd
from src.security import authentication, is_guard

@dataclass
class TimeRecordsQuery:
    '''Query for time records'''
    parkinglot_id: int = Query()
    start_time: str = Query(description='e.g., 2023-01-01 00:00:00')
    end_time: str = Query(description='e.g., 2023-01-02 00:00:00')
    interval: str = Query(description='e.g., 1D, 2H, 15T, 30S')

router = APIRouter(
    dependencies=[Depends(authentication)]
)

@router.get(path="/guards/dashboard/time-records", tags=['guard'])
def get_time_records(r: Request, query: TimeRecordsQuery = Depends()) -> dict[int, dict[str, int]]:
    '''Returns the number of records in time interval for each floor of a parking lot'''
    if not is_guard(r):
        raise HTTPException(
            status_code=403,
            detail="Permission denied"
        )
    data = r.app.state.database.get_records_from_parkinglot_id_and_time(
        query.parkinglot_id, query.start_time, query.end_time
    )
    all_df = pd.DataFrame.from_dict(data)
    floors = all_df['floor'].unique()
    timestamps = pd.date_range(start=query.start_time, end=query.end_time, freq=query.interval)
    res = {}
    for floor in floors:
        df = all_df[all_df['floor'] == floor]
        counts = {}
        for i in range(len(timestamps)-1):
            mask = (df['startTime'] < timestamps[i+1]) & (df['endTime'] >= timestamps[i])
            count = sum(mask)
            counts[str(timestamps[i]) + ',' + str(timestamps[i+1])] = count
        res[floor] = counts
    return res
