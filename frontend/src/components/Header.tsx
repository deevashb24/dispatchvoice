'use client';

import React from 'react';
import { PhoneCall, Radio, Zap, ShieldCheck, Activity } from 'lucide-react';

interface HeaderProps {
  onSimulateClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSimulateClick }) => {
  return (
    <header className="border-b border-[#1E293B] bg-[#121824]/80 backdrop-blur sticky top-0 z-40 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 rounded-lg bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-center text-[#F97316]">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg text-white tracking-wide">DispatchVoice AI</h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#F97316]/20 text-[#F97316] font-semibold border border-[#F97316]/40">
                FIELD TRADE MISSION CONTROL
              </span>
            </div>
            <p className="text-xs text-[#94A3B8]">
              Sub-400ms Turnaround Telephony • Live Twilio SIP Bridge • Deepgram Nova-2 + Cartesia Sonic
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 bg-[#0B0F17] border border-[#1E293B] rounded-lg px-3 py-1.5 text-xs text-[#94A3B8]">
            <Activity className="h-3.5 w-3.5 text-[#10B981]" />
            <span>Turn Latency:</span>
            <span className="font-mono text-[#10B981] font-semibold">342ms SLA</span>
          </div>

          <div className="hidden md:flex items-center space-x-2 bg-[#0B0F17] border border-[#1E293B] rounded-lg px-3 py-1.5 text-xs text-[#94A3B8]">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
            <span>Jobber / ServiceTitan:</span>
            <span className="font-semibold text-white">CONNECTED</span>
          </div>

          <button
            onClick={onSimulateClick}
            className="flex items-center space-x-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-lg shadow-[#F97316]/20 transition cursor-pointer"
          >
            <PhoneCall className="h-4 w-4" />
            <span>Simulate Emergency Call</span>
          </button>
        </div>
      </div>
    </header>
  );
};
