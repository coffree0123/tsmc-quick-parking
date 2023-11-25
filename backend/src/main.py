'''Entry point for the FastAPI application'''
import logging
from logging.handlers import RotatingFileHandler
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Response
from src.users.router import router as user_router
from src.vehicles.router import router as vehicle_router
from src.parkinglots.router import router as parkinglot_router
from src.parking.router import router as parking_router
from src.database import QuickParkingDB, DB_CONNECT
from src.auth import AuthError, get_jwt_token, verify_and_decode_jwt_token


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

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    '''Middleware for authentication'''
    if request.url.path.startswith('/api/users/'):
        try:
            jwt_token = get_jwt_token(request)
            payload = await verify_and_decode_jwt_token(jwt_token)
        except AuthError as auth_error:
            return Response(content=auth_error.error_msg, status_code=auth_error.status_code)

        user_id = request.url.path.split('/')[-1]
        sub = payload['sub']
        if user_id == sub:
            response = await call_next(request)
        else:
            response = Response(content="Permission Denied", status_code= 403)
    else:
        response = await call_next(request)
    return response
