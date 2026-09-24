import React, { useState } from 'react';
import { 
  Bot, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Languages,
  Activity,
  Cpu,
  Sparkles,
  Download
} from 'lucide-react';
import { ActiveTab } from '../types';
import { SamSatLogo } from './SamSatLogo';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: 'ar' | 'en';
  setLang: (l: 'ar' | 'en') => void;
  audioEnabled: boolean;
  setAudioEnabled: (val: boolean) => void;
  pendingTasksCount: number;
  completedTasksCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  audioEnabled,
  setAudioEnabled,
  pendingTasksCount,
  completedTasksCount,
}) => {
  const isAr = lang === 'ar';

  const tabs: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'chat', label: isAr ? 'محادثة سمسات' : 'Chat', icon: '💬' },
    { id: 'receivers', label: isAr ? 'الريسيفرات والأقمار و CCcam' : 'Receivers & Satellites', icon: '📡' },
    { id: 'subscriptions', label: isAr ? 'الزبائن والاشتراكات' : 'Clients & Subscriptions', icon: '👥' },
    { id: 'invoices', label: isAr ? 'الفواتير والتشريجات' : 'Invoices & Recharges', icon: '🧾' },
    { id: 'monthlyReport', label: isAr ? 'التقرير الشهري وواتساب' : 'Monthly Report & WhatsApp', icon: '📈' },
    { id: 'appointments', label: isAr ? 'جدول المواعيد' : 'Appointments', icon: '⏰' },
    { id: 'radar', label: isAr ? 'الرادار وبرشلونة' : 'Radar & Barca', icon: '📊' },
    { id: 'gmail', label: isAr ? 'بريد الجيميل' : 'Gmail Monitor', icon: '✉️' },
    { id: 'tasks', label: isAr ? 'مهام سام' : "Tasks", icon: '📋' },
    { id: 'notes', label: isAr ? 'المفكرة' : "Notes", icon: '📝' },
    { id: 'briefing', label: isAr ? 'التقرير اليومي' : 'Briefing', icon: '⚡' },
    { id: 'profile', label: isAr ? 'هوية سمسات' : 'Profile', icon: '👤' },
  ];

  return (
    <header className="border-b border-slate-800/60 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
      {/* Top Banner: Sleek Identity & Operator Telemetry */}
      <div className="bg-[#0B0F1A]/90 border-b border-slate-800/60 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
          <span className="font-mono text-[11px] text-sky-400 font-bold uppercase tracking-wider">
            SAMSAT V4.2
          </span>
          <span className="text-slate-600">•</span>
          <span className="font-medium text-slate-200">
            {isAr ? 'الاسم: سمسات' : 'Unit: Samsat'}
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-sky-400 font-semibold bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20 text-[11px]">
            {isAr ? 'يعمل لدى سام' : 'Dedicated to Sam'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-400 font-mono text-xs">
          <div className="hidden md:flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-500 uppercase tracking-widest text-[10px]">{isAr ? 'المشغّل:' : 'OPERATOR:'}</span>
            <span className="text-white font-semibold">سام / Sam</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-500 uppercase tracking-widest text-[10px]">EFFICIENCY:</span>
            <span className="text-sky-400 font-bold">98.2%</span>
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">{completedTasksCount}/{completedTasksCount + pendingTasksCount}</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* Authentic Gold SAM SAT Logo */}
            <div className="relative">
              <SamSatLogo size="md" showDownloadOnHover={true} withGlow={true} />
              <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-0.5 border border-amber-500/40 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white uppercase flex items-center gap-2">
                  <span>سَمسات</span>
                  <span className="text-[11px] font-mono font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-md">
                    SAM SAT
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
                <span>{isAr ? 'المساعد التشغيلي الذكي لـ' : 'Operational Interface for'}</span>
                <span className="text-amber-400 font-bold">
                  {isAr ? 'سام' : 'Sam'}
                </span>
                <span className="text-slate-600 hidden sm:inline">|</span>
                <span className="text-amber-400/90 font-mono text-[11px] hidden sm:inline">
                  {isAr ? 'رقم التحويل:' : 'LINE:'} 71186492
                </span>
              </p>
            </div>
          </div>

          {/* Quick controls on mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              title={audioEnabled ? 'كتم الصوت' : 'تفعيل النطق الصوتي'}
              className={`p-2 rounded-xl border text-xs transition-colors ${
                audioEnabled 
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-[0_0_10px_rgba(56,189,248,0.2)]' 
                  : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
              }`}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setLang(isAr ? 'en' : 'ar')}
              className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs flex items-center gap-1"
            >
              <Languages className="w-4 h-4 text-sky-400" />
              <span className="font-mono">{isAr ? 'EN' : 'عربي'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs with sleek styling */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-[0_0_16px_rgba(56,189,248,0.35)]'
                    : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800/80'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.id === 'tasks' && pendingTasksCount > 0 && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-slate-950 text-sky-400 font-bold' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  }`}>
                    {pendingTasksCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            title={audioEnabled ? (isAr ? 'تعطيل الصوت' : 'Mute voice') : (isAr ? 'تفعيل النطق الصوتي' : 'Enable voice')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1.5 ${
              audioEnabled 
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-[0_0_12px_rgba(56,189,248,0.2)]' 
                : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-sky-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{audioEnabled ? (isAr ? 'صوت سمسات مفعّل' : 'Voice On') : (isAr ? 'صوت' : 'Voice')}</span>
          </button>

          <button
            onClick={() => setLang(isAr ? 'en' : 'ar')}
            className="px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Languages className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-mono">{isAr ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

