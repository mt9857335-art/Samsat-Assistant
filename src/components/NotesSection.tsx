import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Copy, 
  Check, 
  FileText, 
  Sparkles,
  Calendar
} from 'lucide-react';
import { SamNote } from '../types';

interface NotesSectionProps {
  notes: SamNote[];
  onAddNote: (note: Omit<SamNote, 'id' | 'updatedAt'>) => void;
  onDeleteNote: (id: string) => void;
  onPolishNoteWithSamsat: (note: SamNote) => Promise<void>;
  lang: 'ar' | 'en';
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  onAddNote,
  onDeleteNote,
  onPolishNoteWithSamsat,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(isAr ? 'مذكرة' : 'Memo');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [polishingId, setPolishingId] = useState<string | null>(null);

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase()) ||
    n.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onAddNote({
      title: title.trim(),
      content: content.trim(),
      category: category.trim() || (isAr ? 'عام' : 'General'),
    });
    setTitle('');
    setContent('');
    setShowAddForm(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePolish = async (note: SamNote) => {
    setPolishingId(note.id);
    await onPolishNoteWithSamsat(note);
    setPolishingId(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-0.5 rounded-full">
            {isAr ? 'مفكرة سام الخاصة' : "SAM'S PRIVATE NOTEBOOK"}
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            {isAr ? 'مذكرات وملاحظات سام' : "Sam's Notes & Memoranda"}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAr 
              ? 'مساحة منظمة لأفكار سام ومشاريعه، يديرها ويحفظها سمسات بعناية.' 
              : 'Organized repository for ideas and meeting notes, guarded by Samsat.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute right-3 top-3 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isAr ? 'بحث في مفكرة سام...' : "Search notes..."}
              className="bg-[#0B0F1A] border border-slate-700/80 rounded-xl pr-8 pl-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-[0_0_15px_rgba(56,189,248,0.3)]"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'ملاحظة جديدة' : 'New Note'}</span>
          </button>
        </div>
      </div>

      {/* Add note drawer */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-sky-500/30 rounded-2xl p-4 shadow-xl space-y-3 animate-fade-in backdrop-blur-md">
          <h3 className="text-sm font-bold text-sky-400 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة فكرة أو مذكرة جديدة لسام' : 'Add New Note for Sam'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-300 mb-1">{isAr ? 'عنوان الملاحظة' : 'Note Title'}</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isAr ? 'مثال: فكرة إطلاق مشروع جديد، ملاحظات الاجتماع...' : 'e.g. Project proposal, meeting recap...'}
                className="w-full bg-[#0B0F1A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">{isAr ? 'التصنيف' : 'Category'}</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={isAr ? 'مذكرة، فكرة، عمل...' : 'Idea, Memo, Work...'}
                className="w-full bg-[#0B0F1A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">{isAr ? 'نص وتفاصيل الملاحظة' : 'Note Content'}</label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={isAr ? 'اكتب تفاصيل الملاحظة هنا...' : 'Write note details here...'}
              className="w-full bg-[#0B0F1A] border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-sky-500 text-slate-950 text-xs font-bold hover:bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
            >
              {isAr ? 'حفظ في المفكرة' : 'Save to Notes'}
            </button>
          </div>
        </form>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredNotes.length === 0 ? (
          <div className="md:col-span-2 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8 text-center backdrop-blur-sm">
            <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">
              {isAr ? 'لا توجد ملاحظات مسجلة حالياً لسام' : 'No notes registered yet for Sam'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {isAr ? 'اضغط "ملاحظة جديدة" أو احفظ أي رسالة من محادثة سمسات بنقرة واحدة!' : 'Click New Note or save messages from Samsat chat!'}
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-slate-900/50 border border-slate-800/70 hover:border-sky-500/40 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all shadow-lg group backdrop-blur-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono bg-slate-800/80 text-sky-400 border border-slate-700 px-2 py-0.5 rounded font-semibold">
                    {note.category}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-sky-400/80" />
                    {note.updatedAt}
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm mt-2 line-clamp-1">
                  {note.title}
                </h3>

                <p className="text-xs text-slate-300 mt-1 whitespace-pre-wrap leading-relaxed line-clamp-4">
                  {note.content}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePolish(note)}
                    disabled={polishingId === note.id}
                    title={isAr ? 'اطلب من سمسات تحسين وتطوير صياغة الملاحظة' : 'Ask Samsat to refine note'}
                    className="p-1 hover:text-sky-300 hover:bg-slate-800/60 rounded-lg transition-colors flex items-center gap-1 text-[11px] text-sky-400 font-mono"
                  >
                    <Sparkles className={`w-3 h-3 ${polishingId === note.id ? 'animate-spin' : ''}`} />
                    <span>{polishingId === note.id ? (isAr ? 'جاري التحسين...' : 'Refining...') : (isAr ? 'تحسين بواسطة سمسات' : 'AI REFINE')}</span>
                  </button>

                  <button
                    onClick={() => handleCopy(note.content, note.id)}
                    className="p-1 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-mono"
                    title={isAr ? 'نسخ الملاحظة' : 'Copy'}
                  >
                    {copiedId === note.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === note.id ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
                  </button>
                </div>

                <button
                  onClick={() => onDeleteNote(note.id)}
                  title={isAr ? 'حذف الملاحظة' : 'Delete note'}
                  className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-800/60 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
