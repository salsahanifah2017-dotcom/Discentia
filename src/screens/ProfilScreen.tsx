import React, { useState } from 'react';
import { 
  Settings, 
  Sun, 
  Moon, 
  Bell, 
  Database, 
  HelpCircle, 
  Info, 
  LogOut, 
  ChevronRight, 
  Check, 
  Download, 
  Upload, 
  RotateCcw,
  User,
  X
} from 'lucide-react';
import { UserProfile, TaskItem, AgendaItem, FocusHistoryItem } from '../types';

interface ProfilScreenProps {
  user: UserProfile;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  tasks: TaskItem[];
  agendas: AgendaItem[];
  focusHistory: FocusHistoryItem[];
  onResetAllData: () => void;
}

export const ProfilScreen: React.FC<ProfilScreenProps> = ({
  user,
  darkMode,
  onToggleDarkMode,
  onUpdateUser,
  tasks,
  agendas,
  focusHistory,
  onResetAllData,
}) => {
  const [activeModal, setActiveModal] = useState<'account' | 'storage' | 'help' | 'about' | 'logout' | null>(null);

  // Edit user form state
  const [nameInput, setNameInput] = useState(user.name);
  const [roleInput, setRoleInput] = useState(user.role);
  const [emailInput, setEmailInput] = useState(user.email);

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = nameInput
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    onUpdateUser({
      name: nameInput,
      role: roleInput,
      email: emailInput,
      initials: initials || 'SH',
    });
    setActiveModal(null);
  };

  const handleExportData = () => {
    const backup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      user,
      tasks,
      agendas,
      focusHistory,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discentia-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-5 py-6 pb-28 space-y-6 animate-in fade-in duration-300">
      {/* Top Profile Card */}
      <div className="flex flex-col items-center justify-center text-center space-y-2 pt-2">
        <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold text-2xl flex items-center justify-center ring-4 ring-blue-50 dark:ring-blue-900/40 shadow-sm">
          {user.initials}
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 dark:text-white tracking-tight">
            {user.name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {user.role}
          </p>
        </div>
      </div>

      {/* Menu List */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-xs divide-y divide-slate-100 dark:divide-slate-700/60 overflow-hidden text-xs">
        {/* Pengaturan Akun */}
        <button
          onClick={() => setActiveModal('account')}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Pengaturan Akun
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Tampilan */}
        <button
          onClick={onToggleDarkMode}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Tampilan
            </span>
          </div>
          <div className="flex items-center space-x-1 text-slate-400">
            <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        {/* Notifikasi */}
        <button
          onClick={() => setActiveModal('help')}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Notifikasi
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Data & Penyimpanan */}
        <button
          onClick={() => setActiveModal('storage')}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Data & Penyimpanan
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Bantuan */}
        <button
          onClick={() => setActiveModal('help')}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Bantuan
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Tentang Aplikasi */}
        <button
          onClick={() => setActiveModal('about')}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Tentang Aplikasi
            </span>
          </div>
          <div className="flex items-center space-x-1 text-slate-400">
            <span>v1.0.0</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* Keluar Button */}
      <div className="pt-2">
        <button
          onClick={() => setActiveModal('logout')}
          className="w-full py-3 px-4 border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-100/60 text-rose-600 dark:text-rose-400 font-semibold text-xs rounded-2xl transition flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <LogOut className="w-4 h-4 rotate-180" />
          <span>Keluar</span>
        </button>
      </div>

      {/* Account Modal */}
      {activeModal === 'account' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setActiveModal(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl z-10 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                Edit Profil Pengguna
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveAccount} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Peran / Status
                </label>
                <input
                  type="text"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  placeholder="Mahasiswa"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Email Kampus
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Storage & Backup Modal */}
      {activeModal === 'storage' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setActiveModal(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl z-10 border border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                Data & Penyimpanan
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 mt-4">
              <p className="text-slate-500 dark:text-slate-400">
                Semua tugas, jadwal agenda, dan catatan waktu fokus tersimpan secara offline di browser perangkat ini.
              </p>
              <button
                onClick={handleExportData}
                className="w-full py-2.5 px-3 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-100 transition"
              >
                <Download className="w-4 h-4" />
                <span>Cadangkan Data (JSON)</span>
              </button>
              <button
                onClick={() => {
                  if (confirm('Kembalikan semua data ke contoh awal?')) {
                    onResetAllData();
                    setActiveModal(null);
                  }
                }}
                className="w-full py-2.5 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-200 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset ke Data Demo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {activeModal === 'help' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setActiveModal(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl z-10 border border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                Panduan Penggunaan
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 mt-4 text-slate-600 dark:text-slate-300">
              <div className="p-3 bg-blue-50 dark:bg-slate-800 rounded-xl">
                <strong className="block text-slate-800 dark:text-white font-bold mb-0.5">1. Semua Tugas</strong>
                Tandai checklist langkah per langkah agar tugas terasa ringan dan terkontrol.
              </div>
              <div className="p-3 bg-blue-50 dark:bg-slate-800 rounded-xl">
                <strong className="block text-slate-800 dark:text-white font-bold mb-0.5">2. Pomodoro Fokus</strong>
                Gunakan teknik 25 menit fokus penuh tanpa distraksi lalu istirahat 5 menit.
              </div>
              <div className="p-3 bg-blue-50 dark:bg-slate-800 rounded-xl">
                <strong className="block text-slate-800 dark:text-white font-bold mb-0.5">3. Jadwal & Agenda</strong>
                Sinkronkan jadwal kuliah, rapat organisasi, dan waktu belajar mandiri.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setActiveModal(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl z-10 border border-slate-100 dark:border-slate-800 text-xs text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-3 shadow-md">
              D
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              Discentia Mobile
            </h3>
            <p className="text-slate-400 mt-1">Versi 1.0.0 (Release Build)</p>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-[11px] leading-relaxed">
              Dirancang khusus untuk membantu mahasiswa mengorganisasi tugas kuliah, jadwal agenda harian, dan melatih fokus belajar dengan metode Pomodoro.
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="mt-5 w-full py-2.5 bg-blue-600 text-white font-semibold rounded-xl"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Logout confirm Modal */}
      {activeModal === 'logout' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setActiveModal(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl z-10 border border-slate-100 dark:border-slate-800 text-xs text-center">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">
              Keluar dari Sesi?
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Data kamu tetap tersimpan di penyimpanan browser lokal. Kamu dapat kembali kapan saja.
            </p>
            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                }}
                className="flex-1 py-2.5 bg-rose-600 text-white font-semibold rounded-xl"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
