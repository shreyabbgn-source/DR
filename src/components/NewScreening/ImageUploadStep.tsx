import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Sparkles, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { DEMO_PRESET_CASES } from '../../data/demoCases';
import { FundusCanvasViewer } from './FundusCanvasViewer';

interface ImageUploadStepProps {
  imageSeed: string;
  onImageSeedChange: (seed: string) => void;
  onProceedToQuality: () => void;
  onBack: () => void;
  onSelectPreset: (presetId: string) => void;
}

export function ImageUploadStep({
  imageSeed,
  onImageSeedChange,
  onProceedToQuality,
  onBack,
  onSelectPreset
}: ImageUploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('case-moderate-03');

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In web app, we create a deterministic seed from file name and size
      const customSeed = `upload-${file.name}-${file.size}`;
      onImageSeedChange(customSeed);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const customSeed = `upload-${file.name}-${file.size}`;
      onImageSeedChange(customSeed);
    }
  };

  const handlePresetClick = (preset: typeof DEMO_PRESET_CASES[0]) => {
    setSelectedPresetId(preset.id);
    onSelectPreset(preset.id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-700 uppercase tracking-wider">
          <span>Step 2 of 8</span>
          <span className="text-slate-300">•</span>
          <span>Fundus Image Ingestion</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Upload Fundus Photograph</h2>
        <p className="text-sm text-slate-600 mt-1">
          Provide a macula-centered or disc-centered 45° digital fundus photograph captured via portable or tabletop fundus camera.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Drag & Drop Zone and Demo Picker */}
        <div className="md:col-span-6 space-y-4">
          {/* Upload Box */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all bg-white cursor-pointer ${
              dragOver
                ? 'border-cyan-500 bg-cyan-50/50'
                : 'border-slate-300 hover:border-slate-400'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.dcm"
              onChange={handleFileSelected}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-cyan-50 text-cyan-700 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">
              Drag & Drop Fundus Photograph
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Supported Formats: <span className="font-semibold text-slate-700">JPG, JPEG, PNG, DICOM</span>
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium text-xs shadow-sm transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Upload from Computer / Camera
              </button>
            </div>
          </div>

          {/* Hackathon Preset Selector */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Or Select a Hackathon Demo Case:
              </h4>
            </div>
            <div className="space-y-2">
              {DEMO_PRESET_CASES.map((preset) => {
                const isSelected = preset.canvasSeed === imageSeed;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-50 border-cyan-500 text-cyan-950 font-semibold ring-1 ring-cyan-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">{preset.name}</span>
                      <span className="text-[11px] text-slate-500 line-clamp-1">{preset.shortDescription}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono shrink-0 ml-2 ${
                        preset.quality.status === 'REQUIRES_RECAPTURE'
                          ? 'bg-amber-100 text-amber-800'
                          : preset.expectedStage === 'NO_DR'
                          ? 'bg-emerald-100 text-emerald-800'
                          : preset.expectedStage === 'MILD_NPDR'
                          ? 'bg-sky-100 text-sky-800'
                          : preset.expectedStage === 'MODERATE_NPDR'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {preset.quality.status === 'REQUIRES_RECAPTURE' ? 'Recapture' : preset.expectedStage.replace('_', ' ')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Selected Fundus Live Preview */}
        <div className="md:col-span-6 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs text-slate-600 mb-2">
              <span className="font-semibold text-slate-800">Current Fundus Frame</span>
              <span className="font-mono text-[11px] text-slate-400">Resolution: 2048 x 2048</span>
            </div>

            <div className="w-full max-w-[340px]">
              <FundusCanvasViewer
                seed={imageSeed}
                isBlurry={imageSeed.includes('blur')}
                interactiveControls={false}
                title="Preview Aperture"
              />
            </div>

            <div className="w-full bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 mt-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
              <span>
                Standard macula-centered field. Next step will assess image sharpness, illumination balance, and contrast.
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
          <span>Back to Patient Info</span>
        </button>

        <button
          type="button"
          onClick={onProceedToQuality}
          className="px-6 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
        >
          <span>Run Image Quality Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
