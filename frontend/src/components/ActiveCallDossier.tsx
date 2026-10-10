'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Volume2,
  DollarSign,
  Send,
  CheckCircle,
  ExternalLink,
  ShieldAlert,
  Zap,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { VoiceCall, TelephonyEvent, Technician } from '@/types';

interface ActiveCallDossierProps {
  call: VoiceCall | null;
  technicians: Technician[];
  events: TelephonyEvent[];
  onSendDeposit: (callId: string, phone: string) => Promise<void>;
  onSyncCrm: (callId: string) => Promise<void>;
}

export const ActiveCallDossier: React.FC<ActiveCallDossierProps> = ({
  call,
  technicians,
  events,
  onSendDeposit,
  onSyncCrm,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSendingSMS, setIsSendingSMS] = useState(false);
  const [isSyncingCrm, setIsSyncingCrm] = useState(false);
  const [smsSentNotice, setSmsSentNotice] = useState(false);
  const [crmSyncedNotice, setCrmSyncedNotice] = useState(false);

  // Animated Audio Waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.beginPath();
      ctx.strokeStyle = '#F97316';
      ctx.lineWidth = 2;

      for (let x = 0; x < width; x++) {
        const freq = 0.05;
        const amplitude = Math.sin(x * 0.02 + phase) * 12 + Math.cos(x * 0.08 + phase) * 6;
        const y = centerY + amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += 0.08;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  if (!call) {
    return (
      <div className="bg-[#121824] border border-[#1E293B] rounded-xl flex items-center justify-center h-[750px] p-6 text-center text-[#94A3B8]">
        <div>
          <Volume2 className="h-10 w-10 mx-auto mb-3 text-[#1E293B]" />
          <p className="text-sm">Select a call from the stream to inspect the active telephony dossier.</p>
        </div>
      </div>
    );
  }

  const assignedTech = technicians.find((t) => t.id === call.technician_id);

  const handleDepositClick = async () => {
    setIsSendingSMS(true);
    await onSendDeposit(call.id, call.caller_phone);
    setIsSendingSMS(false);
    setSmsSentNotice(true);
  };

  const handleCrmClick = async () => {
    setIsSyncingCrm(true);
    await onSyncCrm(call.id);
    setIsSyncingCrm(false);
    setCrmSyncedNotice(true);
  };

  return (
    <div className="bg-[#121824] border border-[#1E293B] rounded-xl flex flex-col h-[750px]">
      {/* Dossier Header */}
      <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-white">{call.caller_name || 'Caller'}</h2>
            <span className="font-mono text-xs text-[#94A3B8]">({call.caller_phone})</span>
            {call.urgency === 'EMERGENCY_DISPATCH' && (
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/40 flex items-center space-x-1">
                <ShieldAlert className="h-3 w-3 inline" />
                <span>EMERGENCY HAZARD</span>
              </span>
            )}
          </div>
          {call.caller_address && (
            <div className="flex items-center space-x-1 text-xs text-[#94A3B8] mt-0.5">
              <MapPin className="h-3 w-3 text-[#F97316]" />
              <span>{call.caller_address}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleDepositClick}
            disabled={isSendingSMS || smsSentNotice || call.is_deposit_paid}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition ${
              call.is_deposit_paid || smsSentNotice
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                : 'bg-[#F97316] hover:bg-[#EA580C] text-white cursor-pointer shadow'
            }`}
          >
            {call.is_deposit_paid || smsSentNotice ? (
              <>
                <CheckCircle className="h-3.5 w-3.5" />
                <span>$89 Deposit Sent</span>
              </>
            ) : (
              <>
                <DollarSign className="h-3.5 w-3.5" />
                <span>Send $89 SMS Deposit</span>
              </>
            )}
          </button>

          <button
            onClick={handleCrmClick}
            disabled={isSyncingCrm || crmSyncedNotice}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition ${
              call.external_crm_job_id || crmSyncedNotice
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-[#0B0F17] hover:bg-[#1E293B] text-white border border-[#1E293B] cursor-pointer'
            }`}
          >
            <CheckCircle className="h-3.5 w-3.5" />
            <span>{call.external_crm_job_id || (crmSyncedNotice ? 'Synced' : 'Sync CRM Job')}</span>
          </button>
        </div>
      </div>

      {/* Live Audio Waveform Strip */}
      <div className="px-4 py-2.5 bg-[#0B0F17] border-b border-[#1E293B] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Volume2 className="h-4 w-4 text-[#F97316]" />
          <canvas ref={canvasRef} width={260} height={24} className="rounded" />
          <span className="text-[11px] font-mono text-[#10B981] flex items-center space-x-1">
            <span className="h-2 w-2 rounded-full bg-[#10B981] animate-ping inline-block" />
            <span>Streaming Live (PCM 8kHz)</span>
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-[#94A3B8]">
          <span>Turn Latency: <strong className="text-[#10B981]">{call.turn_latency_ms}ms</strong></span>
          <span>Interrupted: <strong className="text-[#F97316]">{call.interrupt_count}x</strong></span>
        </div>
      </div>

      {/* Main Transcript Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-3 text-xs">
          <span className="text-[#94A3B8] font-semibold uppercase text-[10px] tracking-wide block mb-1">
            AI Triage & Hazard Diagnostic
          </span>
          <p className="text-white font-medium">{call.issue_summary}</p>
          {assignedTech && (
            <div className="mt-2 pt-2 border-t border-[#1E293B] flex items-center justify-between text-[11px]">
              <span className="text-[#94A3B8]">Dispatched Tech:</span>
              <span className="font-semibold text-white">
                {assignedTech.name} • ETA {assignedTech.estimated_eta_minutes} mins
              </span>
            </div>
          )}
        </div>

        <div className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mt-3">
          Full Conversational Audio Transcript
        </div>

        <div className="space-y-2">
          {call.full_transcript.split('\n').map((line, idx) => {
            const isCaller = line.startsWith('Caller:');
            const isAgent = line.startsWith('Agent:');
            const content = line.replace(/^(Caller:|Agent:)\s*/, '');

            return (
              <div
                key={idx}
                className={`p-3 rounded-lg text-xs leading-relaxed ${
                  isCaller
                    ? 'bg-[#1E293B]/40 border border-[#1E293B] text-slate-200'
                    : isAgent
                    ? 'bg-[#F97316]/10 border border-[#F97316]/20 text-orange-200'
                    : 'bg-[#0B0F17] text-[#94A3B8]'
                }`}
              >
                <div className="font-semibold text-[10px] uppercase font-mono mb-1 text-[#94A3B8]">
                  {isCaller ? '🗣️ Inbound Caller' : isAgent ? '🤖 Dispatch Voice AI (Sarah)' : 'System'}
                </div>
                <div>{content}</div>
              </div>
            );
          })}
        </div>

        {/* Telephony Event Stream Log */}
        {events.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[#1E293B]">
            <div className="text-[11px] font-mono font-semibold text-[#94A3B8] uppercase mb-2">
              Telephony Event Trace &amp; Latencies
            </div>
            <div className="space-y-1 text-[11px] font-mono">
              {events.map((ev) => (
                <div key={ev.id} className="flex items-center justify-between bg-[#0B0F17] px-2.5 py-1.5 rounded border border-[#1E293B]">
                  <span className="text-[#F97316] font-semibold">{ev.event_type}</span>
                  <span className="text-[#94A3B8] truncate max-w-xs">{ev.message_content}</span>
                  <span className="text-[#10B981]">{ev.latency_ms}ms</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
