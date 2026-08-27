import React, { useState } from 'react';
import { DRGradingResult, GradCAMAnalysis, RetinalStructureFinding, DRStage } from '../../types';
import { FundusCanvasViewer } from './FundusCanvasViewer';
import {
  Flame,
  HelpCircle,
  Eye,
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface ExplainableAIStepProps {
  imageSeed: string;
  stage: DRStage;
  grading: DRGradingResult;
  gradCam: GradCAMAnalysis;
  structureFindings: RetinalStructureFinding;
  onProceedToReferral: () => void;
  onBack: () => void;
}

export function ExplainableAIStep({
  imageSeed,
  stage,
  grading,
  gradCam,
  structureFindings,
  onProceedToReferral,
  onBack
}: ExplainableAIStepProps) {
  const [viewMode, setViewMode] = useState<'heatmapOverlay' | 'sideBySide' | 'structuralTriage'>('heatmapOverlay');
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.70);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-700 uppercase tracking-wider">
          <span>Step 7 of 8</span>
          <span className="text-slate-300">•</span>
          <span>Interpretability & Visual Saliency</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-1">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            WHY DID THE AI PREDICT THIS?
          </h2>
          <span className="text-xs px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200 font-medium">
            AI-Assisted Explanation — For Clinician Review
          </span>
        </div>
        <p className="text-sm text-slate-600 mt-1">
          Grad-CAM (Gradient-weighted Class Activation Mapping) exposes the precise spatial regions in the retinal feature space that triggered the EfficientNet-B3 classification.
        </p>
      </div>

      {/* 3-Step Visual Explanation Flow Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold font-mono text-cyan-400">
            1
          </div>
          <div>
            <div className="font-semibold text-slate-200">Original Fundus</div>
            <div className="text-[11px] text-slate-400">45° Optical Input</div>
          </div>
        </div>

        <div className="hidden md:block text-slate-500 font-bold">→</div>

        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-amber-950/80 border border-amber-500 text-amber-300 flex items-center justify-center font-bold font-mono">
            2
          </div>
          <div>
            <div className="font-semibold text-amber-300">Grad-CAM Heatmap</div>
            <div className="text-[11px] text-slate-400">Conv_1 Feature Activation</div>
          </div>
        </div>

        <div className="hidden md:block text-slate-500 font-bold">→</div>

        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-300 flex items-center justify-center font-bold font-mono">
            3
          </div>
          <div>
            <div className="font-semibold text-emerald-300">Structural Evidence</div>
            <div className="text-[11px] text-slate-400">Lesion & Vessel Correlation</div>
          </div>
        </div>
      </div>

      {/* Main Visualizer & Saliency Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Canvas with Grad-CAM Saliency & Metrics */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-xs">
            {/* Heatmap Bar matching Design */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Retinal Visualization — Grad-CAM Heatmap
              </span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-black rounded uppercase tracking-wider">
                AI EXPLANATION ACTIVE
              </span>
            </div>

            <div className="p-4 flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-xs pb-2 mb-2 border-b border-slate-100">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Model Saliency Focus
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setViewMode('heatmapOverlay')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      viewMode === 'heatmapOverlay'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Heatmap Overlay
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('structuralTriage')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      viewMode === 'structuralTriage'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    + Lesion Markers
                  </button>
                </div>
              </div>

              <div className="w-full">
                <FundusCanvasViewer
                  seed={imageSeed}
                  stage={stage}
                  enhanced={true}
                  structureFindings={structureFindings}
                  gradCamData={gradCam}
                  initialShowGradCam={true}
                  initialGradCamOpacity={heatmapOpacity}
                  initialShowLesions={viewMode === 'structuralTriage'}
                  initialShowDisc={viewMode === 'structuralTriage'}
                  initialShowFovea={viewMode === 'structuralTriage'}
                  interactiveControls={true}
                  title="Grad-CAM Thermal Saliency Map"
                />
              </div>

              {/* Thermal Color Scale Bar */}
              <div className="w-full mt-3 p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-xs text-white">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                  <span>Low Model Saliency (0.0)</span>
                  <span className="text-amber-400">Peak Model Attention (1.0)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-blue-900 via-emerald-500 via-amber-400 to-rose-600" />
              </div>
            </div>
          </div>

          {/* 3 Metric Cards Under Canvas */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Confidence Score
              </p>
              <h2 className="text-3xl font-black text-blue-600 font-mono">
                {grading.confidence.toFixed(1)}%
              </h2>
              <div className="w-full h-1 bg-slate-100 mt-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${grading.confidence}%` }}
                  className="h-full bg-blue-600 rounded-full"
                ></div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Lesion Correlation
              </p>
              <h2 className="text-xl font-black text-slate-900 font-mono mt-1">
                {gradCam.lesionCorrelationScore}% Match
              </h2>
              <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">
                Convolutional Layer 1
              </p>
            </div>

            <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 shadow-xs">
              <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1">
                Referral Status
              </p>
              <h2 className="text-xl font-black text-rose-600 mt-1 uppercase">
                REFERABLE
              </h2>
              <p className="text-[10px] text-rose-600 mt-1 uppercase font-bold tracking-wider">
                Specialist Review
              </p>
            </div>
          </div>
        </div>

        {/* Right: AI Severity Assessment & Evidence Log */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* AI Severity Assessment */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              AI Severity Assessment
            </p>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase">
                    {grading.stageName}
                  </span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                    ICDR STAGE {grading.stageNumber}
                  </span>
                </div>
                <div className="flex gap-1 h-3 mt-2">
                  {[0, 1, 2, 3, 4].map((stepIdx) => {
                    const isSelected = stepIdx === grading.stageNumber;
                    const isPast = stepIdx < grading.stageNumber;
                    return (
                      <div
                        key={stepIdx}
                        className={`flex-1 rounded-sm transition-all ${
                          isSelected
                            ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]'
                            : isPast
                            ? 'bg-slate-300'
                            : 'bg-slate-100'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 space-y-2 border-t border-slate-100">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-500 uppercase tracking-wider">Probability Distribution</span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Mild', val: grading.probabilities.mild },
                    { label: 'Moderate', val: grading.probabilities.moderate },
                    { label: 'Severe', val: grading.probabilities.severe },
                    { label: 'PDR', val: grading.probabilities.pdr }
                  ].map((prob) => {
                    const isHigh = prob.val > 40;
                    return (
                      <div key={prob.label} className="flex items-center gap-3">
                        <span
                          className={`w-20 text-[10px] uppercase ${
                            isHigh ? 'text-slate-900 font-bold' : 'text-slate-400'
                          }`}
                        >
                          {prob.label}
                        </span>
                        <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${prob.val}%` }}
                            className={`h-full rounded-full ${isHigh ? 'bg-blue-600' : 'bg-slate-300'}`}
                          />
                        </div>
                        <span
                          className={`w-10 text-right text-[10px] font-mono ${
                            isHigh ? 'font-bold text-slate-900' : 'opacity-50 text-slate-500'
                          }`}
                        >
                          {prob.val.toFixed(1)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Deep Navy Evidence Log Card */}
          <div className="bg-slate-900 text-white rounded-xl p-6 flex-1 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-blue-600 rounded-lg text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest">Evidence Log</h3>
              </div>

              <ul className="space-y-3">
                {gradCam.clinicalPointers.map((pointer, idx) => (
                  <li key={idx} className="flex gap-3 text-xs">
                    <span className="text-blue-400 font-mono font-bold">[{String(idx + 1).padStart(2, '0')}]</span>
                    <p className="text-slate-200 leading-relaxed font-medium">{pointer}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 italic text-[10px] text-slate-400 font-medium">
              * This is an AI-assisted screening result. Final clinical decisions must be made by a certified ophthalmologist.
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
          <span>Back to Grading</span>
        </button>

        <button
          type="button"
          onClick={onProceedToReferral}
          className="px-6 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
        >
          <span>Evaluate Referral & Clinical Triage</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
