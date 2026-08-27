import React, { useState, useEffect } from 'react';
import { UserSession, UserRole, ScreeningRecord } from './types';
import { loadScreeningRecords, saveScreeningRecord, saveAllRecords } from './services/storage';
import { Header } from './components/Header';
import { Navigation, NavigationTab } from './components/Navigation';
import { DashboardOverview } from './components/DashboardOverview';
import { ScreeningPipeline } from './components/NewScreening/ScreeningPipeline';
import { ScreeningHistory } from './components/ScreeningHistory';
import { BatchScreening } from './components/BatchScreening';
import { TeleOphthalmologyReview } from './components/TeleOphthalmologyReview';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { DemoModeModal } from './components/DemoModeModal';
import { RecordDetailModal } from './components/RecordDetailModal';
import { MedicalDisclaimerBanner, MedicalDisclaimerFooter } from './components/MedicalDisclaimer';

export default function App() {
  // Active User Session State
  const [session, setSession] = useState<UserSession>({
    id: 'user-op-01',
    name: 'Sunita Devi',
    role: 'OPERATOR',
    roleTitle: 'Vision Technician / CHW',
    center: 'PHC Chandpur Primary Health Centre',
    district: 'Bijnor',
    state: 'Uttar Pradesh'
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavigationTab>('DASHBOARD');

  // Screening Records State
  const [records, setRecords] = useState<ScreeningRecord[]>([]);

  // Modals & Presets
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [selectedRecordForModal, setSelectedRecordForModal] = useState<ScreeningRecord | null>(null);
  const [activePipelinePreset, setActivePipelinePreset] = useState<string | undefined>('case-moderate-03');

  // Load records on mount
  useEffect(() => {
    const loaded = loadScreeningRecords();
    setRecords(loaded);
  }, []);

  const handleReloadRecords = () => {
    const loaded = loadScreeningRecords();
    setRecords(loaded);
  };

  // Role switching
  const handleRoleChange = (newRole: UserRole) => {
    if (newRole === 'OPERATOR') {
      setSession({
        id: 'user-op-01',
        name: 'Sunita Devi',
        role: 'OPERATOR',
        roleTitle: 'Vision Technician / CHW',
        center: 'PHC Chandpur Primary Health Centre',
        district: 'Bijnor',
        state: 'Uttar Pradesh'
      });
    } else if (newRole === 'OPHTHALMOLOGIST') {
      setSession({
        id: 'user-doc-01',
        name: 'Dr. Arvind Swaminathan, MD',
        role: 'OPHTHALMOLOGIST',
        roleTitle: 'Senior Vitreoretinal Consultant',
        center: 'District Tele-Ophthalmology Reading Hub',
        district: 'Bijnor',
        state: 'Uttar Pradesh'
      });
      // Optionally switch to tele-review
      setActiveTab('TELE_REVIEW');
    } else {
      setSession({
        id: 'user-admin-01',
        name: 'Dr. Ramesh Chandra',
        role: 'ADMIN',
        roleTitle: 'Chief Medical Officer / District Admin',
        center: 'District Health Society, Bijnor',
        district: 'Bijnor',
        state: 'Uttar Pradesh'
      });
      setActiveTab('ANALYTICS');
    }
  };

  // Start new screening from button or demo case
  const handleStartNewScreening = (presetId?: string) => {
    if (presetId) {
      setActivePipelinePreset(presetId);
    } else {
      setActivePipelinePreset('case-moderate-03');
    }
    setActiveTab('NEW_SCREENING');
  };

  // When a single screening is saved from report step
  const handleFinishScreening = (newRecord: ScreeningRecord) => {
    const updated = loadScreeningRecords();
    setRecords(updated);
  };

  // Batch save
  const handleSaveBatchToHistory = (batchRecords: ScreeningRecord[]) => {
    const current = loadScreeningRecords();
    const combined = [...batchRecords, ...current];
    saveAllRecords(combined);
    setRecords(combined);
  };

  const pendingReviewCount = records.filter(
    (r) => r.referral.status === 'REFERABLE' && !r.reviewedByDoctor
  ).length;

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col text-slate-900 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Regulatory Clinical Safety Banner */}
      <MedicalDisclaimerBanner />

      {/* Main Global Header */}
      <Header
        session={session}
        onRoleChange={handleRoleChange}
        onOpenDemoModal={() => setIsDemoModalOpen(true)}
        onStartNewScreening={() => handleStartNewScreening()}
      />

      {/* Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userRole={session.role}
        pendingReviewCount={pendingReviewCount}
      />

      {/* Main Application Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'DASHBOARD' && (
          <DashboardOverview
            records={records}
            onStartNewScreening={handleStartNewScreening}
            onViewRecord={(rec) => setSelectedRecordForModal(rec)}
            onNavigateToHistory={() => setActiveTab('HISTORY')}
            onOpenDemoModal={() => setIsDemoModalOpen(true)}
          />
        )}

        {activeTab === 'NEW_SCREENING' && (
          <ScreeningPipeline
            key={activePipelinePreset}
            initialPresetId={activePipelinePreset}
            onFinishScreening={handleFinishScreening}
          />
        )}

        {activeTab === 'HISTORY' && (
          <ScreeningHistory
            records={records}
            onViewRecord={(rec) => setSelectedRecordForModal(rec)}
            onStartNewScreening={() => handleStartNewScreening()}
            onReloadRecords={handleReloadRecords}
          />
        )}

        {activeTab === 'BATCH' && (
          <BatchScreening
            onViewRecord={(rec) => setSelectedRecordForModal(rec)}
            onSaveBatchToHistory={handleSaveBatchToHistory}
          />
        )}

        {activeTab === 'TELE_REVIEW' && (
          <TeleOphthalmologyReview
            records={records}
            onRecordUpdated={handleReloadRecords}
            onViewRecord={(rec) => setSelectedRecordForModal(rec)}
          />
        )}

        {activeTab === 'ANALYTICS' && (
          <AnalyticsDashboard records={records} />
        )}
      </main>

      {/* Footer Disclaimer */}
      <MedicalDisclaimerFooter />

      {/* Demo Selection Modal */}
      <DemoModeModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSelectCase={(presetId) => handleStartNewScreening(presetId)}
      />

      {/* Record Full-Detail Modal */}
      <RecordDetailModal
        record={selectedRecordForModal}
        onClose={() => setSelectedRecordForModal(null)}
      />
    </div>
  );
}
