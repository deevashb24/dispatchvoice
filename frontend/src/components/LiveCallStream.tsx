'use client';

import React from 'react';
import { AlertCircle, Calendar, HelpCircle, PhoneIncoming, Clock } from 'lucide-react';
import { VoiceCall, UrgencyTier } from '@/types';

interface LiveCallStreamProps {
  calls: VoiceCall[];
  selectedCallId: string | null;
  onSelectCall: (id: string) => void;
  filterUrgency: UrgencyTier | 'ALL';
  onFilterChange: (urgency: UrgencyTier | 'ALL') => void;
}

export const LiveCallStream: React.FC<LiveCallStreamProps> = ({
  calls,
  selectedCallId,
  onSelectCall,
  filterUrgency,
  onFilterChange,
}) => {
  const filtered = calls.filter((c) =>
    filterUrgency === 'ALL' ? true : c.urgency === filterUrgency
  );

  return (
    <div className="bg-[#121824] border border-[#1E293B] rounded-xl flex flex-col h-[750px]">
      <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <PhoneIncoming className="h-4 w-4 text-[#F97316]" />
          <h2 className="text-sm font-semibold text-white">Live Call Stream</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#1E293B] text-[#94A3B8] font-mono">
            {filtered.length}
          </span>
        </div>
      </div>

      <div className="px-4 py-2 border-b border-[#1E293B] flex items-center space-x-1.5 overflow-x-auto text-[11px]">
        {(['ALL', 'EMERGENCY_DISPATCH', 'NEXT_DAY', 'STANDARD_INQUIRY'] as const).map((tier) => (
          <button
            key={tier}
            onClick={() => onFilterChange(tier)}
            className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
              filterUrgency === tier
                ? 'bg-[#F97316] text-white shadow-sm'
                : 'bg-[#0B0F17] text-[#94A3B8] hover:text-white border border-[#1E293B]'
            }`}
          >
            {tier === 'ALL'
              ? 'All Calls'
              : tier === 'EMERGENCY_DISPATCH'
              ? '🚨 Emergency'
              : tier === 'NEXT_DAY'
              ? '📅 Next Day'
              : '💬 Inquiry'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-[#1E293B] p-2 space-y-1">
        {filtered.map((call) => {
          const isSelected = call.id === selectedCallId;
          const isEmergency = call.urgency === 'EMERGENCY_DISPATCH';

          return (
            <div
              key={call.id}
              onClick={() => onSelectCall(call.id)}
              className={`p-3 rounded-lg cursor-pointer transition border text-left ${
                isSelected
                  ? 'bg-[#0B0F17] border-[#F97316]/50 shadow-md'
                  : 'bg-[#121824] hover:bg-[#0B0F17]/60 border-transparent'
              } ${isEmergency ? 'border-l-4 border-l-[#F97316]' : ''}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-semibold text-white">
                  {call.caller_phone}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-semibold font-mono ${
                    call.urgency === 'EMERGENCY_DISPATCH'
                      ? 'bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/30'
                      : call.urgency === 'NEXT_DAY'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-slate-700/30 text-slate-300 border border-slate-700/50'
                  }`}
                >
                  {call.urgency.replace('_', ' ')}
                </span>
              </div>

              <div className="text-xs text-[#94A3B8] line-clamp-2 mb-2">
                {call.issue_summary || call.full_transcript}
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#94A3B8] font-mono">
                <div className="flex items-center space-x-1.5">
                  <Clock className="h-3 w-3 text-[#10B981]" />
                  <span>{call.turn_latency_ms}ms turn</span>
                </div>
                <span>{call.call_duration_seconds}s</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
