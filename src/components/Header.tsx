import React, { useState } from 'react';
import { UserSession, UserRole } from '../types';
import {
  Eye,
  ShieldCheck,
  Sparkles,
  LogOut,
  User,
  MapPin,
  ChevronDown,
  Stethoscope,
  Building2,
  Lock,
  Plus
} from 'lucide-react';

interface HeaderProps {
  session: UserSession;
  onRoleChange: (role: UserRole) => void;
  onOpenDemoModal: () => void;
  onStartNewScreening: () => void;
}

export function Header({
  session,
  onRoleChange,
  onOpenDemoModal,
  onStartNewScreening
}: HeaderProps) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  return (
    <header
      id="netra-app-header"
      className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-black">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tighter text-blue-400">NETRA</span>
              <span className="text-[9px] font-black px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                AI TRIAGE v2.4
              </span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-tight hidden sm:block">
              AI Retinopathy Screening System
            </p>
          </div>
        </div>

        {/* Right: Quick Actions & User Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Demo Mode Trigger Button */}
          <button
            type="button"
            onClick={onOpenDemoModal}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold rounded-lg text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Jury Demo</span> Mode
          </button>

          {/* Quick New Screening */}
          <button
            type="button"
            onClick={onStartNewScreening}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer uppercase tracking-wider"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Screening</span>
          </button>

          {/* User / Role Switcher Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 bg-slate-800/90 hover:bg-slate-700 rounded-lg border border-slate-700 text-xs transition-colors cursor-pointer text-left"
            >
              <div className="w-7 h-7 rounded-md bg-blue-600/20 border border-blue-500/30 text-blue-300 flex items-center justify-center font-black text-xs">
                {session.role === 'OPHTHALMOLOGIST' ? 'DR' : session.role === 'ADMIN' ? 'AD' : 'OP'}
              </div>
              <div className="hidden md:block">
                <div className="font-bold text-white text-xs leading-none line-clamp-1">{session.name}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{session.roleTitle}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-800 text-xs">
                  <div className="font-bold text-white">{session.name}</div>
                  <div className="text-slate-400 flex items-center gap-1 mt-0.5 text-[11px]">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>{session.center}</span>
                  </div>
                  <div className="text-slate-400 text-[10px] mt-0.5">
                    District: {session.district}, {session.state}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Secure ABHA PHC Session Active</span>
                  </div>
                </div>

                <div className="pt-2 text-xs">
                  <div className="px-3 py-1 font-semibold text-slate-400 uppercase text-[10px] tracking-wider">
                    Switch Active Role:
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onRoleChange('OPERATOR');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      session.role === 'OPERATOR'
                        ? 'bg-cyan-950 text-cyan-300 font-semibold border border-cyan-800'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <User className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div>Screening Operator (CHW / ASHA)</div>
                      <div className="text-[10px] text-slate-400">Capture, AI run, & print reports</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onRoleChange('OPHTHALMOLOGIST');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      session.role === 'OPHTHALMOLOGIST'
                        ? 'bg-cyan-950 text-cyan-300 font-semibold border border-cyan-800'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div>Ophthalmologist (Consultant)</div>
                      <div className="text-[10px] text-slate-400">Review referable cases & sign-off</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onRoleChange('ADMIN');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      session.role === 'ADMIN'
                        ? 'bg-cyan-950 text-cyan-300 font-semibold border border-cyan-800'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-indigo-400" />
                    <div>
                      <div>Program Administrator</div>
                      <div className="text-[10px] text-slate-400">Camp statistics & epidemiology</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
