import React, { useState } from 'react';
import { 
  Mail, 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  Send, 
  Sparkles, 
  Clock, 
  Eye, 
  AlertTriangle,
  FileText,
  User,
  Plus,
  RefreshCw,
  Search,
  Check
} from 'lucide-react';
import { GmailMessageItem } from '../types';

interface GmailSectionProps {
  messages: GmailMessageItem[];
  onApproveAndSendReply: (messageId: string, replyText: string) => void;
  onAddMessage: (msg: GmailMessageItem) => void;
  lang: 'ar' | 'en';
}

const DEFAULT_EMAILS: GmailMessageItem[] = [
  {
    id: 'mail-1',
    fromName: 'شركة تاتش (Touch Support)',
    fromEmail: 'support@touch.com.lb',
    subject: 'تحديث أسعار باقات البيانات وتجديد التراخيص الشهرية',
    snippet: 'حضرة الوكيل المحترم، نود إعلامكم بتحديث جدول حصص البيانات الشهرية الخاصة بالوكلاء ابتداءً من الأسبوع القادم...',
    date: 'اليوم، 10:45 ص',
    isRead: false,
    category: 'invoices',
    draftReply: 'حضرة إدارة تاتش المحترمة، تم استلام التحديثات وسيقوم الأستاذ سام بمراجعتها. شكراً لكم.',
    replyApprovedBySam: false,
  },
  {
    id: 'mail-2',
    fromName: 'الزبون فراس العلي',
    fromEmail: 'firas.ali@gmail.com',
    subject: 'استفسار بخصوص تجديد 5 خطوط ألفا سنوية وفاتورة الشركات',
    snippet: 'مرحبا أستاذ سام، حابب أستفسر عن أسعار التجديد السنوي لـ 5 خطوط وإذا ممكن فاتورة رسمية مع رقم التحويل للدفع...',
    date: 'أمس، 04:20 م',
    isRead: true,
    category: 'clients',
    draftReply: 'أهلاً وسهلاً بك أستاذ فراس. تم تجهيز الفاتورة لك، ويمكنك سداد المبلغ على رقم التحويل المعتمد 71186492. نتواصل معك عبر الواتساب لتفاصيل إضافية.',
    replyApprovedBySam: false,
  },
  {
    id: 'mail-3',
    fromName: 'خدمات Google Cloud & AI',
    fromEmail: 'billing-noreply@google.com',
    subject: 'كشف حساب الشهري للاشتراكات والخدمات السحابية',
    snippet: 'تم إصدار الفاتورة الإلكترونية لحسابكم المسجل. يرجى الاطلاع على التفاصيل المرفقة...',
    date: '28 شباط',
    isRead: true,
    category: 'general',
    replyApprovedBySam: false,
  },
];

