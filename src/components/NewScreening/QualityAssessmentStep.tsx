import React from 'react';
import { QualityMetrics } from '../../types';
import { FundusCanvasViewer } from './FundusCanvasViewer';
import {
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Sliders,
  ShieldCheck
} from 'lucide-react';

interface QualityAssessmentStepProps {
  imageSeed: string;
  quality: QualityMetrics;
  onEnhance: () => void;
  onRecapture: () => void;
  onProceed: () => void;
  onBack: () => void;
}

export function QualityAssessmentStep({
  imageSeed,
  quality,
  onEnhance,
  onRecapture,
  onProceed,
  onBack
}: QualityAssessmentStepProps) {
  const isAccepted = quality.status === 'ACCEPTED';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-700 uppercase tracking-wider">
          <span>Step 3 of 8</span>
          <span className="text-slate-300">•</span>
          <span>Automated Quality Gate & Pre-Flight Check</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Image Quality Assessment</h2>
        <p className="text-sm text-slate-600 mt-1">
          Automated evaluation of diagnostic clarity according to WHO / ICDR tele-screening quality protocols before deep learning inference.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Fundus Viewer with blur / aperture simulation */}
        <div className="md:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-[360px]">
            <FundusCanvasViewer
              seed={imageSeed}
              isBlurry={quality.status === 'REQUIRES_RECAPTURE'}
              qualityStatus={quality.status}
              interactiveControls={false}
              title="Assessed Fundus Frame"
            />
          </div>
        </div>

        {/* Right: Quality Scores Breakdown & Status */}
        <div className="md:col-span-6 space-y-4">
          {/* Status Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              isAccepted
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            {isAccepted ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-wide">
                  {isAccepted ? 'IMAGE ACCEPTED' : 'IMAGE REQUIRES RECAPTURE'}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-mono font-semibold ${
                    isAccepted ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                  }`}
                >
                  Score: {quality.overallScore}/100
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1">{quality.recommendation}</p>
            </div>
          </div>

          {/* Metric Progress Bars */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Quality Metrics</span>
              <span className="text-[11px] font-normal text-slate-500">Threshold: ≥70</span>
            </h4>

            {/* Focus / Blur */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Focus / Blur Sharpness</span>
                <span className="font-mono font-semibold text-slate-900">{quality.focusBlurScore}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${quality.focusBlurScore}%` }}
                  className={`h-full rounded-full ${
                    quality.focusBlurScore >= 70 ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </div>
            </div>

            {/* Illumination */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Illumination Uniformity</span>
                <span className="font-mono font-semibold text-slate-900">{quality.illuminationScore}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${quality.illuminationScore}%` }}
                  className={`h-full rounded-full ${
                    quality.illuminationScore >= 70 ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </div>
            </div>

            {/* Contrast */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Local Vascular Contrast</span>
                <span className="font-mono font-semibold text-slate-900">{quality.contrastScore}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${quality.contrastScore}%` }}
                  className={`h-full rounded-full ${
                    quality.contrastScore >= 70 ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </div>
            </div>

            {/* Resolution */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Sensor Optical Resolution</span>
                <span className="font-mono font-semibold text-slate-900">{quality.resolutionScore}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${quality.resolutionScore}%` }}
                  className={`h-full rounded-full ${
                    quality.resolutionScore >= 70 ? 'bg-emerald-500' : 'bg-emerald-500'
                  }`}
                />
              </div>
            </div>

            {/* Field of View */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Retinal Field Coverage (45°)</span>
                <span className="font-mono font-semibold text-slate-900">{quality.fieldOfViewScore}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${quality.fieldOfViewScore}%` }}
                  className={`h-full rounded-full ${
                    quality.fieldOfViewScore >= 70 ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Feedback Reasons (if poor quality) */}
          {quality.feedbackReasons.length > 0 && (
            <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-xs">
              <span className="font-bold text-amber-950 block mb-1.5">Detected Quality Artifacts:</span>
              <ul className="space-y-1 text-amber-900 list-disc list-inside">
                {quality.feedbackReasons.map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Navigation and Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Upload</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {!isAccepted && (
            <button
              type="button"
              onClick={onRecapture}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Recapture Image</span>
            </button>
          )}

          <button
            type="button"
            onClick={onEnhance}
            className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>Apply CLAHE Enhancement</span>
          </button>

          <button
            type="button"
            onClick={onProceed}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Proceed to Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
