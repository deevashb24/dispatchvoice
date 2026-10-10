'use client';

import React from 'react';
import { PhoneCall, AlertTriangle, Clock, DollarSign, Users, CheckCircle2 } from 'lucide-react';
import { PlatformMetrics } from '@/types';

interface MetricsBarProps {
  metrics: PlatformMetrics;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
      <div className="bg-[#121824] border border-[#1E293B] rounded-xl p-3.5">
        <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-1">
          <span>Calls Handled</span>
          <PhoneCall className="h-3.5 w-3.5 text-blue-400" />
        </div>
        <div className="text-xl font-bold font-mono text-white">
          {metrics.total_calls_handled}
        </div>
        <div className="text-[10px] text-[#94A3B8] mt-0.5">24h volume</div>
      </div>

      <div className="bg-[#121824] border border-[#1E293B] rounded-xl p-3.5">
        <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-1">
          <span>Emergency Triage</span>
          <AlertTriangle className="h-3.5 w-3.5 text-[#F97316]" />
        </div>
        <div className="text-xl font-bold font-mono text-[#F97316]">
          {metrics.emergency_dispatch_rate}%
        </div>
        <div className="text-[10px] text-[#94A3B8] mt-0.5">Water / gas / hazard</div>
      </div>

      <div className="bg-[#121824] border border-[#1E293B] rounded-xl p-3.5">
        <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-1">
          <span>Avg Turn Latency</span>
          <Clock className="h-3.5 w-3.5 text-[#10B981]" />
        </div>
        <div className="text-xl font-bold font-mono text-[#10B981]">
          {metrics.avg_turn_latency_ms}ms
        </div>
        <div className="text-[10px] text-[#94A3B8] mt-0.5">SLA: &lt; 400ms</div>
      </div>

      <div className="bg-[#121824] border border-[#1E293B] rounded-xl p-3.5">
        <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-1">
          <span>Diagnostic Deposits</span>
          <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
        </div>
        <div className="text-xl font-bold font-mono text-white">
          ${metrics.total_diagnostic_deposits_usd.toLocaleString()}
        </div>
        <div className="text-[10px] text-[#94A3B8] mt-0.5">Stripe SMS links</div>
      </div>

      <div className="bg-[#121824] border border-[#1E293B] rounded-xl p-3.5">
        <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-1">
          <span>CRM Auto-Sync</span>
          <CheckCircle2 className="h-3.5 w-3.5 text-sky-400" />
        </div>
        <div className="text-xl font-bold font-mono text-white">
          {metrics.crm_auto_sync_rate}%
        </div>
        <div className="text-[10px] text-[#94A3B8] mt-0.5">Jobber &amp; Titan</div>
      </div>

      <div className="bg-[#121824] border border-[#1E293B] rounded-xl p-3.5">
        <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-1">
          <span>On-Call Techs</span>
          <Users className="h-3.5 w-3.5 text-purple-400" />
        </div>
        <div className="text-xl font-bold font-mono text-white">
          {metrics.active_technicians_count} Active
        </div>
        <div className="text-[10px] text-[#94A3B8] mt-0.5">In service zones</div>
      </div>
    </div>
  );
};
