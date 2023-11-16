'''Entry point for the FastAPI application'''
from fastapi import FastAPI
from src.users.router import router as user_router
from src.spaces.router import router as spaces_router
from src.parking.router import router as parking_router

app = FastAPI()
app.include_router(user_router, prefix="/api")
app.include_router(spaces_router, prefix='/api')
app.include_router(parking_router, prefix="/api")


@app.get("/")
def index():
    '''Index route'''
    return {"Hello": "FastAPI"}
