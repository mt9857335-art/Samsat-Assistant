import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  Copy, 
  Check, 
  PlusCircle, 
  Bookmark, 
  RotateCcw,
  Bot,
  User,
  ShieldAlert
} from 'lucide-react';
import { ChatMessage, TaskItem, SamNote } from '../types';
import { speakText } from '../utils/speech';
import { SamSatLogo } from './SamSatLogo';

interface ChatSectionProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onAddTask: (task: Omit<TaskItem, 'id' | 'createdAt'>) => void;
  onAddNote: (note: Omit<SamNote, 'id' | 'updatedAt'>) => void;
  lang: 'ar' | 'en';
  audioEnabled: boolean;
  onResetChat: () => void;
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onAddTask,
  onAddNote,
  lang,
  audioEnabled,
  onResetChat,
}) => {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isAr = lang === 'ar';

  const quickPrompts = isAr
    ? [
        { label: '📊 تجهيز التقرير الشهري وإرساله للواتساب', text: 'يا سمسات، جهز لي ملخص التقرير الشهري المفصل لإيرادات واشتراكات هذا الشهر وصغه برسالة مرتبة لأرسلها على الواتساب لرقمي 03983010.' },
        { label: '🧾 صغ فاتورة لزبون مع رقم 71186492', text: 'يا سمسات، اكتب لي فاتورة احترافية لزبون طلب تشريج خط ألفا شهر مع إكسسوار شاحن، وضع رقم التحويل 71186492.' },
        { label: '👥 اشتراكات الزبائن المنتهية للتجديد', text: 'يا سمسات، راجع لي سجل الزبائن والاشتراكات، واذكر لي من شارف اشتراكه على الانتهاء وصغ رسائل تذكير لتجديدهم برقم التحويل 71186492.' },
        { label: '⚽ آخر أخبار نادي برشلونة والطقس والعملات', text: 'يا سمسات، زودني بآخر أخبار نادي برشلونة الإسباني، وتحديث الطقس وأسعار الصرف اليوم.' },
        { label: '⏰ تذكير بمواعيدي المجدولة لليوم', text: 'يا سمسات، ما هي مواعيدي المجدولة لليوم ومن هم الزبائن الواجب تذكيرهم عبر الواتساب؟' },
        { label: '✉️ متابعة بريد الجيميل دون الرد', text: 'يا سمسات، لخص لي الرسائل الجديدة الواردة على بريد الجيميل، وتذكر ألا ترد على أي إيميل إلا بأمري الصريح.' },
        { label: '💬 صياغة رد على زبون', text: 'يا سمسات، أريد منك صياغة رد مهذب ومقنع لزبون يسأل عن أسعار التشريج وطريقة الدفع عبر رقمنا 71186492.' },
      ]
    : [
        { label: "🧾 Draft Client Invoice (Pay: 71186492)", text: "Samsat, draft an invoice for a customer recharging Alfa monthly + accessories, including payment phone 71186492." },
        { label: '⚽ FC Barcelona & Radar Updates', text: "Samsat, provide me the latest FC Barcelona match news, weather report, and current exchange rates." },
        { label: '⏰ Check Today’s Appointments', text: "Samsat, what appointments do I have scheduled today, and prepare WhatsApp reminders for clients." },
        { label: '✉️ Monitor Gmail (Read-Only)', text: "Samsat, summarize new emails in my Gmail inbox. Remember: strictly do not reply without my order." },
        { label: '💬 Draft Customer Reply', text: "Samsat, draft a polite customer response about our top-up rates and transfer line 71186492." },
      ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput('');
    await onSendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateTaskFromMessage = (content: string) => {
    const title = content.split('\n')[0].replace(/[*#]/g, '').slice(0, 70);
    onAddTask({
      title: title || (isAr ? 'مهمة مستخرجة بواسطة سمسات' : 'Task extracted by Samsat'),
      priority: 'high',
      category: isAr ? 'عمل' : 'Work',
      completed: false,
    });
    setActionNotice(isAr ? 'تمت إضافة المهمة بنجاح إلى مهام سام!' : "Added to Sam's tasks!");
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleSaveToNotes = (content: string) => {
    const title = content.split('\n')[0].replace(/[*#]/g, '').slice(0, 50);
    onAddNote({
      title: title || (isAr ? 'ملاحظة من محادثة سمسات' : 'Note from Samsat chat'),
      content: content,
      category: isAr ? 'محادثة' : 'Chat',
    });
    setActionNotice(isAr ? 'تم حفظ المحتوى في مفكرة سام!' : "Saved to Sam's notebook!");
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Web Speech recognition (if browser supports it)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(isAr ? 'خاصية الإملاء الصوتي غير مدعومة في هذا المتصفح' : 'Speech recognition not supported in this browser');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = isAr ? 'ar-SA' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error', event);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech recognition start failed', e);
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-210px)] min-h-[520px] bg-slate-900/50 rounded-2xl border border-slate-800/50 backdrop-blur-md shadow-2xl overflow-hidden">
      {/* Samsat Active Bar */}
      <div className="bg-slate-900/80 px-4 py-3 border-b border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <SamSatLogo size="sm" showDownloadOnHover={true} withGlow={true} />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-[0_0_6px_#10b981]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">سَمسات • SAMSAT</span>
              <span className="text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                {isAr ? 'يعمل لدى سام' : 'SERVING SAM'}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <span>{isAr ? 'المساعد التشغيلي والتنفيذي الذكي' : 'Operational AI Assistant to Sam'}</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400 font-mono text-[11px]">71186492</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {actionNotice && (
            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md animate-fade-in shadow-[0_0_8px_rgba(16,185,129,0.2)]">
              {actionNotice}
            </span>
          )}
          <button
            onClick={onResetChat}
            title={isAr ? 'بدء جلسة محادثة جديدة' : 'New chat session'}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/70 rounded-xl transition-colors text-xs flex items-center gap-1 border border-transparent hover:border-slate-700/60"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono text-[11px]">{isAr ? 'محادثة جديدة' : 'RESET'}</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-mono overflow-hidden ${
                  isUser
                    ? 'bg-gradient-to-br from-slate-600 to-slate-800 text-white font-bold border border-slate-600'
                    : 'bg-amber-500/10 border border-amber-500/30 shadow-[0_0_8px_rgba(212,175,55,0.25)] p-0.5'
                }`}
              >
                {isUser ? (
                  <span>S</span>
                ) : (
                  <SamSatLogo size="xs" withGlow={false} />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-sky-500 text-slate-950 font-medium rounded-tr-none shadow-[0_0_20px_rgba(56,189,248,0.25)]'
                    : 'bg-slate-900/70 text-slate-200 border border-slate-800/80 rounded-tl-none backdrop-blur-sm'
                }`}
              >
                <div className={`flex items-center justify-between gap-2 mb-1.5 pb-1 border-b text-[11px] font-mono ${
                  isUser ? 'border-slate-950/20 text-slate-900' : 'border-slate-800/80 text-slate-400'
                }`}>
                  <span className="font-semibold">
                    {isUser ? (isAr ? 'المشغّل الرئيسي (سام)' : 'Operator (Sam)') : (isAr ? 'سمسات (مساعد سام)' : 'Samsat (Assistant)')}
                  </span>
                  <span className="opacity-75">{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Assistant message action toolbars */}
                {!isUser && (
                  <div className="mt-3 pt-2 border-t border-slate-800 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="p-1 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors flex items-center gap-1"
                      title={isAr ? 'نسخ النص' : 'Copy'}
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span className="font-mono text-[11px]">{copiedId === msg.id ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
                    </button>

                    <button
                      onClick={() => speakText(msg.content, isAr ? 'ar-SA' : 'en-US')}
                      className="p-1 hover:text-sky-300 hover:bg-slate-800/80 rounded-lg transition-colors flex items-center gap-1"
                      title={isAr ? 'استمع صوتياً' : 'Listen'}
                    >
                      <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                      <span className="font-mono text-[11px]">{isAr ? 'استماع' : 'Listen'}</span>
                    </button>

                    <button
                      onClick={() => handleCreateTaskFromMessage(msg.content)}
                      className="p-1 hover:text-sky-300 hover:bg-sky-500/10 rounded-lg transition-colors flex items-center gap-1 text-sky-400 font-mono text-[11px]"
                      title={isAr ? 'تحويل لمهمة لسام' : 'Add to tasks'}
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إضافة كمهمة' : 'Make Task'}</span>
                    </button>

                    <button
                      onClick={() => handleSaveToNotes(msg.content)}
                      className="p-1 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors flex items-center gap-1 text-emerald-400 font-mono text-[11px]"
                      title={isAr ? 'حفظ في المفكرة' : 'Save to notes'}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{isAr ? 'حفظ للمفكرة' : 'Save Note'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800/60 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.2)]">
              <Bot className="w-4 h-4 animate-spin text-sky-400" />
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span className="font-mono text-[11px]">{isAr ? 'سمسات يجهز الرد بأعلى دقة لسام...' : 'Samsat processing directive for Sam...'}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-2.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-mono text-sky-400 font-bold whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          {isAr ? 'أوامر سريعة لسام:' : 'DIRECTIVES:'}
        </span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(p.text)}
            className="text-xs bg-slate-900 hover:bg-sky-500/15 hover:text-sky-300 hover:border-sky-500/30 text-slate-300 px-3 py-1 rounded-full border border-slate-800 whitespace-nowrap transition-colors shadow-sm"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-900/80 border-t border-slate-800/70">
        <div className="relative flex items-end gap-2 bg-[#0B0F1A] rounded-xl border border-slate-700/80 focus-within:border-sky-500 focus-within:shadow-[0_0_15px_rgba(56,189,248,0.2)] p-2 transition-all">
          <textarea
            ref={inputRef}
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isAr
                ? 'تحدث أو اطلب ما تريد من مساعدك سمسات... (Shift+Enter لسطر جديد)'
                : 'Enter directive for Samsat, Operator Sam... (Shift+Enter for newline)'
            }
            className="flex-1 bg-transparent border-0 resize-none text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-0 px-2 py-1 max-h-32"
          />

          <div className="flex items-center gap-1.5 pb-1">
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              title={isListening ? (isAr ? 'إيقاف الاستماع' : 'Stop mic') : (isAr ? 'تحدث بالصوت' : 'Voice input')}
              className={`p-2 rounded-xl transition-colors ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-[0_0_10px_#ef4444]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold hover:bg-sky-400 disabled:opacity-40 disabled:hover:bg-sky-500 transition-colors shadow-[0_0_15px_rgba(56,189,248,0.35)]"
              title={isAr ? 'إرسال' : 'Send'}
            >
              <Send className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
