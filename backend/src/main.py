'''Entry point for the FastAPI application'''
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def index():
    '''Index route'''
    return {"Hello": "FastAPI"}
