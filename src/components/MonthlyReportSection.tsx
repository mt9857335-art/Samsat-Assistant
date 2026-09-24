import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Send, 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Copy, 
  Check, 
  Sparkles, 
  RotateCw, 
  FileText, 
  Printer, 
  Smartphone,
  CreditCard,
  TrendingUp,
  Share2,
  ExternalLink,
  ChevronRight,
  Filter,
  FileDown,
  Loader2
} from 'lucide-react';
import { CustomerSubscription, Invoice, AppointmentItem } from '../types';
import { SamSatLogo } from './SamSatLogo';
import { generateMonthlyReportPdf } from '../utils/pdfExport';

interface MonthlyReportSectionProps {
  subscriptions: CustomerSubscription[];
  invoices: Invoice[];
  appointments: AppointmentItem[];
  lang: 'ar' | 'en';
}

export const MonthlyReportSection: React.FC<MonthlyReportSectionProps> = ({
  subscriptions,
  invoices,
  appointments,
  lang,
}) => {
  const isAr = lang === 'ar';

  // Month selector (defaults to current month YYYY-MM)
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey);
  
  // Custom recipient phone
  const [customPhone, setCustomPhone] = useState('03983010'); // Default to Sam's line
  const [copied, setCopied] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Message customization toggles
  const [includeFinancials, setIncludeFinancials] = useState(true);
  const [includeSubscriptions, setIncludeSubscriptions] = useState(true);
  const [includeInvoices, setIncludeInvoices] = useState(true);
  const [includePaymentInfo, setIncludePaymentInfo] = useState(true);
  const [includeExecutiveNote, setIncludeExecutiveNote] = useState(true);

  // Parse selected month
  const [yearStr, monthStr] = selectedMonth.split('-');
  const selectedYear = parseInt(yearStr, 10);
  const selectedMonthNum = parseInt(monthStr, 10); // 1-12

  const monthNamesAr = [
    'كانون الثاني / يناير', 'شباط / فبراير', 'آذار / مارس', 'نيسان / أبريل',
    'أيار / مايو', 'حزيران / يونيو', 'تموز / يوليو', 'آب / أغسطس',
    'أيلول / سبتمبر', 'تشرين الأول / أكتوبر', 'تشرين الثاني / نوفمبر', 'كانون الأول / ديسمبر'
  ];
  const monthName = isAr ? monthNamesAr[selectedMonthNum - 1] : new Date(selectedYear, selectedMonthNum - 1).toLocaleString('en-US', { month: 'long' });

  // Filter subscriptions for the selected month (either active, starting, or expiring in that month)
  const monthSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => {
      // Check if start or end date matches year and month
      const start = sub.startDate ? sub.startDate.slice(0, 7) : '';
      const end = sub.endDate ? sub.endDate.slice(0, 7) : '';
      return start === selectedMonth || end === selectedMonth || (sub.startDate <= `${selectedMonth}-31` && sub.endDate >= `${selectedMonth}-01`);
    });
  }, [subscriptions, selectedMonth]);

  // Subscriptions expiring in this exact month
  const expiringThisMonth = useMemo(() => {
    return subscriptions.filter(sub => sub.endDate && sub.endDate.slice(0, 7) === selectedMonth);
  }, [subscriptions, selectedMonth]);

  // Filter invoices for the selected month
  const monthInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const invDate = inv.date ? inv.date.slice(0, 7) : '';
      return invDate === selectedMonth;
    });
  }, [invoices, selectedMonth]);

  // Financial calculations
  const totalSubRevenueUSD = monthSubscriptions
    .filter(s => s.paymentStatus === 'paid' && s.currency === 'USD')
    .reduce((sum, s) => sum + s.price, 0);

  const totalSubRevenueLBP = monthSubscriptions
    .filter(s => s.paymentStatus === 'paid' && s.currency === 'LBP')
    .reduce((sum, s) => sum + s.price, 0);

  const totalInvoiceRevenueUSD = monthInvoices
    .filter(inv => inv.status === 'paid' && inv.currency === 'USD')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const totalInvoiceRevenueLBP = monthInvoices
    .filter(inv => inv.status === 'paid' && inv.currency === 'LBP')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const grandTotalUSD = totalSubRevenueUSD + totalInvoiceRevenueUSD;
  const grandTotalLBP = totalSubRevenueLBP + totalInvoiceRevenueLBP;

  // Unpaid pending amounts
  const unpaidSubUSD = monthSubscriptions
    .filter(s => s.paymentStatus !== 'paid' && s.currency === 'USD')
    .reduce((sum, s) => sum + s.price, 0);

  const unpaidInvoiceUSD = monthInvoices
    .filter(inv => inv.status !== 'paid' && inv.currency === 'USD')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const totalUnpaidUSD = unpaidSubUSD + unpaidInvoiceUSD;
  const collectionRate = Math.round((grandTotalUSD / (grandTotalUSD + totalUnpaidUSD || 1)) * 100);

  // Generate WhatsApp Message Content
  const generatedWhatsAppText = useMemo(() => {
    let msg = `*📊 التقرير الشهري التنفيذي - ${monthName} ${selectedYear}*\n`;
    msg += `*المعد من قِبل: سمسات (Samsat) لمديره الأستاذ سام*\n`;
    msg += `*التاريخ:* ${new Date().toLocaleDateString('ar-LB')}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    if (includeFinancials) {
      msg += `*💰 ملخص الإيرادات والتحصيلات:*\n`;
      msg += `• إجمالي المقبوضات (USD): *$${grandTotalUSD.toFixed(2)}*\n`;
      if (grandTotalLBP > 0) {
        msg += `• إجمالي المقبوضات (LBP): *${grandTotalLBP.toLocaleString()} ل.ل*\n`;
      }
      msg += `• المبالغ المعلقة / غير المحصلة: *$${totalUnpaidUSD.toFixed(2)}*\n`;
      msg += `• نسبة التحصيل المالي: *${((grandTotalUSD / (grandTotalUSD + totalUnpaidUSD || 1)) * 100).toFixed(0)}%*\n\n`;
    }

    if (includeSubscriptions) {
      msg += `*👥 سجل الزبائن والاشتراكات:*\n`;
      msg += `• إجمالي المشتركين النشطين: *${monthSubscriptions.length} زبون*\n`;
      msg += `• اشتراكات تنتهي هذا الشهر (${monthName}): *${expiringThisMonth.length} زبون*\n`;
      const paidSubs = monthSubscriptions.filter(s => s.paymentStatus === 'paid').length;
      msg += `• المشتركون المسددون: *${paidSubs} / ${monthSubscriptions.length}*\n\n`;
    }

    if (includeInvoices) {
      msg += `*🧾 الفواتير والتشريجات:*\n`;
      msg += `• عدد الفواتير المصدرة هذا الشهر: *${monthInvoices.length} فاتورة*\n`;
      const alfaTouchCount = monthInvoices.filter(i => 
        i.items.some(item => item.description.includes('ألفا') || item.description.includes('تاتش') || item.description.includes('Alfa') || item.description.includes('Touch'))
      ).length;
      if (alfaTouchCount > 0) {
        msg += `• عمليات تشريج خطوط ألفا وتاتش: *${alfaTouchCount}*\n`;
      }
      msg += `\n`;
    }

    if (includePaymentInfo) {
      msg += `*📱 أرقام التحويل والتواصل المعتمدة للزبائن:*\n`;
      msg += `• رقم التحويل المعتمد: *71186492* (Whish / OMT / Cash)\n`;
      msg += `• خط التواصل والواتساب لسمسات: *03983010*\n\n`;
    }

    if (includeExecutiveNote) {
      msg += `*⚡ توصية سمسات التنفيذية لسام:*\n`;
      if (aiAnalysis) {
        msg += `${aiAnalysis}\n\n`;
      } else {
        msg += `«يا أستاذ سام، الأداء هذا الشهر مستقر وواعد. نوصي بالتركيز على تجديد اشتراكات الـ (${expiringThisMonth.length}) زبون قبل نهاية الشهر، ومتابعة تحصيل المبالغ المعلقة على رقم 71186492. أنا سمسات في خدمتك وتحت إمرتك دائماً!»\n\n`;
      }
      msg += `⚽ *فورسا بارسا دائماً يا سام!* 🔵🔴\n`;
    }

    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `_تم توليد هذا التقرير تلقائياً عبر نظام سمسات الذكي_`;
    return msg;
  }, [
    monthName, 
    selectedYear, 
    includeFinancials, 
    includeSubscriptions, 
    includeInvoices, 
    includePaymentInfo, 
    includeExecutiveNote,
    grandTotalUSD, 
    grandTotalLBP, 
    totalUnpaidUSD, 
    monthSubscriptions, 
    expiringThisMonth, 
    monthInvoices, 
    aiAnalysis
  ]);

  // Trigger WhatsApp send
  const handleSendToWhatsApp = (phoneTarget?: string) => {
    const rawTarget = phoneTarget || customPhone;
    const cleanPhone = rawTarget.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('961') ? cleanPhone : `961${cleanPhone.replace(/^0/, '')}`;
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(generatedWhatsAppText)}`;
    window.open(url, '_blank');
  };

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedWhatsAppText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch / Generate AI Analysis for the Month
  const handleGenerateAiAnalysis = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/monthly-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: selectedMonth,
          monthName,
          financials: {
            revenueUSD: grandTotalUSD,
            revenueLBP: grandTotalLBP,
            unpaidUSD: totalUnpaidUSD,
          },
          subscriptionsCount: monthSubscriptions.length,
          expiringCount: expiringThisMonth.length,
          invoicesCount: monthInvoices.length,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.analysis) {
          setAiAnalysis(data.analysis);
        }
      } else {
        // Fallback analysis
        setAiAnalysis(`تقرير مالي وتنفيذي مميز لشهر ${monthName}. الإيرادات المحصلة تبلغ $${grandTotalUSD.toFixed(0)} مع ${monthSubscriptions.length} اشتراكاً نشطاً. يُنصح بإرسال تذكيرات التجديد لـ ${expiringThisMonth.length} زبون عبر الواتساب فوراً.`);
      }
    } catch (err) {
      setAiAnalysis(`تقرير مالي وتنفيذي مميز لشهر ${monthName}. الإيرادات المحصلة تبلغ $${grandTotalUSD.toFixed(0)} مع ${monthSubscriptions.length} اشتراكاً نشطاً. يُنصح بإرسال تذكيرات التجديد لـ ${expiringThisMonth.length} زبون عبر الواتساب فوراً.`);
    } finally {
      setIsAiLoading(false);
    }
  };

  // WhatsApp reminder for a single customer
  const handleSendCustomerReminder = (sub: CustomerSubscription) => {
    const cleanPhone = sub.phone.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('961') ? cleanPhone : `961${cleanPhone.replace(/^0/, '')}`;
    const text = isAr
      ? `تحية طيبة حضرة الزبون المحترم ${sub.name}،\nنحيطكم علماً من مكتب الأستاذ سام بأن اشتراككم (${sub.serviceType}) ينتهي بتاريخ: ${sub.endDate}.\n\nلتجديد الاشتراك دون انقطاع، يرجى تحويل الرسوم (${sub.price}${sub.currency === 'USD' ? '$' : ' ل.ل'}) إلى رقم التحويل المعتمد:\n📱 *71186492* (Whish / OMT)\n\nشاكرين ثقتكم الكريمة.\nمع تحيات الأستاذ سام - هاتف الواتساب: 03983010`
      : `Dear ${sub.name},\nThis is a renewal notice from Sam's office for your subscription (${sub.serviceType}) ending on ${sub.endDate}.\nTo renew, please send the fee to our payment line:\n📱 71186492\n\nThank you, Sam Management.`;

    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleExportMonthlyPdf = async () => {
    try {
      setIsExportingPdf(true);
      await generateMonthlyReportPdf({
        monthName,
        monthKey: selectedMonth,
        financials: {
          revenueUSD: grandTotalUSD,
          revenueLBP: grandTotalLBP,
          unpaidUSD: totalUnpaidUSD,
          collectionRate,
        },
        subscriptions: monthSubscriptions,
        invoices: monthInvoices,
        aiAnalysis: aiAnalysis || undefined,
        isAr,
      });
    } catch (err) {
      console.error('Failed to export Monthly Report PDF:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/25 rounded-2xl p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <SamSatLogo size="md" showDownloadOnHover={true} withGlow={true} />
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{isAr ? 'نظام التقرير الشهري والدمج المباشر مع الواتساب' : "Monthly Report & WhatsApp Integration Hub"}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Samsat Dispatch
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  {isAr 
                    ? 'تلخيص كامل لإيرادات الشهر، اشتراكات الزبائن، الفواتير، وإرسال التقرير بضغطة زر إلى واتساب الأستاذ سام (03983010).' 
                    : 'Consolidated monthly revenues, customer renewals, invoices, with 1-click WhatsApp dispatch to Sam.'}
                </p>
              </div>
            </div>
          </div>

          {/* Controls: Month Picker & PDF Export */}
          <div className="flex flex-wrap items-center gap-2.5 self-stretch md:self-auto">
            <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800 flex-1 sm:flex-initial">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 px-2 font-mono">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'الشهر:' : 'Month:'}</span>
              </div>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-slate-900 text-white font-mono text-xs px-3 py-1.5 rounded-lg border border-slate-700/80 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={handleExportMonthlyPdf}
              disabled={isExportingPdf}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
              title={isAr ? 'تصدير التقرير الشهري كملف PDF رسمي' : 'Export Monthly Report as PDF'}
            >
              {isExportingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileDown className="w-4 h-4" />
              )}
              <span>{isExportingPdf ? (isAr ? 'جاري تجهيز PDF...' : 'Generating...') : (isAr ? 'تصدير التقرير PDF' : 'Export Report PDF')}</span>
            </button>
          </div>
        </div>

        {/* Quick Month Metrics Bar */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-emerald-500/25">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-emerald-400 font-mono font-semibold">{isAr ? 'إجمالي الإيرادات المحصلة' : 'Collected USD'}</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white">
              ${grandTotalUSD.toFixed(0)}
              {grandTotalLBP > 0 && (
                <span className="text-xs text-slate-400 font-normal block mt-0.5">
                  + {grandTotalLBP.toLocaleString()} ل.ل
                </span>
              )}
            </div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-amber-500/25">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-amber-400 font-mono font-semibold">{isAr ? 'مبالغ معلقة للتحصيل' : 'Pending USD'}</span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-bold font-mono text-amber-400">
              ${totalUnpaidUSD.toFixed(0)}
            </div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-sky-500/25">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-sky-400 font-mono font-semibold">{isAr ? 'المشتركون النشطون' : 'Active Subscribers'}</span>
              <Users className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {monthSubscriptions.length}
              <span className="text-[11px] text-slate-400 font-normal mr-1">زبون</span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-rose-500/25">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-rose-400 font-mono font-semibold">{isAr ? 'تجديدات مستحقة هذا الشهر' : 'Expiring This Month'}</span>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-xl font-bold font-mono text-rose-400">
              {expiringThisMonth.length}
              <span className="text-[11px] text-slate-400 font-normal mr-1">زبون</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: WhatsApp Dispatch Center & Real-time Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left / Main Column: WhatsApp Dispatch Configuration (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {isAr ? 'تجهيز وإرسال التقرير عبر الواتساب' : 'WhatsApp Dispatch Configuration'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isAr ? 'إرسال التقرير التنفيذي لسام فوراً بنقرة واحدة' : 'Send executive report to Sam directly in one click'}
                  </p>
                </div>
              </div>

              {/* Samsat AI Button */}
              <button
                onClick={handleGenerateAiAnalysis}
                disabled={isAiLoading}
                className="px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-400 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 font-mono"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
                <span>{isAiLoading ? (isAr ? 'جاري التحليل...' : 'Analyzing...') : (isAr ? 'تحليل ذكي من سمسات' : 'Samsat AI Synthesis')}</span>
              </button>
            </div>

            {/* Quick Destination Select */}
            <div>
              <label className="text-xs text-slate-300 block mb-1.5 font-semibold">
                {isAr ? 'الرقم المستلم للتقرير:' : 'Recipient Phone Number:'}
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCustomPhone('03983010')}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 border transition-all ${
                    customPhone === '03983010'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-950 text-slate-300 border-slate-700 hover:border-emerald-500/40'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{isAr ? 'خط الأستاذ سام (03983010)' : "Sam's Line (03983010)"}</span>
                </button>

                <div className="relative flex-1">
                  <input
                    type="text"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    placeholder="رقم آخر (مثلاً 70123456 أو 961...)"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Customization Checkboxes */}
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">
                {isAr ? 'العناصر المضمنة في رسالة الواتساب:' : 'Included Report Sections:'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <input 
                    type="checkbox" 
                    checked={includeFinancials} 
                    onChange={(e) => setIncludeFinancials(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>{isAr ? '💰 ملخص المقبوضات والأرقام المالية' : 'Revenues & Financials'}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <input 
                    type="checkbox" 
                    checked={includeSubscriptions} 
                    onChange={(e) => setIncludeSubscriptions(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>{isAr ? '👥 إحصائيات المشتركين والتجديدات' : 'Subscriber Retention & Stats'}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <input 
                    type="checkbox" 
                    checked={includeInvoices} 
                    onChange={(e) => setIncludeInvoices(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>{isAr ? '🧾 فواتير التشريج (ألفا، تاتش، إنترنت)' : 'Invoices & Recharges'}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <input 
                    type="checkbox" 
                    checked={includePaymentInfo} 
                    onChange={(e) => setIncludePaymentInfo(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>{isAr ? '📱 رقم التحويل المعتمد (71186492)' : 'Payment Line (71186492)'}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-white sm:col-span-2">
                  <input 
                    type="checkbox" 
                    checked={includeExecutiveNote} 
                    onChange={(e) => setIncludeExecutiveNote(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>{isAr ? '⚡ وصية سمسات التنفيذية وتحية برشلونة' : 'Executive Note & Barca Shoutout'}</span>
                </label>
              </div>
            </div>

            {/* Action Buttons: Dispatch Now */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
              <button
                onClick={() => handleSendToWhatsApp(customPhone)}
                className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isAr 
                    ? `إرسال التقرير فوراً عبر الواتساب إلى (${customPhone})` 
                    : `Send Report via WhatsApp to (${customPhone})`}
                </span>
              </button>

              <button
                onClick={handleCopy}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                title={isAr ? 'نسخ نص الرسالة بالكامل' : 'Copy Formatted Text'}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ النص' : 'Copy')}</span>
              </button>
            </div>
          </div>

          {/* Customer Renewals for this Month (Actionable WhatsApp List) */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white">
                  {isAr ? `اشتراكات تنتهي في شهر ${monthName} (${expiringThisMonth.length})` : `Renewals Due in ${monthName} (${expiringThisMonth.length})`}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {isAr ? 'تذكير فوري برقم 71186492' : 'Instant WhatsApp Reminders'}
              </span>
            </div>

            {expiringThisMonth.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800/60">
                <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-1.5 opacity-80" />
                <p>{isAr ? `لا توجد اشتراكات تنتهي في شهر ${monthName}. جميع الاشتراكات سارية ومحدثة!` : `No subscriptions ending in ${monthName}. All clear!`}</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {expiringThisMonth.map((sub) => (
                  <div 
                    key={sub.id}
                    className="bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/30 rounded-xl p-3 flex items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{sub.name}</span>
                        <span className="font-mono text-[11px] text-sky-400">{sub.phone}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${
                          sub.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {sub.paymentStatus === 'paid' ? (isAr ? 'مدفوع' : 'Paid') : (isAr ? 'غير مدفوع' : 'Unpaid')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>{sub.serviceType}</span>
                        <span>•</span>
                        <span className="font-mono text-amber-400">تاريخ الانتهاء: {sub.endDate}</span>
                        <span>•</span>
                        <span className="font-mono text-white font-semibold">${sub.price}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSendCustomerReminder(sub)}
                      className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors whitespace-nowrap"
                      title={isAr ? 'إرسال تذكير بالواتساب للزبون برقم التحويل 71186492' : 'Send WhatsApp Reminder to Client'}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تذكير واتساب' : 'Reminder'}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live WhatsApp Message Dark Bubble Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0b141a] border border-[#202c33] rounded-2xl p-4 shadow-2xl relative overflow-hidden flex flex-col h-full min-h-[500px]">
            {/* WhatsApp Header bar */}
            <div className="bg-[#202c33] -mx-4 -mt-4 p-3 flex items-center justify-between border-b border-[#2a3942]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow">
                  S
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#e9edef] leading-tight">
                    {isAr ? 'محادثة الأستاذ سام (03983010)' : 'Chat: Sam (03983010)'}
                  </h4>
                  <span className="text-[10px] text-[#8696a0] font-mono">
                    {isAr ? 'سمسات متصل الآن • تقرير شهري' : 'Samsat online • Monthly Report'}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#111b21] text-emerald-400 border border-emerald-500/30">
                معاينة حية
              </span>
            </div>

            {/* Chat Bubble Body */}
            <div className="flex-1 py-4 overflow-y-auto space-y-2">
              <div className="max-w-[95%] mr-auto bg-[#005c4b] text-[#e9edef] p-3.5 rounded-2xl rounded-tr-none text-xs leading-relaxed shadow whitespace-pre-wrap font-sans border border-[#00705a]/50 selection:bg-emerald-300 selection:text-slate-950">
                {generatedWhatsAppText}
                <div className="flex items-center justify-end gap-1 mt-2 text-[9px] text-[#8696a0] font-mono">
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="text-sky-400">✓✓</span>
                </div>
              </div>
            </div>

            {/* Quick Actions in Footer */}
            <div className="pt-3 border-t border-[#202c33] flex flex-wrap items-center justify-between gap-2 text-xs">
              <button
                onClick={handleExportMonthlyPdf}
                disabled={isExportingPdf}
                className="px-3 py-1.5 bg-[#202c33] hover:bg-[#2a3942] text-amber-300 font-bold rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all border border-amber-500/30 disabled:opacity-50"
                title={isAr ? 'تصدير وتحميل التقرير كملف PDF' : 'Download Report PDF'}
              >
                {isExportingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
                <span>{isExportingPdf ? (isAr ? 'جاري التحميل...' : 'Exporting...') : (isAr ? 'تحميل PDF' : 'PDF')}</span>
              </button>

              <button
                onClick={() => handleSendToWhatsApp(customPhone)}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isAr ? 'فتح الواتساب وإرسال' : 'Open WhatsApp'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
