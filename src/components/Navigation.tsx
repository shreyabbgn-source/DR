import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  BarChart3,
  Layers,
  Stethoscope,
  Users
} from 'lucide-react';
import { UserRole } from '../types';

export type NavigationTab =
  | 'DASHBOARD'
  | 'NEW_SCREENING'
  | 'HISTORY'
  | 'BATCH'
  | 'TELE_REVIEW'
  | 'ANALYTICS';

interface NavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  userRole: UserRole;
  pendingReviewCount: number;
}

export function Navigation({
  activeTab,
  onTabChange,
  userRole,
  pendingReviewCount
}: NavigationProps) {
  const tabs = [
    {
      id: 'DASHBOARD' as NavigationTab,
      label: 'Dashboard Overview',
      icon: LayoutDashboard
    },
    {
      id: 'NEW_SCREENING' as NavigationTab,
      label: 'New Screening',
      icon: PlusCircle
    },
    {
      id: 'HISTORY' as NavigationTab,
      label: 'Screening History',
      icon: History
    },
    {
      id: 'BATCH' as NavigationTab,
      label: 'Batch Upload Queue',
      icon: Layers
    },
    {
      id: 'TELE_REVIEW' as NavigationTab,
      label: 'Tele-Review Queue',
      icon: Stethoscope,
      badge: pendingReviewCount > 0 ? `${pendingReviewCount} Cases` : undefined,
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300'
    },
    {
      id: 'ANALYTICS' as NavigationTab,
      label: 'Analytics & Trends',
      icon: BarChart3
    }
  ];

  return (
    <nav
      id="netra-navigation-bar"
      className="bg-white border-b border-slate-200 px-4 sm:px-6 shadow-2xs overflow-x-auto"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs whitespace-nowrap transition-all cursor-pointer border-b-2 ${
                isActive
                  ? 'border-blue-600 text-blue-600 font-bold bg-blue-50/60'
                  : 'border-transparent text-slate-500 font-semibold hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isActive ? 'bg-blue-600 shadow-[0_0_6px_rgba(37,99,235,0.6)]' : 'bg-slate-300'
                }`}
              />
              <span className={isActive ? 'font-black tracking-tight' : 'font-semibold'}>{tab.label}</span>
              {tab.badge && (
                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