export const GmailSection: React.FC<GmailSectionProps> = ({
  messages = DEFAULT_EMAILS,
  onApproveAndSendReply,
  onAddMessage,
  lang,
}) => {
  const isAr = lang === 'ar';

  const [activeList, setActiveList] = useState<GmailMessageItem[]>(messages.length > 0 ? messages : DEFAULT_EMAILS);
  const [selectedMail, setSelectedMail] = useState<GmailMessageItem | null>(activeList[0] || null);
  const [customReplyDraft, setCustomReplyDraft] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleSelectMail = (mail: GmailMessageItem) => {
    setSelectedMail(mail);
    setCustomReplyDraft(mail.draftReply || '');
    setShowReplyBox(false);
  };

  const handleGenerateDraft = async (mail: GmailMessageItem) => {
    setIsGeneratingReply(true);
    try {
      const res = await fetch('/api/customer-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerQuestion: mail.snippet,
          samDirection: 'صياغة رد رسمي ومقتضب من مكتب سام مع الترحيب بالمرسل',
          includePaymentInfo: mail.category === 'clients' || mail.category === 'invoices',
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setCustomReplyDraft(data.reply);
        setShowReplyBox(true);
      }
    } catch (e) {
      console.warn('Reply drafting failed:', e);
    } finally {
      setIsGeneratingReply(false);
    }
  };

  const handleSamApprovalAndSend = () => {
    if (!selectedMail) return;
    const updated = activeList.map(m => m.id === selectedMail.id ? { ...m, replyApprovedBySam: true, draftReply: customReplyDraft } : m);
    setActiveList(updated);
    setSelectedMail({ ...selectedMail, replyApprovedBySam: true, draftReply: customReplyDraft });
    
    setActionNotice(isAr ? 'تم اعتماد الرد من سام بنجاح وتجهيز الإرسال!' : 'Reply approved by Sam and queued for dispatch!');
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div className="space-y-5">
      {/* Strict Policy Banner */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900/80 to-slate-900/90 border border-red-500/30 rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.25)]">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-semibold bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-0.5 rounded-full uppercase">
                  {isAr ? 'بروتوكول الأمان والحماية الصارم' : 'STRICT MONITORING PROTOCOL'}
                </span>
                <span className="text-xs text-amber-400 font-mono flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  {isAr ? 'ممنوع الرد التلقائي' : 'ZERO AUTO-REPLY'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                {isAr ? 'متابعة وقراءة بريد الجيميل (Gmail)' : 'Gmail Inbox Monitor & Guard'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                {isAr 
                  ? '«توجيه سام الصارم لسمسات: قراءة وتلخيص ومتابعة الإيميلات فقط — ممنوع الرد على أي إيميل إلا إذا طلب سام وأمر بذلك شخصياً».' 
                  : "Sam's Strict Rule: Read & monitor inbox only. Never reply unless explicitly commanded and authorized by Sam."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs font-mono text-slate-300 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              <span>Mturky15@gmail.com</span>
            </div>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-400 flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Gmail Inbox Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Email List Column */}
        <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800/70 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-white">
                {isAr ? 'البريد الوارد لسام' : 'Inbox Messages'} ({activeList.length})
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              {isAr ? 'مزامنة مباشرة' : 'LIVE SYNC'}
            </span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {activeList.map((mail) => (
              <div
                key={mail.id}
                onClick={() => handleSelectMail(mail)}
                className={`p-3 rounded-xl border transition-all cursor-pointer text-xs space-y-1.5 ${
                  selectedMail?.id === mail.id
                    ? 'bg-sky-500/10 border-sky-500/40 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800/70 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white truncate max-w-[170px]">
                    {mail.fromName}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {mail.date}
                  </span>
                </div>

                <div className="text-slate-200 font-medium truncate">
                  {mail.subject}
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {mail.snippet}
                </p>

                <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
                  <span className="text-slate-500">{mail.fromEmail}</span>
                  {mail.replyApprovedBySam ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      {isAr ? 'معتمد من سام' : 'APPROVED'}
                    </span>
                  ) : (
                    <span className="text-amber-400/80 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      {isAr ? 'بانتظار أمر سام' : 'LOCKED'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Reading & Action Column */}
        <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800/70 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4 flex flex-col justify-between">
          {selectedMail ? (
            <div className="space-y-4">
              {/* Message Header */}
              <div className="border-b border-slate-800/80 pb-3 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-bold text-white leading-snug">
                    {selectedMail.subject}
                  </h3>
                  <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800 flex-shrink-0">
                    {selectedMail.date}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  <span className="font-semibold">{selectedMail.fromName}</span>
                  <span className="text-slate-500 font-mono">&lt;{selectedMail.fromEmail}&gt;</span>
                </div>
              </div>

              {/* Message Body Content */}
              <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 text-xs text-slate-200 leading-relaxed min-h-[140px]">
                <p className="whitespace-pre-line">{selectedMail.snippet}</p>
                <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500 italic">
                  {isAr 
                    ? 'تم فحص محتوى الرسالة وتلخيصه لسام بواسطة سمسات. لا يتم الرد إلا بموافقة سام الصريحة.' 
                    : 'Scanned and summarized by Samsat for Sam. No response is issued without explicit authorization.'}
                </div>
              </div>

              {/* Sam Command Action Guard */}
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <Lock className="w-4 h-4" />
                    <span>{isAr ? 'إجراء سمسات تحت إشراف سام:' : "Samsat Action under Sam's Command:"}</span>
                  </div>

                  <button
                    onClick={() => handleGenerateDraft(selectedMail)}
                    disabled={isGeneratingReply}
                    className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 border border-sky-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors font-mono disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAr ? 'صياغة مسودة رد لسام' : 'Draft Reply'}</span>
                  </button>
                </div>

                {/* Draft text area */}
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={customReplyDraft}
                    onChange={(e) => setCustomReplyDraft(e.target.value)}
                    placeholder={isAr ? 'اكتب أو صغ مسودة الرد التي تريد من سمسات إرسالها بعد موافقتك...' : 'Draft response here...'}
                    className="w-full bg-[#0B0F1A] border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 leading-relaxed"
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
                    <span className="text-[11px] text-slate-400">
                      {isAr ? '⚠️ يتطلب ضغط الزر التالي لموافقة سام الصريحة:' : 'Requires explicit approval button from Sam:'}
                    </span>

                    <button
                      onClick={handleSamApprovalAndSend}
                      disabled={!customReplyDraft.trim()}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-colors shadow-md disabled:opacity-40"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isAr ? 'أمر صريح من سام: اعتماد وإرسال' : "Sam's Command: Approve & Send"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-12 text-slate-500 text-xs">
              {isAr ? 'اختر رسالة من القائمة لقراءتها' : 'Select an email to inspect'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
