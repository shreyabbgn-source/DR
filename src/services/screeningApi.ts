import {
  PatientInfo,
  QualityMetrics,
  EnhancementSettings,
  RetinalStructureFinding,
  DRGradingResult,
  GradCAMAnalysis,
  ReferralRecommendation,
  ScreeningRecord,
  DRStage,
  BatchScreeningItem
} from '../types';
import { DEMO_PRESET_CASES } from '../data/demoCases';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * FastAPI Contract Simulation for NETRA
 * Architecture:
 * - Pre-processing: Blur kernel estimation & CLAHE enhancement
 * - Segmentation: DeepLabV3+ / U-Net retinal vessel segmentation & Optic Disc / Fovea localization
 * - Classification: EfficientNet-B3 with spatial attention and calibrated Softmax temperature scaling
 * - Explainability: Grad-CAM activation mapping at final convolutional feature layer (Conv_1)
 */

export async function apiAssessQuality(
  imageSeed: string,
  patientInfo?: PatientInfo
): Promise<QualityMetrics> {
  await delay(350); // Simulate API latency

  // Check if this seed is marked as poor quality
  const isBlur = imageSeed.includes('blur') || imageSeed.includes('poor');

  if (isBlur) {
    return {
      status: 'REQUIRES_RECAPTURE',
      overallScore: 42,
      focusBlurScore: 38,
      illuminationScore: 45,
      contrastScore: 35,
      resolutionScore: 60,
      fieldOfViewScore: 40,
      feedbackReasons: [
        'Excessive optical blur and camera motion artifact',
        'Sub-optimal illumination (underexposed temporal quadrant)',
        'Low local contrast across vascular arcades',
        'Insufficient retinal field (<30 degrees effective coverage)'
      ],
      recommendation: 'IMAGE REQUIRES RECAPTURE: Steady patient forehead against slit-lamp/chin rest, ensure darkened room, and capture second photograph.'
    };
  }

  // Find matching preset if any
  const matchedPreset = DEMO_PRESET_CASES.find((c) => c.canvasSeed === imageSeed);
  if (matchedPreset) {
    return matchedPreset.quality;
  }

  return {
    status: 'ACCEPTED',
    overallScore: 94,
    focusBlurScore: 93,
    illuminationScore: 96,
    contrastScore: 92,
    resolutionScore: 96,
    fieldOfViewScore: 95,
    feedbackReasons: [],
    recommendation: 'Image quality meets diagnostic screening thresholds (Snellen equivalent > 6/60).'
  };
}

export async function apiEnhanceImage(
  imageSeed: string,
  settings: EnhancementSettings
): Promise<{ enhanced: boolean; latencyMs: number; appliedTransforms: string[] }> {
  await delay(280);
  const applied: string[] = [];
  if (settings.claheApplied) applied.push('Adaptive Histogram Equalization (CLAHE, clipLimit=2.0)');
  if (settings.denoiseApplied) applied.push('Bilateral Filter Denoising (d=9, sigmaColor=75)');
  if (settings.illuminationCorrection) applied.push('Gamma-corrected Illumination Normalization');
  applied.push(`Contrast Stretching (Factor: ${settings.contrastBoost.toFixed(1)}x)`);

  return {
    enhanced: true,
    latencyMs: 142,
    appliedTransforms: applied
  };
}

export async function apiDetectStructures(
  imageSeed: string,
  stage: DRStage
): Promise<RetinalStructureFinding> {
  await delay(400);
  const matchedPreset = DEMO_PRESET_CASES.find((c) => c.canvasSeed === imageSeed || c.expectedStage === stage);
  if (matchedPreset) {
    return matchedPreset.structureFindings;
  }
  return DEMO_PRESET_CASES[0].structureFindings;
}

export async function apiGradeDR(
  imageSeed: string,
  forceStage?: DRStage
): Promise<DRGradingResult> {
  await delay(450);

  if (forceStage) {
    const preset = DEMO_PRESET_CASES.find((c) => c.expectedStage === forceStage);
    if (preset) return preset.grading;
  }

  const matchedPreset = DEMO_PRESET_CASES.find((c) => c.canvasSeed === imageSeed);
  if (matchedPreset) {
    return matchedPreset.grading;
  }

  return DEMO_PRESET_CASES[2].grading; // default moderate
}

