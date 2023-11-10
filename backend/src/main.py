'''Entry point for the FastAPI application'''
from fastapi import FastAPI
from src.user.router import router as user_router

app = FastAPI()
app.include_router(user_router, prefix="/api")


@app.get("/")
def index():
    '''Index route'''
    return {"Hello": "FastAPI"}
