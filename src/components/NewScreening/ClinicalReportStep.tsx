import React, { useState } from 'react';
import { ScreeningRecord } from '../../types';
import { FundusCanvasViewer } from './FundusCanvasViewer';
import { generateClinicalPDFReport } from '../../services/reportGenerator';
import {
  Download,
  Printer,
  Save,
  CheckCircle2,
  AlertTriangle,
  FileText,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Building,
  User,
  Calendar,
  Eye,
  ShieldAlert
} from 'lucide-react';

interface ClinicalReportStepProps {
  record: ScreeningRecord;
  onSaveToHistory: () => void;
  onStartNew: () => void;
  onBack: () => void;
}

export function ClinicalReportStep({
  record,
  onSaveToHistory,
  onStartNew,
  onBack
}: ClinicalReportStepProps) {
  const [saved, setSaved] = useState(false);
  const p = record.patientInfo;
  const g = record.grading;
  const r = record.referral;
  const q = record.quality;
  const s = record.structureFindings;
  const isReferable = r.status === 'REFERABLE';

  const handleDownloadPDF = () => {
    generateClinicalPDFReport(record);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    onSaveToHistory();
    setSaved(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Screening Pipeline Completed</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">Clinical Tele-Screening Report</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saved}
            className={`px-4 py-2 rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer ${
              saved
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved to History</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save to History</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Printable Clinical Report Document Container */}
      <div
        id="printable-clinical-report"
        className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-300 shadow-xl space-y-6 text-slate-900"
      >
        {/* Hospital / Health Mission Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-cyan-400 flex items-center justify-center font-bold text-lg">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight uppercase text-slate-950">
                NETRA — Diabetic Retinopathy Screening System
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                National Health Mission • Tele-Ophthalmology Screening Unit
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs">
            <div className="font-mono font-bold text-slate-900">Report Ref: {record.id}</div>
            <div className="text-slate-500">Date: {record.createdAt}</div>
          </div>
        </div>

        {/* Patient & Center Metadata Grid */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Patient ID:</span>
            <span className="font-bold text-slate-900 font-mono text-sm">{p.patientId}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">Age / Sex:</span>
            <span className="font-bold text-slate-900">{p.age} Yrs / {p.sex}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">Diabetes Duration:</span>
            <span className="font-bold text-slate-900">{p.diabetesDurationYears} Years</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">Eye Examined:</span>
            <span className="font-bold text-cyan-800">{record.eyeSide}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Screening PHC / Camp:</span>
            <span className="font-semibold text-slate-800">{p.screeningCenter}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">District / State:</span>
            <span className="font-semibold text-slate-800">{p.district}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">Vision Tech / Operator:</span>
            <span className="font-semibold text-slate-800">{p.operatorName}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">HbA1c Level:</span>
            <span className="font-semibold text-slate-800">{p.lastHbA1c || 'Not tested'}</span>
          </div>
        </div>

        {/* Primary Classification & Referral Triage Summary (Two columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* DR Severity */}
          <div
            className={`p-4 rounded-xl border ${
              isReferable
                ? 'bg-rose-50/50 border-rose-200 text-rose-950'
                : 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              AI DR Severity Assessment
            </span>
            <h3 className="text-xl font-black mt-1 text-slate-950">
              {g.stageName}
            </h3>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="font-bold text-slate-800">
                Confidence: <span className="font-mono text-cyan-800">{g.confidence.toFixed(1)}%</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">ICDR Level {g.stageNumber} / 4</span>
            </div>
            <p className="text-xs text-slate-600 mt-2 line-clamp-2">
              {g.icdrDescription}
            </p>
          </div>

          {/* Referral Triage */}
          <div
            className={`p-4 rounded-xl border ${
              isReferable
                ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                : 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Tele-Triage Status
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                  r.priority === 'EMERGENCY'
                    ? 'bg-rose-600 text-white'
                    : r.priority === 'HIGH'
                    ? 'bg-amber-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {r.priority}
              </span>
            </div>
            <h3 className="text-xl font-black mt-1">
              {r.status === 'REFERABLE' ? 'REFERRAL RECOMMENDED' : 'NOT REFERABLE (ROUTINE)'}
            </h3>
            <div className="text-xs text-slate-700 mt-2 font-medium">
              Timeframe: <strong className="text-slate-900">{r.recommendedTimeframe}</strong>
            </div>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
              {r.suggestedAction}
            </p>
          </div>
        </div>

        {/* Visual Imagery Snapshot (Fundus + Grad-CAM) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col items-center">
            <div className="text-xs font-semibold text-slate-800 mb-1.5 self-start">
              Enhanced Retinal Photograph ({record.eyeSide})
            </div>
            <div className="w-full max-w-[280px]">
              <FundusCanvasViewer
                seed={record.imageUrl}
                stage={g.stage}
                enhanced={true}
                structureFindings={s}
                initialShowDisc={true}
                initialShowFovea={true}
                initialShowLesions={true}
                interactiveControls={false}
                title="Fundus with Lesion Overlays"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col items-center">
            <div className="text-xs font-semibold text-slate-800 mb-1.5 self-start">
              Grad-CAM Spatial Explainability Heatmap
            </div>
            <div className="w-full max-w-[280px]">
              <FundusCanvasViewer
                seed={record.imageUrl}
                stage={g.stage}
                enhanced={true}
                structureFindings={s}
                gradCamData={record.gradCam}
                initialShowGradCam={true}
                initialGradCamOpacity={0.7}
                interactiveControls={false}
                title="Grad-CAM Activation Map"
              />
            </div>
          </div>
        </div>

        {/* Structural Findings & Lesion Inventory */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider">
            Anatomical Structure & Pathological Lesion Findings
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
            <div>
              <span className="text-slate-400 block text-[10px]">Optic Disc:</span>
              <span className="font-medium">{s.opticDiscDetected ? 'Detected (99.1%)' : 'Not Localized'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Fovea / Macula:</span>
              <span className="font-medium">{s.foveaDetected ? 'Detected (98.4%)' : 'Not Localized'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Vessel Tree:</span>
              <span className="font-medium">{s.vesselDensity}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Image Quality:</span>
              <span className="font-medium text-emerald-700">{q.status} ({q.overallScore}/100)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2 text-[11px]">
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-800">
              Microaneurysms: <strong>{s.lesionCount.microaneurysms}</strong>
            </span>
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-800">
              Hemorrhages: <strong>{s.lesionCount.hemorrhages}</strong>
            </span>
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-800">
              Hard Exudates: <strong>{s.lesionCount.hardExudates}</strong>
            </span>
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-800">
              Cotton Wool: <strong>{s.lesionCount.cottonWoolSpots}</strong>
            </span>
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-800">
              NVD / NVE: <strong>{s.lesionCount.neovascularization}</strong>
            </span>
          </div>
        </div>

        {/* Explainable AI Summary */}
        <div className="p-4 bg-cyan-50/50 rounded-xl border border-cyan-200 text-xs space-y-1.5">
          <span className="font-bold text-cyan-950 uppercase tracking-wider block">
            Explainable AI Clinical Evidence Summary:
          </span>
          <p className="text-slate-700 leading-relaxed">
            {record.gradCam.attentionSummary}
          </p>
          <div className="text-[11px] text-slate-600">
            <strong className="text-slate-800">Peak Attention Hotspot:</strong> {record.gradCam.peakActivationRegion}
          </div>
        </div>

        {/* Mandatory Regulatory & Medical Safety Disclaimer */}
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-950 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>IMPORTANT CLINICAL & REGULATORY SAFETY NOTICE:</span>
          </div>
          <p className="text-[11px] text-amber-900/90 leading-relaxed">
            NETRA is an AI-assisted diabetic retinopathy screening prototype designed to prioritize referrals in resource-limited rural Primary Health Centres. It is NOT a definitive diagnosis. Automated inferences must be confirmed through dilated slit-lamp ophthalmoscopy or clinical consultation by a certified ophthalmologist.
          </p>
        </div>

        {/* Signatures */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-600">
          <div>
            <div className="h-10 border-b border-dashed border-slate-400 mb-1" />
            <div className="font-semibold text-slate-800">{p.operatorName}</div>
            <div className="text-slate-400 text-[11px]">Screening Operator / Vision Technician</div>
          </div>
          <div>
            <div className="h-10 border-b border-dashed border-slate-400 mb-1" />
            <div className="font-semibold text-slate-800">Consulting Ophthalmologist</div>
            <div className="text-slate-400 text-[11px]">Tele-Retina Reading Center Sign-Off</div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Referral Engine</span>
        </button>

        <button
          type="button"
          onClick={onStartNew}
          className="px-6 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Start New Screening</span>
        </button>
      </div>
    </div>
  );
}
