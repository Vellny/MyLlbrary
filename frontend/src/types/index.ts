// ============================================
// MyLibrary — Shared TypeScript Interfaces
// ============================================

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface BookStats {
  reads: string;
  rating: string;
  chapters: number;
}

export interface ChapterListItem {
  id: string;
  title: string;
  date: string;
  read: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  synopsis: string;
  coverImage: string;
  tags: string[];
  stats: BookStats;
  chaptersList: ChapterListItem[];
  isCollaborative?: boolean;
}

export interface BookSummary {
  id: string;
  title: string;
  author: string;
  coverImage: string;
}

export interface SavedAccount {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface StatusMessage {
  type: 'success' | 'error';
  message: string;
}
