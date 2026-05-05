import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_probe_validation_error():
    response = client.post("/api/probe", json={"target": "invalid host", "count": 1})
    assert response.status_code == 422
