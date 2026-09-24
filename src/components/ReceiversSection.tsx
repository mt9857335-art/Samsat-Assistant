import React, { useState } from 'react';
import { 
  Tv, 
  Download, 
  ExternalLink, 
  Share2, 
  Check, 
  Copy, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Terminal, 
  Layers, 
  MessageSquare, 
  Plus, 
  Trash2, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle,
  Wifi,
  Radio,
  FileCode2,
  Send,
  Calendar,
  PhoneCall,
  Server,
  Globe
} from 'lucide-react';
import { ApprovedReceiver, CustomerDeviceRecord } from '../types';
import { APPROVED_RECEIVERS, INITIAL_CUSTOMER_DEVICES } from '../data/receiversData';
import { SamSatLogo } from './SamSatLogo';
import { SatellitesView } from './SatellitesView';
import { CccamView } from './CccamView';
import { LocalSatView } from './LocalSatView';

interface ReceiversSectionProps {
  lang: 'ar' | 'en';
}

export const ReceiversSection: React.FC<ReceiversSectionProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  
  const [activeBrandFilter, setActiveBrandFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'catalog' | 'satellites' | 'localsat' | 'cccam' | 'whatsapp' | 'devices' | 'guide'>('catalog');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  
  // Selected receiver for quick details / update modal
  const [selectedReceiver, setSelectedReceiver] = useState<ApprovedReceiver | null>(null);

  // Customer Devices tracker state
  const [devices, setDevices] = useState<CustomerDeviceRecord[]>(() => {
    const saved = localStorage.getItem('samsat_customer_devices');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_CUSTOMER_DEVICES;
  });

  // New device form state
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [newDevice, setNewDevice] = useState<Partial<CustomerDeviceRecord>>({
    customerName: '',
    customerPhone: '',
    brand: 'starsat',
    model: '',
    serverType: 'Forever VIP',
    lastUpdatedDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // WhatsApp Message Generator state
  const [waCustomerName, setWaCustomerName] = useState('الزبون الكريم');
  const [waCustomerPhone, setWaCustomerPhone] = useState('');
  const [waSelectedBrand, setWaSelectedBrand] = useState<string>('starsat');
  const [waModelName, setWaModelName] = useState('StarSat SR-200HD 4K Extreme');
  const [waUpdateType, setWaUpdateType] = useState<'firmware' | 'channels' | 'server_renewal' | 'sat_frequencies' | 'free_cccam' | 'local_sat'>('firmware');
  const [waCopied, setWaCopied] = useState(false);

  // Save devices to localStorage
  const saveDevices = (updated: CustomerDeviceRecord[]) => {
    setDevices(updated);
    localStorage.setItem('samsat_customer_devices', JSON.stringify(updated));
  };

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevice.customerName || !newDevice.brand) return;

    const brandData = APPROVED_RECEIVERS.find(b => b.brandKey === newDevice.brand);
    const modelName = newDevice.model || (brandData ? brandData.topModels[0].model : 'Standard Model');

    const created: CustomerDeviceRecord = {
      id: `dev-${Date.now()}`,
      customerName: newDevice.customerName,
      customerPhone: newDevice.customerPhone || '',
      brand: newDevice.brand as any,
      model: modelName,
      serverType: newDevice.serverType || 'Forever',
      serverExpireDate: newDevice.serverExpireDate || '',
      lastUpdatedDate: newDevice.lastUpdatedDate || new Date().toISOString().split('T')[0],
      notes: newDevice.notes || '',
    };

    saveDevices([created, ...devices]);
    setShowAddDeviceModal(false);
    setNewDevice({
      customerName: '',
      customerPhone: '',
      brand: 'starsat',
      model: '',
      serverType: 'Forever VIP',
      lastUpdatedDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  const handleDeleteDevice = (id: string) => {
    if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الجهاز من السجل؟' : 'Are you sure you want to delete this device?')) {
      saveDevices(devices.filter(d => d.id !== id));
    }
  };

  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(identifier);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  // Filtered receivers
  const filteredReceivers = APPROVED_RECEIVERS.filter(rec => {
    const matchesBrand = activeBrandFilter === 'all' || rec.brandKey === activeBrandFilter;
    const matchesQuery = 
      rec.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.defaultServers.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      rec.topModels.some(m => m.model.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesBrand && matchesQuery;
  });

  // Selected brand data for WhatsApp builder
  const currentWaBrand = APPROVED_RECEIVERS.find(b => b.brandKey === waSelectedBrand) || APPROVED_RECEIVERS[1];

  // Generated WhatsApp message
  const generatedWhatsAppMessage = () => {
    if (waUpdateType === 'firmware') {
      return `مرحباً بك أستاذ ${waCustomerName || 'الكريم'}،
تحية طيبة من شركة *SAM SAT* لخدمات الستالايت والاشتراكات.

بخصوص جهازك المعتمد: *${currentWaBrand.nameAr} (${currentWaBrand.nameEn})* - موديل *${waModelName}*.

📥 *رابط موقع التحديث الرسمي لتحميل السوفتوير:*
${currentWaBrand.officialUpdateUrl}

📂 *موقع بديل لتحميل البرمجيات وملفات اللودر:*
${currentWaBrand.backupUpdateUrl}

⚙️ *خطوات التثبيت السريعة:*
1. نزّل ملف السوفتوير وفك الضغط عنه وضعه على فلاشة USB.
2. ضع الفلاشة بالريسيفر، وادخل على Menu ثم USB Upgrade واضغط OK.
3. انتظر إعادة تشغيل الريسيفر تلقائياً.
4. كود تفعيل السيرفر والباتش: ${currentWaBrand.serverActivationCode}

لأي استفسار أو دعم فني، نحن في خدمتك:
📞 خط الأستاذ سام: 03983010
📱 خط التحويلات المعتمد (Whish / OMT): 71186492

*SAM SAT • Premium Satellite Solutions*`;
    }

    if (waUpdateType === 'channels') {
      return `مرحباً بك أستاذ ${waCustomerName || 'الكريم'}،
تحية طيبة من *SAM SAT*.

إليك رابط تنزيل أحدث ملف قنوات مرتب ومعرب بالترددات الجديدة (نايل سات + هوتبيرد + عربسات) لجهازك *${currentWaBrand.nameAr} (${waModelName})*:

📥 *رابط ملفات القنوات الحديثة:*
${currentWaBrand.channelListUrl}

طريقة التحميل: انقل ملف القنوات بصيغة .sdx أو .bin إلى فلاشة USB وثبته عبر خيار USB بالريسيفر.

📞 للاستفسار: 03983010
SAM SAT • Premium Satellite Solutions`;
    }

    if (waUpdateType === 'sat_frequencies') {
      return `مرحباً بك أستاذ ${waCustomerName || 'الكريم'}،
تحية طيبة من شركة *SAM SAT* لخدمات الستالايت والاشتراكات.

📡 *ترددات القنوات والأقمار المعتمدة في لبنان:*
🔹 *نايل سات (7.0°W):*
- الباقة اللبنانية (MTV, LBCI, الجديد, OTV, تلفزيون لبنان): *12604 عمودي (V) 27500*
- بي إن سبورت المفتوحة والإخبارية: *11258 أفقي (H) 27500*
- باقة MBC HD: *11747 عمودي (V) 27500*
- باقة روتانا سينما: *12054 عمودي (V) 27500*
- أقوى تردد لضبط إشارة النايل سات: *11679 أفقي (H) 27500*

🔹 *هوتبيرد (13.0°E):*
- باقة بولسات واليفن سبورت وكانال بلوس: *11278 عمودي (V) 27500*
- باقة بولسات بريميوم دوري أبطال أوروبا: *11488 أفقي (H) 27500*

🌐 *مواقع الترددات اليومية المعتمدة:*
- موقع فلاي سات: https://www.flysat.com
- موقع كينغ أوف سات: https://en.kingofsat.net

📞 لطلب فني أو صيانة صحون وتمديدات: *03983010*
💳 خط الدفع المعتمد: *71186492*
*SAM SAT • بخدمتكم دائماً*`;
    }

    if (waUpdateType === 'free_cccam') {
      return `مرحباً بك أستاذ ${waCustomerName || 'الكريم'}،
تحية طيبة من شركة *SAM SAT*.

📺 *بيانات سيرفر CCcam تجريبي مجاني للشيرينغ والقنوات المشفرة:*
السيرفر يدعم باقات هوتبيرد (Polsat / Eleven) وأسترا ونايل سات بثبات عالي.

⚙️ *سطر السيسكام (C-Line):*
C: free.cccam-server.net 18500 samsat_test 2026

🔍 *لفحص السيرفر والتأكد أنه متصل أونلاين:*
موقع تيستيوس: http://testious.com

🌐 *مواقع سيرفرات CCcam مجانية يومية متجددة:*
- https://freecccam.org
- https://cccamfree.com
- https://bosscccam.com

💡 *طريقة الإدخال في الريسيفر:*
- عبر الريموت: اضغط F1 + 666 (ستارسات / ميدياستار / تايجر) واختر سيرفر 1 وضع البيانات.
- أو عبر فلاشة USB بملف CCcam.cfg.

💳 لتجديد اشتراكات السيرفرات الرسمية (Forever VIP / Apollo / Alpha):
📱 خط التحويل المعتمد: *71186492*
📞 هاتف الأستاذ سام المباشر: *03983010*
*SAM SAT • بخدمتكم دائماً*`;
    }

    if (waUpdateType === 'local_sat') {
      return `مرحباً بك أستاذ ${waCustomerName || 'الكريم'}،
تحية طيبة من شركة *SAM SAT* (الأستاذ سام).

📡 *جدول ترددات شبكات اللوكال سات (Local Sat) المعتمدة في لبنان:*
⚙️ *قاعدة التيونر واللاقط (+30 MHz Offset):* يتم زيادة 30 ميغاهرتز على التردد لضبط واستقبال حزم الـ 12 تردد المتتابعة بدقة واستقرار كاملين وبدون تكسير:

1️⃣ *Cablevision (كيبل فيجن):*
• التردد الأساسي: *11960 عمودي (V) 30000*
• التردد بعد زيادة +30: *11990 عمودي (V) 30000* (12 تردد)

2️⃣ *Econet (إيكونت / أكونت):*
• التردد الأساسي: *12120 أفقي (H) 31250*
• التردد بعد زيادة +30: *12150 أفقي (H) 31250* (12 تردد)

3️⃣ *CitySat (سيتي سات):*
• التردد الأساسي: *11740 عمودي (V) 30000*
• التردد بعد زيادة +30: *11770 عمودي (V) 30000* (12 تردد)

4️⃣ *Home Sat (هوم سات):*
• التردد الأساسي: *12620 عمودي (V) 30000*
• التردد بعد زيادة +30: *12650 عمودي (V) 30000* (12 تردد)

5️⃣ *Digest (دايجست / ديجي سات):*
• التردد الأساسي: *12100 عمودي (V) 30000*
• التردد بعد زيادة +30: *12130 عمودي (V) 30000* (12 تردد)

💡 لتثبيت وتوجيه صحون اللوكال سات أو برمجة التيونر على ريسيفرات ستارسات، ماجيك، سيناتور، ميدياستار، وتايجر:
📞 هاتف الأستاذ سام المباشر: *03983010*
💳 خط الدفع والتحويلات المعتمد (Whish / OMT): *71186492*
*SAM SAT • بخدمتكم دائماً*`;
    }

    return `مرحباً بك أستاذ ${waCustomerName || 'الكريم'}،
تحية طيبة من شركة *SAM SAT*.

نود إعلامك بإمكانية تجديد وتحديث سيرفر الشيرينغ و IPTV لجهازك *${currentWaBrand.nameAr}* (*${currentWaBrand.defaultServers[0]}*).

💳 *بيانات الدفع والتحويل المعتمدة (Whish Money / OMT):*
📱 رقم التحويل: *71186492*

فور إرسال الإشعار يتم تفعيل الاشتراك فورياً لجهازك.
📞 خط التواصل المباشر: 03983010
*SAM SAT • بخدمتكم دائماً*`;
  };

  const handleSendWhatsAppToCustomer = () => {
    const text = encodeURIComponent(generatedWhatsAppMessage());
    let cleanPhone = waCustomerPhone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '961' + cleanPhone.substring(1);
    if (!cleanPhone.startsWith('961') && cleanPhone.length === 8) cleanPhone = '961' + cleanPhone;

    const url = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${text}`
      : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Banner: Brand Header */}
      <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5 shadow-2xl backdrop-blur-md relative overflow-hidden bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-sky-950/30">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <SamSatLogo size="md" showDownloadOnHover={true} withGlow={true} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  SAM SAT CERTIFIED HARDWARE
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">•</span>
                <span className="text-xs text-emerald-400 font-mono hidden sm:inline">5 APPROVED BRANDS</span>
              </div>
              <h1 className="text-xl font-black text-white mt-1 flex items-center gap-2">
                <span>{isAr ? 'الريسيفرات، مواقع الأقمار، ترددات المحطات و CCcam' : 'Receivers, Satellite Frequencies & Free CCcam'}</span>
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                {isAr 
                  ? 'منظومة متكاملة: الريسيفرات المعتمدة (ماجيك، ستارسات، سيناتور، ميدياستار، تايجر) • مواقع الأقمار والترددات (FlySat, KingOfSat, LyngSat) • سيرفرات سيسكام مجانية وفاحص الأسطر (Testious).' 
                  : 'Complete platform: Approved receivers, live satellite frequency charts, dish alignment, and free CCcam test servers.'}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block font-mono">{isAr ? 'الماركات' : 'BRANDS'}</span>
              <span className="text-base font-bold text-amber-300 font-mono">5</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block font-mono">{isAr ? 'مواقع الأقمار' : 'SATELLITES'}</span>
              <span className="text-base font-bold text-sky-400 font-mono">7+</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block font-mono">{isAr ? 'سيرفرات سيسكام' : 'CCCAM'}</span>
              <span className="text-base font-bold text-emerald-400 font-mono">مجانية</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block font-mono">{isAr ? 'أجهزة الزبائن' : 'DEVICES'}</span>
              <span className="text-base font-bold text-indigo-400 font-mono">{devices.length}</span>
            </div>
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => setViewMode('catalog')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'catalog'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>{isAr ? 'الريسيفرات ومواقع التحديث (5)' : 'Receivers & Updates (5)'}</span>
          </button>

          <button
            onClick={() => setViewMode('satellites')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'satellites'
                ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-sky-400" />
            <span>{isAr ? 'مواقع الأقمار وترددات المحطات' : 'Satellite Portals & Frequencies'}</span>
          </button>

          <button
            onClick={() => setViewMode('localsat')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'localsat'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/25 scale-[1.02]'
                : 'bg-slate-800/70 text-amber-300 hover:bg-slate-800 hover:text-white border border-amber-500/30'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? '📡 اللوكال سات وقاعدة +30 (Cablevision, Econet...)' : 'Local Sat & +30 (12 TPs)'}</span>
          </button>

          <button
            onClick={() => setViewMode('cccam')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'cccam'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isAr ? 'سيرفرات CCcam المجانية وفاحص الأسطر' : 'Free CCcam & Line Tester'}</span>
          </button>

          <button
            onClick={() => setViewMode('whatsapp')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'whatsapp'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isAr ? 'إرسال للزبون عبر واتساب' : 'Dispatch via WhatsApp'}</span>
          </button>

          <button
            onClick={() => setViewMode('devices')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'devices'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isAr ? `سجل أجهزة الزبائن (${devices.length})` : `Customer Devices (${devices.length})`}</span>
          </button>

          <button
            onClick={() => setViewMode('guide')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'guide'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-purple-300" />
            <span>{isAr ? 'دليل أكواد التفعيل والتوجيه' : 'Activation Codes & Guide'}</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: CATALOG OF APPROVED RECEIVERS */}
      {viewMode === 'catalog' && (
        <div className="space-y-5">
          {/* Filter Bar & Search */}
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Brand Pills */}
            <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
              <button
                onClick={() => setActiveBrandFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeBrandFilter === 'all'
                    ? 'bg-slate-100 text-slate-950 shadow'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {isAr ? 'كافة الماركات (5)' : 'All Brands (5)'}
              </button>

              {APPROVED_RECEIVERS.map(b => (
                <button
                  key={b.brandKey}
                  onClick={() => setActiveBrandFilter(b.brandKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    activeBrandFilter === b.brandKey
                      ? 'bg-amber-500 text-slate-950 font-black shadow'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{b.nameAr}</span>
                  <span className="text-[10px] opacity-75">({b.nameEn})</span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute top-2.5 right-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث عن موديل، سيرفر، أو ماركة...' : 'Search model, server...'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Grid of 5 Approved Receivers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredReceivers.map(receiver => (
              <div 
                key={receiver.id}
                className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-sm relative overflow-hidden flex flex-col justify-between hover:border-amber-500/40 transition-all group"
              >
                {/* Header of Brand Card */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-extrabold text-white group-hover:text-amber-300 transition-colors">
                          {receiver.nameAr}
                        </h2>
                        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                          {receiver.nameEn}
                        </span>
                        <span className="p-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold">
                          معتمد لدى سام
                        </span>
                      </div>
                      <div className={`mt-1.5 inline-block text-[11px] font-medium border rounded-full px-2.5 py-0.5 ${receiver.badgeColor}`}>
                        {receiver.badge}
                      </div>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-amber-400 shadow-md group-hover:scale-105 transition-transform">
                      <Tv className="w-6 h-6" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {receiver.description}
                  </p>

                  {/* Server Badges */}
                  <div className="mb-4 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                    <div className="text-[11px] font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5 text-sky-400" />
                      <span>{isAr ? 'السيرفرات والاشتراكات المدمجة المعتمدة:' : 'Supported Servers:'}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {receiver.defaultServers.map((srv, idx) => (
                        <span 
                          key={idx}
                          className="text-[11px] font-mono font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20 px-2 py-0.5 rounded-md"
                        >
                          {srv}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 text-[11px] text-amber-300/90 font-mono flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-amber-400" />
                      <span>{isAr ? 'كود تفعيل السيرفر والباتش:' : 'Activation:'} <strong>{receiver.serverActivationCode}</strong></span>
                    </div>
                  </div>

                  {/* Top Models list */}
                  <div className="space-y-2 mb-5">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>{isAr ? 'أشهر الموديلات المعتمدة:' : 'Top Approved Models:'}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{receiver.topModels.length} {isAr ? 'موديلات' : 'models'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {receiver.topModels.map((m, idx) => (
                        <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-xs hover:border-slate-700 transition-colors">
                          <div className="flex items-center justify-between font-bold text-white mb-0.5">
                            <span className="truncate">{m.model}</span>
                            <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                              {m.resolution}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">{m.server}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Direct Action Links & Update Portals */}
                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-amber-300">
                      <Download className="w-3.5 h-3.5" />
                      <span>{isAr ? 'مواقع التحديث والسوفتوير الرسمية:' : 'Official Update Portals:'}</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">100% VERIFIED</span>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a
                      href={receiver.officialUpdateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isAr ? 'الموقع الرسمي للتحديث' : 'Official Updates'}</span>
                      <ExternalLink className="w-3 h-3 opacity-75" />
                    </a>

                    <a
                      href={receiver.backupUpdateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <FileCode2 className="w-3.5 h-3.5 text-sky-400" />
                      <span>{isAr ? 'مركز السوفتوير واللودر' : 'Firmware Archive'}</span>
                      <ExternalLink className="w-3 h-3 opacity-75" />
                    </a>
                  </div>

                  {/* Secondary Links: Copy, WhatsApp, Channel List, Details */}
                  <div className="flex items-center justify-between gap-2 pt-1 flex-wrap text-xs">
                    <button
                      onClick={() => copyToClipboard(receiver.officialUpdateUrl, receiver.id)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-slate-800 transition-colors font-mono text-[11px]"
                    >
                      {copiedUrl === receiver.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">{isAr ? 'تم نسخ الرابط' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isAr ? 'نسخ رابط التحديث' : 'Copy URL'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setWaSelectedBrand(receiver.brandKey);
                        setWaModelName(receiver.topModels[0].model);
                        setViewMode('whatsapp');
                      }}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-emerald-950/40 border border-emerald-500/20 transition-colors font-mono text-[11px]"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إرسال للزبون عبر واتساب' : 'WhatsApp Client'}</span>
                    </button>

                    <button
                      onClick={() => setSelectedReceiver(receiver)}
                      className="text-sky-400 hover:text-sky-300 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-sky-950/40 border border-sky-500/20 transition-colors font-mono text-[11px]"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{isAr ? 'خطوات التحديث' : 'Instructions'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: SATELLITE WEBSITES & LIVE FREQUENCIES */}
      {viewMode === 'satellites' && (
        <SatellitesView lang={lang} />
      )}

      {/* VIEW: LEBANESE LOCAL SAT & +30 OFFSET */}
      {viewMode === 'localsat' && (
        <LocalSatView lang={lang} />
      )}

      {/* VIEW: FREE CCCAM WEBSITES & LINE GENERATOR */}
      {viewMode === 'cccam' && (
        <CccamView lang={lang} />
      )}

      {/* VIEW: WHATSAPP UPDATE DISPATCHER */}
      {viewMode === 'whatsapp' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls form */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'توليد رسالة التحديث للزبون عبر الواتساب' : 'WhatsApp Update Message Builder'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr ? 'إرسال روابط التحديث والسوفتوير المعتمدة مع اسم سام وأرقام الخدمة' : 'Send official links with Sam contact'}
                </p>
              </div>
            </div>

            {/* Customer Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isAr ? 'اسم الزبون الكريم:' : 'Customer Name:'}
                </label>
                <input
                  type="text"
                  value={waCustomerName}
                  onChange={(e) => setWaCustomerName(e.target.value)}
                  placeholder="مثال: أستاذ فادي نجم"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isAr ? 'رقم هاتف الزبون (واتساب):' : 'WhatsApp Phone:'}
                </label>
                <input
                  type="text"
                  value={waCustomerPhone}
                  onChange={(e) => setWaCustomerPhone(e.target.value)}
                  placeholder="مثال: 70891234 أو 03456789"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isAr ? 'الماركة المعتمدة:' : 'Approved Brand:'}
                </label>
                <select
                  value={waSelectedBrand}
                  onChange={(e) => {
                    setWaSelectedBrand(e.target.value);
                    const b = APPROVED_RECEIVERS.find(x => x.brandKey === e.target.value);
                    if (b) setWaModelName(b.topModels[0].model);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {APPROVED_RECEIVERS.map(b => (
                    <option key={b.brandKey} value={b.brandKey}>
                      {b.nameAr} ({b.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isAr ? 'موديل الريسيفر:' : 'Receiver Model:'}
                </label>
                <input
                  type="text"
                  value={waModelName}
                  onChange={(e) => setWaModelName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isAr ? 'نوع الرسالة المطلوبة:' : 'Message Type:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setWaUpdateType('firmware')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-colors ${
                      waUpdateType === 'firmware'
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    {isAr ? 'سوفتوير وتحديث' : 'Firmware'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setWaUpdateType('channels')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-colors ${
                      waUpdateType === 'channels'
                        ? 'bg-sky-500 text-slate-950 shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    {isAr ? 'ملف قنوات' : 'Channels'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setWaUpdateType('sat_frequencies')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-colors ${
                      waUpdateType === 'sat_frequencies'
                        ? 'bg-blue-500 text-white shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    {isAr ? 'ترددات الأقمار' : 'Frequencies'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setWaUpdateType('local_sat')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-colors ${
                      waUpdateType === 'local_sat'
                        ? 'bg-amber-500 text-slate-950 font-black shadow'
                        : 'bg-slate-800 text-amber-300 hover:bg-slate-750 border border-amber-500/30'
                    }`}
                  >
                    {isAr ? '📡 لوكال سات (+30)' : 'Local Sat +30'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setWaUpdateType('free_cccam')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-colors ${
                      waUpdateType === 'free_cccam'
                        ? 'bg-teal-500 text-slate-950 shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    {isAr ? 'سيرفر CCcam' : 'CCcam'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setWaUpdateType('server_renewal')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-colors ${
                      waUpdateType === 'server_renewal'
                        ? 'bg-emerald-500 text-slate-950 shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    {isAr ? 'تجديد السيرفر' : 'Renewal'}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleSendWhatsAppToCustomer}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
              >
                <Send className="w-4 h-4" />
                <span>{isAr ? 'فتح الواتساب وإرسال الرسالة فوراً' : 'Open WhatsApp & Send'}</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedWhatsAppMessage());
                  setWaCopied(true);
                  setTimeout(() => setWaCopied(false), 2500);
                }}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
              >
                {waCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{waCopied ? (isAr ? 'تم نسخ نص الرسالة' : 'Copied!') : (isAr ? 'نسخ نص الرسالة' : 'Copy Message Text')}</span>
              </button>
            </div>
          </div>

          {/* Live Preview Box (WhatsApp Style) */}
          <div className="lg:col-span-7 bg-[#0b141a] border border-[#202c33] rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#202c33] pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                    SAM
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">SAM SAT • {currentWaBrand.nameAr} Update</div>
                    <div className="text-[10px] text-emerald-400 font-mono">متصل الآن • خدمة عملاء سام</div>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                  {isAr ? 'معاينة واتساب' : 'WhatsApp Preview'}
                </span>
              </div>

              {/* Chat Bubble */}
              <div className="bg-[#005c4b] text-[#e9edef] rounded-2xl rounded-tr-none p-4 text-xs leading-relaxed whitespace-pre-wrap font-sans shadow-md border border-[#005c4b]/50">
                {generatedWhatsAppMessage()}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#202c33] flex items-center justify-between text-[11px] text-slate-400">
              <span>{isAr ? 'صادرة من نظام سمسات لخدمة الأستاذ سام' : 'Generated by Samsat for Sam'}</span>
              <span className="font-mono text-emerald-400">71186492</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: CUSTOMER DEVICES TRACKER */}
      {viewMode === 'devices' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-900/50 border border-slate-800/50 rounded-2xl p-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>{isAr ? 'سجل أجهزة الريسيفر لدى الزبائن ومتابعة التحديثات' : 'Customer Devices & Firmware Tracker'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isAr ? 'تتبع أجهزة الزبائن، موديلاتها، السيرفر وتاريخ انتهائه، لسهولة التجديد والصيانة' : 'Track installed receivers and subscriptions'}
              </p>
            </div>

            <button
              onClick={() => setShowAddDeviceModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'تسجيل جهاز زبون جديد' : 'Register Customer Device'}</span>
            </button>
          </div>

          {/* Table of Customer Devices */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">{isAr ? 'اسم الزبون' : 'Customer'}</th>
                    <th className="px-4 py-3">{isAr ? 'الهاتف' : 'Phone'}</th>
                    <th className="px-4 py-3">{isAr ? 'الماركة والموديل' : 'Brand & Model'}</th>
                    <th className="px-4 py-3">{isAr ? 'السيرفر المعتمد' : 'Server'}</th>
                    <th className="px-4 py-3 text-center">{isAr ? 'آخر تحديث' : 'Last Update'}</th>
                    <th className="px-4 py-3 text-center">{isAr ? 'انتهاء السيرفر' : 'Server Expiry'}</th>
                    <th className="px-4 py-3 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {devices.map(device => {
                    const brandObj = APPROVED_RECEIVERS.find(b => b.brandKey === device.brand);
                    return (
                      <tr key={device.id} className="hover:bg-slate-850/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">
                          {device.customerName}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-300">
                          {device.customerPhone || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-amber-300">{device.model}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{brandObj?.nameAr} ({brandObj?.nameEn})</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-sky-500/10 text-sky-300 border border-sky-500/20 px-2 py-0.5 rounded text-[11px] font-mono">
                            {device.serverType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-slate-400">
                          {device.lastUpdatedDate || '—'}
                        </td>
                        <td className="px-4 py-3 text-center font-mono">
                          {device.serverExpireDate ? (
                            <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              {device.serverExpireDate}
                            </span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setWaCustomerName(device.customerName);
                                setWaCustomerPhone(device.customerPhone);
                                setWaSelectedBrand(device.brand);
                                setWaModelName(device.model);
                                setViewMode('whatsapp');
                              }}
                              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                              title={isAr ? 'إرسال رابط التحديث عبر واتساب' : 'Send update via WhatsApp'}
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteDevice(device.id)}
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                              title={isAr ? 'حذف من السجل' : 'Delete'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: QUICK ACTIVATION CODES & TROUBLESHOOTING GUIDE */}
      {viewMode === 'guide' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Quick Activation Shortcuts */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm border-b border-slate-800 pb-2.5">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'أكواد تفعيل الباتش والسيرفر للماركات الـ 5' : 'Activation Codes for the 5 Brands'}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between">
                <div>
                  <strong className="text-white block text-sm">ستار سات (StarSat)</strong>
                  <span className="text-slate-400">الضغط على زر <strong>F1 + 000</strong> لتفعيل الباتش (Enable Patch)، ثم <strong>F1 + 111</strong> لاختيار الإنترنت، ثم <strong>F1 + 666</strong> لإعدادات السيرفر 40.</span>
                </div>
                <span className="px-2 py-1 bg-amber-500/10 text-amber-300 font-mono font-bold rounded border border-amber-500/30">
                  F1 + 000
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between">
                <div>
                  <strong className="text-white block text-sm">ميديا ستار (MediaStar)</strong>
                  <span className="text-slate-400">الوقوف على أي قناة ثم <strong>F1 + 000</strong> لتفعيل الباتش، ثم <strong>F1 + 111</strong> لاختيار Enable Internet، ثم <strong>F1 + 666</strong> للسيرفر.</span>
                </div>
                <span className="px-2 py-1 bg-sky-500/10 text-sky-300 font-mono font-bold rounded border border-sky-500/30">
                  F1 + 000
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between">
                <div>
                  <strong className="text-white block text-sm">سيناتور (Senator)</strong>
                  <span className="text-slate-400">الدخول إلى Menu ثم الضبط ثم إعدادات السيرفر، أو الضغط على <strong>F1 + 111</strong> أو الرقم السري <strong>8899</strong> لتشغيل سيرفر ألفا وفوريفر.</span>
                </div>
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-300 font-mono font-bold rounded border border-emerald-500/30">
                  8899 / F1
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between">
                <div>
                  <strong className="text-white block text-sm">ماجيك (Magic)</strong>
                  <span className="text-slate-400">الضغط على <strong>8899</strong> أو <strong>F1 + 000</strong> من الريموت لتفعيل وظائف الشيرينغ وإظهار خانة السيرفر.</span>
                </div>
                <span className="px-2 py-1 bg-purple-500/10 text-purple-300 font-mono font-bold rounded border border-purple-500/30">
                  8899
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between">
                <div>
                  <strong className="text-white block text-sm">تايجر (Tiger)</strong>
                  <span className="text-slate-400">الضغط على <strong>F1 + 000</strong> لتفعيل الباتش، ثم <strong>F1 + 666</strong> لإعدادات سيرفر فوريفر وتايجر شيرينغ.</span>
                </div>
                <span className="px-2 py-1 bg-rose-500/10 text-rose-300 font-mono font-bold rounded border border-rose-500/30">
                  F1 + 000
                </span>
              </div>
            </div>
          </div>

          {/* Golden Rules for Firmware Updates */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm border-b border-slate-800 pb-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'قواعد سام الذهبية لتحديث الريسيفر بأمان تام' : "Sam's Golden Firmware Rules"}</span>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">فرمتة فلاشة USB بصيغة FAT32</strong>
                  <span>تأكد دائماً أن الفلاش ميموري مفرمتة بنظام FAT32 لضمان قراءة الريسيفر لملف السوفتوير بدون أخطاء قراءة.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">فك الضغط عن الملف (.bin)</strong>
                  <span>الملفات المحملة من المواقع الرسمية تأتي مضغوطة (.rar أو .zip). يجب فك الضغط وأخذ الملف الذي ينتهي بـ .bin حصراً.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-rose-300">ممنوع فصل الكهرباء أثناء التحميل</strong>
                  <span>فصل التيار الكهربائي أثناء شريط التحديث قد يسبب تلف الفلاشة الداخلية (Boot Error). انتظر حتى يعيد الجهاز التشغيل بمفرده.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">حفظ نسخة من القنوات (Backup Channels)</strong>
                  <span>قبل عمل ضبط المصنع، ادخل إلى USB واحفظ ملف القنوات لتتمكن من إعادته للزبون في ثوانٍ معدودة.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: STEP-BY-STEP UPDATE GUIDE FOR SELECTED RECEIVER */}
      {selectedReceiver && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-5 text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Tv className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isAr ? `طريقة تحديث ريسيفر ${selectedReceiver.nameAr}` : `How to update ${selectedReceiver.nameEn}`}
                  </h3>
                  <div className="text-xs text-amber-300 font-mono">
                    {selectedReceiver.officialUpdateUrl}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedReceiver(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Step by step list */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-300">
                {isAr ? 'الخطوات المعتمدة من شركة SAM SAT:' : 'Approved Steps:'}
              </div>
              {selectedReceiver.updateMethodSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="text-slate-300 leading-relaxed">{step}</span>
                </div>
              ))}
            </div>

            {/* Quick Link Out */}
            <div className="pt-2 flex items-center justify-between gap-3 flex-wrap">
              <a
                href={selectedReceiver.officialUpdateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Download className="w-4 h-4" />
                <span>{isAr ? 'فتح موقع التحديث الرسمي الآن' : 'Open Update Site'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setSelectedReceiver(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD CUSTOMER DEVICE */}
      {showAddDeviceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddDevice} className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'تسجيل جهاز ريسيفر لزبون جديد' : 'Register Customer Receiver Device'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddDeviceModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">{isAr ? 'اسم الزبون:' : 'Customer Name:'}</label>
                <input
                  type="text"
                  required
                  value={newDevice.customerName}
                  onChange={(e) => setNewDevice({ ...newDevice, customerName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  placeholder="مثال: جهاد منصور"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">{isAr ? 'رقم الهاتف:' : 'Phone:'}</label>
                  <input
                    type="text"
                    value={newDevice.customerPhone}
                    onChange={(e) => setNewDevice({ ...newDevice, customerPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                    placeholder="71123456"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">{isAr ? 'الماركة المعتمدة:' : 'Brand:'}</label>
                  <select
                    value={newDevice.brand}
                    onChange={(e) => setNewDevice({ ...newDevice, brand: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    {APPROVED_RECEIVERS.map(b => (
                      <option key={b.brandKey} value={b.brandKey}>
                        {b.nameAr} ({b.nameEn})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">{isAr ? 'الموديل الدقيق:' : 'Model:'}</label>
                  <input
                    type="text"
                    value={newDevice.model}
                    onChange={(e) => setNewDevice({ ...newDevice, model: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                    placeholder="SR-200HD 4K Extreme"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">{isAr ? 'نوع السيرفر:' : 'Server:'}</label>
                  <input
                    type="text"
                    value={newDevice.serverType}
                    onChange={(e) => setNewDevice({ ...newDevice, serverType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                    placeholder="Forever Pro VIP"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">{isAr ? 'تاريخ التحديث:' : 'Last Updated:'}</label>
                  <input
                    type="date"
                    value={newDevice.lastUpdatedDate}
                    onChange={(e) => setNewDevice({ ...newDevice, lastUpdatedDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">{isAr ? 'تاريخ انتهاء السيرفر:' : 'Server Expiry:'}</label>
                  <input
                    type="date"
                    value={newDevice.serverExpireDate}
                    onChange={(e) => setNewDevice({ ...newDevice, serverExpireDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">{isAr ? 'ملاحظات الصيانة والتشغيل:' : 'Notes:'}</label>
                <input
                  type="text"
                  value={newDevice.notes}
                  onChange={(e) => setNewDevice({ ...newDevice, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  placeholder="ملاحظات حول الدايسك، الأقمار، أو نوع الاشتراك..."
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddDeviceModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow"
              >
                {isAr ? 'حفظ الجهاز في السجل' : 'Save Device'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
