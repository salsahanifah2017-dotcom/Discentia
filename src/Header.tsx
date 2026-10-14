import React from 'react';
import { Menu, Sun, Moon, Bell } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenNotifications: () => void;
  onOpenMenu: () => void;
  onOpenProfile: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  darkMode,
  onToggleDarkMode,
  onOpenNotifications,
  onOpenMenu,
  onOpenProfile,
  unreadCount = 2,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors">
      {/* Phone Status Bar Simulation */}
      <div className="flex items-center justify-between px-6 pt-2 pb-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
        <span className="tracking-tight">9:41</span>
        <div className="flex items-center space-x-1.5">
          {/* Signal */}
          <div className="flex items-end space-x-0.5 h-3">
            <span className="w-0.5 h-1 bg-current rounded-full" />
            <span className="w-0.5 h-1.5 bg-current rounded-full" />
            <span className="w-0.5 h-2 bg-current rounded-full" />
            <span className="w-0.5 h-2.5 bg-current rounded-full" />
          </div>
          {/* Wifi */}
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
          </svg>
          {/* Battery */}
          <div className="flex items-center">
            <div className="w-5 h-2.5 border border-current rounded-xs p-0.5 flex items-center">
              <div className="w-3.5 h-1.5 bg-current rounded-xs" />
            </div>
            <div className="w-0.5 h-1 bg-current rounded-r-xs" />
          </div>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="flex items-center justify-between px-4 py-2">
        <button
          onClick={onOpenMenu}
          className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5 stroke-[2.2]" />
        </button>

        <div className="flex items-center space-x-2">
          {/* Theme toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
            title={darkMode ? "Ganti ke Light Mode" : "Ganti ke Dark Mode"}
            aria-label="Mode Gelap / Terang"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Sun className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Notification bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
            aria-label="Notifikasi"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {/* User Initials Avatar */}
          <button
            onClick={onOpenProfile}
            className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center ring-2 ring-blue-50 dark:ring-blue-900 hover:scale-105 active:scale-95 transition"
            title={user.name}
          >
            {user.initials}
          </button>
        </div>
      </div>
    </header>
  );
};
