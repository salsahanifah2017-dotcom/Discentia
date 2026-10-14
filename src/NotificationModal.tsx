import React from 'react';
import { X, CheckCircle2, Clock, AlertCircle, Bell, Flame } from 'lucide-react';
import { TaskItem } from '../types';
import { getUrgentTasks } from './DeadlineAlertBanner';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTask?: (taskId: string) => void;
  tasks?: TaskItem[];
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onOpenTask,
  tasks = [],
}) => {
  if (!isOpen) return null;

  interface NotificationEntry {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'danger' | 'warning' | 'info' | 'success';
    taskId?: string;
  }

  const urgentTasks = getUrgentTasks(tasks, '2026-10-14');

  // Convert real urgent tasks into dynamic notification alerts
  const taskAlerts: NotificationEntry[] = urgentTasks.map(({ task, badgeText, isUrgent }) => ({
    id: `notif-task-${task.id}`,
    title: `Deadline: ${task.title}`,
    message: `${task.course} • ${badgeText}. Jangan sampai terlambat mengumpulkan!`,
    time: 'Peringatan Sistem',
    type: isUrgent ? 'danger' : 'warning',
    taskId: task.id,
  }));

  const standardNotifications: NotificationEntry[] = [
    {
      id: 'notif-agenda-1',
      title: 'Agenda Meeting Kerja pukul 13:00',
      message: 'Siapkan poin bahan riset mahasiswa sebelum meeting dimulai.',
      time: '1 jam yang lalu',
      type: 'info',
    },
    {
      id: 'notif-focus-1',
      title: 'Sesi Fokus Selesai (25 Menit)',
      message: 'Kerja bagus! Kamu sudah menyelesaikan target sesi fokus pagi ini.',
      time: '2 jam yang lalu',
      type: 'success',
    },
  ];

  const allNotifications: NotificationEntry[] = [...taskAlerts, ...standardNotifications];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-5 z-10 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base">Notifikasi & Alert</h3>
              <p className="text-[10px] text-slate-400">
                {taskAlerts.length > 0 ? `${taskAlerts.length} tugas mendekati deadline` : 'Semua tugas terkontrol'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {allNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.taskId && onOpenTask) {
                  onOpenTask(item.taskId);
                  onClose();
                }
              }}
              className={`p-3 rounded-2xl border transition-all ${
                item.taskId ? 'cursor-pointer hover:scale-[1.01] hover:shadow-xs' : ''
              } ${
                item.type === 'danger'
                  ? 'border-rose-200 bg-rose-50/70 dark:border-rose-900/60 dark:bg-rose-950/40'
                  : item.type === 'warning'
                  ? 'border-amber-200 bg-amber-50/70 dark:border-amber-900/60 dark:bg-amber-950/30'
                  : item.type === 'success'
                  ? 'border-emerald-100 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/20'
                  : 'border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40'
              }`}
            >
              <div className="flex items-start space-x-2.5">
                {item.type === 'danger' ? (
                  <Flame className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                ) : item.type === 'warning' ? (
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                ) : item.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug truncate">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-normal">
                    {item.message}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-slate-400">
                      {item.time}
                    </span>
                    {item.taskId && (
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                        Buka Tugas →
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Tandai semua sudah dibaca
          </button>
        </div>
      </div>
    </div>
  );
};