export async function apiGenerateGradCAM(
  imageSeed: string,
  stage: DRStage
): Promise<GradCAMAnalysis> {
  await delay(320);
  const matchedPreset = DEMO_PRESET_CASES.find((c) => c.canvasSeed === imageSeed || c.expectedStage === stage);
  if (matchedPreset) {
    return matchedPreset.gradCam;
  }
  return DEMO_PRESET_CASES[2].gradCam;
}

export async function apiEvaluateReferral(
  stage: DRStage,
  quality: QualityMetrics,
  structureFindings: RetinalStructureFinding,
  patientInfo: PatientInfo
): Promise<ReferralRecommendation> {
  await delay(200);

  if (quality.status === 'REQUIRES_RECAPTURE') {
    return {
      status: 'REFERABLE',
      priority: 'HIGH',
      referralProbability: 75.0,
      primaryReason: 'Inconclusive / Ungradable screening photograph. Protocol mandates repeat capture or clinical exam.',
      suggestedAction: 'Recapture fundus photograph. If still ungradable due to cataract/corneal opacity, refer to nearest eye center for slit-lamp biomicroscopy.',
      recommendedTimeframe: 'Same-day recapture or 2-week eye clinic visit',
      teleOphthalmologyCenter: 'District Hospital Tele-Ophthalmology Unit'
    };
  }

  const matchedPreset = DEMO_PRESET_CASES.find((c) => c.expectedStage === stage);
  if (matchedPreset) {
    return matchedPreset.referral;
  }

  return {
    status: 'REFERABLE',
    priority: 'HIGH',
    referralProbability: 88.0,
    primaryReason: 'Automated screening detected clinically significant retinopathy lesions.',
    suggestedAction: 'Refer to District Tele-Ophthalmologist for clinical evaluation and OCT.',
    recommendedTimeframe: '2-4 weeks specialist review',
    teleOphthalmologyCenter: 'District Hospital Tele-Ophthalmology Unit'
  };
}

export async function apiRunFullPipeline(
  patientInfo: PatientInfo,
  imageSeed: string,
  eyeSide: 'Left (OS)' | 'Right (OD)',
  forceStage?: DRStage
): Promise<ScreeningRecord> {
  const quality = await apiAssessQuality(imageSeed, patientInfo);
  const grading = await apiGradeDR(imageSeed, forceStage);
  const structureFindings = await apiDetectStructures(imageSeed, grading.stage);
  const gradCam = await apiGenerateGradCAM(imageSeed, grading.stage);
  const referral = await apiEvaluateReferral(grading.stage, quality, structureFindings, patientInfo);

  const newRecord: ScreeningRecord = {
    id: `NETRA-REC-${Date.now().toString().slice(-6)}`,
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

  return newRecord;
}

export async function apiProcessBatchItem(
  item: BatchScreeningItem,
  onProgress: (progress: number) => void
): Promise<BatchScreeningItem> {
  onProgress(20);
  await delay(250);

  // Map filename or id to a stage
  const stages: DRStage[] = ['NO_DR', 'MILD_NPDR', 'MODERATE_NPDR', 'SEVERE_NPDR', 'PDR'];
  const hash = item.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const selectedStage = stages[hash % stages.length];
  const isPoor = item.filename.toLowerCase().includes('poor') || item.filename.toLowerCase().includes('blur') || hash % 7 === 0;

  onProgress(50);
  const imageSeed = isPoor ? 'seed-blur-06' : `seed-batch-${item.id}`;

  const patientInfo: PatientInfo = {
    patientId: item.patientId,
    age: 45 + (hash % 25),
    sex: hash % 2 === 0 ? 'Female' : 'Male',
    diabetesDurationYears: 3 + (hash % 15),
    screeningCenter: 'Primary Health Centre Batch Queue',
    district: 'Rural Screening Camp',
    operatorName: 'Sunita Devi'
  };

  onProgress(75);
  const record = await apiRunFullPipeline(patientInfo, imageSeed, item.eyeSide, isPoor ? undefined : selectedStage);
  onProgress(100);

  return {
    ...item,
    status: 'COMPLETED',
    progress: 100,
    qualityStatus: record.quality.status,
    stage: record.grading.stage,
    confidence: record.grading.confidence,
    referralStatus: record.referral.status,
    record
  };
}
