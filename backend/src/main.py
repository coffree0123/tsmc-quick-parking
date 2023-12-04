'''Entry point for the FastAPI application'''
import argparse
import logging
from logging.handlers import RotatingFileHandler
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from src.security import authentication
from src.users.router import router as user_router
from src.vehicles.router import router as vehicle_router
from src.parkinglots.router import router as parkinglot_router
from src.parking.router import router as parking_router
from src.dashboard.router import router as dashboard_router
from src.database import QuickParkingDB, DB_CONNECT


@asynccontextmanager
async def lifespan(app: FastAPI):
    '''Startup Routines'''
    # include routers
    app.include_router(user_router, prefix="/api")
    app.include_router(vehicle_router, prefix="/api")
    app.include_router(parkinglot_router, prefix="/api")
    app.include_router(parking_router, prefix="/api")
    app.include_router(dashboard_router, prefix="/api")

    # set up database
    app.state.database = QuickParkingDB(DB_CONNECT)

    yield
    '''Shutdown Routines'''

app = FastAPI(lifespan=lifespan)


def mock_authentication(request: Request):
    '''Mock authentication'''
    user_data = {
        "user_id": "21EC2020-3AEA-1069-A2DD-08002B30309D",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone_num": "1234567890",
        "gender": "male",
        "age": 30,
        "job_title": "engineer",
        "special_role": ""
    }
    request.state.token_claims = {"sub": user_data["user_id"]}


if __name__ == '__main__':
    # parse arguments
    parser = argparse.ArgumentParser()
    parser.add_argument("--skip_auth", action="store_true",
                        help="Skip authentication")
    args = parser.parse_args()

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

    # authentication
    if args.skip_auth:
        print("Skip authentication")
        app.dependency_overrides[authentication] = mock_authentication
    else:
        print("Enable authentication")

    # Start the server
    uvicorn.run(app)


@app.get("/")
def index():
    '''Index route'''
    return {"Hello": "FastAPI"}
