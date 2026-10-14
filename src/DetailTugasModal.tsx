import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, 
  MoreVertical, 
  Calendar, 
  Clock, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Play,
  UploadCloud,
  Eye,
  Download,
  Image as ImageIcon,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TaskItem, TaskStep, TaskAttachment } from '../types';
import { playSuccessSound } from '../utils/sound';

interface DetailTugasModalProps {
  task: TaskItem;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (task: TaskItem) => void;
  onDeleteTask: (taskId: string) => void;
  onStartFocus: (task: TaskItem) => void;
  onEditClick: (task: TaskItem) => void;
}

export const DetailTugasModal: React.FC<DetailTugasModalProps> = ({
  task,
  isOpen,
  onClose,
  onUpdateTask,
  onDeleteTask,
  onStartFocus,
  onEditClick,
}) => {
  if (!isOpen) return null;

  const [newStepText, setNewStepText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Toggle step completion
  const handleToggleStep = (stepId: string) => {
    const updatedSteps = task.steps.map((s) =>
      s.id === stepId ? { ...s, completed: !s.completed } : s
    );
    const completedCount = updatedSteps.filter((s) => s.completed).length;
    let newStatus = task.status;
    if (completedCount === updatedSteps.length && updatedSteps.length > 0) {
      newStatus = 'Selesai';
      playSuccessSound();
      try {
        confetti({ particleCount: 50, spread: 50 });
      } catch {
        // ignore
      }
    } else if (completedCount > 0) {
      newStatus = 'Dalam proses';
    }

    onUpdateTask({
      ...task,
      steps: updatedSteps,
      status: newStatus,
    });
  };

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepText.trim()) return;
    const newStep: TaskStep = {
      id: `step-${Date.now()}`,
      text: newStepText.trim(),
      completed: false,
    };
    onUpdateTask({
      ...task,
      steps: [...task.steps, newStep],
    });
    setNewStepText('');
  };

  const handleDeleteStep = (stepId: string) => {
    onUpdateTask({
      ...task,
      steps: task.steps.filter((s) => s.id !== stepId),
    });
  };

  const handleToggleCompleted = () => {
    const isNowDone = task.status !== 'Selesai';
    if (isNowDone) {
      playSuccessSound();
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch {
        // ignore
      }
    }
    onUpdateTask({
      ...task,
      status: isNowDone ? 'Selesai' : 'Dalam proses',
      steps: task.steps.map((s) => ({ ...s, completed: isNowDone })),
    });
  };

  // Upload new attachment directly from detail
  const handleDirectUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const sizeFormatted = file.size > 1024 * 1024 
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
          : `${Math.round(file.size / 1024)} KB`;

        const newAttachment: TaskAttachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          size: sizeFormatted,
          type: file.type || 'application/octet-stream',
          dataUrl,
          uploadedAt: new Date().toISOString(),
        };

        const currentAttachments = task.attachments || [];
        onUpdateTask({
          ...task,
          attachments: [...currentAttachments, newAttachment],
        });
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    const currentAttachments = task.attachments || [];
    onUpdateTask({
      ...task,
      attachments: currentAttachments.filter((a) => a.id !== attachmentId),
    });
  };

  const handleDownloadFile = (att: TaskAttachment) => {
    const a = document.createElement('a');
    a.href = att.dataUrl;
    a.download = att.name;
    a.click();
  };

  const totalSteps = task.steps.length;
  const completedSteps = task.steps.filter((s) => s.completed).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const attachments = task.attachments || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] z-10 border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Navigation Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1 text-xs font-semibold"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-1.5 z-20 text-xs">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEditClick(task);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                >
                  <span>Edit Tugas</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    if (confirm('Hapus tugas ini?')) {
                      onDeleteTask(task.id);
                      onClose();
                    }
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 text-rose-600 dark:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Tugas</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Header Title with Course */}
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {task.course}
              </span>
            </div>

            <h2 className="text-lg font-extrabold text-slate-800 dark:text-white leading-snug">
              {task.title}
            </h2>

            {/* Badges */}
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                  task.priority === 'Tinggi'
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50'
                    : task.priority === 'Sedang'
                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50'
                }`}
              >
                Prioritas {task.priority.toLowerCase()}
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                {task.status}
              </span>
            </div>
          </div>

          {/* 2 Information Cards (Deadline & Estimasi Waktu) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-400 text-[11px]">
                <Calendar className="w-3.5 h-3.5" />
                <span>Deadline</span>
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {task.deadline || 'Belum ditentukan'}
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-400 text-[11px]">
                <Clock className="w-3.5 h-3.5" />
                <span>Estimasi waktu</span>
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {task.estimatedMinutes || 60} menit
              </div>
            </div>
          </div>

          {/* Deskripsi tugas */}
          {task.description && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Deskripsi tugas
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                {task.description}
              </p>
            </div>
          )}

          {/* Lampiran File: Gambar, Foto, PDF */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-blue-600" />
                <span>Berkas & Lampiran</span>
              </h4>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Unggah File</span>
              </button>
            </div>

            {/* Hidden native input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleDirectUpload}
              multiple
              accept="image/*,application/pdf,.doc,.docx,.ppt,.pptx,.txt"
              className="hidden"
            />

            {attachments.length === 0 ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center cursor-pointer hover:bg-slate-100/70 transition"
              >
                <ImageIcon className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <p className="text-xs text-slate-500 font-medium">Belum ada file lampiran.</p>
                <p className="text-[10px] text-slate-400">Klik untuk mengunggah foto materi, gambar soal, atau PDF.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {attachments.map((att) => {
                  const isImage = att.type.startsWith('image/');
                  return (
                    <div
                      key={att.id}
                      className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0 flex-1 mr-2">
                        {isImage ? (
                          <div
                            onClick={() => setPreviewImage(att.dataUrl)}
                            className="w-10 h-10 rounded-xl overflow-hidden shrink-0 cursor-pointer border border-slate-200 dark:border-slate-700 relative group"
                          >
                            <img
                              src={att.dataUrl}
                              alt={att.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white">
                              <Eye className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                            {att.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {att.size} • {att.type.split('/')[1]?.toUpperCase() || 'FILE'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        {isImage && (
                          <button
                            type="button"
                            onClick={() => setPreviewImage(att.dataUrl)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                            title="Lihat Foto"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDownloadFile(att)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                          title="Unduh / Simpan"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAttachment(att.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Langkah pengerjaan (Checklist & Progress) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Langkah pengerjaan
              </h4>
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                {completedSteps} dari {totalSteps} langkah selesai
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Steps list */}
            <div className="space-y-2">
              {task.steps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 group"
                >
                  <button
                    onClick={() => handleToggleStep(step.id)}
                    className="flex items-center space-x-2.5 flex-1 text-left"
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 hover:text-blue-500 shrink-0" />
                    )}
                    <span
                      className={`text-xs ${
                        step.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {step.text}
                    </span>
                  </button>

                  <button
                    onClick={() => handleDeleteStep(step.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 p-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Add step form */}
              <form onSubmit={handleAddStep} className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  value={newStepText}
                  onChange={(e) => setNewStepText(e.target.value)}
                  placeholder="+ Tambah langkah baru..."
                  className="flex-1 text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newStepText.trim()}
                  className="p-2 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-xl disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Referensi dan lampiran cloud link */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Tautan Eksternal Cloud
            </h4>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300 min-w-0">
                <ExternalLink className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="truncate">
                  {task.referenceUrl || 'Link Google Drive / file pendukung'}
                </span>
              </div>
              {task.referenceUrl && (
                <a
                  href={task.referenceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline shrink-0 ml-2"
                >
                  Buka
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2.5">
          <button
            onClick={() => {
              onStartFocus(task);
              onClose();
            }}
            className="flex-1 py-2.5 px-3 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold text-xs rounded-xl border border-blue-200 dark:border-blue-900 hover:bg-blue-100 transition flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Fokuskan</span>
          </button>

          <button
            onClick={() => onEditClick(task)}
            className="py-2.5 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-200 transition"
          >
            Edit
          </button>

          <button
            onClick={handleToggleCompleted}
            className={`flex-1 py-2.5 px-3 font-semibold text-xs rounded-xl transition text-white shadow-xs flex items-center justify-center gap-1.5 ${
              task.status === 'Selesai'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{task.status === 'Selesai' ? 'Telah Selesai' : 'Selesaikan'}</span>
          </button>
        </div>
      </div>

      {/* Lightbox Preview Modal for Image/Photo */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-lg max-h-[85vh] bg-slate-900 rounded-2xl p-2 overflow-hidden shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Preview Foto"
              className="max-h-[80vh] w-auto rounded-xl object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};
