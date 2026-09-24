import React, { useState } from 'react';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  Send, 
  Printer, 
  Sparkles, 
  Phone, 
  MapPin, 
  User, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  CreditCard,
  Zap,
  Search,
  ExternalLink,
  FileDown,
  Loader2
} from 'lucide-react';
import { Invoice, InvoiceLine } from '../types';
import { SamSatLogo } from './SamSatLogo';
import { generateInvoicePdf } from '../utils/pdfExport';

interface InvoicesSectionProps {
  invoices: Invoice[];
  onAddInvoice: (invoice: Invoice) => void;
  onUpdateInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (id: string) => void;
  lang: 'ar' | 'en';
}

const QUICK_PRESETS = [
  { name: 'تشريج ألفا $22.73 (شهر)', price: 23, category: 'تشريج' },
  { name: 'تشريج تاتش $22.73 (شهر)', price: 23, category: 'تشريج' },
  { name: 'تشريج أيام ألفا (Days)', price: 5, category: 'تشريج' },
  { name: 'تشريج أيام تاتش (Days)', price: 5, category: 'تشريج' },
  { name: 'كرت إنترنت فائق السرعة', price: 15, category: 'إنترنت' },
  { name: 'شاحن أصلي سريع Type-C', price: 12, category: 'إكسسوارات' },
  { name: 'لزقة حماية شاشة ضد الكسر', price: 6, category: 'إكسسوارات' },
  { name: 'صيانة وبرمجة جهاز', price: 20, category: 'صيانة' },
];

