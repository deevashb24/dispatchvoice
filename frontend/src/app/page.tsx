'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { MetricsBar } from '@/components/MetricsBar';
import { LiveCallStream } from '@/components/LiveCallStream';
import { ActiveCallDossier } from '@/components/ActiveCallDossier';
import { TechnicianCascade } from '@/components/TechnicianCascade';
import { SimulateCallModal } from '@/components/SimulateCallModal';
import {
  VoiceCall,
  Technician,
  Contractor,
  PlatformMetrics,
  TelephonyEvent,
  UrgencyTier,
  TradeCategory,
} from '@/types';

const API_BASE = 'http://localhost:8014/api/v1';

// Initial Fallback / Seed Data
const initialContractors: Contractor[] = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    business_name: 'Apex Emergency Plumbing & Rooter',
    trade_category: 'PLUMBING',
    forwarding_phone: '+18005550199',
    crm_provider: 'JOBBER',
    emergency_diagnostic_fee: 89.0,
    voice_agent_name: 'Sarah (Dispatch AI)',
    voice_model_id: 'sonic-english-trade-v1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    business_name: 'Titan Climate Solutions (HVAC)',
    trade_category: 'HVAC',
    forwarding_phone: '+18005550244',
    crm_provider: 'SERVICETITAN',
    emergency_diagnostic_fee: 119.0,
    voice_agent_name: 'Alex (HVAC AI)',
    voice_model_id: 'sonic-english-trade-v1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const initialTechnicians: Technician[] = [
  {
    id: 'b0000000-0000-0000-0000-000000000001',
    contractor_id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Mike Thorne (Master Plumber)',
    phone_number: '+15550193344',
    trade_category: 'PLUMBING',
    zone_area: 'Downtown / Metro West',
    is_on_duty: true,
    priority_order: 1,
    active_job_count: 1,
    estimated_eta_minutes: 15,
    created_at: new Date().toISOString(),
  },
  {
    id: 'b0000000-0000-0000-0000-000000000002',
    contractor_id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Dave Miller (Journeyman Plumber)',
    phone_number: '+15550193355',
    trade_category: 'PLUMBING',
    zone_area: 'North Suburbs',
    is_on_duty: true,
    priority_order: 2,
    active_job_count: 0,
    estimated_eta_minutes: 25,
    created_at: new Date().toISOString(),
  },
  {
    id: 'b0000000-0000-0000-0000-000000000003',
    contractor_id: 'c0000000-0000-0000-0000-000000000002',
    name: 'Sarah Jenkins (HVAC Lead)',
    phone_number: '+15550194411',
    trade_category: 'HVAC',
    zone_area: 'Commercial District',
    is_on_duty: true,
    priority_order: 1,
    active_job_count: 0,
    estimated_eta_minutes: 20,
    created_at: new Date().toISOString(),
  },
];

const initialCalls: VoiceCall[] = [
  {
    id: 'd0000000-0000-0000-0000-000000000001',
    contractor_id: 'c0000000-0000-0000-0000-000000000001',
    technician_id: 'b0000000-0000-0000-0000-000000000001',
    caller_phone: '+15550198822',
    caller_name: 'Arthur Pendelton',
    caller_address: '412 Westwood Ave, Apt 3B',
    call_duration_seconds: 78,
    turn_latency_ms: 342,
    urgency: 'EMERGENCY_DISPATCH',
    outcome: 'BOOKED',
    full_transcript:
      'Caller: Hello! My main water supply shutoff valve just sheared off in the basement! There is about two inches of water rising on the floor right now!\nAgent: Arthur, stay calm. I\'m dispatching Mike Thorne right away—he is 15 minutes out in Metro West. I just texted a secure link to authorize the $89 emergency diagnostic fee.',
    issue_summary:
      'Main basement shutoff valve sheared off; water actively rising (2+ inches). Immediate flood hazard.',
    deposit_payment_link: 'https://pay.stripe.com/cs_live_apex_89_8822',
    is_deposit_paid: true,
    external_crm_job_id: 'JOBBER_#89140',
    customer_sentiment_score: 0.92,
    interrupt_count: 1,
    created_at: new Date().toISOString(),
  },
];

const initialMetrics: PlatformMetrics = {
  total_calls_handled: 104,
  emergency_dispatch_rate: 68.4,
  avg_turn_latency_ms: 348.5,
  total_diagnostic_deposits_usd: 5785.0,
  crm_auto_sync_rate: 96.2,
  active_technicians_count: 3,
  sentiment_average: 0.89,
  urgency_breakdown: {
    EMERGENCY_DISPATCH: 71,
    NEXT_DAY: 22,
    STANDARD_INQUIRY: 11,
  },
  hourly_call_volume: [],
};

