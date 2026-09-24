import React from 'react';
import { 
  Sparkles, 
  RotateCw, 
  Volume2, 
  CheckCircle2, 
  Quote, 
  Calendar, 
  Bot,
  Award
} from 'lucide-react';
import { ExecutiveBriefingData } from '../types';
import { speakText } from '../utils/speech';

interface ExecutiveBriefingProps {
  briefing: ExecutiveBriefingData | null;
  isLoading: boolean;
  onRefresh: () => void;
  lang: 'ar' | 'en';
}

export const ExecutiveBriefing: React.FC<ExecutiveBriefingProps> = ({
  briefing,
  isLoading,
  onRefresh,
  lang,
}) => {
  const isAr = lang === 'ar';

  const handleListenBriefing = () => {
    if (!briefing) return;
    const fullText = `${briefing.greeting}. ${briefing.summary}. أهم الأولويات لسام اليوم: ${briefing.priorities.join('. ')}. ${briefing.quote}`;
    speakText(fullText, isAr ? 'ar-SA' : 'en-US');
  };

  return (
    <div className="space-y-5">
      {/* Header banner */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-sky-950/25">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.25)]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-0.5 rounded-full">
                  {isAr ? 'التقرير التنفيذي لسام' : "SAM'S EXECUTIVE BRIEF"}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3 text-sky-400" />
                  {new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                {isAr ? 'إحاطة اليوم الصادرة من سمسات لسام' : "Today's Briefing from Samsat to Sam"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {briefing && (
              <button
                onClick={handleListenBriefing}
                className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 text-xs font-semibold flex items-center gap-1.5 transition-colors font-mono"
                title={isAr ? 'استمع للإحاطة صوتياً' : 'Listen to briefing'}
              >
                <Volume2 className="w-4 h-4 text-sky-400" />
                <span>{isAr ? 'استماع صوتي' : 'AUDIO BRIEF'}</span>
              </button>
            )}

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(56,189,248,0.3)] font-mono"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isAr ? 'تحديث الإحاطة الآن' : 'SYNC BRIEFING'}</span>
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-12 text-center space-y-3 backdrop-blur-sm">
          <Bot className="w-10 h-10 text-sky-400 mx-auto animate-bounce" />
          <h3 className="text-base font-bold text-slate-200">
            {isAr ? 'سمسات يحلل جدولك ويعد التقرير التنفيذي لسام...' : 'Samsat is synthesizing the executive briefing for Sam...'}
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            {isAr ? 'ثوانٍ معدودة وسيكون تقريرك جاهزاً يا أستاذ سام' : 'Just a moment, preparing your strategic overview'}
          </p>
        </div>
      ) : briefing ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Greeting & Summary */}
          <div className="md:col-span-2 bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 space-y-4 backdrop-blur-md shadow-xl">
            <div className="border-b border-slate-800/80 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>{briefing.greeting}</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {briefing.summary}
              </p>
            </div>

            {/* Strategic Priorities */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'أهم 3 أولويات يوصي بها سمسات لسام اليوم:' : 'Top 3 Priorities Recommended by Samsat:'}</span>
              </h4>

              <div className="space-y-2.5">
                {briefing.priorities.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-200 flex items-start gap-3 hover:border-sky-500/30 transition-colors"
                  >
                    <span className="w-5 h-5 rounded-md bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center justify-center flex-shrink-0 text-[11px] font-mono font-bold">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quote & Samsat Pledge */}
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 backdrop-blur-md shadow-xl">
            <div>
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-sky-400 mb-3">
                <Quote className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                {isAr ? 'رسالة تحفيزية من سمسات لسام' : "Samsat's Directive for Sam"}
              </h4>
              <p className="text-sm italic text-slate-200 leading-relaxed font-sans">
                "{briefing.quote}"
              </p>
            </div>

            <div className="bg-slate-950/60 border border-sky-500/20 rounded-xl p-3.5 text-xs text-slate-400">
              <div className="flex items-center gap-2 mb-1 text-sky-400 font-semibold font-mono text-[11px]">
                <Bot className="w-3.5 h-3.5" />
                <span>{isAr ? 'تعهد سمسات لمديره سام:' : "SAMSAT'S PLEDGE TO SAM:"}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                {isAr 
                  ? 'أنا سمسات، أعمل لدى سام بكل إخلاص، ودائماً على أهبة الاستعداد لإنجاز المهام، مراجعة المشاريع، وتقديم المشورة الفورية.'
                  : 'I am Samsat, working dedicatedly for Sam with complete loyalty, efficiency, and instant readiness.'}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
