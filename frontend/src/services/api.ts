import api from '../api';

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateProfilePayload {
  name?: string;
  avatar?: string | null;
}

export interface CreateBookPayload {
  title: string;
  synopsis: string;
  coverImage?: string;
  tags?: string[];
  isCollaborative?: boolean;
}

export interface UpdateBookPayload {
  title?: string;
  synopsis?: string;
  coverImage?: string;
  tags?: string[];
  isCollaborative?: boolean;
}

export interface CreateChapterPayload {
  bookId: string;
  title: string;
  content: string;
}

export interface UpdateChapterPayload {
  title?: string;
  content?: string;
}

// ─── Auth ──────────────────────────────────────────────

export const getCsrfCookie = () =>
  Promise.resolve();

export const login = async (payload: LoginPayload) => {
  const { data } = await api.post('/api/login', payload);
  return data;
};

export const register = async (payload: RegisterPayload) => {
  const { data } = await api.post('/api/register', payload);
  return data;
};

export const logout = () =>
  api.post('/api/logout');

export const getUser = () =>
  api.get('/api/user').then((r) => r.data);

export const updateProfile = (payload: UpdateProfilePayload) =>
  api.post('/api/user/update', payload).then((r) => r.data);

export const socialAuthRedirect = (provider: string) => {
  window.location.href = `/api/auth/${provider}`;
};

// ─── Books ─────────────────────────────────────────────

export const getBooks = (params?: {
  category?: string;
  search?: string;
  page?: number;
}) =>
  api.get('/api/books', { params }).then((r) => r.data);

export const getBook = (id: string) =>
  api.get(`/api/books/${id}`).then((r) => r.data);

export const getFeaturedBook = () =>
  api.get('/api/books/featured').then((r) => r.data);

export const getTrendingBooks = () =>
  api.get('/api/books/trending').then((r) => r.data);

export const getNewlyUpdatedBooks = () =>
  api.get('/api/books/newly-updated').then((r) => r.data);

export const createBook = (payload: CreateBookPayload) =>
  api.post('/api/books', payload).then((r) => r.data);

export const updateBook = (id: string, payload: UpdateBookPayload) =>
  api.put(`/api/books/${id}`, payload).then((r) => r.data);

export const deleteBook = (id: string) =>
  api.delete(`/api/books/${id}`).then((r) => r.data);

// ─── Chapters ──────────────────────────────────────────

export const getChapters = (bookId: string) =>
  api.get(`/api/books/${bookId}/chapters`).then((r) => r.data);

export const getChapterContent = (chapterId: string) =>
  api.get(`/api/chapters/${chapterId}`).then((r) => r.data);

export const createChapter = (payload: CreateChapterPayload) =>
  api.post(`/api/books/${payload.bookId}/chapters`, payload).then((r) => r.data);

export const updateChapter = (chapterId: string, payload: UpdateChapterPayload) =>
  api.put(`/api/chapters/${chapterId}`, payload).then((r) => r.data);

export const deleteChapter = (chapterId: string) =>
  api.delete(`/api/chapters/${chapterId}`).then((r) => r.data);

// ─── Bookshelf ─────────────────────────────────────────

export const getBookshelf = () =>
  api.get('/api/bookshelf').then((r) => r.data);

export const addToBookshelf = (bookId: string) =>
  api.post('/api/bookshelf', { book_id: bookId }).then((r) => r.data);

export const removeFromBookshelf = (bookId: string) =>
  api.delete(`/api/bookshelf/${bookId}`).then((r) => r.data);

// ─── Reading Progress ──────────────────────────────────

export const updateReadingProgress = (chapterId: string, progress: number) =>
  api.post('/api/reading-progress', { chapter_id: chapterId, progress }).then((r) => r.data);

export const getReadingProgress = (bookId: string) =>
  api.get(`/api/reading-progress/${bookId}`).then((r) => r.data);
