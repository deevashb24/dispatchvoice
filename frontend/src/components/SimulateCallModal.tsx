'use client';

import React, { useState } from 'react';
import { X, PhoneCall, Zap, AlertTriangle } from 'lucide-react';
import { Contractor, TradeCategory } from '@/types';

interface SimulateCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractors: Contractor[];
  onSimulate: (payload: {
    contractor_id: string;
    caller_phone: string;
    caller_name: string;
    caller_address: string;
    transcript_utterance: string;
    trade_category: TradeCategory;
  }) => Promise<void>;
}

export const SimulateCallModal: React.FC<SimulateCallModalProps> = ({
  isOpen,
  onClose,
  contractors,
  onSimulate,
}) => {
  const [contractorId, setContractorId] = useState(contractors[0]?.id || '');
  const [callerName, setCallerName] = useState('Brandon Hayes');
  const [callerPhone, setCallerPhone] = useState('+15550193499');
  const [callerAddress, setCallerAddress] = useState('1042 Riverbank Road');
  const [tradeCategory, setTradeCategory] = useState<TradeCategory>('PLUMBING');
  const [transcript, setTranscript] = useState(
    'My basement sump pump failed during the storm and water is rising towards the water heater right now!'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSimulate({
      contractor_id: contractorId || contractors[0]?.id,
      caller_name: callerName,
      caller_phone: callerPhone,
      caller_address: callerAddress,
      transcript_utterance: transcript,
      trade_category: tradeCategory,
    });
    setIsSubmitting(false);
    onClose();
  };

  const presetEmergency = (cat: TradeCategory, text: string) => {
    setTradeCategory(cat);
    setTranscript(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#121824] border border-[#1E293B] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PhoneCall className="h-5 w-5 text-[#F97316]" />
            <h3 className="font-bold text-white text-base">Simulate Inbound Telephony Call</h3>
          </div>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#94A3B8] block mb-1">
              Select Contractor Account
            </label>
            <select
              value={contractorId}
              onChange={(e) => setContractorId(e.target.value)}
              className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-lg p-2.5 text-xs text-white"
            >
              {contractors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.business_name} ({c.trade_category})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Caller Name</label>
              <input
                type="text"
                value={callerName}
                onChange={(e) => setCallerName(e.target.value)}
                className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-lg p-2 text-xs text-white"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Caller Phone</label>
              <input
                type="text"
                value={callerPhone}
                onChange={(e) => setCallerPhone(e.target.value)}
                className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-lg p-2 text-xs text-white font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Service Address</label>
            <input
              type="text"
              value={callerAddress}
              onChange={(e) => setCallerAddress(e.target.value)}
              className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-lg p-2 text-xs text-white"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#94A3B8]">
                Inbound Voice Transcript Utterance
              </label>
              <span className="text-[10px] text-[#F97316] font-mono">Simulates Live STT</span>
            </div>
            <textarea
              rows={3}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-lg p-2.5 text-xs text-white font-mono"
              required
            />
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#94A3B8] block mb-1.5">
              Quick Test Presets
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  presetEmergency(
                    'PLUMBING',
                    'Burst main supply pipe in basement! Water is 3 inches deep and rapidly gushing!'
                  )
                }
                className="text-[10px] px-2 py-1 bg-[#1E293B] hover:bg-[#F97316]/20 hover:text-[#F97316] rounded text-[#94A3B8] transition cursor-pointer"
              >
                🌊 Water Flood Emergency
              </button>
              <button
                type="button"
                onClick={() =>
                  presetEmergency(
                    'HVAC',
                    'Strong smell of gas near the heating furnace and sparks flying from the motor!'
                  )
                }
                className="text-[10px] px-2 py-1 bg-[#1E293B] hover:bg-red-500/20 hover:text-red-400 rounded text-[#94A3B8] transition cursor-pointer"
              >
                🔥 Gas &amp; Spark Hazard
              </button>
              <button
                type="button"
                onClick={() =>
                  presetEmergency(
                    'PLUMBING',
                    'Can we book an estimate for next week to inspect a slow bathtub drain?'
                  )
                }
                className="text-[10px] px-2 py-1 bg-[#1E293B] hover:bg-slate-700 rounded text-[#94A3B8] transition cursor-pointer"
              >
                📅 Standard Routine Inquiry
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1E293B] flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs rounded-lg text-[#94A3B8] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white shadow transition cursor-pointer"
            >
              {isSubmitting ? 'Simulating Call...' : 'Dispatch Voice Agent Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
