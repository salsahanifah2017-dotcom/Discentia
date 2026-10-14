import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ChevronDown,
  X,
  Filter
} from 'lucide-react';
import { TaskItem, Priority, TaskStatus } from '../types';

interface TugasScreenProps {
  tasks: TaskItem[];
  courses: string[];
  onSelectTask: (task: TaskItem) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onAddNewTask: () => void;
}

export const TugasScreen: React.FC<TugasScreenProps> = ({
  tasks,
  courses,
  onSelectTask,
  onToggleTaskStatus,
  onAddNewTask,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'Semua' | 'Mata Kuliah' | 'Prioritas' | 'Status'>('Semua');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Filter tasks based on search & filters
  const filteredTasks = tasks.filter((t) => {
    // Search
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Course
    if (selectedCourse !== 'all' && t.course !== selectedCourse) return false;

    // Priority
    if (selectedPriority !== 'all' && t.priority !== selectedPriority) return false;

    // Status
    if (selectedStatus !== 'all' && t.status !== selectedStatus) return false;

    return true;
  });

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'Tinggi':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50';
      case 'Sedang':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50';
      case 'Rendah':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50';
    }
  };

  return (
    <div className="px-5 py-4 pb-28 space-y-4 animate-in fade-in duration-300 relative">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
          Semua Tugas
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Kelola semua tugas kuliahmu
        </p>
      </div>

      {/* Search Bar + Filter Button */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tugas..."
            className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilterDrawer(!showFilterDrawer)}
          className={`p-2.5 rounded-2xl border transition ${
            selectedCourse !== 'all' || selectedPriority !== 'all' || selectedStatus !== 'all'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
          }`}
          aria-label="Filter"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Chips Scrollable */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => {
            setActiveFilter('Semua');
            setSelectedCourse('all');
            setSelectedPriority('all');
            setSelectedStatus('all');
          }}
          className={`px-3.5 py-1.5 rounded-xl font-semibold transition shrink-0 ${
            activeFilter === 'Semua' && selectedCourse === 'all' && selectedPriority === 'all' && selectedStatus === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          Semua
        </button>

        <button
          onClick={() => {
            setActiveFilter('Mata Kuliah');
            setShowFilterDrawer(true);
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 flex items-center space-x-1 ${
            selectedCourse !== 'all'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-semibold'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <span>{selectedCourse === 'all' ? 'Mata Kuliah' : selectedCourse}</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        <button
          onClick={() => {
            setActiveFilter('Prioritas');
            setShowFilterDrawer(true);
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 flex items-center space-x-1 ${
            selectedPriority !== 'all'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-semibold'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <span>{selectedPriority === 'all' ? 'Prioritas' : selectedPriority}</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        <button
          onClick={() => {
            setActiveFilter('Status');
            setShowFilterDrawer(true);
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 flex items-center space-x-1 ${
            selectedStatus !== 'all'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-semibold'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <span>{selectedStatus === 'all' ? 'Status' : selectedStatus}</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Filter Options Expandable Panel if opened */}
      {showFilterDrawer && (
        <div className="p-3.5 bg-blue-50/70 dark:bg-slate-800/90 rounded-2xl border border-blue-100 dark:border-slate-700 space-y-3 text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              Filter Cepat
            </span>
            <button
              onClick={() => {
                setSelectedCourse('all');
                setSelectedPriority('all');
                setSelectedStatus('all');
                setActiveFilter('Semua');
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline text-[11px]"
            >
              Reset Filter
            </button>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-[11px] text-slate-400 block mb-1 font-medium">Mata Kuliah:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedCourse('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] ${
                    selectedCourse === 'all' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Semua MK
                </button>
                {courses.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCourse(c)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] ${
                      selectedCourse === c ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block mb-1 font-medium">Prioritas:</span>
              <div className="flex flex-wrap gap-1.5">
                {['all', 'Tinggi', 'Sedang', 'Rendah'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPriority(p)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] ${
                      selectedPriority === p ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {p === 'all' ? 'Semua Prioritas' : p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block mb-1 font-medium">Status:</span>
              <div className="flex flex-wrap gap-1.5">
                {['all', 'Belum mulai', 'Dalam proses', 'Selesai'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStatus(s)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] ${
                      selectedStatus === s ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {s === 'all' ? 'Semua Status' : s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400 font-medium">
              Tidak ada tugas yang sesuai kriteria.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === 'Selesai';
            return (
              <div
                key={task.id}
                className={`bg-white dark:bg-slate-800/90 rounded-2xl p-3.5 border transition-all flex items-center justify-between group hover:border-blue-200 dark:hover:border-blue-900 ${
                  isDone
                    ? 'border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 opacity-75'
                    : 'border-slate-100 dark:border-slate-700/80 shadow-xs'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1 mr-2">
                  {/* Status checkbox / radio toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTaskStatus(task.id);
                    }}
                    className="text-slate-300 hover:text-blue-600 dark:text-slate-600 dark:hover:text-blue-400 transition shrink-0"
                    aria-label="Tandai selesai"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 hover:text-blue-500" />
                    )}
                  </button>

                  {/* Task details click to open modal */}
                  <div
                    onClick={() => onSelectTask(task)}
                    className="min-w-0 flex-1 cursor-pointer"
                  >
                    <h3
                      className={`font-bold text-sm truncate leading-snug ${
                        isDone
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                      }`}
                    >
                      {task.title}
                    </h3>

                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-1">
                      <span className="font-medium text-slate-500 dark:text-slate-400">
                        {task.course}
                      </span>
                      <span>•</span>
                      <span>{task.status}</span>
                    </div>
                  </div>
                </div>

                {/* Right badges: Priority & Duration */}
                <div 
                  onClick={() => onSelectTask(task)}
                  className="flex flex-col items-end space-y-1.5 shrink-0 cursor-pointer"
                >
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${getPriorityBadge(
                      task.priority
                    )}`}
                  >
                    <span>{task.priority}</span>
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 flex items-center gap-0.5">
                    {task.estimatedMinutes ? `${task.estimatedMinutes} mnt` : '45–60 mnt'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Action Button (FAB) for adding new task */}
      <button
        onClick={onAddNewTask}
        className="fixed bottom-20 right-6 z-40 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center transition-transform"
        aria-label="Tambah Tugas"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>
    </div>
  );
};
