import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Compass, 
  Edit3, 
  Clock, 
  Sparkles,
  Volume2,
  VolumeX,
  Music2,
  CloudRain,
  Coffee,
  Headphones,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FocusHistoryItem, TaskItem } from '../types';
import { playTimerFinishSound, playClickSound } from '../utils/sound';
import { focusAudio, FocusMusicTrack, TRACK_OPTIONS } from '../utils/focusAudio';

interface FokusScreenProps {
  tasks: TaskItem[];
  focusHistory: FocusHistoryItem[];
  onAddFocusLog: (item: FocusHistoryItem) => void;
  activeTask?: TaskItem | null;
  onSelectActiveTask: (task: TaskItem | null) => void;
}

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export const FokusScreen: React.FC<FokusScreenProps> = ({
  tasks,
  focusHistory,
  onAddFocusLog,
  activeTask,
  onSelectActiveTask,
}) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [targetSession, setTargetSession] = useState('Selesaikan 3 slide presentasi');
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Focus Music State
  const [selectedTrack, setSelectedTrack] = useState<FocusMusicTrack>('lofi');
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [musicVolume, setMusicVolume] = useState<number>(0.6);
  const [autoPlayMusic, setAutoPlayMusic] = useState<boolean>(true);
  const [showMusicSettings, setShowMusicSettings] = useState<boolean>(false);

  const durationForMode: Record<TimerMode, number> = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  const timerRef = useRef<number | null>(null);

  // Switch mode
  const handleModeSwitch = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(durationForMode[newMode]);
    playClickSound();

    if (newMode !== 'focus' && isMusicPlaying) {
      // Pause focus music during break
      focusAudio.stop();
      setIsMusicPlaying(false);
    }
  };

  // Timer Tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, activeTask]);

  // Handle focus music playback
  const handleToggleMusic = (overrideTrack?: FocusMusicTrack) => {
    const trackToPlay = overrideTrack || selectedTrack;
    if (isMusicPlaying && !overrideTrack) {
      focusAudio.stop();
      setIsMusicPlaying(false);
    } else {
      focusAudio.setVolume(musicVolume);
      focusAudio.play(trackToPlay);
      setIsMusicPlaying(true);
      if (overrideTrack) setSelectedTrack(overrideTrack);
    }
  };

  const handleSelectTrack = (track: FocusMusicTrack) => {
    setSelectedTrack(track);
    playClickSound();
    if (isMusicPlaying || isRunning) {
      focusAudio.play(track);
      setIsMusicPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMusicVolume(val);
    focusAudio.setVolume(val);
  };

  const handleTimerComplete = () => {
    if (soundEnabled) {
      playTimerFinishSound();
    }

    // Stop music on complete
    focusAudio.stop();
    setIsMusicPlaying(false);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    if (mode === 'focus') {
      const minutesCompleted = Math.round(durationForMode.focus / 60);
      const newLog: FocusHistoryItem = {
        id: `foc-${Date.now()}`,
        date: '14 Okt 2026',
        durationMinutes: minutesCompleted,
        course: activeTask ? activeTask.course : 'Belajar Mandiri',
        title: targetSession || 'Sesi Fokus Belajar',
        completedAt: new Date().toISOString(),
      };
      onAddFocusLog(newLog);
    }
  };

  const toggleTimer = () => {
    playClickSound();
    const nextRunning = !isRunning;
    setIsRunning(nextRunning);

    // Auto-play / stop focus music on timer trigger
    if (autoPlayMusic && selectedTrack !== 'none') {
      if (nextRunning) {
        focusAudio.setVolume(musicVolume);
        focusAudio.play(selectedTrack);
        setIsMusicPlaying(true);
      } else {
        focusAudio.stop();
        setIsMusicPlaying(false);
      }
    }
  };

  const resetTimer = () => {
    playClickSound();
    setIsRunning(false);
    setTimeLeft(durationForMode[mode]);
    focusAudio.stop();
    setIsMusicPlaying(false);
  };

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // SVG Circular progress
  const totalSeconds = durationForMode[mode];
  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const radius = 95;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Today completed count
  const todayFocusCount = focusHistory.filter((f) => f.date.includes('14 Okt')).length;
  const dailyTargetTotal = 3;

  return (
    <div className="px-5 py-4 pb-28 space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
            Fokus
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tingkatkan konsentrasi, capai tujuan
          </p>
        </div>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={soundEnabled ? 'Matikan Suara Bell' : 'Nyalakan Suara Bell'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Linked Task Selector */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-3 border border-slate-100 dark:border-slate-700/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Tugas Terhubung:
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-white truncate block">
              {activeTask ? activeTask.title : 'Belajar Umum (Mandiri)'}
            </span>
          </div>
        </div>

        <select
          value={activeTask ? activeTask.id : 'none'}
          onChange={(e) => {
            const found = tasks.find((t) => t.id === e.target.value);
            onSelectActiveTask(found || null);
            if (found) setTargetSession(`Mengerjakan: ${found.title}`);
          }}
          className="text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-200 focus:outline-none"
        >
          <option value="none">Mandiri</option>
          {tasks.filter((t) => t.status !== 'Selesai').map((t) => (
            <option key={t.id} value={t.id}>
              {t.title.length > 20 ? t.title.slice(0, 20) + '...' : t.title}
            </option>
          ))}
        </select>
      </div>

      {/* Circular Timer Visual */}
      <div className="flex flex-col items-center justify-center pt-1">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Background circle track */}
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 220 220">
            <circle
              cx="110"
              cy="110"
              r={radius}
              stroke="currentColor"
              strokeWidth="9"
              fill="transparent"
              className="text-blue-50 dark:text-slate-800"
            />
            {/* Animated blue arc */}
            <circle
              cx="110"
              cy="110"
              r={radius}
              stroke="currentColor"
              strokeWidth="9"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-blue-400 dark:text-blue-500 transition-all duration-500 ease-linear"
            />
          </svg>

          {/* Time digits & subtitle in center */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <div className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight tabular-nums">
              {formattedTime}
            </div>
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
              {mode === 'focus' ? 'Fokus' : mode === 'shortBreak' ? 'Istirahat' : 'Istirahat Panjang'}
            </div>
            {isMusicPlaying && (
              <div className="flex items-center space-x-1 mt-2 text-[10px] text-blue-500 dark:text-blue-400 font-medium">
                <span className="w-1 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1 h-3.5 bg-blue-500 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:300ms]" />
                <span className="ml-1">Musik aktif</span>
              </div>
            )}
          </div>
        </div>

        {/* Play/Pause & Reset buttons */}
        <div className="flex items-center space-x-5 mt-3">
          <button
            onClick={toggleTimer}
            className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg shadow-blue-500/25 flex items-center justify-center transition active:scale-95"
            aria-label={isRunning ? 'Jeda' : 'Mulai'}
          >
            {isRunning ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={resetTimer}
            className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition active:scale-95 border border-slate-200/80 dark:border-slate-700"
            aria-label="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Preset Duration Buttons */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          onClick={() => handleModeSwitch('focus')}
          className={`py-2 px-1 text-center rounded-xl border transition text-xs font-semibold ${
            mode === 'focus'
              ? 'bg-blue-50/80 dark:bg-blue-950/60 border-blue-400 text-blue-600 dark:text-blue-300 shadow-xs'
              : 'bg-white dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
          }`}
        >
          <div className="font-bold text-sm">25m</div>
          <div className="text-[10px] opacity-80">Fokus</div>
        </button>

        <button
          onClick={() => handleModeSwitch('shortBreak')}
          className={`py-2 px-1 text-center rounded-xl border transition text-xs font-semibold ${
            mode === 'shortBreak'
              ? 'bg-blue-50/80 dark:bg-blue-950/60 border-blue-400 text-blue-600 dark:text-blue-300 shadow-xs'
              : 'bg-white dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
          }`}
        >
          <div className="font-bold text-sm">5m</div>
          <div className="text-[10px] opacity-80">Istirahat</div>
        </button>

        <button
          onClick={() => handleModeSwitch('longBreak')}
          className={`py-2 px-1 text-center rounded-xl border transition text-xs font-semibold ${
            mode === 'longBreak'
              ? 'bg-blue-50/80 dark:bg-blue-950/60 border-blue-400 text-blue-600 dark:text-blue-300 shadow-xs'
              : 'bg-white dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
          }`}
        >
          <div className="font-bold text-sm">15m</div>
          <div className="text-[10px] opacity-80">Istirahat Panjang</div>
        </button>
      </div>

      {/* Musik & Ambience Fokus (NEW FEATURE) */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Music2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-white">
                Musik & Suasana Fokus
              </h3>
              <p className="text-[10px] text-slate-400">
                Putar alunan peredam distraksi saat belajar
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => handleToggleMusic()}
              className={`p-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                isMusicPlaying
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
              }`}
            >
              {isMusicPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isMusicPlaying ? 'Jeda' : 'Putar'}</span>
            </button>

            <button
              onClick={() => setShowMusicSettings(!showMusicSettings)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              title="Pengaturan Musik"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Track Selection Chips */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {TRACK_OPTIONS.map((tr) => {
            const isSelected = selectedTrack === tr.id;
            return (
              <button
                key={tr.id}
                onClick={() => handleSelectTrack(tr.id)}
                className={`p-2.5 rounded-xl border text-left transition flex items-center space-x-2.5 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-xs'
                    : 'border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {tr.id === 'lofi' && <Music2 className="w-3 h-3" />}
                  {tr.id === 'rain' && <CloudRain className="w-3 h-3" />}
                  {tr.id === 'cafe' && <Coffee className="w-3 h-3" />}
                  {tr.id === 'alpha' && <Headphones className="w-3 h-3" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-bold text-[11px] truncate leading-tight">{tr.title}</div>
                  <div className="text-[9px] text-slate-400 truncate">{tr.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Music Options Expandable */}
        {showMusicSettings && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2.5 pt-2.5 border border-slate-100 dark:border-slate-700 text-xs">
            {/* Volume slider */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-slate-400 font-medium">Volume:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVolume}
                onChange={handleVolumeChange}
                className="flex-1 accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-semibold w-7 text-right">
                {Math.round(musicVolume * 100)}%
              </span>
            </div>

            {/* Auto play toggle */}
            <label className="flex items-center justify-between cursor-pointer pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                Otomatis putar saat timer fokus mulai
              </span>
              <input
                type="checkbox"
                checked={autoPlayMusic}
                onChange={(e) => setAutoPlayMusic(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </label>
          </div>
        )}
      </div>

      {/* Target Sesi & Target Hari Ini */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-white">
            Target Sesi
          </span>
          <button
            onClick={() => setIsEditingTarget(!isEditingTarget)}
            className="text-slate-400 hover:text-blue-600"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>

        {isEditingTarget ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={targetSession}
              onChange={(e) => setTargetSession(e.target.value)}
              className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-blue-400 dark:border-blue-500 bg-transparent text-slate-800 dark:text-white focus:outline-none"
            />
            <button
              onClick={() => setIsEditingTarget(false)}
              className="text-xs bg-blue-600 text-white px-2.5 py-1.5 rounded-lg font-semibold"
            >
              OK
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            {targetSession}
          </p>
        )}

        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Target Hari Ini
            </span>
            <div className="text-xs font-bold text-slate-800 dark:text-white">
              {todayFocusCount} / {dailyTargetTotal} sesi fokus
            </div>
          </div>
          <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (todayFocusCount / dailyTargetTotal) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Motivational Tip Box */}
      <div className="bg-[#f0f7ff] dark:bg-blue-950/30 rounded-2xl p-3.5 border border-blue-100 dark:border-blue-900/40 flex items-start space-x-3">
        <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
          <Compass className="w-4 h-4 stroke-[2]" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
            Mulai dari 5 menit
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Tidak perlu sempurna, yang penting mulai.
          </p>
        </div>
      </div>

      {/* Riwayat Fokus */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
          Riwayat Fokus
        </h3>
        <div className="space-y-2">
          {focusHistory.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800/90 rounded-xl p-3 border border-slate-100 dark:border-slate-700/80 shadow-xs flex items-center justify-between"
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Clock className="w-3 h-3" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                    {item.date} • {item.durationMinutes} menit
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {item.title}
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">
                {item.course}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
