'''Entry point for the FastAPI application'''
import os
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

    
    def mock_authentication(request: Request):
        '''Mock authentication'''
        request.state.token_claims = {
            "sub": request.headers['authorization'].split(' ')[1], 
            "roles": "guard"
        }

    if os.environ.get('SKIP_AUTH', 'False') == 'True':
        print("Skip authentication")
        app.dependency_overrides[authentication] = mock_authentication
    else:
        print("Enable authentication")

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

if __name__ == '__main__':
    # parse arguments
    parser = argparse.ArgumentParser()
    parser.add_argument("--skip_auth", action="store_true",
                        help="Skip authentication")
    parser.add_argument("--host", default="127.0.0.1", type=str,
                        help="Host address")
    parser.add_argument("--port", default=os.environ.get("PROD_PORT",
                        '8000'), type=str, help="Port number")
    args = parser.parse_args()

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
    os.environ['SKIP_AUTH'] = str(args.skip_auth)

    # Start the server
    uvicorn.run('src.main:app', host=args.host, port=int(args.port), reload=True)

@app.get("/")
def index():
    '''Index route'''
    return {"Hello": "FastAPI"}
