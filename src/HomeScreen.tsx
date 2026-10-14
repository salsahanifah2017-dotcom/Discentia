import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Inbox, 
  ChevronRight, 
  Calendar, 
  ListChecks, 
  Target, 
  BarChart3, 
  Play, 
} from 'lucide-react';
import { TaskItem, UserProfile } from '../types';
import { TabKey } from '../components/BottomNav';
import { MiniProductivityChart } from '../components/MiniProductivityChart';
import { DeadlineAlertBanner } from '../components/DeadlineAlertBanner';

interface HomeScreenProps {
  user: UserProfile;
  tasks: TaskItem[];
  onNavigate: (tab: TabKey) => void;
  onSelectTask: (task: TaskItem) => void;
  onStartFocusOnTask: (task: TaskItem) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  tasks,
  onNavigate,
  onSelectTask,
  onStartFocusOnTask,
}) => {
  // Compute dynamic stats from tasks
  const pendingTasks = tasks.filter((t) => t.status !== 'Selesai');
  const completedTasks = tasks.filter((t) => t.status === 'Selesai');
  const inProgressTasks = tasks.filter((t) => t.status === 'Dalam proses');
  const notStartedTasks = tasks.filter((t) => t.status === 'Belum mulai');

  // Featured task for today's focus (Statistika - Tabulasi Data or first high priority)
  const focusTask =
    tasks.find((t) => t.id === 'task-1') ||
    tasks.find((t) => t.priority === 'Tinggi' && t.status !== 'Selesai') ||
    tasks[0];

  const totalWeeklyTarget = 5;
  const completedWeekly = 2;
  const progressPercent = Math.round((completedWeekly / totalWeeklyTarget) * 100);

  return (
    <div className="px-5 py-4 pb-24 space-y-5 animate-in fade-in duration-300">
      {/* Header Greeting */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-1.5">
          <span>Halo, {user.name.split(' ')[0]}!</span>
          <span className="inline-block animate-wave">👋</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Semangat terus untuk hari ini.
        </p>
        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 pt-0.5">
          Rabu, 14 Oktober 2026
        </p>
      </div>

      {/* Peringatan Deadline Alert Banner */}
      <DeadlineAlertBanner
        tasks={tasks}
        onSelectTask={onSelectTask}
        onStartFocusOnTask={onStartFocusOnTask}
        referenceDateStr="2026-10-14"
      />

      {/* 2x2 Stats Cards Grid */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* 1. Tugas Tersisa */}
        <div 
          onClick={() => onNavigate('tugas')}
          className="bg-[#ebf4ff] dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40 transition hover:scale-[1.02] cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
            <FileText className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            {pendingTasks.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Tugas tersisa
          </div>
        </div>

        {/* 2. Selesai */}
        <div 
          onClick={() => onNavigate('tugas')}
          className="bg-[#e8f8f0] dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 transition hover:scale-[1.02] cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
            <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            {completedTasks.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Selesai
          </div>
        </div>

        {/* 3. Dalam Proses */}
        <div 
          onClick={() => onNavigate('tugas')}
          className="bg-[#fff4e8] dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/40 transition hover:scale-[1.02] cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2">
            <Clock className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            {inProgressTasks.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Dalam proses
          </div>
        </div>

        {/* 4. Belum Mulai */}
        <div 
          onClick={() => onNavigate('tugas')}
          className="bg-[#f3f5f8] dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 transition hover:scale-[1.02] cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700/70 flex items-center justify-center text-slate-600 dark:text-slate-300 mb-2">
            <Inbox className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            {notStartedTasks.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Belum mulai
          </div>
        </div>
      </div>

      {/* Mini Grafik Aktivitas Belajar Mingguan (NEW FEATURE) */}
      <MiniProductivityChart onViewDetails={() => onNavigate('fokus')} />

      {/* Fokus Hari Ini */}
      {focusTask && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Fokus hari ini
            </h2>
            <button
              onClick={() => onNavigate('fokus')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-0.5"
            >
              <span>Lihat semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/80 shadow-xs space-y-3.5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-300 shrink-0 mt-0.5">
                <FileText className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 
                  onClick={() => onSelectTask(focusTask)}
                  className="font-bold text-slate-800 dark:text-white text-sm hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer truncate"
                >
                  {focusTask.title}
                </h3>
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50">
                    Prioritas tinggi
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    45–60 menit
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onStartFocusOnTask(focusTask)}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Mulai mengerjakan</span>
            </button>
          </div>
        </div>
      )}

      {/* Menu Cepat */}
      <div className="space-y-2.5">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          Menu cepat
        </h2>
        <div className="grid grid-cols-4 gap-2.5">
          {/* Jadwal */}
          <button
            onClick={() => onNavigate('jadwal')}
            className="flex flex-col items-center p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 hover:border-blue-200 dark:hover:border-blue-900 transition active:scale-95 text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1.5 group-hover:bg-blue-100">
              <Calendar className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
              Jadwal
            </span>
          </button>

          {/* Semua Tugas */}
          <button
            onClick={() => onNavigate('tugas')}
            className="flex flex-col items-center p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 hover:border-blue-200 dark:hover:border-blue-900 transition active:scale-95 text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1.5 group-hover:bg-blue-100">
              <ListChecks className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
              Semua Tugas
            </span>
          </button>

          {/* Target */}
          <button
            onClick={() => onNavigate('fokus')}
            className="flex flex-col items-center p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 hover:border-blue-200 dark:hover:border-blue-900 transition active:scale-95 text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1.5 group-hover:bg-blue-100">
              <Target className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
              Target
            </span>
          </button>

          {/* Progres */}
          <button
            onClick={() => onNavigate('tugas')}
            className="flex flex-col items-center p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 hover:border-blue-200 dark:hover:border-blue-900 transition active:scale-95 text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1.5 group-hover:bg-blue-100">
              <BarChart3 className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
              Progres
            </span>
          </button>
        </div>
      </div>

      {/* Progres Mingguan */}
      <div 
        onClick={() => onNavigate('tugas')}
        className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/80 shadow-xs cursor-pointer hover:border-blue-200 dark:hover:border-blue-900 transition"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                Progres Mingguan
              </h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {completedWeekly} dari {totalWeeklyTarget} tugas selesai
              </p>
            </div>
          </div>
          <div className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
            {progressPercent}%
          </div>
        </div>

        {/* Bar */}
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-3">
          <div 
            className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
