import React from 'react';
import { X, Calendar, CheckSquare, Target, User, Sparkles, BookOpen, Clock, ShieldCheck, Heart } from 'lucide-react';
import { UserProfile, TaskItem } from '../types';
import { TabKey } from './BottomNav';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  tasks: TaskItem[];
  onNavigate: (tab: TabKey) => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  user,
  tasks,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const pendingCount = tasks.filter((t) => t.status !== 'Selesai').length;
  const completedCount = tasks.filter((t) => t.status === 'Selesai').length;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="relative w-4/5 max-w-xs bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-base flex items-center justify-center">
              {user.initials}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base leading-snug">
                {user.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user.role}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mini stats */}
        <div className="p-4 bg-blue-50/60 dark:bg-slate-800/50 m-4 rounded-2xl flex justify-around text-center">
          <div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{pendingCount}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Tugas Aktif</div>
          </div>
          <div className="w-px bg-slate-200 dark:bg-slate-700" />
          <div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{completedCount}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Tuntas</div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          <button
            onClick={() => { onNavigate('home'); onClose(); }}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition text-left"
          >
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => { onNavigate('jadwal'); onClose(); }}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition text-left"
          >
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>Jadwal & Agenda</span>
          </button>
          <button
            onClick={() => { onNavigate('tugas'); onClose(); }}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition text-left"
          >
            <CheckSquare className="w-4 h-4 text-blue-600" />
            <span>Semua Tugas Kuliah</span>
          </button>
          <button
            onClick={() => { onNavigate('fokus'); onClose(); }}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition text-left"
          >
            <Target className="w-4 h-4 text-sky-500" />
            <span>Pomodoro Fokus</span>
          </button>
          <button
            onClick={() => { onNavigate('profil'); onClose(); }}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition text-left"
          >
            <User className="w-4 h-4 text-purple-500" />
            <span>Profil & Pengaturan</span>
          </button>

          <div className="pt-4 pb-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3">
              Informasi Kuliah
            </div>
          </div>

          <div className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              <span>Semester Gasal 2026/2027</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Target Belajar: 4 Sesi / Hari</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Penyimpanan Lokal Aktif</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Discentia v1.0.0</span>
          <span className="flex items-center text-slate-500">
            Dibuat dengan <Heart className="w-3 h-3 text-red-500 mx-1 fill-red-500" />
          </span>
        </div>
      </div>
    </div>
  );
};
