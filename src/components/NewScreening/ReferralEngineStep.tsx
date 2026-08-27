import React from 'react';
import { DRGradingResult, ReferralRecommendation, PatientInfo } from '../../types';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Stethoscope,
  ArrowRight,
  ArrowLeft,
  FileText,
  ShieldCheck
} from 'lucide-react';

interface ReferralEngineStepProps {
  patientInfo: PatientInfo;
  grading: DRGradingResult;
  referral: ReferralRecommendation;
  onProceedToReport: () => void;
  onBack: () => void;
}

export function ReferralEngineStep({
  patientInfo,
  grading,
  referral,
  onProceedToReport,
  onBack
}: ReferralEngineStepProps) {
  const isReferable = referral.status === 'REFERABLE';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-700 uppercase tracking-wider">
          <span>Step 8 of 8</span>
          <span className="text-slate-300">•</span>
          <span>Automated Clinical Referral Engine</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Clinical Triage & Referral Prioritization</h2>
        <p className="text-sm text-slate-600 mt-1">
          Evidence-based clinical decision support algorithm aligning ICDR classification with rural tele-ophthalmology referral guidelines.
        </p>
      </div>

      {/* Large Clinical Triage Card */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border shadow-md space-y-6 ${
          isReferable
            ? referral.priority === 'EMERGENCY'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500'
              : 'bg-amber-50 border-amber-300 ring-2 ring-amber-500'
            : 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500'
        }`}
      >
        {/* Top Status and Priority */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/10">
          <div className="flex items-center gap-3">
            {isReferable ? (
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                  referral.priority === 'EMERGENCY' ? 'bg-rose-600 shadow-lg shadow-rose-600/30' : 'bg-amber-600'
                }`}
              >
                <AlertTriangle className="w-7 h-7" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
            )}
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-600">
                Screening Triage Status
              </span>
              <h3
                className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  isReferable
                    ? referral.priority === 'EMERGENCY'
                      ? 'text-rose-950'
                      : 'text-amber-950'
                    : 'text-emerald-950'
                }`}
              >
                {referral.status === 'REFERABLE' ? 'REFERABLE TO OPHTHALMOLOGY' : 'NOT REFERABLE (ROUTINE)'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-lg font-bold text-xs font-mono uppercase tracking-wider ${
                referral.priority === 'EMERGENCY'
                  ? 'bg-rose-600 text-white animate-pulse'
                  : referral.priority === 'HIGH'
                  ? 'bg-amber-600 text-white'
                  : referral.priority === 'MEDIUM'
                  ? 'bg-amber-200 text-amber-900'
                  : 'bg-emerald-200 text-emerald-900'
              }`}
            >
              Priority: {referral.priority}
            </span>
          </div>
        </div>

        {/* 3 Core Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-black/5 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Assessed DR Grade</div>
            <div className="text-lg font-bold text-slate-900 mt-1">{grading.stageName}</div>
            <div className="text-[11px] text-slate-400 font-mono">ICDR Level {grading.stageNumber}</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-black/5 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">AI Model Confidence</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5 font-mono">
              {grading.confidence.toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-400">EfficientNet-B3 Saliency</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-black/5 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Referral Probability</div>
            <div
              className={`text-2xl font-black mt-0.5 font-mono ${
                isReferable ? 'text-amber-800' : 'text-emerald-800'
              }`}
            >
              {referral.referralProbability.toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-400">Triage Decision Threshold</div>
          </div>
        </div>

        {/* Clinical Recommendation Box */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-cyan-700" />
            Recommended Clinical Action
          </h4>
          <p className="text-sm font-semibold text-slate-900 leading-relaxed">
            {referral.suggestedAction}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                <strong className="text-slate-900">Recommended Timeframe:</strong> {referral.recommendedTimeframe}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                <strong className="text-slate-900">Tele-Hub:</strong> {referral.teleOphthalmologyCenter}
              </span>
            </div>
          </div>
        </div>

        {/* Mandatory Doctor Responsibility Callout */}
        <div className="p-4 bg-amber-100/70 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Medical Protocol Notice:</span>
            <span>
              Final clinical decision, dilation ophthalmoscopy, and treatment decisions remain the sole responsibility of the ophthalmologist.
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Grad-CAM</span>
        </button>

        <button
          type="button"
          onClick={onProceedToReport}
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Generate Clinical Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
