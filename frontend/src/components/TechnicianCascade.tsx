'use client';

import React from 'react';
import { Users, MapPin, Briefcase, Phone, Clock } from 'lucide-react';
import { Technician } from '@/types';

interface TechnicianCascadeProps {
  technicians: Technician[];
  onToggleDuty: (id: string, currentDuty: boolean) => Promise<void>;
}

export const TechnicianCascade: React.FC<TechnicianCascadeProps> = ({
  technicians,
  onToggleDuty,
}) => {
  return (
    <div className="bg-[#121824] border border-[#1E293B] rounded-xl flex flex-col h-[750px]">
      <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-purple-400" />
          <h2 className="text-sm font-semibold text-white">On-Call Tech Roster</h2>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-[#1E293B] text-[#94A3B8] font-mono">
          {technicians.filter((t) => t.is_on_duty).length} On Duty
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {technicians.map((tech) => (
          <div
            key={tech.id}
            className="p-3 bg-[#0B0F17] border border-[#1E293B] rounded-lg text-xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-white flex items-center space-x-1.5">
                  <span>{tech.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#1E293B] text-[#94A3B8] rounded">
                    #{tech.priority_order}
                  </span>
                </div>
                <div className="text-[11px] text-[#94A3B8] font-mono mt-0.5">
                  {tech.trade_category}
                </div>
              </div>

              <button
                onClick={() => onToggleDuty(tech.id, tech.is_on_duty)}
                className={`text-[10px] px-2 py-1 rounded font-semibold font-mono transition cursor-pointer ${
                  tech.is_on_duty
                    ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
              >
                {tech.is_on_duty ? 'ON DUTY' : 'OFF DUTY'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#94A3B8] pt-1 border-t border-[#1E293B]/60">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3 text-[#F97316]" />
                <span className="truncate">{tech.zone_area}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 text-[#10B981]" />
                <span>ETA: {tech.estimated_eta_minutes} mins</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#94A3B8] pt-1">
              <div className="flex items-center space-x-1 font-mono">
                <Briefcase className="h-3 w-3 text-blue-400" />
                <span>{tech.active_job_count} Active Jobs</span>
              </div>
              <span className="font-mono text-[#94A3B8]">{tech.phone_number}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
