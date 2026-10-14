import React, { useState } from 'react';
import { AlertTriangle, Clock, ArrowRight, X, ChevronDown, ChevronUp, Play, Flame } from 'lucide-react';
import { TaskItem } from '../types';

interface DeadlineAlertBannerProps {
  tasks: TaskItem[];
  onSelectTask: (task: TaskItem) => void;
  onStartFocusOnTask: (task: TaskItem) => void;
  referenceDateStr?: string; // default "2026-10-14"
}

export interface UrgentTaskInfo {
  task: TaskItem;
  daysDiff: number;
  badgeText: string;
  isUrgent: boolean; // <= 1 day or overdue
}

export function getUrgentTasks(tasks: TaskItem[], refDateStr: string = '2026-10-14'): UrgentTaskInfo[] {
  const refDate = new Date(refDateStr + 'T00:00:00');

  const list: UrgentTaskInfo[] = [];

  tasks.forEach((task) => {
    if (task.status === 'Selesai' || !task.deadline) return;

    const taskDate = new Date(task.deadline + 'T00:00:00');
    if (isNaN(taskDate.getTime())) return;

    const diffTime = taskDate.getTime() - refDate.getTime();
    const daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Alert if overdue or due within 3 days
    if (daysDiff <= 3) {
      let badgeText = '';
      if (daysDiff < 0) {
        badgeText = `Terlambat ${Math.abs(daysDiff)} hari!`;
      } else if (daysDiff === 0) {
        badgeText = 'Deadline Hari Ini!';
      } else if (daysDiff === 1) {
        badgeText = 'Besok (1 hari lagi)';
      } else {
        badgeText = `${daysDiff} hari lagi`;
      }

      list.push({
        task,
        daysDiff,
        badgeText,
        isUrgent: daysDiff <= 1,
      });
    }
  });

  // Sort: most urgent first (lowest daysDiff)
  list.sort((a, b) => a.daysDiff - b.daysDiff);

  return list;
}

export const DeadlineAlertBanner: React.FC<DeadlineAlertBannerProps> = ({
  tasks,
  onSelectTask,
  onStartFocusOnTask,
  referenceDateStr = '2026-10-14',
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const urgentTasks = getUrgentTasks(tasks, referenceDateStr);

  if (urgentTasks.length === 0) {
    return null;
  }

  // If user dismissed the full banner, show a compact pill alert they can re-open
  if (isDismissed) {
    return (
      <div className="flex items-center justify-between p-2.5 px-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl text-xs text-amber-800 dark:text-amber-200 animate-in fade-in">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span className="font-semibold">
            {urgentTasks.length} tugas mendekati deadline
          </span>
        </div>
        <button
          onClick={() => setIsDismissed(false)}
          className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
        >
          Lihat Peringatan
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-200/90 dark:border-amber-900/60 bg-linear-to-b from-amber-50/90 via-orange-50/60 to-white dark:from-amber-950/50 dark:via-slate-900/80 dark:to-slate-900 p-4 shadow-sm space-y-3 animate-in slide-in-from-top-2 duration-300">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-400 via-rose-500 to-amber-500" />

      {/* Header bar */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 animate-pulse">
            <AlertTriangle className="w-4 h-4 stroke-[2.4]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-xs tracking-tight">
                Peringatan Deadline Tugas!
              </h3>
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-bold">
                {urgentTasks.length} Mendesak
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
              Segera selesaikan tugas berikut sebelum batas waktu berakhir.
            </p>
          </div>
        </div>

        {/* Action icons: Collapse & Dismiss */}
        <div className="flex items-center space-x-1 -mr-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            title={isExpanded ? 'Ciutkan' : 'Perluas'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition"
            title="Tutup Notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Urgent task list */}
      {isExpanded && (
        <div className="space-y-2 pt-1">
          {urgentTasks.map(({ task, daysDiff, badgeText, isUrgent }) => (
            <div
              key={task.id}
              onClick={() => onSelectTask(task)}
              className="bg-white/95 dark:bg-slate-800/90 rounded-2xl p-3 border border-amber-100 dark:border-slate-700/80 shadow-xs hover:border-amber-300 dark:hover:border-amber-700 transition cursor-pointer flex items-center justify-between group"
            >
              <div className="min-w-0 flex-1 mr-2">
                <div className="flex items-center space-x-1.5 mb-0.5">
                  <span className="font-bold text-[10px] text-blue-600 dark:text-blue-400">
                    {task.course}
                  </span>
                  <span className="text-[10px] text-slate-300 dark:text-slate-600">•</span>
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isUrgent
                        ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200/80'
                        : 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200/80'
                    }`}
                  >
                    <Flame className="w-2.5 h-2.5 fill-current" />
                    <span>{badgeText}</span>
                  </span>
                </div>

                <h4 className="font-bold text-xs text-slate-800 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {task.title}
                </h4>

                <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Deadline: {task.deadline}</span>
                  </span>
                  <span>•</span>
                  <span>{task.estimatedMinutes || 60} mnt</span>
                </div>
              </div>

              {/* Quick Focus Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onStartFocusOnTask(task);
                }}
                className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 shrink-0 shadow-xs transition active:scale-95"
              >
                <Play className="w-3 h-3 fill-current" />
                <span className="hidden xs:inline">Fokus</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
