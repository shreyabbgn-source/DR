import React, { useState } from 'react';
import {
  PatientInfo,
  QualityMetrics,
  RetinalStructureFinding,
  DRGradingResult,
  GradCAMAnalysis,
  ReferralRecommendation,
  ScreeningRecord,
  DRStage
} from '../../types';
import { DEMO_PRESET_CASES } from '../../data/demoCases';
import {
  apiAssessQuality,
  apiDetectStructures,
  apiGradeDR,
  apiGenerateGradCAM,
  apiEvaluateReferral
} from '../../services/screeningApi';
import { saveScreeningRecord } from '../../services/storage';

import { PatientInfoStep } from './PatientInfoStep';
import { ImageUploadStep } from './ImageUploadStep';
import { QualityAssessmentStep } from './QualityAssessmentStep';
import { EnhancementStep } from './EnhancementStep';
import { RetinalStructureStep } from './RetinalStructureStep';
import { DRGradingStep } from './DRGradingStep';
import { ExplainableAIStep } from './ExplainableAIStep';
import { ReferralEngineStep } from './ReferralEngineStep';
import { ClinicalReportStep } from './ClinicalReportStep';

import {
  User,
  Upload,
  ShieldCheck,
  Sliders,
  Eye,
  Activity,
  Flame,
  FileCheck,
  CheckCircle2,
  Loader2,
  Sparkles
} from 'lucide-react';

interface ScreeningPipelineProps {
  key?: React.Key;
  onFinishScreening?: (record: ScreeningRecord) => void;
  initialPresetId?: string;
}

export type PipelineStep =
  | 'PATIENT_INFO'
  | 'UPLOAD'
  | 'QUALITY'
  | 'ENHANCEMENT'
  | 'STRUCTURES'
  | 'GRADING'
  | 'EXPLAINABLE_AI'
  | 'REFERRAL'
  | 'REPORT';

const STEPS: Array<{ id: PipelineStep; label: string; icon: any }> = [
  { id: 'PATIENT_INFO', label: 'Patient', icon: User },
  { id: 'UPLOAD', label: 'Upload', icon: Upload },
  { id: 'QUALITY', label: 'Quality', icon: ShieldCheck },
  { id: 'ENHANCEMENT', label: 'Enhance', icon: Sliders },
  { id: 'STRUCTURES', label: 'Structures', icon: Eye },
  { id: 'GRADING', label: 'Grading', icon: Activity },
  { id: 'EXPLAINABLE_AI', label: 'Grad-CAM', icon: Flame },
  { id: 'REFERRAL', label: 'Referral', icon: FileCheck },
  { id: 'REPORT', label: 'Report', icon: CheckCircle2 }
];

