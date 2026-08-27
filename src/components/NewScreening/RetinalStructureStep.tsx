import React, { useState } from 'react';
import { DRStage, RetinalStructureFinding } from '../../types';
import { FundusCanvasViewer } from './FundusCanvasViewer';
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  Eye,
  Activity,
  ArrowRight,
  ArrowLeft,
  Info,
  Sparkles
} from 'lucide-react';

interface RetinalStructureStepProps {
  imageSeed: string;
  stage: DRStage;
  structureFindings: RetinalStructureFinding;
  onProceedToGrading: () => void;
  onBack: () => void;
}

export function RetinalStructureStep({
  imageSeed,
  stage,
  structureFindings,
  onProceedToGrading,
  onBack
}: RetinalStructureStepProps) {
  const [showDisc, setShowDisc] = useState(true);
  const [showFovea, setShowFovea] = useState(true);
  const [showVessels, setShowVessels] = useState(true);
  const [showLesions, setShowLesions] = useState(true);

  const { lesionCount } = structureFindings;
  const totalLesions =
    lesionCount.microaneurysms +
    lesionCount.hemorrhages +
    lesionCount.hardExudates +
    lesionCount.cottonWoolSpots +
    lesionCount.neovascularization;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-700 uppercase tracking-wider">
          <span>Step 5 of 8</span>
          <span className="text-slate-300">•</span>
          <span>Computer Vision Retinal Morphology</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Retinal Structure & Lesion Analysis</h2>
        <p className="text-sm text-slate-600 mt-1">
          Automated localization of anatomical landmarks (Optic Disc, Macula) and candidate microvascular lesion segmentation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Interactive Canvas with Active Overlays */}
        <div className="md:col-span-7 flex flex-col items-center">
          <div className="w-full">
            <FundusCanvasViewer
              seed={imageSeed}
              stage={stage}
              enhanced={true}
              structureFindings={structureFindings}
              initialShowDisc={showDisc}
              initialShowFovea={showFovea}
              initialShowVessels={showVessels}
              initialShowLesions={showLesions}
              interactiveControls={true}
              title="Segmented Retinal Anatomy & Pathological Markers"
            />
          </div>

          {/* Color Legend */}
          <div className="w-full bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm mt-3">
            <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2">
              Anatomical & Pathological Legend:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600 inline-block" />
                <span className="text-slate-700">Optic Disc (OD)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sky-400 border border-sky-600 inline-block" />
                <span className="text-slate-700">Fovea / Macula</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-700 inline-block" />
                <span className="text-slate-700">Vessel Tree</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600 inline-block" />
                <span className="text-slate-700">Microaneurysms</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="text-slate-700">Hard Exudates (Lipids)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-pink-500 inline-block" />
                <span className="text-slate-700">Neovascularization</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Structural Findings Panel */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-600" />
                Structural Findings
              </h3>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 font-mono font-medium border border-cyan-200">
                U-Net / DeepLabV3+
              </span>
            </div>

            {/* Landmark 1: Optic Disc */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="font-semibold text-slate-800">Optic Disc (OD)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-medium">Detected</span>
                <span className="font-mono text-slate-500">({structureFindings.opticDiscConfidence}%)</span>
              </div>
            </div>

            {/* Landmark 2: Fovea */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sky-500" />
                <span className="font-semibold text-slate-800">Fovea / Macula Center</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-medium">Detected</span>
                <span className="font-mono text-slate-500">({structureFindings.foveaConfidence}%)</span>
              </div>
            </div>

            {/* Landmark 3: Vessel Segmentation */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-800">Vascular Segmentation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-700 font-medium">{structureFindings.vesselDensity}</span>
              </div>
            </div>

            {/* Candidate Lesion Breakdown */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                <span>Candidate Lesions Detected:</span>
                <span
                  className={`px-2 py-0.5 rounded font-mono ${
                    totalLesions > 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {totalLesions} Total
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between py-1 px-2 rounded bg-slate-50">
                  <span className="text-slate-700">Microaneurysms (Red dots)</span>
                  <span className="font-mono font-bold text-slate-900">{lesionCount.microaneurysms}</span>
                </div>
                <div className="flex items-center justify-between py-1 px-2 rounded bg-slate-50">
                  <span className="text-slate-700">Intraretinal Hemorrhages (Blots)</span>
                  <span className="font-mono font-bold text-slate-900">{lesionCount.hemorrhages}</span>
                </div>
                <div className="flex items-center justify-between py-1 px-2 rounded bg-slate-50">
                  <span className="text-slate-700">Hard Exudates (Lipid flecks)</span>
                  <span className="font-mono font-bold text-slate-900">{lesionCount.hardExudates}</span>
                </div>
                <div className="flex items-center justify-between py-1 px-2 rounded bg-slate-50">
                  <span className="text-slate-700">Cotton Wool Spots (Infarcts)</span>
                  <span className="font-mono font-bold text-slate-900">{lesionCount.cottonWoolSpots}</span>
                </div>
                <div className="flex items-center justify-between py-1 px-2 rounded bg-slate-50">
                  <span className="text-slate-700">Neovascularization Fronds (NVD/NVE)</span>
                  <span className="font-mono font-bold text-slate-900">{lesionCount.neovascularization}</span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Simulated anatomical landmark & candidate lesion detection for hackathon demonstration. Not clinically validated.
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
          <span>Back to Enhancement</span>
        </button>

        <button
          type="button"
          onClick={onProceedToGrading}
          className="px-6 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
        >
          <span>Proceed to AI DR Grading</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
