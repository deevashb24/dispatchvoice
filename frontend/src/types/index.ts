export type TradeCategory =
  | 'PLUMBING'
  | 'HVAC'
  | 'ELECTRICAL'
  | 'ROOFING'
  | 'TOWING'
  | 'LOCKSMITH';

export type UrgencyTier =
  | 'EMERGENCY_DISPATCH'
  | 'NEXT_DAY'
  | 'STANDARD_INQUIRY';

export type CallOutcome =
  | 'BOOKED'
  | 'DEPOSIT_PENDING'
  | 'TRANSFERRED_TO_HUMAN'
  | 'INFO_PROVIDED'
  | 'ABANDONED';

export type CRMProvider =
  | 'JOBBER'
  | 'SERVICETITAN'
  | 'HOUSECALL_PRO'
  | 'GOOGLE_CALENDAR';

export type DepositStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED';

export interface TelephonyEvent {
  id: string;
  call_id: string;
  event_type: string;
  speaker: 'CALLER' | 'AGENT' | 'SYSTEM';
  message_content: string;
  latency_ms: number;
  timestamp: string;
}

export interface Technician {
  id: string;
  contractor_id: string;
  name: string;
  phone_number: string;
  trade_category: TradeCategory;
  zone_area: string;
  is_on_duty: boolean;
  priority_order: number;
  active_job_count: number;
  estimated_eta_minutes: number;
  created_at: string;
}

export interface Contractor {
  id: string;
  business_name: string;
  trade_category: TradeCategory;
  forwarding_phone: string;
  crm_provider: CRMProvider;
  emergency_diagnostic_fee: number;
  voice_agent_name: string;
  voice_model_id: string;
  created_at: string;
  updated_at: string;
}

export interface VoiceCall {
  id: string;
  contractor_id: string;
  technician_id?: string | null;
  caller_phone: string;
  caller_name?: string | null;
  caller_address?: string | null;
  call_duration_seconds: number;
  turn_latency_ms: number;
  urgency: UrgencyTier;
  outcome: CallOutcome;
  audio_recording_url?: string | null;
  full_transcript: string;
  issue_summary?: string | null;
  deposit_payment_link?: string | null;
  is_deposit_paid: boolean;
  external_crm_job_id?: string | null;
  customer_sentiment_score: number;
  interrupt_count: number;
  created_at: string;
}

export interface PlatformMetrics {
  total_calls_handled: number;
  emergency_dispatch_rate: number;
  avg_turn_latency_ms: number;
  total_diagnostic_deposits_usd: number;
  crm_auto_sync_rate: number;
  active_technicians_count: number;
  sentiment_average: number;
  urgency_breakdown: Record<string, number>;
  hourly_call_volume: Array<{ hour: string; count: number; emergency_count: number }>;
}