export function ScreeningPipeline({ onFinishScreening, initialPresetId }: ScreeningPipelineProps) {
  const initialPreset =
    DEMO_PRESET_CASES.find((c) => c.id === initialPresetId) || DEMO_PRESET_CASES[2]; // default Moderate

  const [currentStep, setCurrentStep] = useState<PipelineStep>('PATIENT_INFO');
  const [patientInfo, setPatientInfo] = useState<PatientInfo>(initialPreset.patientInfo);
  const [eyeSide, setEyeSide] = useState<'Left (OS)' | 'Right (OD)'>(initialPreset.eyeSide);
  const [imageSeed, setImageSeed] = useState<string>(initialPreset.canvasSeed);
  const [selectedStage, setSelectedStage] = useState<DRStage>(
    initialPreset.expectedStage || initialPreset.grading.stage
  );

  const [quality, setQuality] = useState<QualityMetrics>(initialPreset.quality);
  const [structureFindings, setStructureFindings] = useState<RetinalStructureFinding>(initialPreset.structureFindings);
  const [grading, setGrading] = useState<DRGradingResult>(initialPreset.grading);
  const [gradCam, setGradCam] = useState<GradCAMAnalysis>(initialPreset.gradCam);
  const [referral, setReferral] = useState<ReferralRecommendation>(initialPreset.referral);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Handle Preset Quick Load
  const handleLoadPreset = (presetId: string) => {
    const preset = DEMO_PRESET_CASES.find((c) => c.id === presetId);
    if (!preset) return;

    setPatientInfo(preset.patientInfo);
    setEyeSide(preset.eyeSide);
    setImageSeed(preset.canvasSeed);
    setSelectedStage(preset.expectedStage);
    setQuality(preset.quality);
    setStructureFindings(preset.structureFindings);
    setGrading(preset.grading);
    setGradCam(preset.gradCam);
    setReferral(preset.referral);
  };

  // Step Transitions with simulated AI processing
  const handleProceedToQuality = async () => {
    setIsLoading(true);
    setLoadingMessage('Assessing optical focus, illumination, and contrast...');
    try {
      const q = await apiAssessQuality(imageSeed, patientInfo);
      setQuality(q);
      setCurrentStep('QUALITY');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToEnhancement = () => {
    setCurrentStep('ENHANCEMENT');
  };

  const handleProceedToStructures = async () => {
    setIsLoading(true);
    setLoadingMessage('Segmenting vessel tree and localizing Optic Disc & Fovea...');
    try {
      const s = await apiDetectStructures(imageSeed, selectedStage);
      setStructureFindings(s);
      setCurrentStep('STRUCTURES');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToGrading = async () => {
    setIsLoading(true);
    setLoadingMessage('Running EfficientNet-B3 deep learning inference...');
    try {
      const g = await apiGradeDR(imageSeed, selectedStage);
      setGrading(g);
      setCurrentStep('GRADING');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToExplain = async () => {
    setIsLoading(true);
    setLoadingMessage('Computing Grad-CAM convolutional activation maps...');
    try {
      const gc = await apiGenerateGradCAM(imageSeed, grading.stage);
      setGradCam(gc);
      setCurrentStep('EXPLAINABLE_AI');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToReferral = async () => {
    setIsLoading(true);
    setLoadingMessage('Evaluating clinical tele-referral triage criteria...');
    try {
      const ref = await apiEvaluateReferral(grading.stage, quality, structureFindings, patientInfo);
      setReferral(ref);
      setCurrentStep('REFERRAL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToReport = () => {
    setCurrentStep('REPORT');
  };

  // Assembled full record for report
  const currentRecord: ScreeningRecord = {
    id: `NETRA-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
    patientInfo,
    createdAt: new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }),
    imageUrl: imageSeed,
    eyeSide,
    quality,
    structureFindings,
    grading,
    gradCam,
    referral,
    reviewedByDoctor: false,
    status: quality.status === 'REQUIRES_RECAPTURE' ? 'RECAPTURE_NEEDED' : 'PENDING_REVIEW'
  };

  const handleSaveToHistory = () => {
    saveScreeningRecord(currentRecord);
    if (onFinishScreening) {
      onFinishScreening(currentRecord);
    }
  };

  const handleStartNew = () => {
    // Pick random or normal case for next
    handleLoadPreset('case-moderate-03');
    setCurrentStep('PATIENT_INFO');
  };

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="space-y-6">
      {/* Top Pipeline Stepper Progress Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[750px] gap-2">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const Icon = step.icon;

            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => {
                    // Allow navigating to already completed steps or current
                    if (isCompleted || isCurrent) {
                      setCurrentStep(step.id);
                    }
                  }}
                  disabled={!isCompleted && !isCurrent}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all select-none ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400 ring-offset-1 font-black'
                      : isCompleted
                      ? 'bg-slate-100 text-slate-800 hover:bg-slate-200 cursor-pointer'
                      : 'bg-transparent text-slate-400 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isCurrent
                        ? 'bg-white text-blue-700'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span>{step.label}</span>
                </button>

                {idx < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 transition-colors ${
                      idx < currentStepIndex ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Loading Modal / State Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto animate-spin">
              <Loader2 className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inference Pipeline</p>
              <h3 className="text-lg font-black text-slate-900 mt-1">NETRA AI Inference Engine</h3>
              <p className="text-xs text-slate-600 mt-1.5 font-medium">{loadingMessage}</p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full animate-pulse w-3/4 mx-auto" />
            </div>
            <div className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
              Model: EfficientNet-B3 • Precision: FP16 • PyTorch Engine
            </div>
          </div>
        </div>
      )}

      {/* Active Step Content */}
      <div>
        {currentStep === 'PATIENT_INFO' && (
          <PatientInfoStep
            patientInfo={patientInfo}
            onChange={setPatientInfo}
            onContinue={() => setCurrentStep('UPLOAD')}
            eyeSide={eyeSide}
            onEyeSideChange={setEyeSide}
            onQuickLoadDemo={handleLoadPreset}
          />
        )}

        {currentStep === 'UPLOAD' && (
          <ImageUploadStep
            imageSeed={imageSeed}
            onImageSeedChange={setImageSeed}
            onProceedToQuality={handleProceedToQuality}
            onBack={() => setCurrentStep('PATIENT_INFO')}
            onSelectPreset={handleLoadPreset}
          />
        )}

        {currentStep === 'QUALITY' && (
          <QualityAssessmentStep
            imageSeed={imageSeed}
            quality={quality}
            onEnhance={handleProceedToEnhancement}
            onRecapture={() => setCurrentStep('UPLOAD')}
            onProceed={handleProceedToEnhancement}
            onBack={() => setCurrentStep('UPLOAD')}
          />
        )}

        {currentStep === 'ENHANCEMENT' && (
          <EnhancementStep
            imageSeed={imageSeed}
            onProceedToStructures={handleProceedToStructures}
            onBack={() => setCurrentStep('QUALITY')}
          />
        )}

        {currentStep === 'STRUCTURES' && (
          <RetinalStructureStep
            imageSeed={imageSeed}
            stage={selectedStage}
            structureFindings={structureFindings}
            onProceedToGrading={handleProceedToGrading}
            onBack={() => setCurrentStep('ENHANCEMENT')}
          />
        )}

        {currentStep === 'GRADING' && (
          <DRGradingStep
            imageSeed={imageSeed}
            grading={grading}
            onProceedToExplain={handleProceedToExplain}
            onBack={() => setCurrentStep('STRUCTURES')}
          />
        )}

        {currentStep === 'EXPLAINABLE_AI' && (
          <ExplainableAIStep
            imageSeed={imageSeed}
            stage={selectedStage}
            grading={grading}
            gradCam={gradCam}
            structureFindings={structureFindings}
            onProceedToReferral={handleProceedToReferral}
            onBack={() => setCurrentStep('GRADING')}
          />
        )}

        {currentStep === 'REFERRAL' && (
          <ReferralEngineStep
            patientInfo={patientInfo}
            grading={grading}
            referral={referral}
            onProceedToReport={handleProceedToReport}
            onBack={() => setCurrentStep('EXPLAINABLE_AI')}
          />
        )}

        {currentStep === 'REPORT' && (
          <ClinicalReportStep
            record={currentRecord}
            onSaveToHistory={handleSaveToHistory}
            onStartNew={handleStartNew}
            onBack={() => setCurrentStep('REFERRAL')}
          />
        )}
      </div>
    </div>
  );
}
