import React, { useState } from 'react';
import { 
  Bot, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  Briefcase, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  Activity,
  HeartHandshake,
  Layers,
  Terminal,
  Download
} from 'lucide-react';
import { SamSatLogo } from './SamSatLogo';

interface SamsatCardProps {
  lang: 'ar' | 'en';
}

export const SamsatCard: React.FC<SamsatCardProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  const handleTestConnection = async () => {
    setIsPinging(true);
    setPingStatus(null);
    const start = Date.now();
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      const elapsed = Date.now() - start;
      setPingStatus(
        isAr 
          ? `الوكيل سمسات متصل بنجاح وسرعة الاستجابة ${elapsed}ms • يعمل تحت إشراف سام` 
          : `Samsat is connected (${elapsed}ms) • Actively serving Sam`
      );
    } catch {
      setPingStatus(isAr ? 'تعذر التحقق من الخادم' : 'Server check failed');
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Official Identity Badge Card with Sleek theme */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-sky-950/30">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          {/* Avatar / Portrait - Official Gold SAM SAT Logo */}
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 rounded-2xl bg-amber-500/10 p-2 shadow-[0_0_25px_rgba(212,175,55,0.3)] flex items-center justify-center border-2 border-amber-500/40">
              <SamSatLogo size="xl" showDownloadOnHover={true} withGlow={true} />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-full border-2 border-slate-900 shadow-[0_0_10px_#10b981]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          {/* Core Credentials */}
          <div className="flex-1 text-center md:text-right space-y-2">
            <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full text-sky-400 text-xs font-mono font-semibold">
              <UserCheck className="w-3.5 h-3.5" />
              <span>{isAr ? 'بطاقة الاعتماد والتعريف الرسمية' : 'OFFICIAL IDENTITY CREDENTIAL'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center md:justify-start gap-3">
              <span>سَمسات</span>
              <span className="text-sky-400 font-mono tracking-widest text-lg sm:text-xl">SAMSAT</span>
            </h2>

            {/* Crucial prompt statement */}
            <div className="p-3.5 bg-slate-950/70 rounded-xl border border-sky-500/25 max-w-xl shadow-inner">
              <div className="text-sm font-bold text-sky-400 flex items-center justify-center md:justify-start gap-2 font-mono">
                <HeartHandshake className="w-4 h-4 text-sky-400" />
                <span>{isAr ? 'الاسم: سمسات • يعمل لدى سام' : 'Name: Samsat • Dedicated to Sam'}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {isAr 
                  ? 'المساعد الشخصي والتنفيذي والتشغيلي لسام: خدمة الزبائن، إصدار الفواتير والتشريجات، تذكير المواعيد، رادار العملات والطقس وبرشلونة، ومتابعة بريد الجيميل.' 
                  : "Dedicated executive and operational AI assistant exclusively serving Sam's business, clients, billing, appointments, and inbox."}
              </p>
            </div>
          </div>
        </div>

        {/* Official Numbers Highlight */}
        <div className="mt-5 p-4 bg-slate-950/70 rounded-2xl border border-sky-500/30 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
              WA
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">{isAr ? 'رقم هاتف / واتساب سمسات الخاص:' : 'Samsat WhatsApp Line:'}</span>
              <span className="text-sm font-bold font-mono text-white">03983010</span>
              <span className="text-[10px] text-slate-500 block font-mono">(03 983010 / +961 3 983010)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 font-mono font-bold text-xs">
              PAY
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">{isAr ? 'رقم دفع وتحويل الزبائن المعتمد:' : 'Client Payment Line:'}</span>
              <span className="text-sm font-bold font-mono text-emerald-400">71186492</span>
              <span className="text-[10px] text-slate-500 block font-mono">(Whish Money / OMT / Cash)</span>
            </div>
          </div>
        </div>

        {/* Live Status Row */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">{isAr ? 'الاسم البرمجي' : 'SYSTEM ID'}</span>
            <span className="text-sm font-bold font-mono text-white">samsat</span>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">{isAr ? 'جهة التبعية' : 'ASSIGNED TO'}</span>
            <span className="text-sm font-bold font-mono text-sky-400">{isAr ? 'سام (Sam)' : 'Sam'}</span>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">{isAr ? 'الحالة التشغيلية' : 'STATUS'}</span>
            <span className="text-sm font-bold font-mono text-emerald-400 flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
              {isAr ? 'نشط 24/7' : 'ACTIVE 24/7'}
            </span>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">{isAr ? 'محرك الذكاء' : 'ENGINE'}</span>
            <span className="text-sm font-bold font-mono text-slate-200">Gemini 3.8 Flash</span>
          </div>
        </div>
      </div>

      {/* 5 Core Operational Mandates from Sam */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 space-y-4 backdrop-blur-md shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-sky-400" />
          <span>{isAr ? 'المهمات والمسؤوليات الأساسية المسندة لسمسات من سام:' : "Sam's 5 Core Directives to Samsat:"}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-sky-400">
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
              <span>{isAr ? '1. الرد على الزبائن بأمر سام' : '1. Client Communication'}</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {isAr 
                ? 'الإجابة على استفسارات الزبائن وصياغة الردود بحسب طلب سام فقط، وإرسالها عبر واتساب سمسات (03983010).' 
                : "Respond to customer queries only per Sam's specific instructions via Samsat line 03983010."}
            </p>
          </div>

          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>{isAr ? '2. التذكير بالمواعيد' : '2. Appointment Reminders'}</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {isAr 
                ? 'جدولة مواعيد الزبائن وتذكير سام بها يومياً، وإرسال رسائل تذكير تلقائية للزبائن بالموعد عبر الواتساب.' 
                : 'Schedule meetings and dispatch timely reminders to clients over WhatsApp.'}
            </p>
          </div>

          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? '3. فواتير وتشريجات احترافية' : '3. Invoicing & Top-ups'}</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {isAr 
                ? 'جمع الفواتير وكتابة الاسم والهاتف والعنوان والأغراض وتشريجات الخطوط، وإرفاق رقم التحويل 71186492.' 
                : 'Generate professional invoices for goods and recharge with payment line 71186492.'}
            </p>
          </div>

          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-blue-400">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>{isAr ? '4. العملات والطقس والبارسا' : '4. Rates, Weather & Barca'}</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {isAr 
                ? 'رصد سعر الصرف اليومي والطقس، ومتابعة حصرية لأخبار ونتائج ومباريات نادي برشلونة الإسباني المفضل لسام.' 
                : 'Real-time exchange rates, weather forecasts, and dedicated FC Barcelona coverage.'}
            </p>
          </div>

          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 space-y-1 md:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-1.5 font-bold text-red-400">
              <CheckCircle2 className="w-4 h-4 text-red-400" />
              <span>{isAr ? '5. متابعة الجيميل ومنع الرد إلا بإذن' : '5. Gmail Monitoring & Zero Auto-Reply'}</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {isAr 
                ? 'قراءة وتلخيص رسائل بريد الجيميل لسام، مع الالتزام الصارم بعدم إرسال أي رد إلا بأمر صريح ومباشر من سام.' 
                : 'Monitor incoming Gmail messages with a strict policy: never reply unless explicitly commanded by Sam.'}
            </p>
          </div>
        </div>
      </div>

      {/* Capabilities & Specialties Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Competencies */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 space-y-3 backdrop-blur-md shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-sky-400" />
            <span>{isAr ? 'كفاءات سمسات في خدمة سام:' : "Samsat's Core Competencies:"}</span>
          </h3>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">{isAr ? 'التنظيم والإدارة التنفيذية:' : 'Executive Management:'}</strong>
                <p className="text-slate-400 mt-0.5">{isAr ? 'جدولة المهام، فرز الأولويات، وإعداد التقارير اليومية لسام.' : 'Task scheduling, priority ranking, and daily briefing.'}</p>
              </div>
            </li>

            <li className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">{isAr ? 'الصياغة والمراسلات المهنية:' : 'Professional Correspondence:'}</strong>
                <p className="text-slate-400 mt-0.5">{isAr ? 'كتابة الإيميلات، العقود، الخطابات الرسمية نيابة عن سام.' : 'Drafting business letters, contracts, and proposals.'}</p>
              </div>
            </li>

            <li className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">{isAr ? 'الدعم التقني والحلول السريعة:' : 'Technical Guidance:'}</strong>
                <p className="text-slate-400 mt-0.5">{isAr ? 'استشارات فنية، حل المشكلات المعقدة، والتحليل البرمجي والتقني.' : 'Technical problem-solving and smart diagnostics.'}</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Verification & Ping console */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 backdrop-blur-md shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-sky-400" />
              <span>{isAr ? 'فحص جهوزية سمسات لسام' : "Samsat Readiness Check"}</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr 
                ? 'يمكن لسام اختبار سرعة استجابة خادم سمسات والتأكد من جهوزيته في أي وقت.' 
                : 'Sam can ping and verify Samsat’s server connectivity and response status anytime.'}
            </p>

            <button
              onClick={handleTestConnection}
              disabled={isPinging}
              className="mt-4 w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
            >
              <Activity className={`w-4 h-4 ${isPinging ? 'animate-spin' : ''}`} />
              <span>{isPinging ? (isAr ? 'جاري الفحص...' : 'CHECKING...') : (isAr ? 'إجراء فحص الاتصال بسمسات' : 'PING SAMSAT AGENT')}</span>
            </button>

            {pingStatus && (
              <div className="mt-3 p-2.5 bg-slate-950 rounded-xl border border-sky-500/30 text-xs font-mono text-sky-300 animate-fade-in shadow-inner">
                {pingStatus}
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>{isAr ? 'شعار سمسات:' : 'MOTTO:'}</span>
            <span className="text-sky-400 font-semibold">
              {isAr ? '«الاسم سمسات.. وأعمل لخدمة سام»' : '"Name is Samsat.. Dedicated to Sam"'}
            </span>
          </div>
        </div>
      </div>

      {/* Official SAM SAT Brand Asset Kit & Transparent Logo Downloads */}
      <div className="bg-gradient-to-r from-slate-900/90 via-amber-950/20 to-slate-900/90 border border-amber-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-2 rounded-2xl bg-slate-950/80 border border-amber-500/30 shadow-lg">
              <SamSatLogo size="xl" showDownloadOnHover={true} withGlow={true} />
            </div>
            <div className="space-y-1 text-right">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[11px] font-mono font-bold text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>شعار SAM SAT الرسمي المفرغ (Transparent PNG & Vector)</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                شعار سام سات جاهز للتصدير والتزيين
              </h3>
              <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                تم تفريغ الشعار بدقة متناهية وبأعلى جودة فيكتور (بدون خلفية)، ليزيّن موقعك وفواتيرك ورسائل الواتساب مع رقمك المعتمد <span className="font-mono text-amber-400 font-bold">71186492</span>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/samsat-logo.svg"
              download="samsat-logo.svg"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs flex items-center gap-2 border border-slate-700 transition-colors shadow"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>تحميل SVG فيكتور</span>
            </a>

            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/samsat-logo.svg';
                link.target = '_blank';
                link.click();
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>معاينة الشعار المفرغ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
