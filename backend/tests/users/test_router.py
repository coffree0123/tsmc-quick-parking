'''Test user router'''
from unittest.mock import Mock
from fastapi.testclient import TestClient
import pytest

from src.main import app


@pytest.fixture()
def user_data():
    '''User data for testing'''
    return {
        "user_id": "21EC2020-3AEA-1069-A2DD-08002B30309D",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone_num": "1234567890",
        "gender": "male",
        "age": 30,
        "job_title": "engineer",
        "special_role": ""
    }


@pytest.fixture()
def mock_db():
    '''Mock database'''
    fake_db = Mock()
    fake_db.add_user.return_value = "21EC2020-3AEA-1069-A2DD-08002B30309D"
    fake_db.update_user.return_value = None
    return fake_db


def test_create_user(mocker, mock_db, user_data):
    '''Test create user'''
    mocker.patch("src.main.QuickParkingDB", return_value=mock_db)

    with TestClient(app) as client:
        response = client.post("/api/users", json=user_data)
        assert response.status_code == 200
        assert "user_id" in response.json()


def test_update_user(mocker, mock_db, user_data):
    '''Test update user'''
    mocker.patch("src.main.QuickParkingDB", return_value=mock_db)

    with TestClient(app) as client:
        response = client.put("/api/users/", json=user_data)
        assert response.status_code == 200
