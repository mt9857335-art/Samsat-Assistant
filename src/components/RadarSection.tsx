import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  TrendingUp, 
  CloudSun, 
  DollarSign, 
  RefreshCw, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  Flame,
  ArrowRightLeft,
  Activity
} from 'lucide-react';
import { CurrencyRates, WeatherInfo, BarcaNewsItem } from '../types';

interface RadarSectionProps {
  lang: 'ar' | 'en';
}

export const RadarSection: React.FC<RadarSectionProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  const [isLoadingBarca, setIsLoadingBarca] = useState(false);
  const [barcaData, setBarcaData] = useState<{
    headline: string;
    summary: string;
    nextMatch: string;
    quote: string;
  }>({
    headline: 'برشلونة يواصل التألق والتحضير لمواجهته الحاسمة في الدوري',
    summary: 'معنويات كتيبة البلوغرانا بقيادة نجوم الفريق في أعلى مستوياتها، والتركيز ينصب على حصد النقاط الكاملة والتتويج بالبطولات.',
    nextMatch: 'برشلونة vs فالنسيا / إشبيلية (الجولة القادمة في الليغا)',
    quote: 'أستاذ سام، فورسا بارسا دائماً! الفريق جاهز بنسبة 100% لإسعاد الجماهير الكتالونية.'
  });

  // Rates state
  const [usdToLbpRate, setUsdToLbpRate] = useState(89500);
  const [calcUsd, setCalcUsd] = useState<number | string>(100);

  // Weather state
  const [weather, setWeather] = useState<WeatherInfo>({
    city: 'بيروت / لبنان',
    temp: 24,
    condition: 'مشمس ومعتدل',
    humidity: 55,
    windSpeed: '14 كم/س',
    forecast: 'طقس مستقر نهاراً، لطيف مساءً ومناسب لجميع الأنشطة والمواعيد.',
  });

  const fetchBarcaNews = async () => {
    setIsLoadingBarca(true);
    try {
      const res = await fetch('/api/sports-barca', { method: 'POST' });
      const data = await res.json();
      if (data && data.headline) {
        setBarcaData(data);
      }
    } catch (e) {
      console.warn('Failed to fetch Barca updates:', e);
    } finally {
      setIsLoadingBarca(false);
    }
  };

  useEffect(() => {
    fetchBarcaNews();
  }, []);

  const calculatedLbp = typeof calcUsd === 'number' ? (calcUsd * usdToLbpRate).toLocaleString() : '0';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-blue-950/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.25)]">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full uppercase">
                  {isAr ? 'رادار المتابعة اليومي لسام' : "SAM'S INTELLIGENCE RADAR"}
                </span>
                <span className="text-xs text-rose-400 flex items-center gap-1 font-mono">
                  <Flame className="w-3.5 h-3.5" />
                  {isAr ? 'خاص بنادي برشلونة' : 'FC BARCELONA FOCUS'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                {isAr ? 'العملات، الطقس، ونادي برشلونة' : 'Currencies, Weather & FC Barcelona'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isAr 
                  ? 'متابعة لحظية لأسعار الصرف في لبنان، حالة الطقس، وتحليلات ومواعيد مباريات فريقك المفضل برشلونة.' 
                  : 'Real-time rates, weather updates, and curated FC Barcelona sports highlights.'}
              </p>
            </div>
          </div>

          <button
            onClick={fetchBarcaNews}
            disabled={isLoadingBarca}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-sky-400 border border-sky-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors font-mono disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBarca ? 'animate-spin' : ''}`} />
            <span>{isAr ? 'تحديث الرادار' : 'REFRESH'}</span>
          </button>
        </div>
      </div>

      {/* FC Barcelona Spotlight (Requested specifically by Sam) */}
      <div className="bg-gradient-to-br from-[#0c1022] via-[#11162c] to-[#1c142e] border border-blue-600/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Barcelona Blaugrana subtle accents */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 relative z-10">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold font-mono bg-gradient-to-r from-blue-500 to-red-500 text-white flex items-center gap-1.5 shadow-md">
                <Trophy className="w-3.5 h-3.5" />
                <span>FC BARCELONA • نـادي بـرشـلـونـة</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {isAr ? 'فريق سام المفضل' : "Sam's Favorite Team"}
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug">
              {barcaData.headline}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              {barcaData.summary}
            </p>

            {/* Quote from Samsat to Sam */}
            <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/20 text-xs text-sky-300 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sky-400">{isAr ? 'رسالة سمسات لسام:' : 'Samsat to Sam:'} </span>
                <span>{barcaData.quote}</span>
              </div>
            </div>
          </div>

          {/* Next Match Box */}
          <div className="w-full md:w-72 bg-slate-950/70 border border-blue-500/30 rounded-2xl p-4 flex flex-col justify-between space-y-3 flex-shrink-0">
            <div>
              <div className="text-[10px] font-mono uppercase text-sky-400 font-bold tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{isAr ? 'المواجهة القادمة للبارسا' : 'NEXT MATCH'}</span>
              </div>
              <div className="text-sm font-bold text-white mt-1.5 leading-snug">
                {barcaData.nextMatch}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1">
                {isAr ? 'الليغا الإسبانية • La Liga' : 'Spanish La Liga'}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">Força Barça!</span>
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-mono font-bold text-[10px]">
                LIVE READY
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Currencies & Weather Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Currencies & Exchange Rate Calculator */}
        <div className="bg-slate-900/50 border border-slate-800/70 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {isAr ? 'سعر الصرف والعملات (لبنان)' : 'Currency & Exchange Rates'}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  {isAr ? 'سعر الصرف المعتمد في المحل والتشريجات' : 'Standard Market Exchange'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
                1 USD = {usdToLbpRate.toLocaleString()} L.L
              </span>
            </div>
          </div>

          {/* Quick Rate Editor */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">{isAr ? 'تعديل سعر صرف الدولار:' : 'Custom Rate:'}</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={usdToLbpRate}
                onChange={(e) => setUsdToLbpRate(Number(e.target.value) || 89500)}
                className="w-24 bg-[#0B0F1A] border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center focus:outline-none focus:border-sky-500"
              />
              <span className="text-slate-400 font-mono">L.L</span>
            </div>
          </div>

          {/* Currency Converter for Sam */}
          <div className="space-y-2 pt-1">
            <div className="text-xs font-medium text-slate-300 flex items-center gap-1">
              <ArrowRightLeft className="w-3.5 h-3.5 text-sky-400" />
              <span>{isAr ? 'حاسبة تحويل سريعة لسام والزبائن:' : 'Quick Converter:'}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#0B0F1A] p-2.5 rounded-xl border border-slate-700/80">
                <span className="text-[10px] text-slate-400 block font-mono">المبلغ بالدولار ($):</span>
                <input
                  type="number"
                  value={calcUsd}
                  onChange={(e) => setCalcUsd(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="100"
                  className="w-full bg-transparent text-sm font-bold text-white font-mono focus:outline-none mt-0.5"
                />
              </div>

              <div className="bg-[#0B0F1A] p-2.5 rounded-xl border border-slate-700/80 flex flex-col justify-center">
                <span className="text-[10px] text-slate-400 block font-mono">يعادل بالليرة (LBP):</span>
                <span className="text-sm font-bold text-emerald-400 font-mono truncate mt-0.5">
                  {calculatedLbp} ل.ل
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Section */}
        <div className="bg-slate-900/50 border border-slate-800/70 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <CloudSun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {isAr ? 'الطقس والمناخ اليومي' : 'Daily Weather Forecast'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {weather.city}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xl font-extrabold font-mono text-amber-400">
                  {weather.temp}°C
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <p className="font-semibold text-white mb-0.5">{weather.condition}</p>
              <p className="text-slate-400">{weather.forecast}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
            <div className="bg-[#0B0F1A] p-2 rounded-xl border border-slate-800 flex items-center justify-between">
              <span>{isAr ? 'نسبة الرطوبة:' : 'Humidity:'}</span>
              <span className="text-sky-400 font-bold">{weather.humidity}%</span>
            </div>
            <div className="bg-[#0B0F1A] p-2 rounded-xl border border-slate-800 flex items-center justify-between">
              <span>{isAr ? 'سرعة الرياح:' : 'Wind:'}</span>
              <span className="text-sky-400 font-bold">{weather.windSpeed}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
