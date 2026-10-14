import React, { useState, useEffect } from 'react';
import { 
  INITIAL_USER, 
  INITIAL_TASKS, 
  INITIAL_AGENDAS, 
  INITIAL_FOCUS_HISTORY, 
  INITIAL_COURSES 
} from './data/initialData';
import { TaskItem, AgendaItem, FocusHistoryItem, UserProfile } from './types';
import { Header } from './components/Header';
import { BottomNav, TabKey } from './components/BottomNav';
import { SidebarDrawer } from './components/SidebarDrawer';
import { NotificationModal } from './components/NotificationModal';
import { HomeScreen } from './screens/HomeScreen';
import { JadwalScreen } from './screens/JadwalScreen';
import { TugasScreen } from './screens/TugasScreen';
import { FokusScreen } from './screens/FokusScreen';
import { ProfilScreen } from './screens/ProfilScreen';
import { DetailTugasModal } from './modals/DetailTugasModal';
import { TambahTugasModal } from './modals/TambahTugasModal';
import { TambahAgendaModal } from './modals/TambahAgendaModal';
import { Smartphone, Monitor } from 'lucide-react';
import { playClickSound, playSuccessSound } from './utils/sound';
import { getUrgentTasks } from './components/DeadlineAlertBanner';

export default function App() {
  // LocalStorage state initialization
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('fokusku_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem('fokusku_tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((t: TaskItem) => {
            if (t.id === 'task-1' && (!t.attachments || t.attachments.length === 0)) {
              return { ...t, attachments: INITIAL_TASKS[0].attachments };
            }
            return t;
          });
        }
      }
      return INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [agendas, setAgendas] = useState<AgendaItem[]>(() => {
    try {
      const saved = localStorage.getItem('fokusku_agendas');
      return saved ? JSON.parse(saved) : INITIAL_AGENDAS;
    } catch {
      return INITIAL_AGENDAS;
    }
  });

  const [focusHistory, setFocusHistory] = useState<FocusHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('fokusku_focus_history');
      return saved ? JSON.parse(saved) : INITIAL_FOCUS_HISTORY;
    } catch {
      return INITIAL_FOCUS_HISTORY;
    }
  });

  const [courses] = useState<string[]>(INITIAL_COURSES);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  // UI state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('fokusku_dark') === 'true';
    } catch {
      return false;
    }
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // Modals
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<TaskItem | null>(null);
  const [isTambahTugasOpen, setIsTambahTugasOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [isTambahAgendaOpen, setIsTambahAgendaOpen] = useState(false);
  const [activeFocusTask, setActiveFocusTask] = useState<TaskItem | null>(null);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('fokusku_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('fokusku_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('fokusku_agendas', JSON.stringify(agendas));
  }, [agendas]);

  useEffect(() => {
    localStorage.setItem('fokusku_focus_history', JSON.stringify(focusHistory));
  }, [focusHistory]);

  useEffect(() => {
    localStorage.setItem('fokusku_dark', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handlers
  const handleToggleTaskStatus = (taskId: string) => {
    playClickSound();
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isDone = t.status === 'Selesai';
          const newStatus = isDone ? 'Dalam proses' : 'Selesai';
          if (!isDone) playSuccessSound();
          return {
            ...t,
            status: newStatus,
            steps: t.steps.map((st) => ({ ...st, completed: !isDone })),
          };
        }
        return t;
      })
    );
  };

  const handleSaveTask = (savedTask: TaskItem) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === savedTask.id);
      if (exists) {
        return prev.map((t) => (t.id === savedTask.id ? savedTask : t));
      }
      return [savedTask, ...prev];
    });
    // If the modal was viewing this task, update it
    if (selectedTaskDetail?.id === savedTask.id) {
      setSelectedTaskDetail(savedTask);
    }
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTaskDetail?.id === taskId) {
      setSelectedTaskDetail(null);
    }
  };

  const handleSaveAgenda = (savedAgenda: AgendaItem) => {
    setAgendas((prev) => [savedAgenda, ...prev]);
  };

  const handleAddFocusLog = (newLog: FocusHistoryItem) => {
    setFocusHistory((prev) => [newLog, ...prev]);
  };

  const handleStartFocusOnTask = (task: TaskItem) => {
    setActiveFocusTask(task);
    setActiveTab('fokus');
  };

  const handleResetAllData = () => {
    localStorage.clear();
    setUser(INITIAL_USER);
    setTasks(INITIAL_TASKS);
    setAgendas(INITIAL_AGENDAS);
    setFocusHistory(INITIAL_FOCUS_HISTORY);
    setDarkMode(false);
  };

  const pendingCount = tasks.filter((t) => t.status !== 'Selesai').length;
  const urgentCount = getUrgentTasks(tasks, '2026-10-14').length;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950' : 'bg-slate-100'} transition-colors duration-200 text-slate-800 dark:text-slate-100 flex flex-col items-center justify-start`}>
      {/* Top Banner on Desktop for View Framing Toggle */}
      <div className="w-full hidden md:flex items-center justify-between px-6 py-2 bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Discentia — Mobile App Preview
          </span>
          <span className="text-slate-400">| Mode Aplikasi Mahasiswa</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPhoneFrame(true)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-medium transition ${
              isPhoneFrame
                ? 'bg-blue-600 text-white shadow-xs'
                : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Tampilan HP</span>
          </button>

          <button
            onClick={() => setIsPhoneFrame(false)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-medium transition ${
              !isPhoneFrame
                ? 'bg-blue-600 text-white shadow-xs'
                : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Layar Penuh</span>
          </button>
        </div>
      </div>

      {/* Main App Container */}
      <div
        className={`w-full transition-all duration-300 relative ${
          isPhoneFrame
            ? 'max-w-[420px] md:my-5 md:rounded-[44px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] md:border-[8px] md:border-slate-800/90 dark:md:border-slate-700 overflow-hidden bg-white dark:bg-slate-900 min-h-[840px]'
            : 'max-w-md w-full bg-white dark:bg-slate-900 shadow-md min-h-screen'
        }`}
      >
        {/* Header with status bar & app bar */}
        <Header
          user={user}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onOpenNotifications={() => setIsNotifOpen(true)}
          onOpenMenu={() => setIsSidebarOpen(true)}
          onOpenProfile={() => setActiveTab('profil')}
          unreadCount={urgentCount}
        />

        {/* Tab Screens */}
        <main className="w-full">
          {activeTab === 'home' && (
            <HomeScreen
              user={user}
              tasks={tasks}
              onNavigate={(tab) => {
                playClickSound();
                setActiveTab(tab);
              }}
              onSelectTask={(task) => setSelectedTaskDetail(task)}
              onStartFocusOnTask={handleStartFocusOnTask}
            />
          )}

          {activeTab === 'jadwal' && (
            <JadwalScreen
              agendas={agendas}
              onAddAgendaClick={() => setIsTambahAgendaOpen(true)}
            />
          )}

          {activeTab === 'tugas' && (
            <TugasScreen
              tasks={tasks}
              courses={courses}
              onSelectTask={(task) => setSelectedTaskDetail(task)}
              onToggleTaskStatus={handleToggleTaskStatus}
              onAddNewTask={() => {
                setEditingTask(null);
                setIsTambahTugasOpen(true);
              }}
            />
          )}

          {activeTab === 'fokus' && (
            <FokusScreen
              tasks={tasks}
              focusHistory={focusHistory}
              onAddFocusLog={handleAddFocusLog}
              activeTask={activeFocusTask}
              onSelectActiveTask={setActiveFocusTask}
            />
          )}

          {activeTab === 'profil' && (
            <ProfilScreen
              user={user}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
              onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
              tasks={tasks}
              agendas={agendas}
              focusHistory={focusHistory}
              onResetAllData={handleResetAllData}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            playClickSound();
            setActiveTab(tab);
          }}
          pendingTasksCount={pendingCount}
        />
      </div>

      {/* Global Modals & Drawers */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        tasks={tasks}
        onNavigate={(tab) => {
          setActiveTab(tab);
        }}
      />

      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        tasks={tasks}
        onOpenTask={(taskId) => {
          const task = tasks.find((t) => t.id === taskId);
          if (task) {
            setSelectedTaskDetail(task);
          }
        }}
      />

      {/* Detail Tugas Modal */}
      {selectedTaskDetail && (
        <DetailTugasModal
          task={selectedTaskDetail}
          isOpen={Boolean(selectedTaskDetail)}
          onClose={() => setSelectedTaskDetail(null)}
          onUpdateTask={handleSaveTask}
          onDeleteTask={handleDeleteTask}
          onStartFocus={(task) => {
            handleStartFocusOnTask(task);
          }}
          onEditClick={(task) => {
            setEditingTask(task);
            setIsTambahTugasOpen(true);
          }}
        />
      )}

      {/* Tambah / Edit Tugas Modal */}
      {isTambahTugasOpen && (
        <TambahTugasModal
          isOpen={isTambahTugasOpen}
          onClose={() => {
            setIsTambahTugasOpen(false);
            setEditingTask(null);
          }}
          onSaveTask={handleSaveTask}
          courses={courses}
          editingTask={editingTask}
        />
      )}

      {/* Tambah Agenda Modal */}
      {isTambahAgendaOpen && (
        <TambahAgendaModal
          isOpen={isTambahAgendaOpen}
          onClose={() => setIsTambahAgendaOpen(false)}
          onSaveAgenda={handleSaveAgenda}
          courses={courses}
        />
      )}
    </div>
  );
}
