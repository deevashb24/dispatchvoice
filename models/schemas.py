"""
DispatchVoice AI - Strict Pydantic v2 Models & API Data Contracts
Ultra-Low-Latency (<400ms) Voice AI Dispatcher for Field Trades
"""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class TradeCategory(str, Enum):
    PLUMBING = "PLUMBING"
    HVAC = "HVAC"
    ELECTRICAL = "ELECTRICAL"
    ROOFING = "ROOFING"
    TOWING = "TOWING"
    LOCKSMITH = "LOCKSMITH"


class UrgencyTier(str, Enum):
    EMERGENCY_DISPATCH = "EMERGENCY_DISPATCH"
    NEXT_DAY = "NEXT_DAY"
    STANDARD_INQUIRY = "STANDARD_INQUIRY"


class CallOutcome(str, Enum):
    BOOKED = "BOOKED"
    DEPOSIT_PENDING = "DEPOSIT_PENDING"
    TRANSFERRED_TO_HUMAN = "TRANSFERRED_TO_HUMAN"
    INFO_PROVIDED = "INFO_PROVIDED"
    ABANDONED = "ABANDONED"


class CRMProvider(str, Enum):
    JOBBER = "JOBBER"
    SERVICETITAN = "SERVICETITAN"
    HOUSECALL_PRO = "HOUSECALL_PRO"
    GOOGLE_CALENDAR = "GOOGLE_CALENDAR"


class DepositStatus(str, Enum):
    PENDING = "PENDING"
    PAID = "PAID"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"


# ============================================================================
# Telephony Event Models
# ============================================================================

class TelephonyEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    call_id: UUID
    event_type: str
    speaker: str  # CALLER, AGENT, SYSTEM
    message_content: str
    latency_ms: int = 0
    timestamp: datetime


# ============================================================================
# Technician Models
# ============================================================================

class TechnicianResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    contractor_id: UUID
    name: str
    phone_number: str
    trade_category: TradeCategory
    zone_area: str
    is_on_duty: bool = True
    priority_order: int = 1
    active_job_count: int = 0
    estimated_eta_minutes: int = 15
    created_at: datetime


class TechnicianUpdatePayload(BaseModel):
    is_on_duty: Optional[bool] = None
    priority_order: Optional[int] = None
    zone_area: Optional[str] = None
    estimated_eta_minutes: Optional[int] = None


# ============================================================================
# Contractor Models
# ============================================================================

class ContractorResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    business_name: str
    trade_category: TradeCategory
    forwarding_phone: str
    crm_provider: CRMProvider
    emergency_diagnostic_fee: float = 89.00
    voice_agent_name: str = "Sarah (AI Dispatcher)"
    voice_model_id: str = "sonic-english-trade-v1"
    created_at: datetime
    updated_at: datetime


class ContractorCreatePayload(BaseModel):
    business_name: str = Field(..., min_length=2, max_length=150)
    trade_category: TradeCategory
    forwarding_phone: str = Field(..., min_length=7, max_length=20)
    crm_provider: CRMProvider = CRMProvider.JOBBER
    emergency_diagnostic_fee: float = Field(89.00, ge=10.0, le=1000.0)
    voice_agent_name: str = "Sarah (AI Dispatcher)"


# ============================================================================
# Voice Call Models
# ============================================================================

class VoiceCallResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    contractor_id: UUID
    technician_id: Optional[UUID] = None
    caller_phone: str
    caller_name: Optional[str] = None
    caller_address: Optional[str] = None
    call_duration_seconds: int = 0
    turn_latency_ms: int = 365
    urgency: UrgencyTier
    outcome: CallOutcome
    audio_recording_url: Optional[str] = None
    full_transcript: str
    issue_summary: Optional[str] = None
    deposit_payment_link: Optional[str] = None
    is_deposit_paid: bool = False
    external_crm_job_id: Optional[str] = None
    customer_sentiment_score: float = 0.85
    interrupt_count: int = 0
    created_at: datetime


class VoiceCallSimulatePayload(BaseModel):
    contractor_id: UUID
    caller_phone: str = "+15550198822"
    caller_name: str = "David Miller"
    caller_address: str = "742 Evergreen Terrace, Springfield"
    transcript_utterance: str = "Help, my main water pipe burst under the kitchen sink and water is spraying everywhere!"
    trade_category: Optional[TradeCategory] = None


class VoiceCallTriageResult(BaseModel):
    call_id: UUID
    urgency: UrgencyTier
    is_emergency: bool
    issue_summary: str
    trade_diagnostics: Dict[str, Any]
    assigned_technician: Optional[TechnicianResponse] = None
    deposit_sms_sent: bool
    deposit_payment_link: Optional[str] = None
    crm_job_id: Optional[str] = None
    turn_latency_ms: int


# ============================================================================
# Deposit Transaction Models
# ============================================================================

class DepositTransactionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    call_id: UUID
    stripe_session_id: str
    amount: float
    currency: str = "USD"
    customer_phone: str
    status: DepositStatus
    receipt_url: Optional[str] = None
    created_at: datetime


class SendDepositSMSPayload(BaseModel):
    call_id: UUID
    phone: str
    amount: float = 89.00


# ============================================================================
# Platform Metrics & Telemetry
# ============================================================================

class PlatformMetricsResponse(BaseModel):
    total_calls_handled: int
    emergency_dispatch_rate: float
    avg_turn_latency_ms: float
    total_diagnostic_deposits_usd: float
    crm_auto_sync_rate: float
    active_technicians_count: int
    sentiment_average: float
    urgency_breakdown: Dict[str, int]
    hourly_call_volume: List[Dict[str, Any]]
