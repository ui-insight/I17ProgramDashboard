"""Tests for Program CRUD API endpoints using synthetic data."""

import pytest

SYNTHETIC_PROGRAM = {
    "program_name": "B.S. Applied Example Science",
    "is_accredited": True,
    "educational_objective": "Bachelor",
    "has_concentrations": False,
    "approval_status": "Still Approved",
    "total_credit_hours": 120,
    "program_length_measurement": "Semester",
    "full_time_enrollment_hours": 12,
    "catalog_page": "42",
    "is_license_cert_prep": False,
    "modality": "Both",
    "is_contracted": False,
}


@pytest.fixture
async def created_program(client):
    resp = await client.post("/api/v1/programs/", json=SYNTHETIC_PROGRAM)
    assert resp.status_code == 201
    return resp.json()


async def test_create_program(client):
    resp = await client.post("/api/v1/programs/", json=SYNTHETIC_PROGRAM)
    assert resp.status_code == 201
    data = resp.json()
    assert data["program_name"] == "B.S. Applied Example Science"
    assert data["id"]
    assert data["educational_objective"] == "Bachelor"


async def test_list_programs(client, created_program):
    resp = await client.get("/api/v1/programs/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] >= 1
    assert len(data["items"]) >= 1
    assert data["page"] == 1


async def test_get_program(client, created_program):
    pid = created_program["id"]
    resp = await client.get(f"/api/v1/programs/{pid}")
    assert resp.status_code == 200
    assert resp.json()["program_name"] == "B.S. Applied Example Science"


async def test_get_program_not_found(client):
    resp = await client.get("/api/v1/programs/nonexistent-id")
    assert resp.status_code == 404


async def test_update_program(client, created_program):
    pid = created_program["id"]
    resp = await client.put(
        f"/api/v1/programs/{pid}",
        json={"program_name": "B.S. Updated Example Science"},
    )
    assert resp.status_code == 200
    assert resp.json()["program_name"] == "B.S. Updated Example Science"


async def test_delete_program(client, created_program):
    pid = created_program["id"]
    resp = await client.delete(f"/api/v1/programs/{pid}")
    assert resp.status_code == 204

    resp = await client.get(f"/api/v1/programs/{pid}")
    assert resp.status_code == 404


async def test_filter_by_approval_status(client, created_program):
    resp = await client.get(
        "/api/v1/programs/", params={"approval_status": "Still Approved"}
    )
    assert resp.status_code == 200
    assert resp.json()["total"] >= 1


async def test_filter_by_modality(client, created_program):
    resp = await client.get("/api/v1/programs/", params={"modality": "Both"})
    assert resp.status_code == 200
    assert resp.json()["total"] >= 1


async def test_search_by_name(client, created_program):
    resp = await client.get("/api/v1/programs/", params={"search": "Example"})
    assert resp.status_code == 200
    assert resp.json()["total"] >= 1


async def test_search_no_results(client, created_program):
    resp = await client.get("/api/v1/programs/", params={"search": "ZZZNonexistent999"})
    assert resp.status_code == 200
    assert resp.json()["total"] == 0


async def test_pagination(client):
    for i in range(5):
        await client.post(
            "/api/v1/programs/",
            json={**SYNTHETIC_PROGRAM, "program_name": f"Test Program {i}"},
        )

    resp = await client.get("/api/v1/programs/", params={"page": 1, "page_size": 2})
    data = resp.json()
    assert len(data["items"]) == 2
    assert data["total"] == 5
    assert data["page"] == 1
    assert data["page_size"] == 2
