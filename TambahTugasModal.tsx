import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  ChevronDown, 
  Plus, 
  Trash2, 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  FileCode,
  X 
} from 'lucide-react';
import { TaskItem, Priority, TaskStatus, TaskAttachment } from '../types';

interface TambahTugasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (task: TaskItem) => void;
  courses: string[];
  editingTask?: TaskItem | null;
}

export const TambahTugasModal: React.FC<TambahTugasModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  courses,
  editingTask,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [course, setCourse] = useState(courses[0] || 'Statistika');
  const [deadline, setDeadline] = useState('2026-10-18');
  const [priority, setPriority] = useState<Priority>('Sedang');
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);
  const [status, setStatus] = useState<TaskStatus>('Belum mulai');
  const [description, setDescription] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [showAdditional, setShowAdditional] = useState(false);
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [steps, setSteps] = useState<{ id: string; text: string; completed: boolean }[]>([
    { id: '1', text: 'Memahami instruksi tugas', completed: false },
    { id: '2', text: 'Mengerjakan draft awal', completed: false },
  ]);
  const [newStepInput, setNewStepInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setCourse(editingTask.course);
      setDeadline(editingTask.deadline || '');
      setPriority(editingTask.priority);
      setEstimatedMinutes(editingTask.estimatedMinutes);
      setStatus(editingTask.status);
      setDescription(editingTask.description || '');
      setReferenceUrl(editingTask.referenceUrl || '');
      setSteps(editingTask.steps || []);
      setAttachments(editingTask.attachments || []);
      setShowAdditional(true);
    } else {
      setTitle('');
      setCourse(courses[0] || 'Statistika');
      setDeadline('2026-10-18');
      setPriority('Sedang');
      setEstimatedMinutes(60);
      setStatus('Belum mulai');
      setDescription('');
      setReferenceUrl('');
      setAttachments([]);
      setSteps([
        { id: '1', text: 'Memahami instruksi tugas', completed: false },
        { id: '2', text: 'Mengerjakan draft perhitungan', completed: false },
      ]);
    }
  }, [editingTask, isOpen]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        setAttachments((prev) => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData: TaskItem = {
      id: editingTask ? editingTask.id : `task-${Date.now()}`,
      title: title.trim(),
      course,
      priority,
      status,
      estimatedMinutes,
      deadline: deadline || undefined,
      description: description.trim() || undefined,
      referenceUrl: referenceUrl.trim() || undefined,
      attachments,
      steps,
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString().slice(0, 10),
    };

    onSaveTask(taskData);
    onClose();
  };

  const handleAddStep = () => {
    if (!newStepInput.trim()) return;
    setSteps([...steps, { id: `step-${Date.now()}`, text: newStepInput.trim(), completed: false }]);
    setNewStepInput('');
  };

  const handleRemoveStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] z-10 border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-2">
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">
            {editingTask ? 'Edit Tugas' : 'Tambah Tugas'}
          </h2>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Nama Tugas */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Nama tugas <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Tugas Statistika"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Mata Kuliah */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Mata kuliah
            </label>
            <div className="relative">
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-9"
              >
                {courses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Row: Deadline & Prioritas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Deadline (opsional)
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Prioritas
              </label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full appearance-none px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs pr-8"
                >
                  <option value="Tinggi">Tinggi</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Rendah">Rendah</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row: Estimasi Waktu & Status Awal */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Estimasi waktu
              </label>
              <div className="relative">
                <select
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  className="w-full appearance-none px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs pr-8"
                >
                  <option value={15}>15 menit</option>
                  <option value={30}>30 menit</option>
                  <option value={45}>45 menit</option>
                  <option value={60}>60 menit</option>
                  <option value={90}>90 menit</option>
                  <option value={120}>120 menit</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Status awal
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full appearance-none px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs pr-8"
                >
                  <option value="Belum mulai">Belum mulai</option>
                  <option value="Dalam proses">Dalam proses</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Menunggu">Menunggu</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Upload Lampiran: Gambar, Foto, PDF, dsb */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Lampiran (Foto, Gambar, PDF)</span>
              <span className="text-[10px] text-slate-400 font-normal">{attachments.length} berkas</span>
            </label>

            {/* Hidden native input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*,application/pdf,.doc,.docx,.ppt,.pptx,.txt"
              className="hidden"
            />

            {/* Drag & drop / upload trigger card */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-blue-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-blue-50/40 dark:bg-slate-800/40 rounded-2xl p-3 text-center cursor-pointer transition hover:bg-blue-50/70"
            >
              <UploadCloud className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-1 stroke-[1.8]" />
              <p className="font-semibold text-slate-700 dark:text-slate-200 text-xs">
                Klik untuk unggah foto, gambar, atau file PDF
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                PNG, JPG, PDF, Dokumen (Tersimpan di perangkat)
              </p>
            </div>

            {/* Attachment preview pills/cards */}
            {attachments.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2.5">
                {attachments.map((att) => {
                  const isImage = att.type.startsWith('image/');
                  return (
                    <div
                      key={att.id}
                      className="relative p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center space-x-2 overflow-hidden"
                    >
                      {isImage ? (
                        <img
                          src={att.dataUrl}
                          alt={att.name}
                          className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[11px] text-slate-800 dark:text-white truncate">
                          {att.name}
                        </p>
                        <p className="text-[9px] text-slate-400">{att.size}</p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveAttachment(att.id);
                        }}
                        className="p-1 rounded-full text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detail Tambahan Toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAdditional(!showAdditional)}
              className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-between transition"
            >
              <span>Detail tambahan</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showAdditional ? 'rotate-180' : ''}`} />
            </button>

            {showAdditional && (
              <div className="space-y-3 mt-3 p-3 bg-slate-50/70 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                {/* Deskripsi */}
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Deskripsi Tugas
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Instruksi soal atau catatan penting..."
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Steps Checklist */}
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Langkah-langkah Pengerjaan
                  </label>
                  <div className="space-y-1.5 mb-2">
                    {steps.map((st) => (
                      <div key={st.id} className="flex items-center justify-between bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-700 dark:text-slate-300 truncate">{st.text}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(st.id)}
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={newStepInput}
                      onChange={(e) => setNewStepInput(e.target.value)}
                      placeholder="Langkah berikutnya..."
                      className="flex-1 px-2.5 py-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddStep}
                      className="px-2.5 py-1.5 bg-blue-600 text-white rounded-lg"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Link Referensi */}
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Link Referensi / Lampiran Cloud
                  </label>
                  <input
                    type="url"
                    value={referenceUrl}
                    onChange={(e) => setReferenceUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Simpan Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl shadow-xs transition active:scale-[0.98]"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
