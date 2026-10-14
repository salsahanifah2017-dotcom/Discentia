import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  MapPin, 
  Tag, 
  BookOpen, 
  Briefcase, 
  FileCheck, 
  UserCheck 
} from 'lucide-react';
import { AgendaItem, AgendaCategory } from '../types';

interface JadwalScreenProps {
  agendas: AgendaItem[];
  onAddAgendaClick: () => void;
  onSelectAgenda?: (agenda: AgendaItem) => void;
}

export const JadwalScreen: React.FC<JadwalScreenProps> = ({
  agendas,
  onAddAgendaClick,
  onSelectAgenda,
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-10-14');
  const [viewMode, setViewMode] = useState<'hari' | 'minggu' | 'bulan'>('hari');

  // Days of the week shown in the October 2026 header: 11 to 17
  const weekDays = [
    { dayName: 'Min', dateNum: '11', fullDate: '2026-10-11' },
    { dayName: 'Sen', dateNum: '12', fullDate: '2026-10-12' },
    { dayName: 'Sel', dateNum: '13', fullDate: '2026-10-13' },
    { dayName: 'Rab', dateNum: '14', fullDate: '2026-10-14' },
    { dayName: 'Kam', dateNum: '15', fullDate: '2026-10-15' },
    { dayName: 'Jum', dateNum: '16', fullDate: '2026-10-16' },
    { dayName: 'Sab', dateNum: '17', fullDate: '2026-10-17' },
  ];

  const getCategoryBadge = (category: AgendaCategory) => {
    switch (category) {
      case 'Kuliah':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50',
          icon: BookOpen,
        };
      case 'Kerja':
        return {
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          icon: Briefcase,
        };
      case 'Tugas':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/50',
          icon: FileCheck,
        };
      case 'Pribadi':
        return {
          bg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-900/50',
          icon: UserCheck,
        };
    }
  };

  // Filter agendas for the selected date or upcoming
  const todayAgendas = agendas.filter((a) => a.date === selectedDate);
  const weeklyAgendas = agendas.filter((a) => a.date !== selectedDate);

  return (
    <div className="px-5 py-4 pb-28 space-y-5 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
          Jadwal
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Kelola agenda dan deadline kamu
        </p>
      </div>

      {/* View Mode Pills (Hari ini, Minggu ini, Bulan ini) */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
        <button
          onClick={() => setViewMode('hari')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
            viewMode === 'hari'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Hari Ini
        </button>
        <button
          onClick={() => setViewMode('minggu')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
            viewMode === 'minggu'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Minggu ini
        </button>
        <button
          onClick={() => setViewMode('bulan')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
            viewMode === 'bulan'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Bulan ini
        </button>
      </div>

      {/* Calendar Week Strip */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/80 shadow-xs">
        {/* Month Selector */}
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="font-bold text-slate-800 dark:text-white text-sm">
            Oktober 2026
          </span>
          <div className="flex items-center space-x-1">
            <button className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDays.map((d) => {
            const isSelected = selectedDate === d.fullDate;
            return (
              <button
                key={d.fullDate}
                onClick={() => setSelectedDate(d.fullDate)}
                className="flex flex-col items-center py-1 transition group"
              >
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mb-1">
                  {d.dayName}
                </span>
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm scale-105'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {d.dateNum}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Agenda Hari Ini */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Agenda Hari Ini ({selectedDate === '2026-10-14' ? 'Rabu, 14 Okt' : selectedDate})
          </h2>
          <span className="text-xs text-slate-400">
            {todayAgendas.length} Agenda
          </span>
        </div>

        {todayAgendas.length === 0 ? (
          <div className="text-center py-8 bg-slate-50/60 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 text-xs">
            Belum ada agenda pada tanggal ini. Klik tombol tambah di bawah.
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayAgendas.map((item) => {
              const badge = getCategoryBadge(item.category);
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectAgenda && onSelectAgenda(item)}
                  className="bg-white dark:bg-slate-800/90 rounded-2xl p-3.5 border border-slate-100 dark:border-slate-700/80 shadow-xs flex items-center justify-between hover:border-blue-200 dark:hover:border-blue-900 transition cursor-pointer"
                >
                  <div className="flex items-start space-x-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                      <CalendarIcon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5 text-xs text-slate-400 dark:text-slate-400 font-medium mb-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{item.startTime} - {item.endTime}</span>
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-white text-sm truncate">
                        {item.title}
                      </h3>
                      {item.location && (
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{item.location}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border shrink-0 ${badge.bg}`}>
                    {item.category}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Jadwal Minggu Ini */}
      {viewMode !== 'hari' || weeklyAgendas.length > 0 ? (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Jadwal Minggu Ini
            </h2>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-2.5">
            {weeklyAgendas.map((item) => {
              const badge = getCategoryBadge(item.category);
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-800/90 rounded-2xl p-3.5 border border-slate-100 dark:border-slate-700/80 shadow-xs flex items-center justify-between"
                >
                  <div className="flex items-start space-x-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 mt-0.5">
                      <CalendarIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-800 dark:text-white text-sm truncate">
                        {item.course || item.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {item.title}
                      </p>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <span>{item.date} • {item.startTime} - {item.endTime}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border shrink-0 ${badge.bg}`}>
                    {item.category}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Tambah Agenda Button */}
      <div className="pt-2">
        <button
          onClick={onAddAgendaClick}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Agenda</span>
        </button>
      </div>
    </div>
  );
};
