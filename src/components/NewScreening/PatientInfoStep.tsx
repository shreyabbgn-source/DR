import React from 'react';
import { PatientInfo } from '../../types';
import { User, Calendar, MapPin, Stethoscope, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { DEMO_PRESET_CASES } from '../../data/demoCases';

interface PatientInfoStepProps {
  patientInfo: PatientInfo;
  onChange: (info: PatientInfo) => void;
  onContinue: () => void;
  eyeSide: 'Left (OS)' | 'Right (OD)';
  onEyeSideChange: (side: 'Left (OS)' | 'Right (OD)') => void;
  onQuickLoadDemo: (presetId: string) => void;
}

export function PatientInfoStep({
  patientInfo,
  onChange,
  onContinue,
  eyeSide,
  onEyeSideChange,
  onQuickLoadDemo
}: PatientInfoStepProps) {
  const handleChange = (field: keyof PatientInfo, value: any) => {
    onChange({
      ...patientInfo,
      [field]: value
    });
  };

  const handleAutofillDemo = (index: number) => {
    const demo = DEMO_PRESET_CASES[index];
    if (demo) {
      onChange(demo.patientInfo);
      onEyeSideChange(demo.eyeSide);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Step Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-700 uppercase tracking-wider">
              <span>Step 1 of 8</span>
              <span className="text-slate-300">•</span>
              <span>Patient Registration & Screening Intake</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Patient Screening Information</h2>
            <p className="text-sm text-slate-600 mt-1">
              Minimal, privacy-conscious data collection for rural Primary Health Centre (PHC) screening records.
            </p>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
            <div className="font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              Quick Demo Fill:
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleAutofillDemo(0)}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded font-medium text-[11px] transition-colors"
              >
                Normal (No DR)
              </button>
              <button
                type="button"
                onClick={() => handleAutofillDemo(1)}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded font-medium text-[11px] transition-colors"
              >
                Mild NPDR
              </button>
              <button
                type="button"
                onClick={() => handleAutofillDemo(2)}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded font-medium text-[11px] transition-colors"
              >
                Moderate NPDR
              </button>
              <button
                type="button"
                onClick={() => handleAutofillDemo(3)}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded font-medium text-[11px] transition-colors"
              >
                Severe NPDR
              </button>
              <button
                type="button"
                onClick={() => handleAutofillDemo(4)}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded font-medium text-[11px] transition-colors"
              >
                PDR (High Risk)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Patient ID / ABHA ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={patientInfo.patientId}
                onChange={(e) => handleChange('patientId', e.target.value)}
                placeholder="e.g. NETRA-UP-2026-0841"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none font-mono"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Anonymized token used for public dashboard displays.</p>
          </div>

          {/* Eye Side Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Eye Under Examination <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onEyeSideChange('Right (OD)')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                  eyeSide === 'Right (OD)'
                    ? 'bg-cyan-700 text-white border-cyan-800 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <span>Right Eye (OD - Oculus Dexter)</span>
              </button>
              <button
                type="button"
                onClick={() => onEyeSideChange('Left (OS)')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                  eyeSide === 'Left (OS)'
                    ? 'bg-cyan-700 text-white border-cyan-800 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <span>Left Eye (OS - Oculus Sinister)</span>
              </button>
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Patient Age (Years) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="10"
              max="110"
              value={patientInfo.age}
              onChange={(e) => handleChange('age', e.target.value)}
              placeholder="e.g. 52"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Biological Sex */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Biological Sex <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Female', 'Male', 'Other'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleChange('sex', s)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                    patientInfo.sex === s
                      ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Diabetes Duration */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Diabetes Duration (Years) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="60"
                value={patientInfo.diabetesDurationYears}
                onChange={(e) => handleChange('diabetesDurationYears', e.target.value)}
                placeholder="e.g. 8"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Key risk coefficient for retinopathy progression.</p>
          </div>

          {/* Recent HbA1c (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Recent HbA1c (%) (If available)
            </label>
            <input
              type="text"
              value={patientInfo.lastHbA1c || ''}
              onChange={(e) => handleChange('lastHbA1c', e.target.value)}
              placeholder="e.g. 8.4%"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none"
            />
          </div>

          {/* PHC / Screening Camp Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              PHC / Screening Camp Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={patientInfo.screeningCenter}
                onChange={(e) => handleChange('screeningCenter', e.target.value)}
                placeholder="e.g. PHC Chandpur Health & Wellness Centre"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* District / State */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              District / State
            </label>
            <input
              type="text"
              value={patientInfo.district}
              onChange={(e) => handleChange('district', e.target.value)}
              placeholder="e.g. Bijnor, Uttar Pradesh"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Operator Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Field Operator / Vision Tech <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={patientInfo.operatorName}
                onChange={(e) => handleChange('operatorName', e.target.value)}
                placeholder="e.g. Sunita Devi (ASHA / Field Operator)"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none"
              />
              <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Clinical Notes / Symptoms */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Clinical Symptoms / Presenting Complaints
            </label>
            <input
              type="text"
              value={patientInfo.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="e.g. Gradual blurring of central vision, floaters"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-slate-400" />
            <span>Encrypted local session. Minimal patient identifiers.</span>
          </div>

          <button
            type="button"
            onClick={onContinue}
            className="px-6 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg font-semibold text-sm shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Continue to Fundus Image</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
