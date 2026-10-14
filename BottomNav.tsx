import React from 'react';
import { Home, Calendar, CheckSquare, Target, User } from 'lucide-react';

export type TabKey = 'home' | 'jadwal' | 'tugas' | 'fokus' | 'profil';

interface BottomNavProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  pendingTasksCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  pendingTasksCount,
}) => {
  const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'jadwal', label: 'Jadwal', icon: Calendar },
    { key: 'tugas', label: 'Tugas', icon: CheckSquare },
    { key: 'fokus', label: 'Fokus', icon: Target },
    { key: 'profil', label: 'Profil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all rounded-xl relative ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.3]' : 'stroke-[1.8]'}`} />
                {tab.key === 'tugas' && pendingTasksCount && pendingTasksCount > 0 ? (
                  <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-3.5 bg-blue-600 text-[9px] font-bold text-white rounded-full flex items-center justify-center">
                    {pendingTasksCount}
                  </span>
                ) : null}
              </div>
              <span className={`text-[11px] mt-1 tracking-tight ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-5 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
