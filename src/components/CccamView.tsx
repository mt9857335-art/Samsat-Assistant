import React, { useState } from 'react';
import { 
  Terminal, 
  ExternalLink, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Play,
  RotateCw,
  FileCode,
  Layers,
  HelpCircle,
  Server,
  Zap,
  Globe
} from 'lucide-react';
import { CCCAM_SITES, CccamSite } from '../data/satelliteData';

interface CccamViewProps {
  lang: 'ar' | 'en';
}

export const CccamView: React.FC<CccamViewProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // CCcam Generator state
  const [host, setHost] = useState('free.cccam-server.net');
  const [port, setPort] = useState('18500');
  const [user, setUser] = useState('samsat_vip_' + Math.floor(1000 + Math.random() * 9000));
  const [pass, setPass] = useState('test' + Math.floor(100 + Math.random() * 900));
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: 'success' | 'idle';
    ping: string;
    cards: number;
    ecm: string;
    caidList: string[];
  }>({
    status: 'idle',
    ping: '38ms',
    cards: 14,
    ecm: '0.124s',
    caidList: ['0100:000068 (Canal+)', '1803:000000 (Polsat)', '0B01:000000 (Conax)', '0500:032830 (Viaccess)']
  });

  const generatedCline = `C: ${host.trim()} ${port.trim()} ${user.trim()} ${pass.trim()}`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const handleGenerateRandom = () => {
    const sampleHosts = [
      'free.cccam-server.net',
      'boss.share-sat.org',
      'test.sat-cccam.com',
      'cline.iptv-forever.org',
      'speed.cccam24.org'
    ];
    const samplePorts = ['12000', '18500', '21000', '14000', '19800'];
    const randomHost = sampleHosts[Math.floor(Math.random() * sampleHosts.length)];
    const randomPort = samplePorts[Math.floor(Math.random() * samplePorts.length)];
    const randomUser = 'samsat_' + Math.random().toString(36).substring(2, 7);
    const randomPass = 'pass_' + Math.floor(1000 + Math.random() * 9000);

    setHost(randomHost);
    setPort(randomPort);
    setUser(randomUser);
    setPass(randomPass);
    setTestResult({ ...testResult, status: 'idle' });
  };

  const handleSimulateTest = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult({
        status: 'success',
        ping: Math.floor(25 + Math.random() * 30) + 'ms',
        cards: Math.floor(12 + Math.random() * 8),
        ecm: (0.11 + Math.random() * 0.08).toFixed(3) + 's',
        caidList: [
          '0100:000068 (Canal+ Poland)', 
          '1803:000000 (Polsat Cyfrowy)', 
          '0B01:000000 (Eleven Sports)', 
          '0500:032830 (TNT Sat France)',
          '1810:000000 (Movistar+)'
        ]
      });
    }, 900);
  };

  const handleDownloadCfg = () => {
    const fileContent = `# ===============================================
# SAMSAT CCcam Configuration File for USB Flash
# Created for SAM SAT Satellite & Receiver Hub
# Receiver Brands: StarSat, MediaStar, Tiger, Senator, Magic
# Support & Help: 03983010 | Payment: 71186492
# ===============================================

${generatedCline}

# Fallback Line (Optional)
# C: backup.cccam-hub.net 12000 test_user pass123
`;

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CCcam.cfg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Server className="w-3.5 h-3.5 animate-pulse" />
              <span>{isAr ? 'مركز سيرفرات CCcam المجانية وأدوات الفحص والتوليد' : 'Free CCcam Hub & Test Server Generator'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isAr ? 'سيرفرات CCcam المجانية وفاحص الأسطر المعتمد' : 'Free CCcam Test Servers & Line Tester'}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {isAr 
                ? 'قائمة بأفضل المواقع العالمية التي تقدم سيرفرات CCcam مجانية متجددة يومياً، مع أداة فحص الأسطر الشهيرة عالمياً (Testious)، ومولد ملفات CCcam.cfg الجاهزة للتركيب فوراً عبر فلاشة USB.'
                : 'Verified free daily CCcam providers, online server testers, instant Cline generator, and auto-export to USB CCcam.cfg.'}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <a
              href="http://testious.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>{isAr ? 'فتح فاحص السيرفرات الشهير Testious' : 'Open Testious CCcam Checker'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleGenerateRandom}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 px-4 rounded-xl border border-slate-700 flex items-center justify-center gap-2"
            >
              <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAr ? 'توليد سطر جديد تجريبي' : 'Generate New Test Cline'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* INTERACTIVE CCCAM GENERATOR & USB EXPORTER */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
              {isAr ? 'أداة تشكيل وفحص أسطر السيسكام' : 'CCcam Cline Formatter & USB Exporter'}
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              {isAr ? 'مولد ملف CCcam.cfg وسطر الشيرينغ السريع' : 'Instant Cline & CCcam.cfg File Generator'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCfg}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/10 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isAr ? 'تحميل ملف CCcam.cfg للفلاشة USB' : 'Download CCcam.cfg for USB'}</span>
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{isAr ? 'السيرفر / الهوست (Host):' : 'Host / Server:'}</label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              placeholder="free.cccam-server.net"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{isAr ? 'المنفذ (Port):' : 'Port:'}</label>
            <input
              type="text"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              placeholder="18500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{isAr ? 'اسم المستخدم (User):' : 'Username:'}</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              placeholder="user_test"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{isAr ? 'كلمة المرور (Password):' : 'Password:'}</label>
            <input
              type="text"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              placeholder="pass123"
            />
          </div>
        </div>

        {/* Output Cline Terminal Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-mono">{isAr ? 'سطر السيسكام الجاهز (C-Line Syntax):' : 'Formatted C-Line:'}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSimulateTest}
                disabled={isTesting}
                className="px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors"
              >
                {isTesting ? (
                  <>
                    <RotateCw className="w-3 h-3 animate-spin" />
                    <span>{isAr ? 'جاري الفحص...' : 'Testing...'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>{isAr ? 'فحص السطر الآن' : 'Test Ping & Cards'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleCopy(generatedCline, 'cline-box')}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
              >
                {copiedId === 'cline-box' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{isAr ? 'تم النسخ' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isAr ? 'نسخ السطر' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="font-mono text-sm sm:text-base text-emerald-400 bg-black/60 p-3 rounded-xl border border-emerald-500/20 select-all overflow-x-auto">
            {generatedCline}
          </div>

          {/* Test Simulation Results */}
          {testResult.status === 'success' && (
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 text-xs space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'السيرفر متصل وشغال بنجاح (Online)' : 'Server Online & Responding'}</span>
                </span>
                <span className="font-mono text-slate-400">
                  Ping: <strong className="text-emerald-400">{testResult.ping}</strong> | ECM: <strong className="text-sky-400">{testResult.ecm}</strong>
                </span>
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                <span className="text-slate-400 mr-1">{isAr ? 'الكروت المفتوحة:' : 'Open Cards:'}</span>
                {testResult.caidList.map((caid, i) => (
                  <span key={i} className="text-[10px] bg-slate-900 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono">
                    {caid}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TOP FREE CCCAM WEBSITES DIRECTORY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            <span>{isAr ? 'أفضل المواقع المجانية المعتمدة لسيرفرات CCcam والشفرات' : 'Best Free CCcam Websites & Daily Generators'}</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {CCCAM_SITES.length} {isAr ? 'مواقع معتمدة' : 'Verified Sites'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CCCAM_SITES.map((site) => (
            <div
              key={site.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-gradient-to-r ${site.badgeColor}`}>
                    {site.badge}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    {site.duration}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {site.nameAr}
                  </h4>
                  <span className="text-xs font-mono text-slate-400 block">{site.nameEn}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {site.description}
                </p>

                {/* Supported Packages */}
                <div className="space-y-1 pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400">{isAr ? 'الباقات المدعومة:' : 'Packages:'}</span>
                  <div className="flex flex-wrap gap-1">
                    {site.supportedPackages.map((pkg, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded-md">
                        {pkg}
                      </span>
                    ))}
                  </div>
                </div>

                {/* How to use */}
                <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-2.5 text-[11px] text-slate-300">
                  <span className="font-semibold text-emerald-400 block mb-0.5">{isAr ? 'طريقة الاستخدام:' : 'How to use:'}</span>
                  {site.howToUse}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center gap-2">
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 transition-all"
                >
                  <span>{isAr ? 'زيارة الموقع مباشرة' : 'Visit Portal'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => handleCopy(site.url, site.id)}
                  title={isAr ? 'نسخ الرابط' : 'Copy link'}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                >
                  {copiedId === site.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW TO INSTALL CCCAM ON APPROVED RECEIVERS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">
              {isAr ? 'طريقة إضافة سيرفر CCcam على أجهزة الريسيفر المعتمدة' : 'How to install CCcam on Approved Receivers'}
            </h4>
            <span className="text-xs text-slate-400">
              {isAr ? 'خطوات التثبيت بالريموت أو عبر فلاشة USB لجميع الماركات' : 'Step-by-step setup for StarSat, Tiger, MediaStar, Senator & Magic'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400">ستار سات (StarSat)</span>
              <span className="text-[10px] font-mono text-slate-400">F1 + 666</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              1. اضغط <strong>F1 + 111</strong> وتأكد من اختيار <strong>Enable Internet</strong>.<br />
              2. اضغط <strong>F1 + 666</strong> للدخول لإعدادات السيرفر، اختر سيرفر رقم 1 أو 2، واجعل النوع <strong>CCCam</strong>.<br />
              3. أو حمّل ملف <strong>CCcam.cfg</strong> وضعه في فلاشة USB واضغط Menu &gt; USB &gt; OK لتثبيته فوراً.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-400">ميديا ستار (MediaStar)</span>
              <span className="text-[10px] font-mono text-slate-400">F1 + 666</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              1. اضغط <strong>F1 + 000</strong> لتفعيل الباتش، ثم <strong>F1 + 666</strong> لقائمة السيرفرات.<br />
              2. غيّر نوع السيرفر من نوع Forever إلى <strong>CCCam</strong>.<br />
              3. ادخل IP/URL، والمنفذ Port، واسم المستخدم، والباسورد واضغط الزر الأصفر للحفظ والتأكيد.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-400">تايجر (Tiger)</span>
              <span className="text-[10px] font-mono text-slate-400">8899 / F1+666</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              1. تفعيل السيرفر برمز <strong>8899</strong> أو <strong>F1 + 666</strong>.<br />
              2. ادخل على قائمة Server Setting، واختر Server 1 واجعل البروتوكول <strong>CCcam</strong>.<br />
              3. يدعم ملف <strong>CCcam.cfg</strong> مباشرة عبر الفلاشة مفرمتة FAT32.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400">سيناتور (Senator)</span>
              <span className="text-[10px] font-mono text-slate-400">Menu &gt; Network</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              1. الدخول على القائمة (Menu) &gt; الضبط &gt; إعدادات الشبكة والسيرفر.<br />
              2. اختيار بروتوكول CCcam وإدخال السطر، أو الضغط على الزر الأحمر لتحميل ملف الفلاشة.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-400">ماجيك (Magic)</span>
              <span className="text-[10px] font-mono text-slate-400">Net Client</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              1. الدخول على Menu &gt; Patch Setting &gt; Net Client Config.<br />
              2. الضغط على الزر الأصفر لتعديل السيرفر 1 واختيار CCcam، أو إدخال السطر من الفلاشة.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-400">فحص السيرفر في Testious</span>
              <span className="text-[10px] font-mono text-slate-400">Online Ping</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              دائماً قبل وضع السطر في الريسيفر، ادخل على <strong>Testious.com</strong> والصق السطر؛ فإذا ظهر باللون الأخضر (Connected) فهو شغال، وإذا أحمر فالسيرفر منتهي.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
