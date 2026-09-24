import React, { useState } from 'react';
import { 
  Radio, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  Compass, 
  Tv, 
  Sparkles, 
  Globe, 
  Signal, 
  CheckCircle2, 
  HelpCircle,
  Share2,
  Navigation
} from 'lucide-react';
import { 
  SATELLITE_SITES, 
  TOP_SATELLITE_FREQUENCIES, 
  SatelliteSite, 
  SatelliteFrequency 
} from '../data/satelliteData';

interface SatellitesViewProps {
  lang: 'ar' | 'en';
}

export const SatellitesView: React.FC<SatellitesViewProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  
  const [activeCategory, setActiveCategory] = useState<'all' | 'frequencies' | 'alignment' | 'sat_operator'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSatFilter, setSelectedSatFilter] = useState<string>('all');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2200);
  };

  // Filter sites
  const filteredSites = SATELLITE_SITES.filter(site => {
    const matchesCat = activeCategory === 'all' || site.category === activeCategory;
    const matchesQuery = 
      site.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.keyFeatures.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  // Filter frequencies
  const filteredFrequencies = TOP_SATELLITE_FREQUENCIES.filter(freq => {
    const matchesSat = selectedSatFilter === 'all' || freq.orbitalPosition === selectedSatFilter;
    const matchesQuery = 
      freq.satelliteNameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freq.satelliteNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freq.frequency.includes(searchQuery) ||
      freq.channels.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      freq.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSat && matchesQuery;
  });

  const uniqueSats = Array.from(new Set(TOP_SATELLITE_FREQUENCIES.map(f => f.orbitalPosition)));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Summary */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950/40 to-slate-900 border border-sky-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>{isAr ? 'دليل مواقع الأقمار الصناعية وترددات المحطات المعتمدة' : 'Official Satellite Portals & Transponder Directory'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isAr ? 'مواقع الأقمار الصناعية والترددات اليومية' : 'Satellite Portals & Live Frequencies'}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {isAr 
                ? 'فهرس متكامل لمواقع رصد ترددات الأقمار أولاً بأول (FlySat, KingOfSat, LyngSat) مع أدوات ضبط وتوجيه الصحن والزوايا بالخريطة (DishPointer, SatLex) وجدول الترددات الأكثر طلباً في لبنان.'
                : 'Direct access to global frequency tracking sites, footprint maps, dish alignment tools, and the most reliable transponders for Lebanon & Middle East.'}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 font-mono block">{isAr ? 'مواقع عالمية' : 'PORTALS'}</span>
              <span className="text-xl font-bold text-sky-400 font-mono">7+</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 font-mono block">{isAr ? 'أقمار رئيسية' : 'SATELLITES'}</span>
              <span className="text-xl font-bold text-amber-400 font-mono">6</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 font-mono block">{isAr ? 'تحديث الإشارة' : 'SIGNAL'}</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-lg">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'ابحث عن اسم موقع، قمر (نايل سات، هوتبيرد)، أو قناة (MTV, beIN, MBC)...' : 'Search portal, satellite or channel name...'}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Categories pills */}
        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          {[
            { id: 'all', label: isAr ? 'جميع المواقع' : 'All Portals' },
            { id: 'frequencies', label: isAr ? 'مواقع الترددات اليومية' : 'Frequency Charts' },
            { id: 'alignment', label: isAr ? 'توجيه الصحن والزوايا' : 'Dish Alignment' },
            { id: 'sat_operator', label: isAr ? 'إدارة الأقمار الرسمية' : 'Operators' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === tab.id
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SATELLITE SITES CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-sky-400" />
            <span>{isAr ? 'أهم مواقع الأقمار الصناعية والترددات الرسمية المعتمدة' : 'Official Satellite & Frequency Websites'}</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {filteredSites.length} {isAr ? 'موقع متوفر' : 'Sites Available'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSites.map((site) => (
            <div
              key={site.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/5 group"
            >
              <div className="space-y-3">
                {/* Header Badge & Name */}
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-gradient-to-r ${site.badgeColor}`}>
                    {site.badge}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-slate-500 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                    {site.category}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors flex items-center gap-1.5">
                    <span>{site.nameAr}</span>
                  </h4>
                  <span className="text-xs font-mono text-slate-400 block">{site.nameEn}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {site.description}
                </p>

                {/* Key Features */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  {site.keyFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Recommended Tip */}
                <div className="bg-sky-500/5 border border-sky-500/20 rounded-xl p-2.5 text-[11px] text-sky-300 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span><strong>{isAr ? 'نصيحة سمسات:' : 'Tip:'}</strong> {site.recommendedUse}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center gap-2">
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/10 transition-all"
                >
                  <span>{isAr ? 'فتح الموقع المباشر' : 'Visit Website'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => handleCopy(site.url, site.id)}
                  title={isAr ? 'نسخ الرابط' : 'Copy link'}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                >
                  {copiedText === site.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TRANSPONDERS & FREQUENCIES DIRECTORY */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-1">
              <Signal className="w-3.5 h-3.5" />
              <span>{isAr ? 'ترددات الأقمار المعتمدة الأكثر طلباً في لبنان' : 'Most Popular Frequencies in Lebanon'}</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              {isAr ? 'جدول الترددات الذهبية للمحطات والباقات' : 'Golden Transponders Directory'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isAr 
                ? 'انقر على أي تردد لنسخه فوراً أو مشاركته مع الزبائن، الترددات تشمل الباقة اللبنانية، باقات الأفلام، وقنوات الرياضة والشيرينغ.'
                : 'Click any frequency to copy instantly or share with clients for easy dish tuning.'}
            </p>
          </div>

          {/* Orbital filter */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedSatFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedSatFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isAr ? 'جميع الأقمار' : 'All Sats'}
            </button>
            {uniqueSats.map(pos => (
              <button
                key={pos}
                onClick={() => setSelectedSatFilter(pos)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedSatFilter === pos
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* Frequencies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFrequencies.map(freq => {
            const freqLine = `${freq.frequency} ${freq.polarity} ${freq.symbolRate} ${freq.fec}`;
            return (
              <div
                key={freq.id}
                className="bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 rounded-2xl p-4 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {freq.satelliteNameAr}
                      </span>
                      <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                        {freq.orbitalPosition}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 block mt-0.5">{freq.satelliteNameEn}</span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    freq.category === 'sports' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : freq.category === 'local_sat'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-mono font-black'
                      : freq.category === 'lebanese'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                  }`}>
                    {freq.category === 'sports' 
                      ? (isAr ? 'رياضة' : 'Sports') 
                      : freq.category === 'local_sat'
                      ? (isAr ? 'لوكال سات (+30)' : 'Local Sat +30')
                      : freq.category === 'lebanese' 
                      ? (isAr ? 'لبناني' : 'Lebanese') 
                      : freq.category === 'movies' 
                      ? (isAr ? 'أفلام' : 'Movies') 
                      : (isAr ? 'إشارة ضبط' : 'Signal')}
                  </span>
                </div>

                {/* Transponder Specs Box */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 my-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono uppercase">
                      {freq.standard} • {freq.modulation}
                    </span>
                    <div className="text-base font-black font-mono text-white flex items-center gap-2">
                      <span className="text-amber-400">{freq.frequency}</span>
                      <span className="text-sky-400">{freq.polarity === 'V' ? 'عمودي (V)' : 'أفقي (H)'}</span>
                      <span className="text-emerald-400">{freq.symbolRate}</span>
                      <span className="text-slate-400 text-xs font-normal">({freq.fec})</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(freqLine, freq.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all border border-slate-700"
                    title={isAr ? 'نسخ التردد' : 'Copy frequency'}
                  >
                    {copiedText === freq.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{isAr ? 'تم النسخ' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>{isAr ? 'نسخ' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Channels in this transponder */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400">{isAr ? 'أهم القنوات في هذا التردد:' : 'Key Channels:'}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {freq.channels.map((chan, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-slate-900 text-slate-200 border border-slate-800 px-2 py-0.5 rounded-lg"
                      >
                        {chan}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <p className="text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800/60 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{freq.notes}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* DISH ALIGNMENT & LNB TIPS FOR SAM */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/20 rounded-3xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">
              {isAr ? 'قواعد ضبط واستقبال الأقمار في لبنان (دليل سام الفني)' : 'Lebanon Satellite Reception & Dish Alignment Guidelines'}
            </h4>
            <span className="text-xs text-slate-400">
              {isAr ? 'إرشادات زوايا الأقمار وأقطار الأطباق في مختلف المناطق اللبنانية' : 'Optimal dish sizes and elevation rules'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-1.5">
            <span className="font-bold text-sky-400 block">1. نايل سات (7.0°W)</span>
            <p className="text-slate-300">
              يُستقبل في كافة مناطق لبنان (بيروت، صيدا، طرابلس، البقاع، والجنوب) بصحن قطره <strong>60 سم إلى 80 سم</strong> بإشارة تتجاوز 90%.
            </p>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-1.5">
            <span className="font-bold text-amber-400 block">2. هوتبيرد (13.0°E)</span>
            <p className="text-slate-300">
              صحن <strong>90 سم</strong> مثالي جداً لاستقبال باقات بولسات واليفن سبورت وكانال بلوس دون أي تأثر بالأمطار والغيوم.
            </p>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-1.5">
            <span className="font-bold text-emerald-400 block">3. أسترا 19.2°E و مسطرة دايسك</span>
            <p className="text-slate-300">
              يمكن جمع <strong>نايل سات + هوتبيرد + عربسات بدر</strong> على صحن بيضاوي واحد 1 متر بمسطرة 3 لواقط مع قسام DiSEqC 4x1.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
