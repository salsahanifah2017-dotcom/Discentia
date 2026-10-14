export type Priority = 'Tinggi' | 'Sedang' | 'Rendah';

export type TaskStatus = 'Belum mulai' | 'Dalam proses' | 'Selesai' | 'Menunggu';

export type AgendaCategory = 'Kuliah' | 'Kerja' | 'Tugas' | 'Pribadi';

export interface TaskStep {
  id: string;
  text: string;
  completed: boolean;
}

export interface TaskAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  dataUrl: string;
  uploadedAt: string;
}

export interface TaskItem {
  id: string;
  title: string;
  course: string;
  priority: Priority;
  status: TaskStatus;
  estimatedMinutes: number;
  deadline?: string;
  description?: string;
  steps: TaskStep[];
  referenceUrl?: string;
  attachments?: TaskAttachment[];
  createdAt: string;
}

export interface AgendaItem {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: AgendaCategory;
  date: string; // YYYY-MM-DD
  course?: string;
  location?: string;
  notes?: string;
}

export interface FocusHistoryItem {
  id: string;
  date: string; // e.g. "14 Okt 2026"
  durationMinutes: number;
  course: string;
  title: string;
  completedAt: string;
}

export interface UserProfile {
  name: string;
  role: string;
  initials: string;
  email: string;
  avatarBg?: string;
}
