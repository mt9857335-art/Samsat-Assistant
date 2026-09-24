import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatSection } from './components/ChatSection';
import { TasksBoard } from './components/TasksBoard';
import { ExecutiveBriefing } from './components/ExecutiveBriefing';
import { NotesSection } from './components/NotesSection';
import { SamsatCard } from './components/SamsatCard';
import { InvoicesSection } from './components/InvoicesSection';
import { AppointmentsSection } from './components/AppointmentsSection';
import { RadarSection } from './components/RadarSection';
import { GmailSection } from './components/GmailSection';
import { SubscriptionsSection } from './components/SubscriptionsSection';
import { MonthlyReportSection } from './components/MonthlyReportSection';
import { ReceiversSection } from './components/ReceiversSection';
import { 
  ActiveTab, 
  ChatMessage, 
  TaskItem, 
  SamNote, 
  ExecutiveBriefingData,
  Invoice,
  AppointmentItem,
  GmailMessageItem,
  CustomerSubscription
} from './types';
import { speakText } from './utils/speech';

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [briefingLoading, setBriefingLoading] = useState(false);

  const isAr = lang === 'ar';

  // Invoices state with initial defaults
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('samsat_invoices');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'inv-1',
        invoiceNumber: 'INV-4091',
        customerName: 'فادي نجم',
        customerPhone: '70891234',
        customerAddress: 'بيروت - الحمرا',
        items: [
          { id: '1', description: 'تشريج خط ألفا شهر كامل ($22.73)', quantity: 1, unitPrice: 23, total: 23 },
          { id: '2', description: 'كفر حماية أصلي ضد الصدمات', quantity: 1, unitPrice: 7, total: 7 },
        ],
        subtotal: 30,
        discount: 0,
        totalAmount: 30,
        currency: 'USD',
        paymentPhone: '71186492',
        paymentStatus: 'unpaid',
        notes: 'يرجى تحويل المبلغ عبر Whish Money أو OMT على الرقم المعتمد: 71186492',
        createdAt: '1 آذار 2025',
      },
      {
        id: 'inv-2',
        invoiceNumber: 'INV-3980',
        customerName: 'طارق عبد الله',
        customerPhone: '03456789',
        customerAddress: 'صيدا',
        items: [
          { id: '1', description: 'كرت إنترنت فائق السرعة (باقة شهرية)', quantity: 1, unitPrice: 15, total: 15 },
        ],
        subtotal: 15,
        discount: 0,
        totalAmount: 15,
        currency: 'USD',
        paymentPhone: '71186492',
        paymentStatus: 'paid',
        notes: 'تم الدفع بنجاح عبر Whish على رقم 71186492',
        createdAt: '28 شباط 2025',
      },
    ];
  });

  // Appointments state with initial defaults
  const [appointments, setAppointments] = useState<AppointmentItem[]>(() => {
    const saved = localStorage.getItem('samsat_appointments');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    const today = new Date().toISOString().split('T')[0];
    return [
      {
        id: 'apt-1',
        title: 'تسليم شحنة كروت تشريج ألفا وتاتش',
        clientName: 'الموزع زياد كرم',
        clientPhone: '71123456',
        date: today,
        time: '12:30',
        location: 'محل سام - بيروت',
        status: 'scheduled',
        notes: 'تأكيد إحضار إيصالات الاستلام، وإرسال تذكير بالموعد عبر الواتساب',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'apt-2',
        title: 'صيانة وبرمجة سيرفر الاتصالات',
        clientName: 'مؤسسة الأفق',
        clientPhone: '03765432',
        date: today,
        time: '16:00',
        location: 'المكتب الرئيسي',
        status: 'scheduled',
        notes: 'موعد عمل هام لسام',
        createdAt: new Date().toISOString(),
      },
    ];
  });

  // Gmail Messages
  const [gmailMessages, setGmailMessages] = useState<GmailMessageItem[]>(() => {
    const saved = localStorage.getItem('samsat_gmail');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'mail-1',
        fromName: 'شركة تاتش (Touch Support)',
        fromEmail: 'support@touch.com.lb',
        subject: 'تحديث أسعار باقات البيانات وتجديد التراخيص الشهرية',
        snippet: 'حضرة الوكيل المحترم، نود إعلامكم بتحديث جدول حصص البيانات الشهرية الخاصة بالوكلاء ابتداءً من الأسبوع القادم...',
        date: 'اليوم، 10:45 ص',
        isRead: false,
        category: 'invoices',
        draftReply: 'حضرة إدارة تاتش المحترمة، تم استلام التحديثات وسيقوم الأستاذ سام بمراجعتها شخصياً.',
        replyApprovedBySam: false,
      },
      {
        id: 'mail-2',
        fromName: 'الزبون فراس العلي',
        fromEmail: 'firas.ali@gmail.com',
        subject: 'طلب تشريج لشركتنا وفاتورة رسمية',
        snippet: 'مرحبا أستاذ سام، بدنا فاتورة لتشريج خطوط الشركة مع رقم التحويل المعتمد لنحول المبلغ...',
        date: 'أمس، 04:20 م',
        isRead: true,
        category: 'clients',
        draftReply: 'أهلاً بك أستاذ فراس. تم تجهيز الفاتورة، ورقم التحويل المعتمد هو: 71186492. نتواصل معك لتأكيد إتمام العملية.',
        replyApprovedBySam: false,
      },
    ];
  });

  // Customer subscriptions state
  const [subscriptions, setSubscriptions] = useState<CustomerSubscription[]>(() => {
    const today = new Date();
    const dVip = new Date(today);
    dVip.setDate(dVip.getDate() + 320);
    const dShamna = new Date(today);
    dShamna.setDate(dShamna.getDate() + 290);
    const dMarvel = new Date(today);
    dMarvel.setDate(dMarvel.getDate() + 340);
    const dDh = new Date(today);
    dDh.setDate(dDh.getDate() + 15);
    const dMagic = new Date(today);
    dMagic.setDate(dMagic.getDate() + 210);
    const d1 = new Date(today);
    d1.setDate(d1.getDate() + 24);
    const d2 = new Date(today);
    d2.setDate(d2.getDate() + 3);
    const d3 = new Date(today);
    d3.setDate(d3.getDate() - 2);

    const defaultSubs: CustomerSubscription[] = [
      {
        id: 'sub-vip2-sam',
        name: 'الأستاذ سام (ترخيص رئيسي Forever VIP 2)',
        phone: '03983010',
        address: 'بيروت - مركز SAM SAT الرئيسي',
        serviceType: 'اشتراك Forever VIP 2 سنة كاملة (شيرينغ بين سبورت والأقمار)',
        startDate: new Date(today.getTime() - 45 * 86400000).toISOString().split('T')[0],
        endDate: dVip.toISOString().split('T')[0],
        price: 75,
        currency: 'USD',
        paymentStatus: 'paid',
        notes: 'الاشتراك الملكي المعتمد لسام - شيرينغ فضائي beIN Sports بدون تقطيع، صوتيات فوريفر وتايم شفت دقيق',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'sub-shamna-1',
        name: 'جورج معلوف',
        phone: '03554433',
        address: 'المتن - انطلياس',
        serviceType: 'اشتراك شامنا IPTV سنة كاملة (Shamna Pro 4K)',
        startDate: new Date(today.getTime() - 75 * 86400000).toISOString().split('T')[0],
        endDate: dShamna.toISOString().split('T')[0],
        price: 35,
        currency: 'USD',
        paymentStatus: 'paid',
        notes: 'شاشة LG WebOS - باقة القنوات اللبنانية والسورية و beIN Sports كاملة، تحويل Whish على 71186492',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'sub-marvel-1',
        name: 'طارق شمس الدين',
        phone: '71987654',
        address: 'بيروت - قريطم',
        serviceType: 'اشتراك مارفل IPTV سنة كاملة (Marvel 4K VIP)',
        startDate: new Date(today.getTime() - 25 * 86400000).toISOString().split('T')[0],
        endDate: dMarvel.toISOString().split('T')[0],
        price: 45,
        currency: 'USD',
        paymentStatus: 'paid',
        notes: 'جهاز Apple TV 4K - باقات 4K الحقيقية وأضخم مكتبة أفلام ومسلسلات VOD، دفع Whish',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'sub-dh-1',
        name: 'فادي حمود',
        phone: '76112233',
        address: 'صيدا - الهلالية',
        serviceType: 'اشتراك دي إتش IPTV ستة أشهر (DH Plus Ultra)',
        startDate: new Date(today.getTime() - 165 * 86400000).toISOString().split('T')[0],
        endDate: dDh.toISOString().split('T')[0],
        price: 25,
        currency: 'USD',
        paymentStatus: 'paid',
        notes: 'قارب على الانتهاء (15 يوماً متبقية) - سيرفر قوي جداً وثابت في مباريات دوري أبطال أوروبا',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'sub-magic-1',
        name: 'حسان بزيع',
        phone: '70889900',
        address: 'صور - الحوش',
        serviceType: 'اشتراك ماجيك IPTV سنة كاملة (Magic Pro VIP)',
        startDate: new Date(today.getTime() - 155 * 86400000).toISOString().split('T')[0],
        endDate: dMagic.toISOString().split('T')[0],
        price: 30,
        currency: 'USD',
        paymentStatus: 'paid',
        notes: 'ريسيفر Magic 9000 4K Ultra - تفعيل تلقائي عبر الكود المباشر MAGIC-PRO',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'sub-1',
        name: 'مروان حداد',
        phone: '70123456',
        address: 'بيروت - الأشرفية، شارع ساسين',
        serviceType: 'تشريج خط ألفا شهري ($23)',
        startDate: new Date(today.getTime() - 6 * 86400000).toISOString().split('T')[0],
        endDate: d1.toISOString().split('T')[0],
        price: 23,
        currency: 'USD',
        paymentStatus: 'paid',
        notes: 'التحويل تم عبر Whish على رقم 71186492',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'sub-2',
        name: 'سارة عبد النور',
        phone: '76891234',
        address: 'صيدا - شارع المصارف',
        serviceType: 'اشتراك إنترنت فائق السرعة',
        startDate: new Date(today.getTime() - 27 * 86400000).toISOString().split('T')[0],
        endDate: d2.toISOString().split('T')[0],
        price: 15,
        currency: 'USD',
        paymentStatus: 'paid',
        notes: 'قارب على الانتهاء - إرسال تذكير بالواتساب للتجديد',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'sub-3',
        name: 'كريم البابا',
        phone: '03456789',
        address: 'طرابلس - الميناء',
        serviceType: 'تشريج خط تاتش شهري ($23)',
        startDate: new Date(today.getTime() - 32 * 86400000).toISOString().split('T')[0],
        endDate: d3.toISOString().split('T')[0],
        price: 23,
        currency: 'USD',
        paymentStatus: 'unpaid',
        notes: 'منتهي - التواصل معه عبر واتساب سمسات 03983010',
        createdAt: new Date().toISOString(),
      },
    ];

    const saved = localStorage.getItem('samsat_subscriptions');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasVipOrIptv = parsed.some((s: CustomerSubscription) => 
            s.serviceType?.toLowerCase().includes('vip') ||
            s.serviceType?.includes('شامنا') ||
            s.serviceType?.toLowerCase().includes('marvel') ||
            s.serviceType?.toLowerCase().includes('dh') ||
            s.serviceType?.includes('ماجيك')
          );
          if (hasVipOrIptv) {
            return parsed;
          }
          // Merge with initial defaults so user sees VIP2 and IPTV immediately
          return [...defaultSubs.slice(0, 5), ...parsed];
        }
      } catch {}
    }
    return defaultSubs;
  });

  // Tasks state with initial defaults
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('samsat_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 't-1',
        title: 'مراجعة فواتير الزبائن وتحويلات الدفع على رقم 71186492',
        priority: 'high',
        category: 'فواتير',
        completed: false,
        dueDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      },
      {
        id: 't-2',
        title: 'تذكير زبائن مواعيد اليوم عبر واتساب سمسات (03983010)',
        priority: 'high',
        category: 'مواعيد',
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 't-3',
        title: 'متابعة قراءة بريد الجيميل والاطلاع على إيميلات شركات الاتصال',
        priority: 'medium',
        category: 'بريد',
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 't-4',
        title: 'متابعة استعدادات نادي برشلونة لمباراة الليغا القادمة',
        priority: 'low',
        category: 'رياضة',
        completed: true,
        createdAt: new Date().toISOString(),
      },
    ];
  });

  // Notes state with initial defaults
  const [notes, setNotes] = useState<SamNote[]>(() => {
    const saved = localStorage.getItem('samsat_notes');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'n-1',
        title: 'بيانات وأرقام تشغيل سمسات لسام',
        content: '• رقم واتساب سمسات للتواصل: 03983010\n• رقم دفع وتحويل الزبائن: 71186492 (Whish / OMT)\n• قواعد العمل: الرد على الزبائن بحسب توجيه سام، التذكير بالمواعيد، جمع الفواتير والتشريجات باحتراف، متابعة العملات والطقس ونادي برشلونة، ومتابعة الجيميل ومنع الرد إلا بإذن سام.',
        category: 'بيانات رسمية',
        updatedAt: 'اليوم',
      },
      {
        id: 'n-2',
        title: 'قائمة أسعار التشريجات والخدمات الشائعة',
        content: '• تشريج خط ألفا شهر: 23$\n• تشريج خط تاتش شهر: 23$\n• تشريج أيام تاتش/ألفا: 5$\n• كروت إنترنت سريعة: 15$\n• تحويل الدفع للزبائن حصراً على الرقم: 71186492',
        category: 'تشريجات',
        updatedAt: 'أمس',
      },
    ];
  });

  // Chat messages
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('samsat_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'm-init',
        role: 'assistant',
        content: `أهلاً بك يا أستاذ سام! أنا "سمسات" (Samsat)، مساعدك الشخصي والتنفيذي، وأعمل في خدمتك وتحت إمرتك دائماً.

أنا جاهز لجميع مهامي الخمس الموكلة إليك:
1. الرد على استفسارات الزبائن وإرسال الرسائل حسب طلبك عبر واتساب سمسات (03983010).
2. إعداد وإتقان فواتير الزبائن والتشريجات بدقة متناهية وتضمين رقم الدفع والتحويل المعتمد: 71186492.
3. التذكير بالمواعيد وجدولتها وإرسال تذكيرات للزبائن بنقرة واحدة.
4. تقديم رادار العملات اليومي، الطقس، وأحدث أخبار فريقك المفضل نادي برشلونة الإسباني!
5. قراءة ومتابعة بريد الجيميل والالتزام بالقاعدة الصارمة: عدم الرد على أي إيميل إلا بأمر مباشر وصريح منك.

أنا رهن إشارتك يا سام، بمَ نبدأ الآن؟`,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  // Briefing state
  const [briefing, setBriefing] = useState<ExecutiveBriefingData | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('samsat_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('samsat_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('samsat_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('samsat_gmail', JSON.stringify(gmailMessages));
  }, [gmailMessages]);

  useEffect(() => {
    localStorage.setItem('samsat_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('samsat_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('samsat_messages', JSON.stringify(messages));
  }, [messages]);

  // Sync document direction and lang
  useEffect(() => {
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isAr]);

  // Load initial briefing on first mount
  useEffect(() => {
    fetchBriefing();
  }, []);

  const fetchBriefing = async () => {
    setBriefingLoading(true);
    try {
      const res = await fetch('/api/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks,
          notes,
          dateStr: new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US'),
        }),
      });
      const data = await res.json();
      setBriefing({
        greeting: data.greeting || (isAr ? 'طاب يومك يا أستاذ سام!' : 'Good day, Sam!'),
        summary: data.summary || (isAr ? 'أنا سمسات، مساعدك الخاص وأعمل لديك. جميع أعمالك ومواعيدك وفواتيرك تحت الرقابة والمتابعة.' : 'Samsat is actively monitoring your workflow.'),
        priorities: data.priorities || [
          isAr ? 'متابعة الفواتير والتشريجات ومراجعة دفعات الزبائن (رقم التحويل 71186492)' : 'Follow up on client invoices (Payment: 71186492)',
          isAr ? 'فحص المواعيد المجدولة وتأكيدها عبر الواتساب' : 'Review scheduled appointments & WhatsApp reminders',
          isAr ? 'متابعة صندوق الجيميل دون الرد إلا بأمرك' : 'Monitor Gmail inbox with strict zero auto-reply',
        ],
        quote: data.quote || (isAr ? 'الاسم سمسات.. ويعمل لخدمة ونجاح سام دائماً!' : 'Name is Samsat.. Serving Sam always!'),
        weatherSummary: data.weatherSummary,
        barcaHighlight: data.barcaHighlight,
        currencyHighlight: data.currencyHighlight,
      });
    } catch (err) {
      console.warn('Failed to load briefing', err);
      setBriefing({
        greeting: isAr ? 'أهلاً بك يا أستاذ سام، يوم موفق ومليء بالنجاح!' : 'Welcome Sam, wishing you a productive day!',
        summary: isAr ? 'أنا سمسات، مساعدك الشخصي وأعمل لخدمتك في كافة الأوقات.' : 'I am Samsat, your personal assistant serving you around the clock.',
        priorities: [
          isAr ? 'مراجعة الفواتير والتشريجات والتحويلات على رقم 71186492' : 'Review client billing on line 71186492',
          isAr ? 'تأكيد مواعيد الزبائن لليوم' : 'Confirm today’s client meetings',
          isAr ? 'قراءة بريد الجيميل والاطلاع على المستجدات' : 'Monitor Gmail correspondence',
        ],
        quote: isAr ? 'معاً نحقق أعلى مستويات الإنجاز يا سام!' : 'Together achieving the highest standards, Sam!',
        weatherSummary: isAr ? 'أجواء معتدلة، يوم مثالي للعمل والإنتاجية.' : 'Mild weather, ideal for business productivity.',
        barcaHighlight: isAr ? 'فورسا بارسا دائماً يا سام! برشلونة في أتم الجاهزية.' : 'Força Barça! Squad is fully focused.',
        currencyHighlight: isAr ? 'متابعة مستمرة لأسعار الصرف بالليرة والدولار.' : 'Constant tracking of USD / LBP rates.',
      });
    } finally {
      setBriefingLoading(false);
    }
  };

  // Handle Send Chat Message
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          contextInfo: {
            employer: 'سام (Sam)',
            assistant: 'سمسات (Samsat)',
            samsatPhone: '03983010',
            clientPaymentPhone: '71186492',
            approvedReceivers: [
              { name: 'ماجيك (Magic)', updateSite: 'https://magictvbox.com' },
              { name: 'ستار سات (StarSat)', updateSite: 'https://swdw.net' },
              { name: 'سيناتور (Senator)', updateSite: 'https://senator-support.com' },
              { name: 'ميديا ستار (MediaStar)', updateSite: 'https://mediastar.co' },
              { name: 'تايجر (Tiger)', updateSite: 'https://tiger-sat.net' },
            ],
            pendingTasksCount: tasks.filter(t => !t.completed).length,
            invoicesCount: invoices.length,
            subscribersCount: subscriptions.length,
            todayAppointmentsCount: appointments.filter(a => a.status === 'scheduled').length,
          },
        }),
      });

      const data = await res.json();
      const replyContent = data.text || (isAr ? 'تحت أمرك يا سام، أنا سمسات في خدمتك دائماً.' : 'At your service, Sam, I am Samsat always ready.');

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);

      // Speak if audio is enabled
      if (audioEnabled) {
        speakText(replyContent, isAr ? 'ar-SA' : 'en-US');
      }
    } catch (error) {
      console.error('Chat error', error);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: isAr 
          ? 'عذراً يا سام، واجهت عائقاً بسيطاً في الاتصال، لكنني سمسات وجاهز دائماً لمعاودة المحاولة.'
          : 'Pardon me Sam, encountered a minor glitch but Samsat is ready to try again.',
        timestamp: new Date().toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Invoice handlers
  const handleAddInvoice = (newInv: Invoice) => {
    setInvoices(prev => [newInv, ...prev]);
  };

  const handleUpdateInvoice = (updated: Invoice) => {
    setInvoices(prev => prev.map(inv => inv.id === updated.id ? updated : inv));
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  // Subscription handlers
  const handleAddSubscription = (newSub: CustomerSubscription) => {
    setSubscriptions(prev => [newSub, ...prev]);
  };

  const handleUpdateSubscription = (updated: CustomerSubscription) => {
    setSubscriptions(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
  };

  // Appointment handlers
  const handleAddAppointment = (newApt: AppointmentItem) => {
    setAppointments(prev => [newApt, ...prev]);
  };

  const handleToggleAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'completed' ? 'scheduled' : 'completed' } : a));
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  // Gmail handlers
  const handleApproveAndSendReply = (mailId: string, replyText: string) => {
    setGmailMessages(prev => prev.map(m => m.id === mailId ? { ...m, replyApprovedBySam: true, draftReply: replyText } : m));
  };

  const handleAddGmail = (msg: GmailMessageItem) => {
    setGmailMessages(prev => [msg, ...prev]);
  };

  // Task operations
  const handleAddTask = (newTask: Omit<TaskItem, 'id' | 'createdAt'>) => {
    const task: TaskItem = {
      ...newTask,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [task, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Note operations
  const handleAddNote = (newNote: Omit<SamNote, 'id' | 'updatedAt'>) => {
    const note: SamNote = {
      ...newNote,
      id: `note-${Date.now()}`,
      updatedAt: new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US'),
    };
    setNotes(prev => [note, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handlePolishNote = async (note: SamNote) => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `أنت سمسات وتعمل لدى سام. قم بتحسين وصياغة وتطوير هذه الملاحظة لسام بطريقة احترافية وتنفيذية أنيقة:\nالعنوان: ${note.title}\nالمحتوى: ${note.content}`,
            },
          ],
        }),
      });
      const data = await res.json();
      if (data.text) {
        setNotes(prev => prev.map(n => n.id === note.id ? { ...n, content: data.text, updatedAt: isAr ? 'معدلة بواسطة سمسات' : 'Polished by Samsat' } : n));
      }
    } catch (e) {
      console.warn('Failed to polish note', e);
    }
  };

  // Extract tasks via AI
  const handleExtractTasksWithAI = async (text: string) => {
    try {
      const res = await fetch('/api/extract-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (Array.isArray(data.tasks)) {
        const newTasks: TaskItem[] = data.tasks.map((item: any, idx: number) => ({
          id: `ai-task-${Date.now()}-${idx}`,
          title: item.title,
          priority: item.priority || 'medium',
          category: item.category || (isAr ? 'مستخرج' : 'Extracted'),
          completed: false,
          createdAt: new Date().toISOString(),
        }));
        setTasks(prev => [...newTasks, ...prev]);
      }
    } catch (e) {
      console.warn('Task extraction failed', e);
    }
  };

  const handleResetChat = () => {
    const freshMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      role: 'assistant',
      content: isAr 
        ? 'جلسة جديدة بدأت! أنا سمسات، مساعدك الخاص وأعمل لدى سام بكل إخلاص. بمَ نبدأ اليوم يا سام؟'
        : 'Fresh session started! I am Samsat, working dedicatedly for Sam. What shall we tackle today, Sam?',
      timestamp: new Date().toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([freshMessage]);
  };

  const pendingTasksCount = tasks.filter(t => !t.completed).length;
  const completedTasksCount = tasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200 flex flex-col selection:bg-sky-500 selection:text-white relative overflow-x-hidden">
      {/* Sleek ambient grid background */}
      <div className="fixed inset-0 sleek-grid-bg opacity-15 pointer-events-none" />

      {/* Persistent App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
        pendingTasksCount={pendingTasksCount}
        completedTasksCount={completedTasksCount}
      />

      {/* Main Workspace Area with Sleek Operator Telemetry Strip */}
      <div className="max-w-7xl w-full mx-auto px-4 pt-4 sm:px-6 relative z-10">
        {/* Sleek Work Order & Status Ribbon */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-4 sm:p-5 backdrop-blur-md mb-4 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-sky-950/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-black/40">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider">
                WORK ORDER 8829
              </span>
              <span className="text-slate-600 text-xs">•</span>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ACTIVE DEPLOYMENT
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-light text-white leading-tight">
              {isAr ? (
                <>يعمل حالياً لدى <span className="font-bold text-sky-400">سام</span></>
              ) : (
                <>Currently deployed for <span className="font-bold text-sky-400">Sam</span></>
              )}
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              {isAr 
                ? 'ينفذ سمسات المهام والخدمات اللوجستية والتنفيذية المسندة من المشغل الرئيسي (سام).'
                : 'Currently executing assigned logistics and high-priority directives for Primary Operator Sam.'}
            </p>

            {/* Quick action chips to switch tabs */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
              <button
                onClick={() => setActiveTab('subscriptions')}
                className={`text-[11px] font-mono px-2.5 py-0.5 rounded-lg border transition-colors flex items-center gap-1 ${
                  activeTab === 'subscriptions' ? 'bg-sky-500 text-slate-950 font-bold border-sky-400' : 'bg-slate-950/60 text-slate-300 border-slate-700 hover:border-sky-500/40'
                }`}
              >
                <span>👥</span>
                <span>{isAr ? 'الزبائن والاشتراكات' : 'Clients & Subs'}</span>
              </button>

              <button
                onClick={() => setActiveTab('invoices')}
                className={`text-[11px] font-mono px-2.5 py-0.5 rounded-lg border transition-colors flex items-center gap-1 ${
                  activeTab === 'invoices' ? 'bg-sky-500 text-slate-950 font-bold border-sky-400' : 'bg-slate-950/60 text-slate-300 border-slate-700 hover:border-sky-500/40'
                }`}
              >
                <span>🧾</span>
                <span>{isAr ? 'الفواتير (رقم الدفع: 71186492)' : 'Invoices (Pay: 71186492)'}</span>
              </button>

              <button
                onClick={() => setActiveTab('appointments')}
                className={`text-[11px] font-mono px-2.5 py-0.5 rounded-lg border transition-colors flex items-center gap-1 ${
                  activeTab === 'appointments' ? 'bg-sky-500 text-slate-950 font-bold border-sky-400' : 'bg-slate-950/60 text-slate-300 border-slate-700 hover:border-sky-500/40'
                }`}
              >
                <span>⏰</span>
                <span>{isAr ? 'المواعيد والتذكير' : 'Appointments'}</span>
              </button>

              <button
                onClick={() => setActiveTab('radar')}
                className={`text-[11px] font-mono px-2.5 py-0.5 rounded-lg border transition-colors flex items-center gap-1 ${
                  activeTab === 'radar' ? 'bg-sky-500 text-slate-950 font-bold border-sky-400' : 'bg-slate-950/60 text-slate-300 border-slate-700 hover:border-sky-500/40'
                }`}
              >
                <span>⚽</span>
                <span>{isAr ? 'العملات والطقس وبرشلونة' : 'Barca & Rates'}</span>
              </button>

              <button
                onClick={() => setActiveTab('gmail')}
                className={`text-[11px] font-mono px-2.5 py-0.5 rounded-lg border transition-colors flex items-center gap-1 ${
                  activeTab === 'gmail' ? 'bg-sky-500 text-slate-950 font-bold border-sky-400' : 'bg-slate-950/60 text-slate-300 border-slate-700 hover:border-sky-500/40'
                }`}
              >
                <span>✉️</span>
                <span>{isAr ? 'بريد الجيميل (بدون رد)' : 'Gmail (Read-Only)'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="text-center p-2.5 sm:p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 min-w-[85px] sm:min-w-[100px]">
              <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400">71186492</div>
              <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-bold tracking-widest">{isAr ? 'رقم الدفع' : 'Payment Line'}</div>
            </div>
            <div className="text-center p-2.5 sm:p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 min-w-[85px] sm:min-w-[100px]">
              <div className="text-lg sm:text-xl font-bold font-mono text-sky-400">03983010</div>
              <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-bold tracking-widest">{isAr ? 'خط سمسات' : 'Samsat Line'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pb-4 sm:px-6 relative z-10">
        {activeTab === 'chat' && (
          <ChatSection
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onAddTask={handleAddTask}
            onAddNote={handleAddNote}
            lang={lang}
            audioEnabled={audioEnabled}
            onResetChat={handleResetChat}
          />
        )}

        {activeTab === 'receivers' && (
          <ReceiversSection lang={lang} />
        )}

        {activeTab === 'subscriptions' && (
          <SubscriptionsSection
            subscriptions={subscriptions}
            onAddSubscription={handleAddSubscription}
            onUpdateSubscription={handleUpdateSubscription}
            onDeleteSubscription={handleDeleteSubscription}
            onOpenMonthlyReport={() => setActiveTab('monthlyReport')}
            lang={lang}
          />
        )}

        {activeTab === 'invoices' && (
          <InvoicesSection
            invoices={invoices}
            onAddInvoice={handleAddInvoice}
            onUpdateInvoice={handleUpdateInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            lang={lang}
          />
        )}

        {activeTab === 'monthlyReport' && (
          <MonthlyReportSection
            subscriptions={subscriptions}
            invoices={invoices}
            appointments={appointments}
            lang={lang}
          />
        )}

        {activeTab === 'appointments' && (
          <AppointmentsSection
            appointments={appointments}
            onAddAppointment={handleAddAppointment}
            onToggleStatus={handleToggleAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            lang={lang}
          />
        )}

        {activeTab === 'radar' && (
          <RadarSection lang={lang} />
        )}

        {activeTab === 'gmail' && (
          <GmailSection
            messages={gmailMessages}
            onApproveAndSendReply={handleApproveAndSendReply}
            onAddMessage={handleAddGmail}
            lang={lang}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksBoard
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onExtractTasksWithAI={handleExtractTasksWithAI}
            lang={lang}
          />
        )}

        {activeTab === 'briefing' && (
          <ExecutiveBriefing
            briefing={briefing}
            isLoading={briefingLoading}
            onRefresh={fetchBriefing}
            lang={lang}
          />
        )}

        {activeTab === 'notes' && (
          <NotesSection
            notes={notes}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
            onPolishNoteWithSamsat={handlePolishNote}
            lang={lang}
          />
        )}

        {activeTab === 'profile' && (
          <SamsatCard lang={lang} />
        )}
      </main>

      {/* Footer styled as Sleek Interface */}
      <footer className="border-t border-slate-800/50 bg-slate-900/40 py-3 text-slate-500 relative z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-slate-400">
            <span className="text-sky-400 font-bold">SAMSAT INTERFACE</span>
            <span className="text-slate-600">•</span>
            <span>WHATSAPP: 03983010</span>
            <span className="text-slate-600 hidden md:inline">•</span>
            <span className="hidden md:inline text-emerald-400">CLIENT PAY: 71186492</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            SYSTEM ID: SMSAT-SAM-001-ALPHA • <span className="text-sky-400 font-semibold">{isAr ? '«الاسم samsat يعمل لدى سام»' : '"Name is samsat, works for Sam"'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
