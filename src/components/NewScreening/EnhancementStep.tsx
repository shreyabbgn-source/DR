import React, { useState } from 'react';
import { EnhancementSettings } from '../../types';
import { FundusCanvasViewer } from './FundusCanvasViewer';
import {
  Sliders,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sun,
  Activity,
  Layers
} from 'lucide-react';

interface EnhancementStepProps {
  imageSeed: string;
  onProceedToStructures: () => void;
  onBack: () => void;
}

export function EnhancementStep({
  imageSeed,
  onProceedToStructures,
  onBack
}: EnhancementStepProps) {
  const [settings, setSettings] = useState<EnhancementSettings>({
    claheApplied: true,
    denoiseApplied: true,
    illuminationCorrection: true,
    contrastBoost: 1.4
  });

  const [activeTab, setActiveTab] = useState<'sideBySide' | 'enhancedOnly'>('sideBySide');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-700 uppercase tracking-wider">
          <span>Step 4 of 8</span>
          <span className="text-slate-300">•</span>
          <span>Pre-Processing & Contrast Standardization</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Image Enhancement & Pre-Processing</h2>
        <p className="text-sm text-slate-600 mt-1">
          Normalizes variable illumination from rural handheld cameras and boosts contrast of subtle microaneurysms and capillary dropouts using CLAHE.
        </p>
      </div>

      {/* Processing Pipeline Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Illumination</div>
            <div className="text-xs font-bold text-slate-900">Gamma Normalization</div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Equalization</div>
            <div className="text-xs font-bold text-slate-900">CLAHE (8x8 grid)</div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Filter</div>
            <div className="text-xs font-bold text-slate-900">Bilateral Denoise</div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Sharpening</div>
            <div className="text-xs font-bold text-slate-900">Vascular Boost</div>
          </div>
        </div>
      </div>

      {/* Before & After Visual Comparison */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Enhanced Fundus Comparison
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('sideBySide')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'sideBySide'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Side-by-Side View
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('enhancedOnly')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'enhancedOnly'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Enhanced Only
            </button>
          </div>
        </div>

        {activeTab === 'sideBySide' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Original Raw Fundus</span>
                <span className="text-slate-400 font-mono text-[10px]">Unprocessed Input</span>
              </div>
              <FundusCanvasViewer
                seed={imageSeed}
                enhanced={false}
                interactiveControls={false}
                title="Original Fundus"
              />
            </div>

            {/* Enhanced */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-emerald-700 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Enhanced (CLAHE Applied)
                </span>
                <span className="text-emerald-600 font-mono text-[10px]">Vessels & Lesions Sharpened</span>
              </div>
              <FundusCanvasViewer
                seed={imageSeed}
                enhanced={true}
                interactiveControls={false}
                title="CLAHE Enhanced Fundus"
              />
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <FundusCanvasViewer
              seed={imageSeed}
              enhanced={true}
              interactiveControls={true}
              title="CLAHE Enhanced Fundus (Full View)"
            />
          </div>
        )}

        {/* Live Filter Controls */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.claheApplied}
                onChange={(e) => setSettings({ ...settings, claheApplied: e.target.checked })}
                className="rounded text-cyan-600 focus:ring-cyan-500"
              />
              <span className="font-semibold text-slate-700">Enable CLAHE Filter</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.denoiseApplied}
                onChange={(e) => setSettings({ ...settings, denoiseApplied: e.target.checked })}
                className="rounded text-cyan-600 focus:ring-cyan-500"
              />
              <span className="font-semibold text-slate-700">Denoising Bilateral</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.illuminationCorrection}
                onChange={(e) => setSettings({ ...settings, illuminationCorrection: e.target.checked })}
                className="rounded text-cyan-600 focus:ring-cyan-500"
              />
              <span className="font-semibold text-slate-700">Illumination Normalization</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Contrast Boost:</span>
            <input
              type="range"
              min="1.0"
              max="2.0"
              step="0.1"
              value={settings.contrastBoost}
              onChange={(e) => setSettings({ ...settings, contrastBoost: parseFloat(e.target.value) })}
              className="w-24 accent-cyan-600 cursor-pointer"
            />
            <span className="font-mono text-slate-800 w-8">{settings.contrastBoost.toFixed(1)}x</span>
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
          <span>Back to Quality</span>
        </button>

        <button
          type="button"
          onClick={onProceedToStructures}
          className="px-6 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
        >
          <span>Proceed to Retinal Structure Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
