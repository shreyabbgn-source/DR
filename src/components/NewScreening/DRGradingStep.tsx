import React from 'react';
import { DRGradingResult, DRStage } from '../../types';
import { FundusCanvasViewer } from './FundusCanvasViewer';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Cpu,
  Zap,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface DRGradingStepProps {
  imageSeed: string;
  grading: DRGradingResult;
  onProceedToExplain: () => void;
  onBack: () => void;
}

const ICDR_STAGES: Array<{
  stage: DRStage;
  label: string;
  shortLabel: string;
  stageNum: number;
  color: string;
  badgeBg: string;
}> = [
  { stage: 'NO_DR', label: 'No Apparent DR', shortLabel: 'No DR', stageNum: 0, color: 'text-emerald-700', badgeBg: 'bg-emerald-500' },
  { stage: 'MILD_NPDR', label: 'Mild NPDR', shortLabel: 'Mild', stageNum: 1, color: 'text-sky-700', badgeBg: 'bg-sky-500' },
  { stage: 'MODERATE_NPDR', label: 'Moderate NPDR', shortLabel: 'Moderate', stageNum: 2, color: 'text-amber-700', badgeBg: 'bg-amber-500' },
  { stage: 'SEVERE_NPDR', label: 'Severe NPDR', shortLabel: 'Severe', stageNum: 3, color: 'text-orange-700', badgeBg: 'bg-orange-500' },
  { stage: 'PDR', label: 'Proliferative DR', shortLabel: 'PDR', stageNum: 4, color: 'text-rose-700', badgeBg: 'bg-rose-500' }
];

export function DRGradingStep({
  imageSeed,
  grading,
  onProceedToExplain,
  onBack
}: DRGradingStepProps) {
  const currentStageIndex = ICDR_STAGES.findIndex((s) => s.stage === grading.stage);

  const probArray = [
    { name: 'Grade 0: No DR', value: grading.probabilities.noDR, stage: 'NO_DR' },
    { name: 'Grade 1: Mild NPDR', value: grading.probabilities.mild, stage: 'MILD_NPDR' },
    { name: 'Grade 2: Moderate NPDR', value: grading.probabilities.moderate, stage: 'MODERATE_NPDR' },
    { name: 'Grade 3: Severe NPDR', value: grading.probabilities.severe, stage: 'SEVERE_NPDR' },
    { name: 'Grade 4: Proliferative DR', value: grading.probabilities.pdr, stage: 'PDR' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-700 uppercase tracking-wider">
          <span>Step 6 of 8</span>
          <span className="text-slate-300">•</span>
          <span>Deep Learning Severity Classification</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mt-1">DR Severity Assessment (ICDR Scale)</h2>
        <p className="text-sm text-slate-600 mt-1">
          Automated classification into the 5-stage International Clinical Diabetic Retinopathy (ICDR) scale using fine-tuned EfficientNet-B3.
        </p>
      </div>

      {/* Horizontal 5-Stage ICDR Visual Progression Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-700 uppercase tracking-wider">
            ICDR 5-Stage Clinical Staging Progression:
          </span>
          <span>International Council of Ophthalmology (ICO) Guideline</span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {ICDR_STAGES.map((s, idx) => {
            const isSelected = s.stage === grading.stage;
            return (
              <div
                key={s.stage}
                className={`relative p-3 rounded-lg border text-center transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-cyan-500 ring-offset-2 scale-[1.02]'
                    : 'bg-slate-50 text-slate-600 border-slate-200 opacity-80'
                }`}
              >
                <div className="flex items-center justify-center gap-1 text-[10px] font-mono uppercase mb-1">
                  <span>Level {s.stageNum}</span>
                </div>
                <div className="font-bold text-xs sm:text-sm leading-tight">{s.shortLabel}</div>
                {isSelected && (
                  <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold text-[10px]">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>PREDICTED</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Result Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Prominent Diagnosis Card */}
        <div className="md:col-span-6 space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
                <span className="font-semibold uppercase tracking-wider text-slate-700">Primary AI Prediction</span>
                <span className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                  <Cpu className="w-3.5 h-3.5 text-cyan-600" />
                  EfficientNet-B3
                </span>
              </div>

              {/* Huge Stage Badge */}
              <div className="mt-4">
                <span className="text-xs font-semibold text-cyan-800 uppercase tracking-widest block mb-1">
                  ICDR Grade {grading.stageNumber}
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">
                  {grading.stageName}
                </h3>
              </div>

              {/* Confidence Score Callout */}
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Model Calibrated Confidence</div>
                  <div className="text-3xl font-black text-slate-900 mt-0.5 font-mono tracking-tight">
                    {grading.confidence.toFixed(1)}%
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                    High Confidence
                  </span>
                  <div className="text-[11px] text-slate-400 mt-1">Latency: {grading.inferenceLatencyMs} ms</div>
                </div>
              </div>

              {/* ICDR Description */}
              <p className="text-xs text-slate-700 mt-4 leading-relaxed bg-cyan-50/50 p-3 rounded-lg border border-cyan-100">
                <span className="font-semibold text-slate-900 block mb-0.5">Clinical Definition:</span>
                {grading.icdrDescription}
              </p>
            </div>

            {/* Model Telemetry */}
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Architecture: EfficientNet-B3 + Spatial Attention</span>
              <span className="text-slate-400">Temp Scaling: T=1.12</span>
            </div>
          </div>
        </div>

        {/* Right: Softmax Probability Distribution Chart */}
        <div className="md:col-span-6 space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Class Probability Distribution
                </h4>
                <span className="text-xs text-slate-500 font-mono">Softmax (∑ = 100%)</span>
              </div>

              {/* Clean Horizontal Bar Distribution */}
              <div className="space-y-3 mt-4">
                {probArray.map((item) => {
                  const isPeak = item.stage === grading.stage;
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-medium ${isPeak ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                          {item.name}
                        </span>
                        <span className={`font-mono ${isPeak ? 'text-slate-900 font-bold text-sm' : 'text-slate-500'}`}>
                          {item.value.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${Math.max(item.value, 1.5)}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${
                            isPeak
                              ? 'bg-cyan-600'
                              : 'bg-slate-300'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
              <span>
                Probabilities are calibrated with isotonic regression on rural PHC validation cohorts to eliminate overconfidence.
              </span>
            </div>
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
          <span>Back to Structures</span>
        </button>

        <button
          type="button"
          onClick={onProceedToExplain}
          className="px-6 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
        >
          <span>View Explainable AI (Grad-CAM)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
