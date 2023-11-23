'''Entry point for the FastAPI application'''
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from src.users.router import router as user_router
from src.vehicles.router import router as vehicle_router
from src.parkinglots.router import router as parkinglot_router
from src.parking.router import router as parking_router
from src.database import QuickParkingDB, DB_CONNECT

@asynccontextmanager
async def lifespan(app: FastAPI):
    '''Startup Routines'''
    # include routers
    app.include_router(user_router, prefix="/api")
    app.include_router(vehicle_router, prefix="/api")
    app.include_router(parkinglot_router, prefix="/api")
    app.include_router(parking_router, prefix="/api")

    # save uvicorn logging to file
    logger = logging.getLogger("uvicorn.access")
    handler = logging.handlers.RotatingFileHandler(
        "api.log", 
        mode="a",
        maxBytes=100*1024,
        backupCount=3,
    )
    handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
    logger.addHandler(handler)

    # set up database
    app.state.database = QuickParkingDB(DB_CONNECT)

    yield
    '''Shutdown Routines'''

app = FastAPI(lifespan=lifespan)

@app.get("/")
def index():
    '''Index route'''
    return {"Hello": "FastAPI"}
