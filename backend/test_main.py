"""
DispatchVoice AI - Unit, Integration & Adversarial Stress Tests
Validates Health, Sub-400ms Turnaround SLA, Hazard Classification, Technician Dispatch & Stripe SMS Deposits
"""

import sys
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import pytest
from fastapi.testclient import TestClient

from backend.main import app
from backend.store import (
    CONTRACTOR_APEX_ID,
    CONTRACTOR_TITAN_ID,
    TECH_MIKE_ID,
    TECH_DAVE_ID,
    CALL_EMERGENCY_ID,
    store,
)
from models.schemas import TradeCategory, UrgencyTier

client = TestClient(app)


@pytest.fixture(autouse=True)
def reset_store_state():
    store.reset()
    yield
    store.reset()


def test_health_check():
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["telephony_status"] == "ONLINE"
    assert data["webrtc_latency_sla_ms"] <= 400


def test_platform_metrics():
    res = client.get("/api/v1/metrics")
    assert res.status_code == 200
    data = res.json()
    assert data["total_calls_handled"] > 0
    assert data["avg_turn_latency_ms"] < 400.0
    assert data["emergency_dispatch_rate"] > 0.0
    assert "EMERGENCY_DISPATCH" in data["urgency_breakdown"]


def test_list_contractors_and_technicians():
    c_res = client.get("/api/v1/contractors")
    assert c_res.status_code == 200
    contractors = c_res.json()
    assert len(contractors) >= 2

    t_res = client.get(f"/api/v1/technicians?contractor_id={CONTRACTOR_APEX_ID}")
    assert t_res.status_code == 200
    techs = t_res.json()
    assert len(techs) >= 2
    assert techs[0]["trade_category"] == "PLUMBING"


def test_update_technician_duty_and_zone():
    patch_res = client.patch(
        f"/api/v1/technicians/{TECH_MIKE_ID}",
        json={"is_on_duty": False, "zone_area": "Out of Service Zone"},
    )
    assert patch_res.status_code == 200
    data = patch_res.json()
    assert data["is_on_duty"] is False
    assert data["zone_area"] == "Out of Service Zone"


def test_simulate_critical_water_flood_emergency():
    payload = {
        "contractor_id": str(CONTRACTOR_APEX_ID),
        "caller_phone": "+15550198899",
        "caller_name": "Linda Miller",
        "caller_address": "505 Pine Ave",
        "transcript_utterance": "Help! The water pipe burst under my kitchen sink and water is rapidly flooding my kitchen!",
        "trade_category": "PLUMBING",
    }
    res = client.post("/api/v1/calls/simulate", json=payload)
    assert res.status_code == 201
    data = res.json()

    assert data["is_emergency"] is True
    assert data["urgency"] == "EMERGENCY_DISPATCH"
    assert data["deposit_sms_sent"] is True
    assert "pay.stripe.com" in data["deposit_payment_link"]
    assert data["assigned_technician"] is not None
    assert data["turn_latency_ms"] < 400  # Sub-400ms SLA


def test_simulate_gas_smell_hvac_emergency():
    payload = {
        "contractor_id": str(CONTRACTOR_TITAN_ID),
        "caller_phone": "+15550196622",
        "caller_name": "Carl Jenkins",
        "caller_address": "902 Maple St",
        "transcript_utterance": "We smell gas and our furnace is sparking in the basement!",
        "trade_category": "HVAC",
    }
    res = client.post("/api/v1/calls/simulate", json=payload)
    assert res.status_code == 201
    data = res.json()

    assert data["is_emergency"] is True
    assert data["urgency"] == "EMERGENCY_DISPATCH"
    assert data["assigned_technician"] is not None
    assert data["turn_latency_ms"] < 400


def test_simulate_next_day_routine_maintenance():
    payload = {
        "contractor_id": str(CONTRACTOR_APEX_ID),
        "caller_phone": "+15550191122",
        "caller_name": "Susan Clark",
        "caller_address": "120 Birch Road",
        "transcript_utterance": "My bathroom faucet has a slow drip, can someone come tomorrow morning?",
        "trade_category": "PLUMBING",
    }
    res = client.post("/api/v1/calls/simulate", json=payload)
    assert res.status_code == 201
    data = res.json()

    assert data["is_emergency"] is False
    assert data["urgency"] == "NEXT_DAY"
    assert data["deposit_sms_sent"] is False


def test_send_deposit_sms_and_crm_sync():
    sms_res = client.post(
        f"/api/v1/calls/{CALL_EMERGENCY_ID}/send-deposit-sms",
        json={"call_id": str(CALL_EMERGENCY_ID), "phone": "+15550198822", "amount": 89.0},
    )
    assert sms_res.status_code == 200
    assert sms_res.json()["status"] == "SMS_DISPATCHED"

    crm_res = client.post(f"/api/v1/calls/{CALL_EMERGENCY_ID}/sync-crm")
    assert crm_res.status_code == 200
    assert crm_res.json()["status"] == "SYNCED"
    assert crm_res.json()["work_order_attached"] is True


def test_call_events_timeline():
    events_res = client.get(f"/api/v1/calls/{CALL_EMERGENCY_ID}/events")
    assert events_res.status_code == 200
    events = events_res.json()
    assert len(events) >= 5
    types = [e["event_type"] for e in events]
    assert "CALL_INBOUND" in types
    assert "SPEECH_STREAM_STT" in types
    assert "INTERRUPT_CUTOFF" in types
