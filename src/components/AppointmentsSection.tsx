import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  Send, 
  Phone, 
  MapPin, 
  User, 
  AlertCircle,
  Bell,
  Search,
  Sparkles
} from 'lucide-react';
import { AppointmentItem } from '../types';

interface AppointmentsSectionProps {
  appointments: AppointmentItem[];
  onAddAppointment: (appointment: AppointmentItem) => void;
  onToggleStatus: (id: string) => void;
  onDeleteAppointment: (id: string) => void;
  lang: 'ar' | 'en';
}

export const AppointmentsSection: React.FC<AppointmentsSectionProps> = ({
  appointments,
  onAddAppointment,
  onToggleStatus,
  onDeleteAppointment,
  lang,
}) => {
  const isAr = lang === 'ar';

  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed'>('all');
  const [search, setSearch] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('11:00');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment: AppointmentItem = {
      id: `apt-${Date.now()}`,
      title: title.trim() || (isAr ? 'موعد عمل' : 'Business Meeting'),
      clientName: clientName.trim() || (isAr ? 'زبون محترم' : 'Valued Client'),
      clientPhone: clientPhone.trim(),
      date,
      time,
      location: location.trim() || (isAr ? 'مكتب سام / المحل' : "Sam's Office"),
      notes: notes.trim(),
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };

    onAddAppointment(newAppointment);
    setShowAddForm(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setClientName('');
    setClientPhone('');
    setLocation('');
    setNotes('');
  };

  // WhatsApp Reminder Sender
  const handleSendReminderWhatsApp = (apt: AppointmentItem) => {
    const text = `مرحباً بك ${apt.clientName} المحترم،
تحية طيبة من طرف سام (Sam) 🌹

نود تذكيرك بموعدك المجدول معنا:
📅 التاريخ: ${apt.date}
⏰ الساعة: ${apt.time}
📌 موضوع الموعد: ${apt.title}
📍 المكان: ${apt.location || 'لبنان'}
${apt.notes ? `📝 ملاحظات: ${apt.notes}\n` : ''}
في حال رغبت بتأكيد الموعد أو تعديله، يرجى الرد على هذه الرسالة أو التواصل معنا.
شكراً جزيلاً لك ويسعدنا دائماً لقاؤك! ✨`;

    const encoded = encodeURIComponent(text);
    const cleanPhone = apt.clientPhone.replace(/[^0-9]/g, '');
    let url = '';
    if (cleanPhone.length >= 7) {
      const normalizedPhone = cleanPhone.startsWith('961') 
        ? cleanPhone 
        : cleanPhone.startsWith('0') 
          ? `961${cleanPhone.substring(1)}` 
          : `961${cleanPhone}`;
      url = `https://wa.me/${normalizedPhone}?text=${encoded}`;
    } else {
      url = `https://wa.me/?text=${encoded}`;
    }
    window.open(url, '_blank');
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === todayStr && a.status === 'scheduled');

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = a.clientName.toLowerCase().includes(search.toLowerCase()) ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.clientPhone.includes(search);
    if (filter === 'all') return matchesSearch;
    return matchesSearch && a.status === filter;
  });

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-sky-950/25">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.25)]">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-0.5 rounded-full uppercase">
                  {isAr ? 'منظومة المواعيد لسام' : "SAM'S SCHEDULE & APPOINTMENTS"}
                </span>
                <span className="text-xs text-amber-400 flex items-center gap-1 font-mono">
                  <Bell className="w-3.5 h-3.5" />
                  {isAr ? `${todayAppointments.length} مواعيد اليوم` : `${todayAppointments.length} today`}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                {isAr ? 'جدول وتذكير المواعيد اليومية' : 'Appointment Reminders & Scheduler'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isAr 
                  ? 'متابعة مواعيد الزبائن بدقة مع إمكانية إرسال تذكير فوري للزبون عبر واتساب بضغطة زر واحدة.' 
                  : 'Track client appointments and trigger instant polite WhatsApp reminders.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-[0_0_15px_rgba(56,189,248,0.3)] font-mono"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة موعد جديد' : 'NEW APPOINTMENT'}</span>
          </button>
        </div>

        {/* Today's Urgent Alerts */}
        {todayAppointments.length > 0 && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                {isAr 
                  ? `تنبيه من سمسات: لديك ${todayAppointments.length} موعد مجدول لليوم يجب تذكير الزبائن به!` 
                  : `Samsat Alert: You have ${todayAppointments.length} scheduled appointment(s) today!`}
              </span>
            </div>
            <span className="text-[11px] font-bold text-amber-400">
              {todayAppointments[0].time} • {todayAppointments[0].clientName}
            </span>
          </div>
        )}
      </div>

      {/* Add Appointment Drawer */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="bg-slate-900/80 border border-sky-500/30 rounded-2xl p-5 shadow-xl space-y-4 backdrop-blur-md animate-fade-in">
          <h3 className="text-sm font-bold text-sky-400 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'حجز وجدولة موعد لسام' : 'Schedule Appointment for Sam'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {isAr ? 'موضوع الموعد / الغرض *' : 'Purpose / Title *'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isAr ? 'مثال: تسليم جهاز، صيانة، اجتماع عمل، تشريج خطوط...' : 'e.g. Device delivery, meeting...'}
                className="w-full bg-[#0B0F1A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {isAr ? 'اسم الزبون / الطرف الآخر *' : 'Client Name *'}
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder={isAr ? 'مثال: كمال خوري' : 'Client Name'}
                className="w-full bg-[#0B0F1A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {isAr ? 'رقم هاتف الزبون (لإرسال تذكير واتساب)' : 'Client Phone'}
              </label>
              <input
                type="text"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="70xxxxxx / 03xxxxxx"
                className="w-full bg-[#0B0F1A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {isAr ? 'المكان / العنوان' : 'Location'}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={isAr ? 'المكتب، بيروت، المحل...' : 'Office, Store...'}
                className="w-full bg-[#0B0F1A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {isAr ? 'التاريخ *' : 'Date *'}
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#0B0F1A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {isAr ? 'الوقت *' : 'Time *'}
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#0B0F1A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {isAr ? 'ملاحظات إضافية' : 'Notes'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isAr ? 'تأكيد إحضار الأوراق، نوع المشكلة...' : 'Details...'}
              className="w-full bg-[#0B0F1A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold font-mono shadow-[0_0_15px_rgba(56,189,248,0.3)]"
            >
              {isAr ? 'حفظ الموعد وتأكيده' : 'Save Appointment'}
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search */}
      <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-3.5 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? 'بحث في المواعيد أو الزبائن...' : 'Search appointments...'}
            className="w-full bg-[#0B0F1A] border border-slate-700/80 rounded-xl pr-9 pl-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-sky-500 text-slate-950 font-bold' 
                : 'bg-slate-800/70 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isAr ? 'الكل' : 'All'} ({appointments.length})
          </button>
          <button
            onClick={() => setFilter('scheduled')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors ${
              filter === 'scheduled' 
                ? 'bg-amber-500 text-slate-950 font-bold' 
                : 'bg-slate-800/70 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isAr ? 'المجدولة' : 'Upcoming'} ({appointments.filter(a => a.status === 'scheduled').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors ${
              filter === 'completed' 
                ? 'bg-emerald-500 text-slate-950 font-bold' 
                : 'bg-slate-800/70 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isAr ? 'المكتملة' : 'Completed'} ({appointments.filter(a => a.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredAppointments.length === 0 ? (
          <div className="col-span-full bg-slate-900/30 border border-slate-800/60 rounded-2xl p-8 text-center backdrop-blur-sm">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-300">
              {isAr ? 'لا توجد مواعيد مسجلة حالياً' : 'No appointments scheduled'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isAr ? 'اضغط على "إضافة موعد جديد" لتسجيل وتذكير الزبائن بمواعيدهم.' : 'Click New Appointment to schedule meetings.'}
            </p>
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className={`bg-slate-900/50 border rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all shadow-xl backdrop-blur-md ${
                apt.status === 'completed' ? 'border-slate-800/50 opacity-70' : 'border-slate-800/80 hover:border-sky-500/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                    apt.status === 'completed' 
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-sky-500/15 text-sky-400 border border-sky-500/25'
                  }`}>
                    {apt.status === 'completed' ? (isAr ? 'مكتمل' : 'COMPLETED') : (isAr ? 'مجدول' : 'SCHEDULED')}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Calendar className="w-3 h-3 text-sky-400" />
                    <span>{apt.date}</span>
                    <Clock className="w-3 h-3 text-sky-400 mr-1" />
                    <span>{apt.time}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mt-2">
                  {apt.title}
                </h3>

                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <User className="w-3.5 h-3.5 text-sky-400" />
                    <span className="font-semibold">{apt.clientName}</span>
                    {apt.clientPhone && (
                      <span className="text-slate-400 font-mono">({apt.clientPhone})</span>
                    )}
                  </div>

                  {apt.location && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{apt.location}</span>
                    </div>
                  )}

                  {apt.notes && (
                    <p className="text-[11px] text-slate-400 mt-1 italic">
                      "{apt.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => onToggleStatus(apt.id)}
                  className={`text-xs font-mono font-medium flex items-center gap-1 transition-colors ${
                    apt.status === 'completed' ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{apt.status === 'completed' ? (isAr ? 'تم الإنجاز' : 'Done') : (isAr ? 'تحديد كمكتمل' : 'Mark Completed')}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSendReminderWhatsApp(apt)}
                    className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono flex items-center gap-1 transition-colors shadow-sm"
                    title={isAr ? 'إرسال تذكير بالموعد عبر واتساب' : 'Send reminder WhatsApp'}
                  >
                    <Send className="w-3 h-3" />
                    <span>{isAr ? 'تذكير واتساب' : 'WhatsApp'}</span>
                  </button>

                  <button
                    onClick={() => onDeleteAppointment(apt.id)}
                    className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
