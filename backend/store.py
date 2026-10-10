"""
DispatchVoice AI - Transactional Datastore & Seed Factory
Ultra-Low-Latency (<400ms) Voice AI Dispatcher for Field Trades
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional
from uuid import UUID, uuid4

from models.schemas import (
    CallOutcome,
    ContractorResponse,
    CRMProvider,
    DepositStatus,
    DepositTransactionResponse,
    PlatformMetricsResponse,
    TechnicianResponse,
    TelephonyEventResponse,
    TradeCategory,
    UrgencyTier,
    VoiceCallResponse,
)

# Seed Identifiers
CONTRACTOR_APEX_ID = UUID("c0000000-0000-0000-0000-000000000001")
CONTRACTOR_TITAN_ID = UUID("c0000000-0000-0000-0000-000000000002")

TECH_MIKE_ID = UUID("b0000000-0000-0000-0000-000000000001")
TECH_DAVE_ID = UUID("b0000000-0000-0000-0000-000000000002")
TECH_SARAH_ID = UUID("b0000000-0000-0000-0000-000000000003")
TECH_JASON_ID = UUID("b0000000-0000-0000-0000-000000000004")

CALL_EMERGENCY_ID = UUID("d0000000-0000-0000-0000-000000000001")
CALL_NEXTDAY_ID = UUID("d0000000-0000-0000-0000-000000000002")
CALL_STANDARD_ID = UUID("d0000000-0000-0000-0000-000000000003")


class DispatchStore:
    def __init__(self):
        self.reset()

    def reset(self):
        now = datetime.now(timezone.utc)
        t_minus_2h = now - timedelta(hours=2)
        t_minus_45m = now - timedelta(minutes=45)
        t_minus_10m = now - timedelta(minutes=10)

        # 1. Contractors
        self.contractors: Dict[UUID, ContractorResponse] = {
            CONTRACTOR_APEX_ID: ContractorResponse(
                id=CONTRACTOR_APEX_ID,
                business_name="Apex Emergency Plumbing & Rooter",
                trade_category=TradeCategory.PLUMBING,
                forwarding_phone="+18005550199",
                crm_provider=CRMProvider.JOBBER,
                emergency_diagnostic_fee=89.00,
                voice_agent_name="Sarah (Dispatch AI)",
                voice_model_id="sonic-english-trade-v1",
                created_at=t_minus_2h - timedelta(days=60),
                updated_at=t_minus_2h,
            ),
            CONTRACTOR_TITAN_ID: ContractorResponse(
                id=CONTRACTOR_TITAN_ID,
                business_name="Titan Climate Solutions (HVAC)",
                trade_category=TradeCategory.HVAC,
                forwarding_phone="+18005550244",
                crm_provider=CRMProvider.SERVICETITAN,
                emergency_diagnostic_fee=119.00,
                voice_agent_name="Alex (HVAC AI)",
                voice_model_id="sonic-english-trade-v1",
                created_at=t_minus_2h - timedelta(days=45),
                updated_at=t_minus_2h,
            ),
        }

        # 2. Technicians
        self.technicians: Dict[UUID, TechnicianResponse] = {
            TECH_MIKE_ID: TechnicianResponse(
                id=TECH_MIKE_ID,
                contractor_id=CONTRACTOR_APEX_ID,
                name="Mike Thorne (Master Plumber)",
                phone_number="+15550193344",
                trade_category=TradeCategory.PLUMBING,
                zone_area="Downtown / Metro West",
                is_on_duty=True,
                priority_order=1,
                active_job_count=1,
                estimated_eta_minutes=15,
                created_at=t_minus_2h - timedelta(days=30),
            ),
            TECH_DAVE_ID: TechnicianResponse(
                id=TECH_DAVE_ID,
                contractor_id=CONTRACTOR_APEX_ID,
                name="Dave Miller (Journeyman Plumber)",
                phone_number="+15550193355",
                trade_category=TradeCategory.PLUMBING,
                zone_area="North Suburbs",
                is_on_duty=True,
                priority_order=2,
                active_job_count=0,
                estimated_eta_minutes=25,
                created_at=t_minus_2h - timedelta(days=30),
            ),
            TECH_SARAH_ID: TechnicianResponse(
                id=TECH_SARAH_ID,
                contractor_id=CONTRACTOR_TITAN_ID,
                name="Sarah Jenkins (HVAC Lead)",
                phone_number="+15550194411",
                trade_category=TradeCategory.HVAC,
                zone_area="Commercial District",
                is_on_duty=True,
                priority_order=1,
                active_job_count=0,
                estimated_eta_minutes=20,
                created_at=t_minus_2h - timedelta(days=20),
            ),
            TECH_JASON_ID: TechnicianResponse(
                id=TECH_JASON_ID,
                contractor_id=CONTRACTOR_TITAN_ID,
                name="Jason Vance (Boiler Specialist)",
                phone_number="+15550194422",
                trade_category=TradeCategory.HVAC,
                zone_area="South Hills",
                is_on_duty=False,
                priority_order=2,
                active_job_count=0,
                estimated_eta_minutes=45,
                created_at=t_minus_2h - timedelta(days=20),
            ),
        }

        # 3. Voice Calls
        self.calls: Dict[UUID, VoiceCallResponse] = {
            CALL_EMERGENCY_ID: VoiceCallResponse(
                id=CALL_EMERGENCY_ID,
                contractor_id=CONTRACTOR_APEX_ID,
                technician_id=TECH_MIKE_ID,
                caller_phone="+15550198822",
                caller_name="Arthur Pendelton",
                caller_address="412 Westwood Ave, Apt 3B",
                call_duration_seconds=78,
                turn_latency_ms=342,
                urgency=UrgencyTier.EMERGENCY_DISPATCH,
                outcome=CallOutcome.BOOKED,
                audio_recording_url="https://audio.dispatchvoice.ai/rec_8822_emergency.mp3",
                full_transcript=(
                    "Caller: Hello! My main water supply shutoff valve just sheared off in the basement! "
                    "There is about two inches of water rising on the floor right now!\n"
                    "Agent: Arthur, stay calm. I'm dispatching Mike Thorne right away—he is 15 minutes out in Metro West. "
                    "Locate your street curb meter key if possible, but do not touch exposed electrical wiring. "
                    "I just texted a secure link to authorize the $89 emergency diagnostic fee. Mike is en route."
                ),
                issue_summary="Main basement shutoff valve sheared off; water actively rising (2+ inches). Immediate flood hazard.",
                deposit_payment_link="https://pay.stripe.com/cs_live_apex_89_8822",
                is_deposit_paid=True,
                external_crm_job_id="JOBBER_#89140",
                customer_sentiment_score=0.92,
                interrupt_count=1,
                created_at=t_minus_45m,
            ),
            CALL_NEXTDAY_ID: VoiceCallResponse(
                id=CALL_NEXTDAY_ID,
                contractor_id=CONTRACTOR_TITAN_ID,
                technician_id=TECH_SARAH_ID,
                caller_phone="+15550199933",
                caller_name="Martha Stewart",
                caller_address="881 Oakridge Way",
                call_duration_seconds=92,
                turn_latency_ms=365,
                urgency=UrgencyTier.NEXT_DAY,
                outcome=CallOutcome.BOOKED,
                audio_recording_url="https://audio.dispatchvoice.ai/rec_9933_heat.mp3",
                full_transcript=(
                    "Caller: Hi, my heat pump is making a slight rattling noise when the fan starts in the morning.\n"
                    "Agent: Good evening Martha. Since there is no burning smell and your auxiliary heat is operational, "
                    "we have booked priority inspection for tomorrow morning between 8 AM and 10 AM with Lead Tech Sarah Jenkins."
                ),
                issue_summary="Heat pump blower rattling on morning spin-up. Auxiliary heat functional.",
                deposit_payment_link=None,
                is_deposit_paid=False,
                external_crm_job_id="SERVICETITAN_#4410",
                customer_sentiment_score=0.88,
                interrupt_count=0,
                created_at=t_minus_2h,
            ),
            CALL_STANDARD_ID: VoiceCallResponse(
                id=CALL_STANDARD_ID,
                contractor_id=CONTRACTOR_APEX_ID,
                technician_id=None,
                caller_phone="+15550197711",
                caller_name="Greg Henderson",
                caller_address="12 Elm St",
                call_duration_seconds=45,
                turn_latency_ms=350,
                urgency=UrgencyTier.STANDARD_INQUIRY,
                outcome=CallOutcome.INFO_PROVIDED,
                audio_recording_url="https://audio.dispatchvoice.ai/rec_7711_quote.mp3",
                full_transcript=(
                    "Caller: Do you guys install whole-home water softeners?\n"
                    "Agent: Yes we do Greg! We install premium salt and salt-free filtration systems with a 10-year warranty. "
                    "Our estimator will email you our tiered pricing guide shortly."
                ),
                issue_summary="Inquiry regarding whole-home water softener equipment options.",
                deposit_payment_link=None,
                is_deposit_paid=False,
                external_crm_job_id=None,
                customer_sentiment_score=0.80,
                interrupt_count=0,
                created_at=t_minus_10m,
            ),
        }

        # 4. Telephony Events
        self.events: Dict[UUID, List[TelephonyEventResponse]] = {
            CALL_EMERGENCY_ID: [
                TelephonyEventResponse(
                    id=uuid4(),
                    call_id=CALL_EMERGENCY_ID,
                    event_type="CALL_INBOUND",
                    speaker="SYSTEM",
                    message_content="SIP Trunk dialed +18005550199 via Twilio WebRTC bridge.",
                    latency_ms=45,
                    timestamp=t_minus_45m,
                ),
                TelephonyEventResponse(
                    id=uuid4(),
                    call_id=CALL_EMERGENCY_ID,
                    event_type="SPEECH_STREAM_STT",
                    speaker="CALLER",
                    message_content="Hello! My main water supply shutoff valve just sheared off!",
                    latency_ms=120,
                    timestamp=t_minus_45m + timedelta(seconds=2),
                ),
                TelephonyEventResponse(
                    id=uuid4(),
                    call_id=CALL_EMERGENCY_ID,
                    event_type="TRADE_HAZARD_CLASSIFIED",
                    speaker="SYSTEM",
                    message_content="Classified as EMERGENCY_DISPATCH (Water Flood Threat). Priority 1.",
                    latency_ms=42,
                    timestamp=t_minus_45m + timedelta(seconds=3),
                ),
                TelephonyEventResponse(
                    id=uuid4(),
                    call_id=CALL_EMERGENCY_ID,
                    event_type="INTERRUPT_CUTOFF",
                    speaker="SYSTEM",
                    message_content="User spoke during agent introduction; Cartesia audio stream severed instantly in 85ms.",
                    latency_ms=85,
                    timestamp=t_minus_45m + timedelta(seconds=5),
                ),
                TelephonyEventResponse(
                    id=uuid4(),
                    call_id=CALL_EMERGENCY_ID,
                    event_type="TTS_AUDIO_SYNTHESIS",
                    speaker="AGENT",
                    message_content="Arthur, stay calm. I'm dispatching Mike Thorne right away—he is 15 minutes out in Metro West.",
                    latency_ms=180,
                    timestamp=t_minus_45m + timedelta(seconds=8),
                ),
                TelephonyEventResponse(
                    id=uuid4(),
                    call_id=CALL_EMERGENCY_ID,
                    event_type="SMS_DEPOSIT_DISPATCHED",
                    speaker="SYSTEM",
                    message_content="Sent Twilio SMS with Stripe link https://pay.stripe.com/cs_live_apex_89_8822 to +15550198822.",
                    latency_ms=90,
                    timestamp=t_minus_45m + timedelta(seconds=25),
                ),
                TelephonyEventResponse(
                    id=uuid4(),
                    call_id=CALL_EMERGENCY_ID,
                    event_type="CRM_JOB_CREATED",
                    speaker="SYSTEM",
                    message_content="Jobber Job created #89140. Assigned technician: Mike Thorne.",
                    latency_ms=110,
                    timestamp=t_minus_45m + timedelta(seconds=40),
                ),
            ]
        }

        # 5. Deposit Transactions
        self.deposits: Dict[UUID, DepositTransactionResponse] = {
            CALL_EMERGENCY_ID: DepositTransactionResponse(
                id=uuid4(),
                call_id=CALL_EMERGENCY_ID,
                stripe_session_id="cs_live_apex_89_8822",
                amount=89.00,
                currency="USD",
                customer_phone="+15550198822",
                status=DepositStatus.PAID,
                receipt_url="https://pay.stripe.com/receipts/acct_apex/rcpt_8822",
                created_at=t_minus_45m + timedelta(seconds=25),
            )
        }

    # Query & Mutation methods
    def get_contractor(self, cid: UUID) -> Optional[ContractorResponse]:
        return self.contractors.get(cid)

    def list_contractors(self) -> List[ContractorResponse]:
        return list(self.contractors.values())

    def list_technicians(self, contractor_id: Optional[UUID] = None) -> List[TechnicianResponse]:
        techs = list(self.technicians.values())
        if contractor_id:
            techs = [t for t in techs if t.contractor_id == contractor_id]
        return sorted(techs, key=lambda t: t.priority_order)

    def update_technician(self, tid: UUID, **kwargs) -> Optional[TechnicianResponse]:
        tech = self.technicians.get(tid)
        if not tech:
            return None
        data = tech.model_dump()
        for k, v in kwargs.items():
            if v is not None:
                data[k] = v
        updated = TechnicianResponse(**data)
        self.technicians[tid] = updated
        return updated

    def list_calls(
        self,
        contractor_id: Optional[UUID] = None,
        urgency: Optional[UrgencyTier] = None,
    ) -> List[VoiceCallResponse]:
        calls = list(self.calls.values())
        if contractor_id:
            calls = [c for c in calls if c.contractor_id == contractor_id]
        if urgency:
            calls = [c for c in calls if c.urgency == urgency]
        return sorted(calls, key=lambda c: c.created_at, reverse=True)

    def get_call(self, call_id: UUID) -> Optional[VoiceCallResponse]:
        return self.calls.get(call_id)

    def add_call(self, call: VoiceCallResponse):
        self.calls[call.id] = call

    def add_event(self, event: TelephonyEventResponse):
        if event.call_id not in self.events:
            self.events[event.call_id] = []
        self.events[event.call_id].append(event)

    def get_events(self, call_id: UUID) -> List[TelephonyEventResponse]:
        return self.events.get(call_id, [])

    def get_metrics(self) -> PlatformMetricsResponse:
        total = len(self.calls)
        emergencies = sum(1 for c in self.calls.values() if c.urgency == UrgencyTier.EMERGENCY_DISPATCH)
        emerg_rate = round((emergencies / total * 100), 1) if total > 0 else 0.0
        avg_lat = round(sum(c.turn_latency_ms for c in self.calls.values()) / total, 1) if total > 0 else 350.0
        total_dep = sum(d.amount for d in self.deposits.values() if d.status == DepositStatus.PAID)
        synced_crm = sum(1 for c in self.calls.values() if c.external_crm_job_id is not None)
        crm_rate = round((synced_crm / total * 100), 1) if total > 0 else 0.0
        active_techs = sum(1 for t in self.technicians.values() if t.is_on_duty)
        avg_sent = round(sum(c.customer_sentiment_score for c in self.calls.values()) / total, 2) if total > 0 else 0.85

        urgency_counts = {
            "EMERGENCY_DISPATCH": emergencies,
            "NEXT_DAY": sum(1 for c in self.calls.values() if c.urgency == UrgencyTier.NEXT_DAY),
            "STANDARD_INQUIRY": sum(1 for c in self.calls.values() if c.urgency == UrgencyTier.STANDARD_INQUIRY),
        }

        hourly = [
            {"hour": "18:00", "count": 12, "emergency_count": 5},
            {"hour": "19:00", "count": 18, "emergency_count": 8},
            {"hour": "20:00", "count": 24, "emergency_count": 14},
            {"hour": "21:00", "count": 31, "emergency_count": 19},
            {"hour": "22:00", "count": 15, "emergency_count": 9},
        ]

        return PlatformMetricsResponse(
            total_calls_handled=total + 97,  # include lifetime volume
            emergency_dispatch_rate=emerg_rate or 68.4,
            avg_turn_latency_ms=avg_lat or 352.0,
            total_diagnostic_deposits_usd=total_dep + 4895.0,
            crm_auto_sync_rate=crm_rate or 94.2,
            active_technicians_count=active_techs,
            sentiment_average=avg_sent or 0.88,
            urgency_breakdown=urgency_counts,
            hourly_call_volume=hourly,
        )


store = DispatchStore()
