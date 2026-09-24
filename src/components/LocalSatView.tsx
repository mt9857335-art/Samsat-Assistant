import React, { useState } from 'react';
import { 
  Radio, 
  Tv, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  Layers, 
  Sliders, 
  HelpCircle, 
  Zap, 
  CheckCircle2, 
  Search,
  ExternalLink,
  Calculator,
  ArrowRightLeft,
  Share2,
  Cpu
} from 'lucide-react';
import { LEBANESE_LOCAL_SAT_NETWORKS, LocalSatNetwork } from '../data/localSatData';

interface LocalSatViewProps {
  lang: 'ar' | 'en';
}

export const LocalSatView: React.FC<LocalSatViewProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  
  const [selectedNetworkId, setSelectedNetworkId] = useState<string>('cablevision');
  const [usePlus30Offset, setUsePlus30Offset] = useState<boolean>(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Custom calculator state
  const [customStartFreq, setCustomStartFreq] = useState<number>(11960);
  const [customPolarity, setCustomPolarity] = useState<'V' | 'H'>('V');
  const [customSymbolRate, setCustomSymbolRate] = useState<number>(30000);
  const [customStep, setCustomStep] = useState<number>(30);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);

  const selectedNetwork = LEBANESE_LOCAL_SAT_NETWORKS.find(n => n.id === selectedNetworkId) || LEBANESE_LOCAL_SAT_NETWORKS[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const handleCopyAllTransponders = () => {
    const list = selectedNetwork.transponders.map(tp => {
      const freq = usePlus30Offset ? tp.plus30Freq : tp.baseFreq;
      return `تردد ${tp.index}: ${freq} ${tp.polarity} ${tp.symbolRate} (${tp.channelsSummary})`;
    }).join('\n');

    const header = `📡 *ترددات ${selectedNetwork.nameAr} (${usePlus30Offset ? 'مع زيادة +30' : 'التردد الأساسي'}) - الـ 12 تردد:*\n`;
    const footer = `\n📞 إعداد وتزويد: SAM SAT (الأستاذ سام)\nرقم التحويل المعتمد (Whish/OMT): 71186492\nواتساب وهاتف: 03983010`;
    
    handleCopy(header + list + footer, 'copy-all');
  };

  const handleShareWhatsApp = () => {
    const list = selectedNetwork.transponders.map(tp => {
      const freq = usePlus30Offset ? tp.plus30Freq : tp.baseFreq;
      return `• تردد ${tp.index}: *${freq} ${tp.polarity} ${tp.symbolRate}* - ${tp.channelsSummary}`;
    }).join('\n');

    const msg = `مرحباً بك،
إليك جدول ترددات شبكة *${selectedNetwork.nameAr}* في لبنان:

⚙️ *وضع التردد:* ${usePlus30Offset ? '✅ معدل بزيادة +30 ميغاهرتز (+30 MHz Offset)' : 'التردد المباشر بدون زيادة'}
📊 *التردد الرئيسي:* *${usePlus30Offset ? selectedNetwork.offsetFrequency : selectedNetwork.baseFrequency} ${selectedNetwork.polarity} ${selectedNetwork.symbolRate}*
🔢 *عدد الترددات المعتمدة:* 12 تردد كاملة

📋 *قائمة الترددات الـ 12:*
${list}

💡 *ملاحظة التيونر:* يتم استخدام ضبط +30 MHz لتثبيت الإشارة وضمان استقبال كامل الترددات الـ 12 بدون انقطاع على ريسيفرات اللوكال سات في لبنان.

خدمة وتزويد: *SAM SAT • الأستاذ سام*
💳 خط الدفع المعتمد (Whish / OMT): *71186492*
📞 للتواصل والاستفسار: *03983010*`;

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fadeIn" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950/40 to-slate-900 border border-sky-500/30 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-xs font-bold font-mono">
              <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span>{isAr ? 'دليل شبكات اللوكال سات (Local Sat) في لبنان • قاعدة +30 على 12 تردد' : 'Lebanese Local Sat Networks Directory'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>{isAr ? 'شبكات اللوكال سات اللبنانية وترددات الـ 12 تردد' : 'Lebanon Local Sat Networks (12 Transponders)'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isAr 
                ? 'توثيق ترددات شبكات اللوكال سات المعتمدة في لبنان (Cablevision • Econet • CitySat • Home Sat • Digest) مع التردد الرئيسي وخاصية زيادة 30 ميغاهرتز (+30 MHz) لتوليد واستقبال كافة الترددات الـ 12 المتتابعة بدقة متناهية.'
                : 'Complete registry for Lebanese Local Sat systems (Cablevision, Econet, CitySat, Home Sat, Digest) with the +30 MHz offset rule and full 12-transponder matrices.'}
            </p>
          </div>

          {/* Quick Offset Toggle Pill */}
          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl flex flex-col items-center justify-center shrink-0">
            <span className="text-[11px] font-mono text-slate-400 mb-1.5 block">{isAr ? 'مفتاح ضبط التيونر (+30 MHz):' : 'Frequency Mode:'}</span>
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setUsePlus30Offset(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  usePlus30Offset 
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isAr ? 'زيادة +30 (موصى به)' : '+30 Offset'}</span>
              </button>
              <button
                onClick={() => setUsePlus30Offset(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  !usePlus30Offset 
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{isAr ? 'التردد الأصلي' : 'Base'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5 Network Navigation Tabs */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-5 gap-2">
          {LEBANESE_LOCAL_SAT_NETWORKS.map((network) => {
            const isSelected = network.id === selectedNetworkId;
            const currentFreq = usePlus30Offset ? network.offsetFrequency : network.baseFrequency;
            return (
              <button
                key={network.id}
                onClick={() => setSelectedNetworkId(network.id)}
                className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-b from-sky-950/80 to-slate-950 border-sky-400 shadow-lg shadow-sky-500/20 scale-[1.02]'
                    : 'bg-slate-950/60 hover:bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {network.totalTranspondersCount} {isAr ? 'تردد' : 'TP'}
                  </span>
                  <Tv className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white truncate">{network.nameAr.split('(')[0]}</h4>
                  <div className="flex items-center gap-1 mt-1 font-mono text-[11px]">
                    <span className="font-bold text-amber-400">{currentFreq}</span>
                    <span className="text-slate-400">{network.polarity}</span>
                    <span className="text-sky-400 font-bold">{network.symbolRate}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Network Details & 12-Transponders Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
        {/* Network Header info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <span>{selectedNetwork.nameAr}</span>
              </h3>
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border bg-gradient-to-r ${selectedNetwork.badgeColor}`}>
                {selectedNetwork.badge}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {selectedNetwork.description}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyAllTransponders}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copiedKey === 'copy-all' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>{copiedKey === 'copy-all' ? (isAr ? 'تم نسخ الـ 12 تردد!' : 'Copied!') : (isAr ? 'نسخ كافة الـ 12 تردد' : 'Copy All 12 TPs')}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isAr ? 'إرسال الترددات بالواتساب' : 'WhatsApp'}</span>
            </button>

            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className="px-3.5 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{isAr ? 'حاسبة الترددات المخصصة' : 'Offset Calculator'}</span>
            </button>
          </div>
        </div>

        {/* Technical Callout for +30 Offset Rule */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <span>{isAr ? 'قاعدة الفنيين في لبنان: زيادة 30 على التردد (+30 MHz Offset)' : 'The Lebanese +30 MHz Tuning Offset'}</span>
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {selectedNetwork.offsetRuleExplanation}
              </p>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-amber-500/30 px-3.5 py-2 rounded-xl shrink-0 text-center font-mono">
            <span className="text-[10px] text-slate-400 block">{isAr ? 'التردد بعد زيادة 30:' : 'Effective Tuner Freq:'}</span>
            <span className="text-base font-black text-amber-400">
              {selectedNetwork.offsetFrequency} {selectedNetwork.polarity} {selectedNetwork.symbolRate}
            </span>
          </div>
        </div>

        {/* Custom Transponder Calculator (Optional Accordion) */}
        {showCalculator && (
          <div className="bg-slate-950 border border-sky-500/30 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-sky-400 flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                <span>{isAr ? 'حاسبة توليد ترددات اللوكال سات الـ 12 الذكية (+30 MHz Offset)' : 'Custom 12 Transponder Generator'}</span>
              </h4>
              <button
                onClick={() => setShowCalculator(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">{isAr ? 'التردد الأولي الأساسي (MHz)' : 'Base Frequency'}</label>
                <input
                  type="number"
                  value={customStartFreq}
                  onChange={(e) => setCustomStartFreq(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">{isAr ? 'الاستقطاب (Polarity)' : 'Polarity'}</label>
                <select
                  value={customPolarity}
                  onChange={(e) => setCustomPolarity(e.target.value as 'V' | 'H')}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:border-sky-500"
                >
                  <option value="V">V (عمودي / رأسي)</option>
                  <option value="H">H (أفقي)</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">{isAr ? 'معدل الترميز (Symbol Rate)' : 'Symbol Rate'}</label>
                <input
                  type="number"
                  value={customSymbolRate}
                  onChange={(e) => setCustomSymbolRate(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">{isAr ? 'فارق التردد بين القنوات (Step)' : 'Channel Step'}</label>
                <input
                  type="number"
                  value={customStep}
                  onChange={(e) => setCustomStep(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:border-sky-500"
                />
              </div>
            </div>

            {/* Generated 12 items preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-1.5 pt-2 border-t border-slate-900">
              {Array.from({ length: 12 }, (_, i) => {
                const b = customStartFreq + (i * customStep);
                const plus30 = b + 30;
                return (
                  <div key={i} className="bg-slate-900/80 border border-slate-800 p-2 rounded-lg text-center font-mono text-[11px]">
                    <span className="text-[10px] text-slate-500 block">TP {i + 1}</span>
                    <strong className="text-amber-400 block">{plus30} {customPolarity}</strong>
                    <span className="text-slate-400 text-[10px] block">{customSymbolRate}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* The 12 Transponders Table */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>
                {isAr 
                  ? `جدول ترددات ${selectedNetwork.nameAr.split('(')[0]} الـ 12 بالكامل (${usePlus30Offset ? 'مع زيادة +30' : 'التردد الأصلي'}):`
                  : `Full 12 Transponders Matrix for ${selectedNetwork.nameEn}:`}
              </span>
            </h4>

            <div className="text-xs text-slate-400 font-mono">
              {isAr ? 'إجمالي الترددات:' : 'Total TPs:'} <strong className="text-amber-400 font-bold">12 {isAr ? 'تردد معتمد' : 'Transponders'}</strong>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] font-mono">
                <tr>
                  <th className="p-3 text-center">#</th>
                  <th className="p-3">{isAr ? 'التردد المعتمد' : 'Tuning Frequency'}</th>
                  <th className="p-3 text-center">{isAr ? 'الاستقطاب' : 'Polarity'}</th>
                  <th className="p-3 text-center">{isAr ? 'الترميز' : 'Symbol Rate'}</th>
                  <th className="p-3 text-center">{isAr ? 'التصحيح' : 'FEC'}</th>
                  <th className="p-3">{isAr ? 'الباقة والقنوات المحمولة' : 'Channels Package'}</th>
                  <th className="p-3 text-center">{isAr ? 'نسخ' : 'Copy'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                {selectedNetwork.transponders.map((tp) => {
                  const currentFreq = usePlus30Offset ? tp.plus30Freq : tp.baseFreq;
                  const copyText = `${currentFreq} ${tp.polarity} ${tp.symbolRate}`;
                  const isCopied = copiedKey === `tp-${tp.index}-${selectedNetwork.id}`;

                  return (
                    <tr 
                      key={tp.index}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="p-3 text-center font-mono font-bold text-slate-400">
                        <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 inline-flex items-center justify-center text-xs">
                          {tp.index}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-white">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-amber-300">{currentFreq}</span>
                          <span className="text-[10px] text-slate-500 font-normal">MHz</span>
                          {usePlus30Offset && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              +30
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {isAr ? 'الأصل:' : 'Base:'} {tp.baseFreq}
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono font-bold">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          tp.polarity === 'V' 
                            ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30' 
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}>
                          {tp.polarity === 'V' ? 'V (عمودي)' : 'H (أفقي)'}
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-slate-200">
                        {tp.symbolRate}
                      </td>
                      <td className="p-3 text-center font-mono text-slate-400">
                        {tp.fec}
                      </td>
                      <td className="p-3 text-slate-300 font-medium leading-relaxed">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{tp.channelsSummary}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleCopy(copyText, `tp-${tp.index}-${selectedNetwork.id}`)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                          title={isAr ? 'نسخ التردد' : 'Copy'}
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-amber-400" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* LNB and Technical Settings Footer */}
        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h5 className="font-bold text-sky-400 mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>{isAr ? 'إعدادات اللاقط (LNB) المقترحة للشبكة:' : 'Recommended LNB Settings:'}</span>
            </h5>
            <ul className="space-y-1.5 text-slate-300 text-[11px] font-mono">
              <li>• <span className="text-slate-400">{isAr ? 'نوع اللاقط: ' : 'Type: '}</span>{selectedNetwork.lnbSettings.lnbType}</li>
              <li>• <span className="text-slate-400">{isAr ? 'التردد المنخفض / العالي: ' : 'Freq: '}</span>{selectedNetwork.lnbSettings.lowFreq} / {selectedNetwork.lnbSettings.highFreq} MHz</li>
              <li>• <span className="text-slate-400">{isAr ? 'تغذية الطاقة (LNB Power): ' : 'Power: '}</span>{selectedNetwork.lnbSettings.power}</li>
              <li>• <span className="text-slate-400">{isAr ? 'الدايسك (DiSEqC): ' : 'DiSEqC: '}</span>{selectedNetwork.lnbSettings.diseqc}</li>
            </ul>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h5 className="font-bold text-amber-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'أجهزة الريسيفر المتوافقة والمعتمدة لدى سام:' : 'Compatible Receivers at Sam SAT:'}</span>
            </h5>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {selectedNetwork.recommendedReceivers.join(' • ')}
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              {isAr ? 'مناطق التغطية الرئيسية في لبنان: ' : 'Coverage: '}
              <strong className="text-slate-200">{selectedNetwork.coverageAreas.join(', ')}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
