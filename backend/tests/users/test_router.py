'''Test user router'''
from unittest.mock import Mock
from fastapi.testclient import TestClient
from src.main import app
import pytest


@pytest.fixture()
def user_data():
    '''User data for testing'''
    return {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "phone_num": "1234567890",
        "gender": "male",
        "age": 30,
        "job_title": "engineer",
        "special_role": ""
    }


def test_create_user(mocker, user_data):
    '''Test create user'''
    # mock database
    mock_db = Mock()
    mock_db.add_user.return_value = 1
    mocker.patch("src.main.QuickParkingDB", return_value=mock_db)

    with TestClient(app) as client:
        response = client.post("/api/users", json=user_data)
        assert response.status_code == 200
        assert "user_id" in response.json()


def test_update_user(mocker, user_data):
    '''Test update user'''
    # mock database
    mock_db = Mock()
    mock_db.update_user.return_value = None
    mocker.patch("src.main.QuickParkingDB", return_value=mock_db)

    with TestClient(app) as client:
        response = client.put("/api/users/1", json=user_data)
        assert response.status_code == 200