export default function Home() {
  const [contractors, setContractors] = useState<Contractor[]>(initialContractors);
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);
  const [calls, setCalls] = useState<VoiceCall[]>(initialCalls);
  const [metrics, setMetrics] = useState<PlatformMetrics>(initialMetrics);
  const [selectedCallId, setSelectedCallId] = useState<string | null>(initialCalls[0].id);
  const [events, setEvents] = useState<TelephonyEvent[]>([]);
  const [filterUrgency, setFilterUrgency] = useState<UrgencyTier | 'ALL'>('ALL');
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);

  // Fetch data from backend API
  const refreshData = async () => {
    try {
      const [mRes, cRes, tRes, callsRes] = await Promise.all([
        fetch(`${API_BASE}/metrics`).catch(() => null),
        fetch(`${API_BASE}/contractors`).catch(() => null),
        fetch(`${API_BASE}/technicians`).catch(() => null),
        fetch(`${API_BASE}/calls`).catch(() => null),
      ]);

      if (mRes && mRes.ok) setMetrics(await mRes.json());
      if (cRes && cRes.ok) setContractors(await cRes.json());
      if (tRes && tRes.ok) setTechnicians(await tRes.json());
      if (callsRes && callsRes.ok) {
        const data: VoiceCall[] = await callsRes.json();
        setCalls(data);
        if (data.length > 0 && !selectedCallId) {
          setSelectedCallId(data[0].id);
        }
      }
    } catch {
      // Keep using state
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch events for selected call
  useEffect(() => {
    if (!selectedCallId) return;
    fetch(`${API_BASE}/calls/${selectedCallId}/events`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setEvents(data))
      .catch(() => setEvents([]));
  }, [selectedCallId]);

  const handleSimulateCall = async (payload: {
    contractor_id: string;
    caller_phone: string;
    caller_name: string;
    caller_address: string;
    transcript_utterance: string;
    trade_category: TradeCategory;
  }) => {
    try {
      const res = await fetch(`${API_BASE}/calls/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const triageResult = await res.json();
        await refreshData();
        setSelectedCallId(triageResult.call_id);
      }
    } catch {
      // Local fallback simulation
      const newCall: VoiceCall = {
        id: `call_${Date.now()}`,
        contractor_id: payload.contractor_id,
        technician_id: technicians[0]?.id,
        caller_phone: payload.caller_phone,
        caller_name: payload.caller_name,
        caller_address: payload.caller_address,
        call_duration_seconds: 64,
        turn_latency_ms: 338,
        urgency: 'EMERGENCY_DISPATCH',
        outcome: 'BOOKED',
        full_transcript: `Caller: ${payload.transcript_utterance}\nAgent: We have dispatched Mike Thorne immediately! ETA 15 minutes.`,
        issue_summary: payload.transcript_utterance,
        deposit_payment_link: 'https://pay.stripe.com/cs_live_simulated',
        is_deposit_paid: false,
        external_crm_job_id: 'JOBBER_#99201',
        customer_sentiment_score: 0.94,
        interrupt_count: 1,
        created_at: new Date().toISOString(),
      };
      setCalls((prev) => [newCall, ...prev]);
      setSelectedCallId(newCall.id);
    }
  };

  const handleToggleDuty = async (id: string, currentDuty: boolean) => {
    try {
      await fetch(`${API_BASE}/technicians/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_on_duty: !currentDuty }),
      });
      refreshData();
    } catch {
      setTechnicians((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_on_duty: !currentDuty } : t))
      );
    }
  };

  const handleSendDeposit = async (callId: string, phone: string) => {
    try {
      await fetch(`${API_BASE}/calls/${callId}/send-deposit-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ call_id: callId, phone, amount: 89.0 }),
      });
      refreshData();
    } catch {
      setCalls((prev) =>
        prev.map((c) => (c.id === callId ? { ...c, is_deposit_paid: true } : c))
      );
    }
  };

  const handleSyncCrm = async (callId: string) => {
    try {
      const res = await fetch(`${API_BASE}/calls/${callId}/sync-crm`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setCalls((prev) =>
          prev.map((c) => (c.id === callId ? { ...c, external_crm_job_id: data.crm_job_id } : c))
        );
      }
    } catch {
      setCalls((prev) =>
        prev.map((c) =>
          c.id === callId ? { ...c, external_crm_job_id: 'JOBBER_#MANUAL_SYNC' } : c
        )
      );
    }
  };

  const selectedCall = calls.find((c) => c.id === selectedCallId) || calls[0] || null;

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col">
      <Header onSimulateClick={() => setIsSimulateOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        <MetricsBar metrics={metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Live Call Stream (3 cols) */}
          <div className="lg:col-span-4">
            <LiveCallStream
              calls={calls}
              selectedCallId={selectedCallId}
              onSelectCall={(id) => setSelectedCallId(id)}
              filterUrgency={filterUrgency}
              onFilterChange={setFilterUrgency}
            />
          </div>

          {/* Middle Column: Active Call Dossier & Telephony Waveform (5 cols) */}
          <div className="lg:col-span-5">
            <ActiveCallDossier
              call={selectedCall}
              technicians={technicians}
              events={events}
              onSendDeposit={handleSendDeposit}
              onSyncCrm={handleSyncCrm}
            />
          </div>

          {/* Right Column: On-Call Technician Cascade (3 cols) */}
          <div className="lg:col-span-3">
            <TechnicianCascade
              technicians={technicians}
              onToggleDuty={handleToggleDuty}
            />
          </div>
        </div>
      </main>

      <SimulateCallModal
        isOpen={isSimulateOpen}
        onClose={() => setIsSimulateOpen(false)}
        contractors={contractors}
        onSimulate={handleSimulateCall}
      />
    </div>
  );
}
