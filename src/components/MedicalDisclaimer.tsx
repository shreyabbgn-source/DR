import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export function MedicalDisclaimerBanner() {
  return (
    <div
      id="medical-disclaimer-banner"
      className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-2 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2"
    >
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="font-black text-amber-950 uppercase tracking-wider text-[11px]">AI-Assisted Screening Prototype:</span>
        <span className="text-[11px] font-medium text-amber-900/90">
          NETRA results are automated triage predictions for rural health centers. Final clinical diagnosis and treatment plans must always be confirmed by a licensed ophthalmologist.
        </span>
      </div>
      <div className="flex items-center gap-3 text-amber-800 font-bold text-[10px] uppercase tracking-wider">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          ICDR Calibrated
        </span>
        <span className="hidden sm:inline text-amber-300">•</span>
        <span className="hidden sm:inline bg-amber-200/70 text-amber-950 px-2 py-0.5 rounded font-black">Hackathon Demo</span>
      </div>
    </div>
  );
}

export function MedicalDisclaimerFooter() {
  return (
    <footer
      id="medical-footer"
      className="h-9 bg-slate-200 border-t border-slate-300 flex items-center justify-between px-4 sm:px-8 text-[9px] font-bold text-slate-500 uppercase tracking-widest"
    >
      <div className="flex items-center gap-2">
        <span className="font-black text-slate-700">NETRA v2.4.0</span>
        <span className="text-slate-400">•</span>
        <span>Demonstration Environment</span>
      </div>
      <div className="hidden sm:block text-slate-500 font-medium">
        Primary Health Centre (PHC) Screening & Tele-Triage
      </div>
    </footer>
  );
}

export const MedicalFooter = MedicalDisclaimerFooter;

