import React, { useState } from 'react';
import { TrendingUp, Award, Zap, ChevronRight } from 'lucide-react';

interface DayData {
  dayName: string;
  dayShort: string;
  minutes: number;
  tasksDone: number;
  isToday?: boolean;
}

interface MiniProductivityChartProps {
  onViewDetails?: () => void;
}

export const MiniProductivityChart: React.FC<MiniProductivityChartProps> = ({ onViewDetails }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(2); // Rabu (today)

  const weeklyData: DayData[] = [
    { dayName: 'Senin', dayShort: 'Sen', minutes: 75, tasksDone: 1 },
    { dayName: 'Selasa', dayShort: 'Sel', minutes: 100, tasksDone: 2 },
    { dayName: 'Rabu', dayShort: 'Rab', minutes: 125, tasksDone: 3, isToday: true },
    { dayName: 'Kamis', dayShort: 'Kam', minutes: 50, tasksDone: 1 },
    { dayName: 'Jumat', dayShort: 'Jum', minutes: 80, tasksDone: 2 },
    { dayName: 'Sabtu', dayShort: 'Sab', minutes: 90, tasksDone: 2 },
    { dayName: 'Minggu', dayShort: 'Min', minutes: 40, tasksDone: 1 },
  ];

  const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes), 140);
  const totalMinutes = weeklyData.reduce((acc, curr) => acc + curr.minutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const selectedDay = weeklyData[selectedDayIndex];

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/80 shadow-xs space-y-3.5">
      {/* Title & View Details */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-white">
              Aktivitas Belajar Mingguan
            </h3>
            <p className="text-[10px] text-slate-400">
              Total {totalHours} jam fokus minggu ini
            </p>
          </div>
        </div>

        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-0.5"
          >
            <span>Detail</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Selected Day Tooltip Pill */}
      <div className="bg-blue-50/60 dark:bg-slate-700/40 p-2.5 rounded-xl border border-blue-100/60 dark:border-slate-700 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
          <span className="font-bold text-slate-800 dark:text-white">
            {selectedDay.dayName} {selectedDay.isToday ? '(Hari Ini)' : ''}
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            ⏱️ {selectedDay.minutes} mnt fokus
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            ✓ {selectedDay.tasksDone} tugas
          </span>
        </div>
      </div>

      {/* Mini Bar Chart */}
      <div className="pt-2">
        <div className="flex items-end justify-between gap-2 h-24 px-1">
          {weeklyData.map((d, index) => {
            const heightPercent = Math.round((d.minutes / maxMinutes) * 100);
            const isSelected = selectedDayIndex === index;

            return (
              <div
                key={d.dayShort}
                onClick={() => setSelectedDayIndex(index)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              >
                {/* Bar Value on hover/selected */}
                <span
                  className={`text-[9px] mb-1 font-bold transition-opacity ${
                    isSelected ? 'text-blue-600 dark:text-blue-400 opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {d.minutes}m
                </span>

                {/* Track background & Bar fill */}
                <div className="w-full max-w-[28px] h-16 bg-slate-100 dark:bg-slate-700/60 rounded-xl overflow-hidden flex flex-col justify-end p-0.5 transition group-hover:bg-slate-200">
                  <div
                    className={`w-full rounded-lg transition-all duration-300 ${
                      isSelected
                        ? 'bg-blue-600 dark:bg-blue-500 shadow-xs'
                        : d.isToday
                        ? 'bg-blue-400/80 dark:bg-blue-600/70'
                        : 'bg-blue-200 dark:bg-blue-900/60 group-hover:bg-blue-400'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                {/* Day label */}
                <span
                  className={`text-[10px] mt-1.5 font-medium transition ${
                    isSelected
                      ? 'font-bold text-blue-600 dark:text-blue-400'
                      : d.isToday
                      ? 'font-bold text-slate-800 dark:text-white'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {d.dayShort}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Mini Badges Footer */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-1">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Fokus Harian: <strong>{Math.round(totalMinutes / 7)} mnt/hari</strong></span>
        </div>
        <div className="flex items-center space-x-1">
          <Award className="w-3.5 h-3.5 text-blue-500" />
          <span>Konsistensi: <strong>Tinggi 🔥</strong></span>
        </div>
      </div>
    </div>
  );
};
