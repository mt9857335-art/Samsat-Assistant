import React, { useState } from 'react';
import { 
  Users, 
  Phone, 
  Calendar, 
  MapPin, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  RefreshCw, 
  Send, 
  DollarSign, 
  Filter, 
  Sparkles, 
  X, 
  CreditCard, 
  MessageSquare,
  Flame,
  Tv,
  Radio,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { CustomerSubscription } from '../types';
import { MasterSubscriptionsCard } from './MasterSubscriptionsCard';
import { PRESET_SUBSCRIPTION_PLANS } from '../data/subscriptionsData';

interface SubscriptionsSectionProps {
  subscriptions: CustomerSubscription[];
  onAddSubscription: (sub: CustomerSubscription) => void;
  onUpdateSubscription: (sub: CustomerSubscription) => void;
  onDeleteSubscription: (id: string) => void;
  onOpenMonthlyReport?: () => void;
  lang: 'ar' | 'en';
}

export const SubscriptionsSection: React.FC<SubscriptionsSectionProps> = ({
  subscriptions,
  onAddSubscription,
  onUpdateSubscription,
  onDeleteSubscription,
  onOpenMonthlyReport,
  lang,
}) => {
  const isAr = lang === 'ar';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expiring' | 'expired' | 'unpaid'>('all');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>('all');
  const [presetModalCategory, setPresetModalCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSub, setEditingSub] = useState<CustomerSubscription | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [serviceType, setServiceType] = useState('اشتراك Forever VIP 2 سنة كاملة (شيرينغ بين سبورت والأقمار)');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 365);
    return d.toISOString().split('T')[0];
  });
  const [price, setPrice] = useState<number>(75);
  const [currency, setCurrency] = useState<'USD' | 'LBP'>('USD');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid' | 'pending'>('paid');
  const [notes, setNotes] = useState('');

  // Handle quick client addition triggered from MasterSubscriptionsCard
  const handleQuickAddClientForService = (serviceName: string, servicePrice: number, durationDays: number) => {
    setName('');
    setPhone('');
    setAddress('');
    setServiceType(serviceName);
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    const d = new Date();
    d.setDate(d.getDate() + durationDays);
    setEndDate(d.toISOString().split('T')[0]);
    setPrice(servicePrice);
    setCurrency('USD');
    setPaymentStatus('paid');
    setNotes('');
    setEditingSub(null);
    setShowAddModal(true);
  };

  const handleApplyPreset = (preset: typeof PRESET_SUBSCRIPTION_PLANS[0]) => {
    setServiceType(preset.name);
    setPrice(preset.price);
    const start = new Date(startDate || new Date());
    const end = new Date(start);
    end.setDate(end.getDate() + preset.durationDays);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const handleOpenAdd = () => {
    setName('');
    setPhone('');
    setAddress('');
    setServiceType('اشتراك Forever VIP 2 سنة كاملة (شيرينغ بين سبورت والأقمار)');
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    const d = new Date();
    d.setDate(d.getDate() + 365);
    setEndDate(d.toISOString().split('T')[0]);
    setPrice(75);
    setCurrency('USD');
    setPaymentStatus('paid');
    setNotes('');
    setEditingSub(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (sub: CustomerSubscription) => {
    setEditingSub(sub);
    setName(sub.name);
    setPhone(sub.phone);
    setAddress(sub.address);
    setServiceType(sub.serviceType);
    setStartDate(sub.startDate);
    setEndDate(sub.endDate);
    setPrice(sub.price);
    setCurrency(sub.currency);
    setPaymentStatus(sub.paymentStatus);
    setNotes(sub.notes || '');
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingSub) {
      const updated: CustomerSubscription = {
        ...editingSub,
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        serviceType: serviceType.trim(),
        startDate,
        endDate,
        price: Number(price) || 0,
        currency,
        paymentStatus,
        notes: notes.trim(),
      };
      onUpdateSubscription(updated);
    } else {
      const newSub: CustomerSubscription = {
        id: `sub-${Date.now()}`,
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        serviceType: serviceType.trim(),
        startDate,
        endDate,
        price: Number(price) || 0,
        currency,
        paymentStatus,
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
      };
      onAddSubscription(newSub);
    }

    setShowAddModal(false);
  };

  // Quick 1-month renew
  const handleQuickRenew = (sub: CustomerSubscription) => {
    const currentEnd = new Date(sub.endDate);
    const baseDate = isNaN(currentEnd.getTime()) || currentEnd < new Date() ? new Date() : currentEnd;
    const newEnd = new Date(baseDate);
    newEnd.setDate(newEnd.getDate() + 30);

    const updated: CustomerSubscription = {
      ...sub,
      startDate: new Date().toISOString().split('T')[0],
      endDate: newEnd.toISOString().split('T')[0],
      paymentStatus: 'paid',
    };
    onUpdateSubscription(updated);
  };

  // Helper to calculate days remaining
  const getSubscriptionStatus = (endDateStr: string) => {
    const end = new Date(endDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'expired', days: Math.abs(diffDays), label: isAr ? `منتهي منذ ${Math.abs(diffDays)} يوم` : `Expired ${Math.abs(diffDays)}d ago` };
    } else if (diffDays <= 4) {
      return { status: 'expiring', days: diffDays, label: isAr ? `ينتهي خلال ${diffDays} أيام` : `Expires in ${diffDays}d` };
    } else {
      return { status: 'active', days: diffDays, label: isAr ? `نشط (متبقي ${diffDays} يوم)` : `Active (${diffDays}d left)` };
    }
  };

  // Send WhatsApp reminder
  const handleSendWhatsAppReminder = (sub: CustomerSubscription) => {
    const cleanPhone = sub.phone.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('961') ? cleanPhone : `961${cleanPhone.replace(/^0/, '')}`;
    
    const message = isAr
      ? `مرحباً ${sub.name} المحترم،\nنود تذكيركم من طرف الأستاذ سام بأن اشتراككم (${sub.serviceType}) ينتهي بتاريخ: ${sub.endDate}.\nلتجديد الاشتراك وتفادي الانقطاع، يرجى تحويل المبلغ (${sub.price}${sub.currency === 'USD' ? '$' : ' ل.ل'}) على رقم التحويل المعتمد:\n📱 71186492 (Whish Money / OMT)\n\nشكراً لتعاملكم معنا ودمتم بخير.`
      : `Dear ${sub.name},\nThis is a reminder regarding your subscription (${sub.serviceType}) ending on ${sub.endDate}.\nTo renew, please transfer the fee (${sub.price}${sub.currency}) to our official payment line:\n📱 71186492\n\nThank you, Sam Management.`;

    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Filter subscriptions
  const filteredSubs = subscriptions.filter(sub => {
    const matchesSearch = 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.phone.includes(searchTerm) ||
      sub.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.serviceType.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    const { status } = getSubscriptionStatus(sub.endDate);

    if (statusFilter === 'active' && status !== 'active') return false;
    if (statusFilter === 'expiring' && status !== 'expiring') return false;
    if (statusFilter === 'expired' && status !== 'expired') return false;
    if (statusFilter === 'unpaid' && sub.paymentStatus === 'paid') return false;

    // Service category filter
    const lowerType = sub.serviceType.toLowerCase();
    if (serviceCategoryFilter === 'vip2') {
      const isVip2 = lowerType.includes('vip') || sub.serviceType.includes('فوريفر') || lowerType.includes('forever');
      if (!isVip2) return false;
    } else if (serviceCategoryFilter === 'shamna') {
      const isShamna = sub.serviceType.includes('شامنا') || lowerType.includes('shamna');
      if (!isShamna) return false;
    } else if (serviceCategoryFilter === 'marvel') {
      const isMarvel = sub.serviceType.includes('مارفل') || lowerType.includes('marvel');
      if (!isMarvel) return false;
    } else if (serviceCategoryFilter === 'dh') {
      const isDh = sub.serviceType.includes('دي إتش') || lowerType.includes('dh');
      if (!isDh) return false;
    } else if (serviceCategoryFilter === 'magic') {
      const isMagic = sub.serviceType.includes('ماجيك') || lowerType.includes('magic');
      if (!isMagic) return false;
    } else if (serviceCategoryFilter === 'telecom') {
      const isTel = sub.serviceType.includes('ألفا') || sub.serviceType.includes('تاتش') || sub.serviceType.includes('إنترنت') || lowerType.includes('alfa') || lowerType.includes('touch');
      if (!isTel) return false;
    }

    return true;
  });

  // Calculate statistics
  const totalSubscribers = subscriptions.length;
  const activeCount = subscriptions.filter(s => getSubscriptionStatus(s.endDate).status === 'active').length;
  const expiringCount = subscriptions.filter(s => getSubscriptionStatus(s.endDate).status === 'expiring').length;
  const expiredCount = subscriptions.filter(s => getSubscriptionStatus(s.endDate).status === 'expired').length;
  const unpaidCount = subscriptions.filter(s => s.paymentStatus !== 'paid').length;
  const totalRevenue = subscriptions.reduce((sum, s) => sum + (s.currency === 'USD' ? s.price : s.price / 89500), 0);

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* SAM'S MASTER SUBSCRIPTIONS & LICENSES CARD */}
      <MasterSubscriptionsCard 
        lang={lang} 
        onQuickAddClientForService={handleQuickAddClientForService}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-sky-500/20 rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">
                {isAr ? 'سجل الزبائن والاشتراكات لسام' : "Sam's Client Subscriptions Record"}
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              {isAr 
                ? 'حفظ وتوثيق أسماء الزبائن، أرقام الهواتف، العناوين، وتواريخ بدء وانتهاء الاشتراكات مع التذكير التلقائي برقم الدفع 71186492.' 
                : 'Customer records with phone, address, start/end subscription dates, and automatic renewal alerts.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenMonthlyReport && (
              <button
                onClick={onOpenMonthlyReport}
                className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-bold rounded-xl text-xs transition-colors whitespace-nowrap font-mono"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isAr ? 'التقرير الشهري والواتساب' : 'Monthly Report & WhatsApp'}</span>
              </button>
            )}

            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-sky-500/20 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة زبون / اشتراك جديد' : 'Add New Client / Subscription'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">{isAr ? 'إجمالي الزبائن' : 'Total Clients'}</span>
            <span className="text-lg font-bold font-mono text-white">{totalSubscribers}</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-emerald-500/20">
            <span className="text-[10px] text-emerald-400 block font-mono">{isAr ? 'اشتراكات نشطة' : 'Active'}</span>
            <span className="text-lg font-bold font-mono text-emerald-400">{activeCount}</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-amber-500/20">
            <span className="text-[10px] text-amber-400 block font-mono">{isAr ? 'شارفت على الانتهاء' : 'Expiring Soon'}</span>
            <span className="text-lg font-bold font-mono text-amber-400">{expiringCount}</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-red-500/20">
            <span className="text-[10px] text-red-400 block font-mono">{isAr ? 'اشتراكات منتهية' : 'Expired'}</span>
            <span className="text-lg font-bold font-mono text-red-400">{expiredCount}</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-sky-500/20 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-sky-400 block font-mono">{isAr ? 'الدخل الشهري المتوقع' : 'Expected Revenue'}</span>
            <span className="text-lg font-bold font-mono text-sky-400">${totalRevenue.toFixed(0)}</span>
          </div>
        </div>
      </div>

      {/* Official Payment Reminder Banner */}
      <div className="bg-slate-900/60 border border-emerald-500/30 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-emerald-400">
          <CreditCard className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300">
            {isAr ? 'رقم التحويل المعتمد للزبائن في رسائل التذكير: ' : 'Official client payment line for renewal messages: '}
            <strong className="text-emerald-400 font-mono text-sm px-1.5 py-0.5 bg-emerald-500/10 rounded">71186492</strong>
            <span className="text-[11px] text-slate-400"> (Whish / OMT / Cash)</span>
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          {isAr ? 'إرسال عبر واتساب سمسات: 03983010' : 'Dispatched via Samsat line: 03983010'}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isAr ? 'بحث باسم الزبون، رقم التلفون، العنوان، أو نوع الاشتراك...' : 'Search by name, phone, address, or service...'}
            className="w-full bg-slate-950/70 border border-slate-700/60 rounded-xl pl-4 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
              statusFilter === 'all' ? 'bg-slate-700 text-white font-bold' : 'bg-slate-950/50 text-slate-400 hover:text-white'
            }`}
          >
            {isAr ? 'الكل' : 'All'} ({subscriptions.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
              statusFilter === 'active' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-950/50 text-emerald-400 hover:bg-emerald-500/10'
            }`}
          >
            {isAr ? 'النشطة' : 'Active'} ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter('expiring')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
              statusFilter === 'expiring' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-950/50 text-amber-400 hover:bg-amber-500/10'
            }`}
          >
            {isAr ? 'قرب الانتهاء' : 'Expiring Soon'} ({expiringCount})
          </button>
          <button
            onClick={() => setStatusFilter('expired')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
              statusFilter === 'expired' ? 'bg-red-500 text-white font-bold' : 'bg-slate-950/50 text-red-400 hover:bg-red-500/10'
            }`}
          >
            {isAr ? 'المنتهية' : 'Expired'} ({expiredCount})
          </button>
          <button
            onClick={() => setStatusFilter('unpaid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
              statusFilter === 'unpaid' ? 'bg-purple-500 text-white font-bold' : 'bg-slate-950/50 text-purple-400 hover:bg-purple-500/10'
            }`}
          >
            {isAr ? 'غير مدفوعة' : 'Unpaid'} ({unpaidCount})
          </button>
        </div>
      </div>

      {/* Service Category Quick Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] text-slate-400 font-semibold px-1 shrink-0">{isAr ? 'نوع الخدمة:' : 'Service:'}</span>
        <button
          onClick={() => setServiceCategoryFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap border ${
            serviceCategoryFilter === 'all'
              ? 'bg-slate-700 text-white border-slate-600 shadow'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          {isAr ? 'الكل' : 'All'}
        </button>
        <button
          onClick={() => setServiceCategoryFilter('vip2')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
            serviceCategoryFilter === 'vip2'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
              : 'bg-slate-900/60 text-amber-400 border-slate-800 hover:border-amber-500/40'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>👑 Forever VIP 2</span>
        </button>
        <button
          onClick={() => setServiceCategoryFilter('shamna')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
            serviceCategoryFilter === 'shamna'
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900/60 text-emerald-400 border-slate-800 hover:border-emerald-500/40'
          }`}
        >
          <Tv className="w-3.5 h-3.5" />
          <span>📺 شامنا Shamna</span>
        </button>
        <button
          onClick={() => setServiceCategoryFilter('marvel')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
            serviceCategoryFilter === 'marvel'
              ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20'
              : 'bg-slate-900/60 text-rose-400 border-slate-800 hover:border-rose-500/40'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>🔥 مارفل Marvel 4K</span>
        </button>
        <button
          onClick={() => setServiceCategoryFilter('dh')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
            serviceCategoryFilter === 'dh'
              ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20'
              : 'bg-slate-900/60 text-sky-400 border-slate-800 hover:border-sky-500/40'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>⚡ دي إتش DH IPTV</span>
        </button>
        <button
          onClick={() => setServiceCategoryFilter('magic')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
            serviceCategoryFilter === 'magic'
              ? 'bg-purple-500 text-white border-purple-400 shadow-md shadow-purple-500/20'
              : 'bg-slate-900/60 text-purple-400 border-slate-800 hover:border-purple-500/40'
          }`}
        >
          <Tv className="w-3.5 h-3.5" />
          <span>🪄 ماجيك Magic IPTV</span>
        </button>
        <button
          onClick={() => setServiceCategoryFilter('telecom')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
            serviceCategoryFilter === 'telecom'
              ? 'bg-indigo-500 text-white border-indigo-400 shadow-md shadow-indigo-500/20'
              : 'bg-slate-900/60 text-indigo-400 border-slate-800 hover:border-indigo-500/40'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>📱 تشريجات وإنترنت</span>
        </button>
      </div>

      {/* Subscription List */}
      {filteredSubs.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">{isAr ? 'لا توجد سجلات مطابقة للبحث' : 'No matching subscription records found'}</p>
          <button
            onClick={handleOpenAdd}
            className="mt-3 text-xs text-sky-400 hover:underline inline-flex items-center gap-1 font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAr ? 'إضافة زبون واشتراك جديد الآن' : 'Add a new client subscription now'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSubs.map((sub) => {
            const statusInfo = getSubscriptionStatus(sub.endDate);
            const isExpiring = statusInfo.status === 'expiring';
            const isExpired = statusInfo.status === 'expired';

            return (
              <div 
                key={sub.id}
                className={`bg-slate-900/70 border rounded-2xl p-4 transition-all shadow-md relative overflow-hidden flex flex-col justify-between ${
                  isExpired 
                    ? 'border-red-500/40 bg-red-950/10' 
                    : isExpiring 
                    ? 'border-amber-500/40 bg-amber-950/10' 
                    : 'border-slate-800 hover:border-sky-500/30'
                }`}
              >
                {/* Top Row: Name & Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{sub.name}</h3>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        sub.paymentStatus === 'paid' 
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                          : 'bg-red-500/15 border-red-500/30 text-red-400'
                      }`}>
                        {sub.paymentStatus === 'paid' ? (isAr ? 'مدفوع' : 'Paid') : (isAr ? 'غير مدفوع' : 'Unpaid')}
                      </span>
                    </div>
                    <p className="text-xs text-sky-400 font-medium mt-0.5">{sub.serviceType}</p>
                  </div>

                  {/* Expiry Badge */}
                  <div className={`text-right px-2.5 py-1 rounded-xl border text-[11px] font-mono font-bold flex items-center gap-1.5 ${
                    isExpired 
                      ? 'bg-red-500/20 text-red-400 border-red-500/40' 
                      : isExpiring 
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {isExpired ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : isExpiring ? (
                      <Clock className="w-3.5 h-3.5" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>{statusInfo.label}</span>
                  </div>
                </div>

                {/* Details: Phone, Address, Dates */}
                <div className="mt-3.5 space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-sky-400" />
                      <span>{isAr ? 'رقم التلفون:' : 'Phone:'}</span>
                    </div>
                    <span className="font-mono font-bold text-white dir-ltr">{sub.phone}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isAr ? 'العنوان:' : 'Address:'}</span>
                    </div>
                    <span className="text-slate-200 text-[11px] truncate max-w-[200px]">{sub.address || (isAr ? 'غير محدد' : 'N/A')}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-500 block">{isAr ? 'تاريخ البدء:' : 'Start Date:'}</span>
                      <span className="text-slate-300 font-semibold">{sub.startDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{isAr ? 'تاريخ الانتهاء:' : 'End Date:'}</span>
                      <span className={`font-bold ${isExpired ? 'text-red-400' : isExpiring ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {sub.endDate}
                      </span>
                    </div>
                  </div>

                  {sub.notes && (
                    <div className="pt-1 border-t border-slate-800/60 text-[11px] text-slate-400 italic">
                      {sub.notes}
                    </div>
                  )}
                </div>

                {/* Amount & Actions */}
                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold font-mono text-white">{sub.price}</span>
                    <span className="text-[10px] font-mono text-slate-400">{sub.currency === 'USD' ? 'USD' : 'LBP'}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Send WhatsApp Renewal Reminder */}
                    <button
                      onClick={() => handleSendWhatsAppReminder(sub)}
                      title={isAr ? 'إرسال تذكير بالواتساب برقم الدفع 71186492' : 'Send WhatsApp Reminder with Payment 71186492'}
                      className="p-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition-colors flex items-center gap-1 text-xs font-semibold"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{isAr ? 'تذكير واتساب' : 'WhatsApp'}</span>
                    </button>

                    {/* Quick Renew 1 month */}
                    <button
                      onClick={() => handleQuickRenew(sub)}
                      title={isAr ? 'تجديد سريع لشهر إضافي' : 'Quick Renew +30 days'}
                      className="p-2 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 border border-sky-500/30 transition-colors flex items-center gap-1 text-xs font-semibold"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{isAr ? 'تجديد شهر' : 'Renew'}</span>
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleOpenEdit(sub)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title={isAr ? 'تعديل البيانات' : 'Edit'}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onDeleteSubscription(sub.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      title={isAr ? 'حذف الزبون' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add or Edit Subscription */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white">
                  {editingSub 
                    ? (isAr ? 'تعديل بيانات الزبون والاشتراك' : 'Edit Client Subscription')
                    : (isAr ? 'إضافة زبون واشتراك جديد لسام' : 'Add New Client Subscription')}
                </h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Quick Presets */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'اختر باقة معتمدة لتعبئة الحقول فورياً:' : 'Auto-fill from official packages:'}</span>
                  </label>
                  <div className="flex items-center gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setPresetModalCategory('all')}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        presetModalCategory === 'all' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {isAr ? 'الكل' : 'All'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetModalCategory('vip2')}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        presetModalCategory === 'vip2' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-amber-400 hover:text-white'
                      }`}
                    >
                      👑 VIP 2
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetModalCategory('iptv')}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        presetModalCategory === 'iptv' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-400 hover:text-white'
                      }`}
                    >
                      📺 IPTV
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetModalCategory('telecom')}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        presetModalCategory === 'telecom' ? 'bg-indigo-500 text-white font-bold' : 'text-indigo-400 hover:text-white'
                      }`}
                    >
                      📱 {isAr ? 'تشريج' : 'Telecom'}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  {PRESET_SUBSCRIPTION_PLANS
                    .filter(preset => {
                      if (presetModalCategory === 'vip2') return preset.category === 'satellite_vip';
                      if (presetModalCategory === 'iptv') return preset.category === 'iptv';
                      if (presetModalCategory === 'telecom') return preset.category === 'telecom' || preset.category === 'internet';
                      return true;
                    })
                    .map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all text-right font-medium ${
                          serviceType === preset.name
                            ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold shadow'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        {preset.shortLabel}
                      </button>
                    ))}
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-semibold">
                    {isAr ? 'اسم الزبون / الزبونة *' : 'Customer Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isAr ? 'مثال: رامي الخالد، سارة عواد' : 'e.g. Rami Al-Khaled'}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-semibold">
                    {isAr ? 'رقم التلفون *' : 'Phone Number *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="70123456 / 03983010"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-xs text-slate-300 block mb-1 font-semibold">
                  {isAr ? 'العنوان / المنطقة *' : 'Address / Location *'}
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={isAr ? 'بيروت، صيدا، طرابلس، شارع الحمرا...' : 'Beirut, Hamra street...'}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Service Type */}
              <div>
                <label className="text-xs text-slate-300 block mb-1 font-semibold">
                  {isAr ? 'نوع الاشتراك أو الخدمة' : 'Service / Subscription Type'}
                </label>
                <input
                  type="text"
                  list="service-preset-options"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  placeholder={isAr ? 'اختر أو اكتب نوع الاشتراك...' : 'Select or type subscription...'}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
                <datalist id="service-preset-options">
                  {PRESET_SUBSCRIPTION_PLANS.map(p => (
                    <option key={p.id} value={p.name} />
                  ))}
                </datalist>
              </div>

              {/* Dates: Start and End */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-semibold">
                    {isAr ? 'تاريخ بدء الاشتراك' : 'Subscription Start Date'}
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-semibold">
                    {isAr ? 'تاريخ انتهاء الاشتراك *' : 'Subscription Expiry Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Price, Currency & Payment Status */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-semibold">
                    {isAr ? 'المبلغ / السعر' : 'Price'}
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-semibold">
                    {isAr ? 'العملة' : 'Currency'}
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as 'USD' | 'LBP')}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="LBP">LBP (ل.ل)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-semibold">
                    {isAr ? 'حالة الدفع' : 'Payment Status'}
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as 'paid' | 'unpaid' | 'pending')}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="paid">{isAr ? 'مدفوع' : 'Paid'}</option>
                    <option value="unpaid">{isAr ? 'غير مدفوع' : 'Unpaid'}</option>
                    <option value="pending">{isAr ? 'معلق / قيد التحويل' : 'Pending'}</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs text-slate-300 block mb-1 font-semibold">
                  {isAr ? 'ملاحظات إضافية' : 'Notes / Remarks'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isAr ? 'ملاحظات خاصة، موديل الجهاز، طريقة الدفع...' : 'Additional client notes...'}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-sky-500/20"
                >
                  {editingSub ? (isAr ? 'حفظ التعديلات' : 'Save Changes') : (isAr ? 'حفظ الزبون' : 'Save Client')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