export const InvoicesSection: React.FC<InvoicesSectionProps> = ({
  invoices,
  onAddInvoice,
  onUpdateInvoice,
  onDeleteInvoice,
  lang,
}) => {
  const isAr = lang === 'ar';

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unpaid' | 'paid'>('all');
  const [exportingPdfId, setExportingPdfId] = useState<string | null>(null);

  // AI Invoice generation state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [showAiInput, setShowAiInput] = useState(false);

  // New Invoice Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('لبنان');
  const [currency, setCurrency] = useState<'USD' | 'LBP'>('USD');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<InvoiceLine[]>([
    { id: '1', description: 'تشريج خط ألفا (شهر كامل)', quantity: 1, unitPrice: 23, total: 23 }
  ]);

  const paymentNumber = '71186492'; // Specified by Sam for client payments

  const calculateSubtotal = () => items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const handleAddItem = () => {
    const newItem: InvoiceLine = {
      id: `line-${Date.now()}-${items.length}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const handleAddPreset = (name: string, price: number) => {
    const newItem: InvoiceLine = {
      id: `preset-${Date.now()}`,
      description: name,
      quantity: 1,
      unitPrice: price,
      total: price,
    };
    setItems([...items, newItem]);
  };

  const handleItemChange = (index: number, field: keyof InvoiceLine, value: any) => {
    const updated = [...items];
    const current = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      const q = field === 'quantity' ? Number(value) : current.quantity;
      const p = field === 'unitPrice' ? Number(value) : current.unitPrice;
      current.total = Number((q * p).toFixed(2));
    }
    updated[index] = current;
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subtotal = calculateSubtotal();
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName.trim() || (isAr ? 'زبون محترم' : 'Valued Client'),
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress.trim() || (isAr ? 'لبنان' : 'Lebanon'),
      items: items.filter(i => i.description.trim() !== ''),
      subtotal,
      discount: 0,
      totalAmount: subtotal,
      currency,
      paymentPhone: paymentNumber,
      paymentStatus: 'unpaid',
      notes: notes.trim() || (isAr ? 'شكراً لتعاملكم معنا. الدفع على الرقم: 71186492' : 'Thank you for your business. Payment line: 71186492'),
      createdAt: new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
    };

    onAddInvoice(newInvoice);
    setShowCreateModal(false);
    resetForm();
  };

  const resetForm = () => {
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('لبنان');
    setNotes('');
    setItems([{ id: '1', description: 'تشريج خط ألفا (شهر كامل)', quantity: 1, unitPrice: 23, total: 23 }]);
  };

  // Generate with AI from natural text
  const handleGenerateInvoiceWithAI = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/generate-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiPrompt }),
      });
      const data = await res.json();
      if (data.customerName) setCustomerName(data.customerName);
      if (data.customerPhone) setCustomerPhone(data.customerPhone);
      if (data.customerAddress) setCustomerAddress(data.customerAddress);
      if (data.currency) setCurrency(data.currency);
      if (Array.isArray(data.items) && data.items.length > 0) {
        setItems(data.items.map((it: any, idx: number) => ({
          id: `ai-item-${Date.now()}-${idx}`,
          description: it.description || 'بضاعة / تشريج',
          quantity: Number(it.quantity) || 1,
          unitPrice: Number(it.unitPrice) || 0,
          total: Number((Number(it.quantity || 1) * Number(it.unitPrice || 0)).toFixed(2)),
        })));
      }
      if (data.notes) setNotes(data.notes);
      setShowAiInput(false);
      setAiPrompt('');
    } catch (e) {
      console.warn('AI Invoice generation error:', e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Format WhatsApp message to send to client
  const generateWhatsAppMessage = (inv: Invoice) => {
    const lines = inv.items.map((item, idx) => `• ${item.description} (الكمية: ${item.quantity}) = ${item.total} ${inv.currency}`).join('\n');
    const msg = `مرحباً بك عزيزنا ${inv.customerName}،
تحية طيبة من طرف سام (Sam) 🌹

إليك تفاصيل فاتورتك / طلبيتك الرسمية (${inv.invoiceNumber}):
--------------------------------
${lines}
--------------------------------
💰 المجموع الإجمالي: ${inv.totalAmount} ${inv.currency}

💳 تفاصيل الدفع والتحويل المعتمد:
يرجى تحويل المبلغ المطلوب عبر (Whish Money أو OMT أو كاش) إلى الرقم المعتمد:
👉 ${inv.paymentPhone} 👈

📍 العنوان: ${inv.customerAddress || 'لبنان'}
${inv.notes ? `ملاحظات: ${inv.notes}\n` : ''}
لأي استفسار يمكنك التواصل معنا مباشرة على هذا الرقم أو خط سمسات الخاص: 03983010
شكراً لثقتكم الكريمة! ✨`;
    return encodeURIComponent(msg);
  };

  const handleSendWhatsApp = (inv: Invoice) => {
    const text = generateWhatsAppMessage(inv);
    const cleanPhone = inv.customerPhone.replace(/[^0-9]/g, '');
    let url = '';
    if (cleanPhone.length >= 7) {
      // If Lebanese local number like 71186492 or 03983010, format with 961
      const normalizedPhone = cleanPhone.startsWith('961') 
        ? cleanPhone 
        : cleanPhone.startsWith('0') 
          ? `961${cleanPhone.substring(1)}` 
          : `961${cleanPhone}`;
      url = `https://wa.me/${normalizedPhone}?text=${text}`;
    } else {
      url = `https://wa.me/?text=${text}`;
    }
    window.open(url, '_blank');
  };

  const handleCopyPaymentInfo = (phone: string, id: string) => {
    navigator.clipboard.writeText(`رقم تحويل الدفع المعتمد لسام: ${phone} (Whish / OMT)`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleExportPdf = async (inv: Invoice) => {
    try {
      setExportingPdfId(inv.id);
      await generateInvoicePdf(inv, isAr);
    } catch (err) {
      console.error('Error generating invoice PDF:', err);
    } finally {
      setExportingPdfId(null);
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerPhone.includes(searchQuery);
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && inv.paymentStatus === filterStatus;
  });

  return (
    <div className="space-y-5">
      {/* Header & Directive Banner */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-sky-950/25">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <SamSatLogo size="md" showDownloadOnHover={true} withGlow={true} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-0.5 rounded-full uppercase">
                  {isAr ? 'نظام الفواتير والتشريجات لسام' : "SAM'S BILLING & INVOICING HUB"}
                </span>
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isAr ? 'رقم التحويل: 71186492' : 'PAY LINE: 71186492'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                {isAr ? 'جمع الفواتير وإتقانها للزبائن باحترافية' : 'Professional Client Invoicing & Top-ups'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isAr 
                  ? 'إعداد فواتير دقيقة لأي زبون: الاسم، الهاتف، العنوان، البضاعة، والتشريجات مع رقم الدفع المعتمد 71186492.' 
                  : 'Automated invoice generation for goods and telecom recharge, with direct WhatsApp dispatch.'}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setShowCreateModal(true);
                setShowAiInput(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-sky-400 border border-sky-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors font-mono"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'إنشاء بالذكاء الاصطناعي' : 'AI INVOICE'}</span>
            </button>

            <button
              onClick={() => {
                setShowCreateModal(true);
                setShowAiInput(false);
              }}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-[0_0_15px_rgba(56,189,248,0.3)] font-mono"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'فاتورة جديدة لزبون' : 'NEW INVOICE'}</span>
            </button>
          </div>
        </div>

        {/* Highlight Banner on Designated Payment Line */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <CreditCard className="w-4 h-4 text-sky-400" />
            <span className="text-slate-400 font-mono">{isAr ? 'رقم دفع الزبائن المعتمد للتحويل:' : 'Customer Transfer Line:'}</span>
            <span className="font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30 text-sm">
              71186492
            </span>
            <span className="text-slate-500 text-[11px]">(Whish Money / OMT / Cash)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyPaymentInfo('71186492', 'top-banner')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-mono flex items-center gap-1"
            >
              {copiedId === 'top-banner' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-sky-400" />}
              <span>{copiedId === 'top-banner' ? (isAr ? 'تم النسخ!' : 'Copied') : (isAr ? 'نسخ بيانات الدفع' : 'Copy Payment')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-3.5 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث برقم الفاتورة، اسم الزبون، الهاتف...' : 'Search invoices...'}
            className="w-full bg-[#0B0F1A] border border-slate-700/80 rounded-xl pr-9 pl-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors ${
              filterStatus === 'all' 
                ? 'bg-sky-500 text-slate-950 font-bold' 
                : 'bg-slate-800/70 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isAr ? 'الكل' : 'All'} ({invoices.length})
          </button>
          <button
            onClick={() => setFilterStatus('unpaid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors ${
              filterStatus === 'unpaid' 
                ? 'bg-amber-500 text-slate-950 font-bold' 
                : 'bg-slate-800/70 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isAr ? 'غير مدفوعة' : 'Pending'} ({invoices.filter(i => i.paymentStatus === 'unpaid').length})
          </button>
          <button
            onClick={() => setFilterStatus('paid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors ${
              filterStatus === 'paid' 
                ? 'bg-emerald-500 text-slate-950 font-bold' 
                : 'bg-slate-800/70 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isAr ? 'مدفوعة' : 'Paid'} ({invoices.filter(i => i.paymentStatus === 'paid').length})
          </button>
        </div>
      </div>

      {/* Invoices List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInvoices.length === 0 ? (
          <div className="col-span-full bg-slate-900/30 border border-slate-800/60 rounded-2xl p-10 text-center backdrop-blur-sm">
            <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300">
              {isAr ? 'لا توجد فواتير مسجلة حالياً' : 'No invoices recorded yet'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {isAr 
                ? 'اضغط على "فاتورة جديدة لزبون" أو اطلب من سمسات كتابة فاتورة لأي زبون مع تفاصيل التشريج والأغراض.' 
                : 'Click New Invoice to draft a bill with items, top-ups, and instant WhatsApp dispatch.'}
            </p>
          </div>
        ) : (
          filteredInvoices.map((inv) => (
            <div
              key={inv.id}
              className="bg-slate-900/50 border border-slate-800/70 hover:border-sky-500/40 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all shadow-xl backdrop-blur-md group relative"
            >
              <div>
                {/* Top status bar */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-sky-400">
                      {inv.invoiceNumber}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {inv.createdAt}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const updated = {
                        ...inv,
                        paymentStatus: inv.paymentStatus === 'paid' ? 'unpaid' : 'paid' as any
                      };
                      onUpdateInvoice(updated);
                    }}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold transition-colors flex items-center gap-1 ${
                      inv.paymentStatus === 'paid'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {inv.paymentStatus === 'paid' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isAr ? 'مدفوعة' : 'PAID'}</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        <span>{isAr ? 'غير مدفوعة' : 'PENDING'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Customer Details */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <User className="w-4 h-4 text-sky-400 flex-shrink-0" />
                    <span className="truncate">{inv.customerName}</span>
                  </div>

                  {inv.customerPhone && (
                    <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                      <Phone className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span>{inv.customerPhone}</span>
                    </div>
                  )}

                  {inv.customerAddress && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{inv.customerAddress}</span>
                    </div>
                  )}
                </div>

                {/* Items preview */}
                <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 space-y-1">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    {isAr ? 'البضاعة والتشريجات:' : 'ITEMS & RECHARGES:'}
                  </div>
                  <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                    {inv.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-slate-300 bg-slate-950/40 px-2 py-1 rounded-lg">
                        <span className="truncate max-w-[170px]">{it.description}</span>
                        <span className="font-mono text-sky-400 font-semibold">{it.total} {inv.currency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Total & Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{isAr ? 'المجموع المستحق:' : 'Total Due:'}</span>
                  <div className="text-base font-bold font-mono text-emerald-400">
                    {inv.totalAmount} {inv.currency}
                  </div>
                </div>

                <div className="p-2 bg-slate-950/60 rounded-xl border border-sky-500/20 text-[11px] font-mono flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 text-[10px]">{isAr ? 'رقم الدفع:' : 'Pay Line:'}</span>
                  <span className="text-sky-400 font-bold">{inv.paymentPhone}</span>
                  <button
                    onClick={() => handleCopyPaymentInfo(inv.paymentPhone, inv.id)}
                    title={isAr ? 'نسخ رقم التحويل' : 'Copy number'}
                    className="p-1 hover:text-white rounded transition-colors"
                  >
                    {copiedId === inv.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => handleSendWhatsApp(inv)}
                    className="py-1.5 px-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold font-mono flex items-center justify-center gap-1 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                    title={isAr ? 'إرسال الفاتورة عبر واتساب' : 'Send via WhatsApp'}
                  >
                    <Send className="w-3 h-3" />
                    <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
                  </button>

                  <button
                    onClick={() => handleExportPdf(inv)}
                    disabled={exportingPdfId === inv.id}
                    className="py-1.5 px-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold font-mono flex items-center justify-center gap-1 transition-colors shadow-[0_0_10px_rgba(245,158,11,0.25)] disabled:opacity-50"
                    title={isAr ? 'تحميل الفاتورة كملف PDF رسمي' : 'Download PDF'}
                  >
                    {exportingPdfId === inv.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <FileDown className="w-3 h-3" />
                    )}
                    <span>{exportingPdfId === inv.id ? '...' : 'PDF'}</span>
                  </button>

                  <button
                    onClick={() => setSelectedInvoice(inv)}
                    className="py-1.5 px-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors font-mono"
                    title={isAr ? 'معاينة وطباعة' : 'Preview'}
                  >
                    <Printer className="w-3 h-3 text-sky-400" />
                    <span>{isAr ? 'معاينة' : 'View'}</span>
                  </button>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => onDeleteInvoice(inv.id)}
                    className="text-[11px] text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{isAr ? 'حذف الفاتورة' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-sky-400" />
                <h3 className="text-lg font-bold text-white">
                  {isAr ? 'إنشاء فاتورة احترافية لزبون (سام)' : 'Create Professional Invoice for Sam'}
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* AI Prompt Drawer */}
            {showAiInput && (
              <div className="bg-slate-900/90 border border-sky-500/30 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                  <Sparkles className="w-4 h-4" />
                  <span>{isAr ? 'صياغة الفاتورة تلقائياً عبر سمسات (اكتب الطلب كما هو):' : 'Natural language to invoice via Samsat:'}</span>
                </div>
                <textarea
                  rows={2}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder={isAr ? 'مثال: الزبون أحمد خليل 70123456 بده تشريج خط ألفا شهر + كفر حماية المجموع 30 دولار العنوان بيروت' : 'e.g. Client John 70123456 wants Alfa monthly recharge plus screen protector 30 USD'}
                  className="w-full bg-[#0B0F1A] border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAiInput(false)}
                    className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    disabled={isGeneratingAi || !aiPrompt.trim()}
                    onClick={handleGenerateInvoiceWithAI}
                    className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingAi ? (isAr ? 'جاري التحليل...' : 'Analyzing...') : (isAr ? 'توليد الفاتورة' : 'Generate')}</span>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {isAr ? 'اسم الزبون *' : 'Client Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={isAr ? 'مثال: سامر حسن' : 'Client Name'}
                    className="w-full bg-[#0B0F1A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {isAr ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="70xxxxxx / 03xxxxxx"
                    className="w-full bg-[#0B0F1A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {isAr ? 'العنوان' : 'Address'}
                  </label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder={isAr ? 'بيروت، صيدا، طرابلس...' : 'City, Area'}
                    className="w-full bg-[#0B0F1A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Currency & Payment Number Notice */}
              <div className="p-3 bg-slate-900/60 rounded-xl border border-sky-500/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{isAr ? 'العملة:' : 'Currency:'}</span>
                  <div className="flex items-center gap-1 bg-[#0B0F1A] p-1 rounded-lg border border-slate-700">
                    <button
                      type="button"
                      onClick={() => setCurrency('USD')}
                      className={`px-3 py-1 rounded text-xs font-mono font-bold ${currency === 'USD' ? 'bg-sky-500 text-slate-950' : 'text-slate-400'}`}
                    >
                      USD ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency('LBP')}
                      className={`px-3 py-1 rounded text-xs font-mono font-bold ${currency === 'LBP' ? 'bg-sky-500 text-slate-950' : 'text-slate-400'}`}
                    >
                      LBP (ل.ل)
                    </button>
                  </div>
                </div>

                <div className="text-slate-300 flex items-center gap-1 font-mono">
                  <span className="text-slate-400">{isAr ? 'رقم دفع الزبائن:' : 'Payment Line:'}</span>
                  <span className="text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">{paymentNumber}</span>
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? 'إضافة سريعة لباقات التشريج والأغراض الشائعة:' : 'Quick items & top-up presets:'}</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddPreset(p.name, p.price)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-300 transition-colors flex items-center gap-1"
                    >
                      <span>+ {p.name}</span>
                      <span className="text-sky-400 font-mono font-bold">({p.price}$)</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-200">
                    {isAr ? 'بنود الفاتورة والتشريجات *' : 'Invoice Items & Recharges *'}
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إضافة بند آخر' : 'Add Item'}</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {items.map((item, idx) => (
                    <div key={item.id || idx} className="grid grid-cols-12 gap-2 items-center bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                      <div className="col-span-6">
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          placeholder={isAr ? 'وصف البضاعة أو التشريج...' : 'Description'}
                          className="w-full bg-[#0B0F1A] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          placeholder={isAr ? 'الكمية' : 'Qty'}
                          className="w-full bg-[#0B0F1A] border border-slate-700/80 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono text-center"
                        />
                      </div>

                      <div className="col-span-3">
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                          placeholder={isAr ? 'السعر' : 'Price'}
                          className="w-full bg-[#0B0F1A] border border-slate-700/80 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono text-center"
                        />
                      </div>

                      <div className="col-span-1 flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subtotal preview */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">{isAr ? 'إجمالي الفاتورة المطلوب سداده:' : 'Total Calculated:'}</span>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  {calculateSubtotal().toFixed(2)} {currency}
                </span>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {isAr ? 'ملاحظات إضافية للفاتورة' : 'Additional Notes'}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isAr ? 'ملاحظات خاصة، كفالة، شروط التشريج...' : 'Notes or conditions...'}
                  className="w-full bg-[#0B0F1A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-colors shadow-[0_0_15px_rgba(56,189,248,0.3)] font-mono"
                >
                  {isAr ? 'حفظ الفاتورة واعتمادها' : 'Save & Issue Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Printable View Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-6 text-slate-100">
            {/* Header / Brand */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3.5">
                <SamSatLogo size="lg" withGlow={true} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold text-white">SAM SAT</span>
                    <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {selectedInvoice.invoiceNumber}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-amber-300 font-mono tracking-wider">
                    PREMIUM SATELLITE SOLUTIONS
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isAr ? 'إشراف وإدارة: سام (Sam) • تدقيق: سمسات' : 'Managed by Sam • Prepared by Samsat'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-white text-lg p-1 rounded-xl hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Bill To Info */}
            <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs">
              <div>
                <div className="text-[10px] text-slate-500 font-mono uppercase">{isAr ? 'المطلوب من الزبون:' : 'Billed To:'}</div>
                <div className="font-bold text-white text-sm mt-0.5">{selectedInvoice.customerName}</div>
                {selectedInvoice.customerPhone && <div className="text-slate-400 font-mono mt-0.5">{selectedInvoice.customerPhone}</div>}
                {selectedInvoice.customerAddress && <div className="text-slate-400 mt-0.5">{selectedInvoice.customerAddress}</div>}
              </div>

              <div className="text-left sm:text-right">
                <div className="text-[10px] text-slate-500 font-mono uppercase">{isAr ? 'تاريخ الفاتورة:' : 'Date:'}</div>
                <div className="font-mono text-slate-200 mt-0.5">{selectedInvoice.createdAt}</div>
                <div className="text-[10px] text-slate-500 font-mono uppercase mt-2">{isAr ? 'حالة السداد:' : 'Payment Status:'}</div>
                <div className={`font-mono font-bold mt-0.5 ${selectedInvoice.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {selectedInvoice.paymentStatus === 'paid' ? (isAr ? 'مدفوعة بالكامل' : 'Paid') : (isAr ? 'قيد السداد' : 'Pending')}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-2">
              <div className="grid grid-cols-12 text-[11px] font-mono text-slate-400 px-3 pb-1 border-b border-slate-800">
                <div className="col-span-7">{isAr ? 'البند / البضاعة / التشريج' : 'Item Description'}</div>
                <div className="col-span-2 text-center">{isAr ? 'الكمية' : 'Qty'}</div>
                <div className="col-span-3 text-right">{isAr ? 'المجموع' : 'Amount'}</div>
              </div>

              <div className="space-y-1.5">
                {selectedInvoice.items.map((it, idx) => (
                  <div key={idx} className="grid grid-cols-12 text-xs text-slate-200 px-3 py-2 bg-slate-950/40 rounded-xl">
                    <div className="col-span-7 font-medium">{it.description}</div>
                    <div className="col-span-2 text-center font-mono text-slate-400">{it.quantity}</div>
                    <div className="col-span-3 text-right font-mono text-sky-400 font-bold">{it.total} {selectedInvoice.currency}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Due */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-sky-500/30 flex items-center justify-between">
              <span className="text-sm font-bold text-white">{isAr ? 'المبلغ الإجمالي المطلوب:' : 'Grand Total:'}</span>
              <span className="text-xl font-extrabold font-mono text-emerald-400">
                {selectedInvoice.totalAmount} {selectedInvoice.currency}
              </span>
            </div>

            {/* Payment instructions */}
            <div className="p-3 bg-sky-950/30 border border-sky-500/30 rounded-2xl text-xs space-y-1">
              <div className="font-bold text-sky-400 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" />
                <span>{isAr ? 'بيانات التحويل والدفع المعتمدة:' : 'Approved Payment Instructions:'}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {isAr 
                  ? `يرجى تحويل المبلغ عبر Whish Money أو OMT أو كاش إلى الرقم المعتمد: ${selectedInvoice.paymentPhone}` 
                  : `Please remit total payment to phone line: ${selectedInvoice.paymentPhone} via Whish/OMT.`}
              </p>
              <div className="text-[11px] text-slate-500 font-mono mt-1">
                {isAr ? 'لأي استفسار أو مراجعة: خط سمسات 03983010' : 'Support line: 03983010'}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>

              <div className="flex items-center gap-2 flex-wrap justify-end">
                <button
                  onClick={() => handleExportPdf(selectedInvoice)}
                  disabled={exportingPdfId === selectedInvoice.id}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 font-mono shadow-md transition-colors disabled:opacity-50"
                  title={isAr ? 'تحميل الفاتورة كملف PDF' : 'Download PDF file'}
                >
                  {exportingPdfId === selectedInvoice.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileDown className="w-3.5 h-3.5" />
                  )}
                  <span>{exportingPdfId === selectedInvoice.id ? (isAr ? 'جاري التصدير...' : 'Exporting...') : (isAr ? 'تحميل ملف PDF' : 'Download PDF')}</span>
                </button>

                <button
                  onClick={() => handleSendWhatsApp(selectedInvoice)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 font-mono shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إرسال للزبون على واتساب' : 'Send WhatsApp'}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 font-mono shadow-md"
                >
                  <Printer className="w-3.5 h-3.5 text-sky-400" />
                  <span>{isAr ? 'طباعة' : 'Print'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
