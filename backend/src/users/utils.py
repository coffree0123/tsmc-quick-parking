'''This file contains utility functions for users'''
from src.constants import BuildingInfo

def get_user_favorite_parkinglot() -> list[BuildingInfo]:
    '''Get user's favorite parking lot'''
    # This function will be updated later
    return [
        BuildingInfo(0, "Building A", 30),
        BuildingInfo(1, "Factory B", 80)
    ]
