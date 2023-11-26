'''Entry point for the FastAPI application'''
import logging
from logging.handlers import RotatingFileHandler
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

    # set up database
    app.state.database = QuickParkingDB(DB_CONNECT)

    yield
    '''Shutdown Routines'''

app = FastAPI(lifespan=lifespan)
# set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# logging
logger = logging.getLogger("uvicorn.access")
handler = RotatingFileHandler(
    "api.log",
    mode="a",
    maxBytes=100*1024,
    backupCount=3,
)
handler.setFormatter(logging.Formatter(
    "%(asctime)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)


@app.get("/")
def index():
    '''Index route'''
    return {"Hello": "FastAPI"}
