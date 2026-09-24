import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Tv, 
  Radio, 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  Flame, 
  Info,
  ChevronDown,
  ChevronUp,
  Cpu,
  MonitorPlay,
  Layers,
  PhoneCall
} from 'lucide-react';
import { MasterSubscriptionItem, SAM_MASTER_SUBSCRIPTIONS } from '../data/subscriptionsData';

interface MasterSubscriptionsCardProps {
  lang: 'ar' | 'en';
  onQuickAddClientForService?: (serviceName: string, price: number, durationDays: number) => void;
}

export const MasterSubscriptionsCard: React.FC<MasterSubscriptionsCardProps> = ({
  lang,
  onQuickAddClientForService
}) => {
  const isAr = lang === 'ar';
  const [selectedSubId, setSelectedSubId] = useState<string>('sam-vip2');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<boolean>(true);

  const selectedSub = SAM_MASTER_SUBSCRIPTIONS.find(s => s.id === selectedSubId) || SAM_MASTER_SUBSCRIPTIONS[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleShareOnWhatsApp = (sub: MasterSubscriptionItem) => {
    let msg = '';
    if (sub.id === 'sam-vip2') {
      msg = `مرحباً بك،
تحية طيبة من شركة *SAM SAT* (الأستاذ سام).

👑 *اشتراك سيرفر Forever VIP 2 الأصلي المعتمد (VIP 2):*
أقوى اشتراك شيرينغ فضائي لفتح القنوات الفضائية المشفرة مباشرة بالصحن وبأقل استهلاك إنترنت (يعمل حتى على شبكات 3G وباقات الموبايل المحدودة).

📡 *أبرز الباقات المفتوحة على اشتراك VIP2:*
- قنوات beIN Sports العربية على نايل سات (7.0°W) وسهيل سات (26.0°E).
- قنوات البين سبورت الماكس والإخبارية وكأس العالم ودوري الأبطال.
- باقة SuperSport و DSTV جنوب أفريقيا الرياضية.
- باقات هوتبيرد: Nova اليونانية، Eleven Sports، Polsat Sport، Canal+ France.
- تفعيل صوتيات فوريفر المدمجة للتعليق العربي التلقائي مع خاصية التايم شفت.

💰 *أسعار الاشتراك الرسمي لدى سام:*
- 3 أشهر: $25
- 6 أشهر: $45
- سنة كاملة: $75

💳 خط التحويل والدفع المعتمد (Whish / OMT): *71186492*
📞 هاتف الأستاذ سام المباشر: *03983010*
*SAM SAT • الأفضل والأوثق في لبنان دائماً*`;
    } else {
      msg = `مرحباً بك،
تحية طيبة من شركة *SAM SAT* (الأستاذ سام).

📺 *تفاصيل ${sub.name}:*
${sub.notes}

✨ *أبرز المميزات والباقات:*
${sub.coverage.map(c => `• ${c}`).join('\n')}

📱 *يعمل على جميع الأجهزة:*
${sub.supportedDevices.join(' • ')}

💰 *أسعار الاشتراك الرسمي لدى سام:*
- 3 أشهر: $${sub.officialPrice.month3 || 15}
- 6 أشهر: $${sub.officialPrice.month6 || 25}
- سنة كاملة: $${sub.officialPrice.year1}

💳 خط التحويل والدفع المعتمد (Whish / OMT): *71186492*
📞 هاتف الأستاذ سام المباشر: *03983010*
*SAM SAT • بخدمتكم دائماً*`;
    }

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-amber-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Glow highlight */}
      <div className="absolute top-0 -left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                {isAr ? 'حساب الأستاذ سام المعتمد' : "Sam's Master Active Licenses"}
              </span>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isAr ? 'اشتراك VIP 2 نشط + 4 سيرفرات IPTV' : 'VIP 2 Active + 4 IPTV Servers'}
              </span>
            </div>
            <h2 className="text-lg font-black text-white mt-0.5 flex items-center gap-2">
              <span>{isAr ? 'اشتراكات وسيرفرات الأستاذ سام (VIP 2 و IPTV المعتمدة)' : "Sam's Master VIP 2 & Official IPTV Subscriptions"}</span>
            </h2>
            <p className="text-xs text-slate-300">
              {isAr
                ? 'لدى الأستاذ سام اشتراك Forever VIP 2 نشط ورسمي لفتح بي إن سبورت والأقمار، بالإضافة للاشتراكات المعتمدة رسمياً: شامنا (Shamna) • دي إتش (DH) • مارفل (Marvel) • ماجيك (Magic).'
                : 'Sam holds active Master VIP 2 for beIN satellite sharing + official IPTV: Shamna, DH, Marvel, and Magic.'}
            </p>
          </div>
        </div>

        {/* Quick Contacts */}
        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800/80 p-2 rounded-xl">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 block">{isAr ? 'خط التحويل المعتمد' : 'Payment Line'}</span>
            <span className="text-xs font-mono font-bold text-amber-400">71186492</span>
          </div>
          <div className="h-6 w-px bg-slate-800 mx-1" />
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 block">{isAr ? 'هاتف سام المباشر' : 'Direct Phone'}</span>
            <span className="text-xs font-mono font-bold text-sky-400">03983010</span>
          </div>
        </div>
      </div>

      {/* Tabs for Sam's 5 Master Subscriptions */}
      <div className="relative z-10 mt-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {SAM_MASTER_SUBSCRIPTIONS.map((sub) => {
            const isSelected = sub.id === selectedSubId;
            const isVip2 = sub.id === 'sam-vip2';
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubId(sub.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  isSelected
                    ? isVip2
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/25 scale-[1.02]'
                      : 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white border-sky-300 shadow-lg shadow-sky-500/25 scale-[1.02]'
                    : 'bg-slate-950/60 hover:bg-slate-800/80 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {isVip2 ? (
                  <Flame className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                ) : (
                  <Tv className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-sky-400'}`} />
                )}
                <span>
                  {sub.id === 'sam-vip2' && '👑 اشتراك VIP 2'}
                  {sub.id === 'sam-shamna' && '📺 شامنا Shamna'}
                  {sub.id === 'sam-dh' && '⚡ دي إتش DH IPTV'}
                  {sub.id === 'sam-marvel' && '🔥 مارفل Marvel 4K'}
                  {sub.id === 'sam-magic' && '🪄 ماجيك Magic Pro'}
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isSelected 
                    ? 'bg-black/20 text-slate-900 font-black' 
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {isAr ? 'نشط' : 'Active'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Subscription Showcase Card */}
      <div className="relative z-10 mt-3 bg-slate-950/90 border border-slate-800 rounded-xl p-4.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>{selectedSub.name}</span>
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold">
                {selectedSub.typeBadge}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {isAr ? 'اشتراك رسمي شغال ومضمون' : 'Verified Official'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {selectedSub.notes}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {selectedSub.activeCode && (
              <button
                onClick={() => handleCopy(selectedSub.activeCode!, `code-${selectedSub.id}`)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                title={isAr ? 'نسخ كود التفعيل' : 'Copy Activation Code'}
              >
                {copiedKey === `code-${selectedSub.id}` ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>{copiedKey === `code-${selectedSub.id}` ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'كود التفعيل' : 'Active Code')}</span>
              </button>
            )}

            <button
              onClick={() => handleShareOnWhatsApp(selectedSub)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isAr ? 'مشاركة عبر واتساب' : 'WhatsApp'}</span>
            </button>

            {onQuickAddClientForService && (
              <button
                onClick={() => {
                  const defaultPlan = selectedSub.id === 'sam-vip2' 
                    ? { name: 'اشتراك Forever VIP 2 سنة كاملة', price: 75, days: 365 }
                    : selectedSub.id === 'sam-shamna'
                    ? { name: 'اشتراك شامنا IPTV سنة كاملة', price: 35, days: 365 }
                    : selectedSub.id === 'sam-marvel'
                    ? { name: 'اشتراك مارفل IPTV سنة كاملة', price: 45, days: 365 }
                    : selectedSub.id === 'sam-dh'
                    ? { name: 'اشتراك دي إتش IPTV سنة كاملة', price: 40, days: 365 }
                    : { name: 'اشتراك ماجيك IPTV سنة كاملة', price: 30, days: 365 };

                  onQuickAddClientForService(defaultPlan.name, defaultPlan.price, defaultPlan.days);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-sky-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? 'تسجيل زبون بهذا الاشتراك' : 'Register Client'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Credentials / Server Link (if applicable) */}
        {(selectedSub.serverUrl || selectedSub.activeCode) && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
            {selectedSub.activeCode && (
              <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg">
                <span className="text-[10px] text-slate-400 block">{isAr ? 'كود التفعيل المعتمد:' : 'Master Code:'}</span>
                <span className="text-amber-300 font-bold font-mono truncate block">{selectedSub.activeCode}</span>
              </div>
            )}
            {selectedSub.host && (
              <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg">
                <span className="text-[10px] text-slate-400 block">{isAr ? 'سيرفر الهوست (Host):' : 'Host / Server:'}</span>
                <span className="text-sky-300 font-bold font-mono truncate block">{selectedSub.host}:{selectedSub.port}</span>
              </div>
            )}
            <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg">
              <span className="text-[10px] text-slate-400 block">{isAr ? 'صلاحية الحساب:' : 'Status & Expiry:'}</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                {isAr ? 'مستمر ومجدد (2027)' : 'Active (2027)'}
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg">
              <span className="text-[10px] text-slate-400 block">{isAr ? 'سعر السنة المعتمد للزبائن:' : 'Official Year Price:'}</span>
              <span className="text-white font-bold font-mono">${selectedSub.officialPrice.year1} USD</span>
            </div>
          </div>
        )}

        {/* Detailed features & coverage */}
        <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
          {/* Coverage */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/70">
            <h4 className="text-xs font-bold text-sky-400 mb-2 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5" />
              <span>{isAr ? 'أهم القنوات والباقات المفتوحة:' : 'Covered Channels & Packages:'}</span>
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              {selectedSub.coverage.map((cov, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold mt-0.5">•</span>
                  <span>{cov}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Features & Devices */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/70">
            <h4 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'الميزات التقنية والأجهزة المدعومة:' : 'Features & Supported Devices:'}</span>
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              {selectedSub.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold mt-0.5">✓</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
              <span className="text-slate-300 font-semibold">{isAr ? 'الأجهزة المتوافقة: ' : 'Compatible: '}</span>
              {selectedSub.supportedDevices.join(' • ')}
            </div>
          </div>
        </div>

        {/* Price tiers footer */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-semibold">{isAr ? 'باقات الاشتراك المتاحة للزبائن:' : 'Available Tiers:'}</span>
            {selectedSub.officialPrice.month1 && (
              <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-white font-mono">
                {isAr ? 'شهر: ' : '1M: '}<strong className="text-amber-400">${selectedSub.officialPrice.month1}</strong>
              </span>
            )}
            {selectedSub.officialPrice.month3 && (
              <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-white font-mono">
                {isAr ? '3 أشهر: ' : '3M: '}<strong className="text-amber-400">${selectedSub.officialPrice.month3}</strong>
              </span>
            )}
            {selectedSub.officialPrice.month6 && (
              <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-white font-mono">
                {isAr ? '6 أشهر: ' : '6M: '}<strong className="text-amber-400">${selectedSub.officialPrice.month6}</strong>
              </span>
            )}
            <span className="bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 text-amber-300 font-mono font-bold">
              {isAr ? 'سنة كاملة: ' : '1Y: '}<strong className="text-amber-400">${selectedSub.officialPrice.year1}</strong>
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span>{isAr ? 'طريقة الدفع:' : 'Payment:'}</span>
            <span className="text-white font-mono font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">Whish / OMT: 71186492</span>
          </div>
        </div>
      </div>
    </div>
  );
};
