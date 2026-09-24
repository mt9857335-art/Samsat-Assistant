export type Priority = 'high' | 'medium' | 'low';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  priority: Priority;
  category: string;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
}

export interface SamNote {
  id: string;
  title: string;
  content: string;
  category: string;
  updatedAt: string;
}

export interface ExecutiveBriefingData {
  greeting: string;
  summary: string;
  priorities: string[];
  quote: string;
  weatherSummary?: string;
  barcaHighlight?: string;
  currencyHighlight?: string;
}

// Invoices & Billing
export interface InvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: InvoiceLine[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  currency: 'USD' | 'LBP';
  paymentPhone: string; // 71186492
  paymentStatus: 'unpaid' | 'paid' | 'partial';
  notes?: string;
  createdAt: string;
  dueDate?: string;
}

// Appointments
export interface AppointmentItem {
  id: string;
  title: string;
  clientName: string;
  clientPhone: string;
  date: string;
  time: string;
  location?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

// Gmail Monitoring
export interface GmailMessageItem {
  id: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  snippet: string;
  date: string;
  isRead: boolean;
  category: 'urgent' | 'clients' | 'invoices' | 'general';
  draftReply?: string;
  replyApprovedBySam?: boolean;
}

// Radar: Barca, Currencies, Weather
export interface CurrencyRates {
  usdToLbp: number;
  eurToUsd: number;
  lastUpdated: string;
}

export interface WeatherInfo {
  city: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: string;
  forecast: string;
}

export interface BarcaNewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  date: string;
  type: 'match' | 'transfer' | 'news';
}

// Customer Subscriptions Record
export interface CustomerSubscription {
  id: string;
  name: string;
  phone: string;
  address: string;
  serviceType: string;
  startDate: string;
  endDate: string;
  price: number;
  currency: 'USD' | 'LBP';
  paymentStatus: 'paid' | 'unpaid' | 'pending';
  notes?: string;
  createdAt: string;
}

export interface MonthlyReportSummary {
  periodLabel: string;
  totalSubscribers: number;
  activeSubscribers: number;
  expiringThisMonth: number;
  expiredThisMonth: number;
  totalInvoicesCount: number;
  totalRevenueUSD: number;
  totalRevenueLBP: number;
  totalUnpaidUSD: number;
  whatsappFormattedText: string;
  executiveNotes: string;
}

// Approved Satellite Receivers & Software Update Support
export interface ReceiverTopModel {
  model: string;
  resolution: string; // '4K Ultra HD' | 'Full HD 1080p' | 'Android 4K'
  server: string;
  specs: string;
}

export interface ApprovedReceiver {
  id: string;
  brandKey: 'magic' | 'starsat' | 'senator' | 'mediastar' | 'tiger';
  nameAr: string;
  nameEn: string;
  badge: string;
  badgeColor: string;
  description: string;
  officialUpdateUrl: string; // الموقع الرسمي لتحميل التحديثات والسوفتوير
  backupUpdateUrl: string;   // موقع الدعم واللودر البديل
  officialWebsiteUrl: string; // الموقع الرسمي للشركة
  channelListUrl: string;    // موقع ملفات القنوات الحديثة
  serverSupportUrl?: string; // موقع فحص وتجديد السيرفر
  defaultServers: string[];  // ['Forever Pro', 'Apollo IPTV', etc.]
  serverActivationCode: string; // كود التفعيل مثل "F1 + 000" أو "8899"
  topModels: ReceiverTopModel[];
  updateMethodSteps: string[];
  keyFeatures: string[];
  tipsForSam: string;
  isPopularInLebanon: boolean;
}

export interface CustomerDeviceRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  brand: 'magic' | 'starsat' | 'senator' | 'mediastar' | 'tiger';
  model: string;
  serialNumber?: string;
  serverType: string;
  serverExpireDate?: string;
  lastUpdatedDate: string;
  notes?: string;
}

export type ActiveTab = 
  | 'chat' 
  | 'subscriptions'
  | 'invoices' 
  | 'receivers'
  | 'monthlyReport'
  | 'appointments' 
  | 'radar' 
  | 'gmail' 
  | 'tasks' 
  | 'notes' 
  | 'briefing' 
  | 'profile';

