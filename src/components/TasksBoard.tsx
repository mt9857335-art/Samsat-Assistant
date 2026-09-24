import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Trash2, 
  Plus, 
  Sparkles, 
  Tag, 
  ListFilter,
  CheckCheck,
  AlertCircle
} from 'lucide-react';
import { TaskItem, Priority } from '../types';

interface TasksBoardProps {
  tasks: TaskItem[];
  onAddTask: (task: Omit<TaskItem, 'id' | 'createdAt'>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onExtractTasksWithAI: (text: string) => Promise<void>;
  lang: 'ar' | 'en';
}

export const TasksBoard: React.FC<TasksBoardProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onExtractTasksWithAI,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'high'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiNoteText, setAiNoteText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState(isAr ? 'عمل' : 'Work');
  const [dueDate, setDueDate] = useState('');

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    if (filter === 'high') return task.priority === 'high' && !task.completed;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({
      title: title.trim(),
      priority,
      category: category.trim() || (isAr ? 'عام' : 'General'),
      dueDate: dueDate || undefined,
      completed: false,
    });
    setTitle('');
    setDueDate('');
    setShowAddForm(false);
  };

  const handleAiExtract = async () => {
    if (!aiNoteText.trim() || isExtracting) return;
    setIsExtracting(true);
    await onExtractTasksWithAI(aiNoteText);
    setIsExtracting(false);
    setAiNoteText('');
    setShowAiModal(false);
  };

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'high':
        return {
          label: isAr ? 'عاجل جداً' : 'HIGH PRIORITY',
          cls: 'bg-red-500/10 text-red-400 border-red-500/30 font-mono',
        };
      case 'medium':
        return {
          label: isAr ? 'متوسط' : 'MEDIUM',
          cls: 'bg-sky-500/10 text-sky-400 border-sky-500/30 font-mono',
        };
      case 'low':
        return {
          label: isAr ? 'عادي' : 'STANDARD',
          cls: 'bg-slate-800/80 text-slate-400 border-slate-700 font-mono',
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Stats for Sam */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-0.5 rounded-full font-semibold">
                {isAr ? 'إشراف سمسات المباشر لسام' : "DIRECTIVE STREAM • SAM"}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              {isAr ? 'لوحة مهام سام التنفيذية' : "Sam's Executive Task Board"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr 
                ? 'ينظم سمسات هذه القائمة لضمان إنجاز كافة أهداف وأعمال سام بدقة عالية.' 
                : 'Samsat keeps this operational agenda systematically organized for Sam.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAiModal(true)}
              className="px-3.5 py-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 hover:bg-sky-500/20 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>{isAr ? 'استخراج ذكي بواسطة سمسات' : 'AI EXTRACT'}</span>
            </button>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-[0_0_15px_rgba(56,189,248,0.3)]"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة مهمة جديدة لسام' : 'Add New Task'}</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
            <div className="flex items-center gap-3">
              <span>{isAr ? 'إجمالي التقدم لسام:' : "Completion Rate:"} <strong className="text-sky-400">{progressPercent}%</strong></span>
              <span>•</span>
              <span>{isAr ? 'قيد المتابعة:' : 'Pending:'} <strong className="text-white">{pendingCount}</strong></span>
              <span>•</span>
              <span>{isAr ? 'تم إنجازها:' : 'Completed:'} <strong className="text-emerald-400">{completedCount}</strong></span>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-sky-500 via-sky-400 to-emerald-400 transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add Task Drawer/Form */}
      {showAddForm && (
        <form onSubmit={handleCreateTask} className="bg-slate-900/80 border border-sky-500/30 rounded-2xl p-4 shadow-xl space-y-3 animate-fade-in backdrop-blur-md">
          <h3 className="text-sm font-bold text-sky-400 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'تسجيل مهمة جديدة في جدول سام' : 'Register New Task for Sam'}</span>
          </h3>

          <div>
            <label className="block text-xs text-slate-300 mb-1">{isAr ? 'عنوان المهمة' : 'Task Title'}</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isAr ? 'مثال: مراجعة العقد مع الشريك الجديد' : 'e.g. Review contract with new partner'}
              className="w-full bg-[#0B0F1A] border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">{isAr ? 'درجة الأولوية' : 'Priority'}</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-[#0B0F1A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              >
                <option value="high">{isAr ? 'عاجل جداً (High)' : 'Urgent (High)'}</option>
                <option value="medium">{isAr ? 'متوسط (Medium)' : 'Medium'}</option>
                <option value="low">{isAr ? 'عادي (Low)' : 'Low'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">{isAr ? 'التصنيف' : 'Category'}</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={isAr ? 'عمل، تقني، اتصالات...' : 'Work, Tech, Clients...'}
                className="w-full bg-[#0B0F1A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">{isAr ? 'تاريخ الاستحقاق (اختياري)' : 'Due Date (Optional)'}</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#0B0F1A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
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
              {isAr ? 'حفظ المهمة' : 'Save Task'}
            </button>
          </div>
        </form>
      )}

      {/* AI Extraction Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-sky-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold text-base text-white">
                {isAr ? 'استخراج المهام الذكي لسام بواسطة سمسات' : "Samsat AI Task Extraction for Sam"}
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              {isAr 
                ? 'الصق أي بريد، محادثة، أو خطة عمل، وسيقوم سمسات بتحليلها واستخراج مهام مرتبة ومصنفة لسام فوراً.'
                : 'Paste any text, meeting memo, or email, and Samsat will extract categorized actionable tasks for Sam.'}
            </p>

            <textarea
              rows={4}
              value={aiNoteText}
              onChange={(e) => setAiNoteText(e.target.value)}
              placeholder={isAr ? 'مثال: غداً يجب أن أتصل بالمورد لشراء أجهزة الاستقبال، وإرسال الفاتورة للمحاسب قبل الظهر...' : 'e.g. Call supplier, email invoice, finish project draft by tomorrow...'}
              className="w-full bg-[#0B0F1A] border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleAiExtract}
                disabled={!aiNoteText.trim() || isExtracting}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
              >
                {isExtracting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>{isAr ? 'سمسات يستخرج المهام...' : 'Extracting...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAr ? 'استخراج وإضافة لسام' : 'Extract & Add to Sam'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium font-mono transition-colors ${
              filter === 'all' 
                ? 'bg-slate-800 text-sky-400 border border-sky-500/30' 
                : 'text-slate-400 hover:text-white bg-slate-900/50 border border-slate-800/60'
            }`}
          >
            {isAr ? 'كل المهام' : 'ALL'} ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium font-mono transition-colors ${
              filter === 'pending' 
                ? 'bg-slate-800 text-sky-400 border border-sky-500/30' 
                : 'text-slate-400 hover:text-white bg-slate-900/50 border border-slate-800/60'
            }`}
          >
            {isAr ? 'قيد المتابعة' : 'PENDING'} ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium font-mono transition-colors ${
              filter === 'high' 
                ? 'bg-slate-800 text-red-400 border border-red-500/30' 
                : 'text-slate-400 hover:text-white bg-slate-900/50 border border-slate-800/60'
            }`}
          >
            {isAr ? 'العاجلة فقط' : 'HIGH ONLY'}
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium font-mono transition-colors ${
              filter === 'completed' 
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30' 
                : 'text-slate-400 hover:text-white bg-slate-900/50 border border-slate-800/60'
            }`}
          >
            {isAr ? 'المكتملة' : 'DONE'} ({completedCount})
          </button>
        </div>
      </div>

      {/* Task List styled sleekly */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8 text-center backdrop-blur-sm">
            <CheckCheck className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">
              {isAr ? 'لا توجد مهام مطابقة حالياً لسام' : 'No matching tasks for Sam right now'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {isAr ? 'اطلب من سمسات في المحادثة إضافة أي مهمة جديدة فوراً!' : 'You can ask Samsat in chat to schedule tasks anytime!'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const priorityBadge = getPriorityBadge(task.priority);
            return (
              <div
                key={task.id}
                className={`bg-slate-900/50 hover:bg-slate-800/40 border rounded-xl p-3.5 transition-all flex items-center justify-between gap-3 ${
                  task.completed 
                    ? 'border-slate-800/40 opacity-55' 
                    : 'border-slate-800 hover:border-sky-500/40'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="flex-shrink-0 text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span className={`px-2 py-0.5 rounded border text-[10px] ${priorityBadge.cls}`}>
                        {priorityBadge.label}
                      </span>
                      <span className="bg-slate-800/60 px-2 py-0.5 rounded text-slate-300 border border-slate-700/60 font-mono text-[10px]">
                        {task.category}
                      </span>
                      {task.dueDate && (
                        <span className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
                          <Clock className="w-3 h-3 text-sky-400" />
                          <span>{task.dueDate}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteTask(task.id)}
                  title={isAr ? 'حذف المهمة' : 'Delete Task'}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800/60 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
