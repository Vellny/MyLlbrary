// ============================================
// MyLibrary — Mock Book Data
// ============================================
import type { Book, BookSummary } from '../types';

export const mockFeaturedBook = {
  id: '1',
  title: 'The Starlight Heir',
  author: 'Elara Vance',
  synopsis: 'In a world where the Sun King\'s Law is absolute, Elara discovers a power forbidden for centuries: the silver rain of falling stars.',
  coverImage: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=800',
  tags: ['Fantasy', 'Magic', 'Adventure'],
};

export const mockTrendingBooks: BookSummary[] = [
  { id: '2', title: 'Neon Shadows', author: 'J.T. Cole', coverImage: 'https://images.unsplash.com/photo-1555679427-1f6dfcce943b?auto=format&fit=crop&q=80&w=400' },
  { id: '3', title: 'Whispers of the Old Gods', author: 'M.R. Thorne', coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400' },
  { id: '4', title: 'Crown of Thorns', author: 'Sarah J.', coverImage: 'https://images.unsplash.com/photo-1629196914212-e56598c92a2a?auto=format&fit=crop&q=80&w=400' },
  { id: '5', title: 'Cybernetic Heart', author: 'Leo Vance', coverImage: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&q=80&w=400' },
];

export const mockCategories = ['All', 'Romance', 'Fantasy', 'Sci-Fi', 'Mystery', 'Thriller', 'Horror'];

export const mockBooksDict: Record<string, Book> = {
  '1': {
    id: '1',
    title: 'The Starlight Heir',
    author: 'Elara Vance',
    synopsis: 'In a world where the Sun King\'s Law is absolute, light is life and darkness is a sin. But when the stars begin to fall like silver rain, Elara discovers a power that has been forbidden for centuries. Now, she must choose between the safety of the Sun Court and the dangerous whispers of the night.',
    coverImage: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=800',
    tags: ['Fantasy', 'Magic', 'Adventure', 'Dystopian'],
    stats: { reads: '1.2M', rating: '4.9', chapters: 3 },
    chaptersList: [
      { id: '1_c1', title: 'Chapter 1: The Night of Silver Rain', date: '2 hours ago', read: true },
      { id: '1_c2', title: 'Chapter 2: Shards of Silence', date: '1 hour ago', read: false },
      { id: '1_c3', title: 'Chapter 3: The Gilded Cage', date: '30 mins ago', read: false },
    ]
  },
  '2': {
    id: '2',
    title: 'Neon Shadows',
    author: 'J.T. Cole',
    synopsis: 'In the rainy, neon-drenched streets of Sector 7, a street-level decker named Jax stumbles upon a corporate datacore holding a secret that could collapse the megastructures powering the city.',
    coverImage: 'https://images.unsplash.com/photo-1555679427-1f6dfcce943b?auto=format&fit=crop&q=80&w=400',
    tags: ['Sci-Fi', 'Cyberpunk', 'Action'],
    stats: { reads: '850K', rating: '4.7', chapters: 3 },
    chaptersList: [
      { id: '2_c1', title: 'Chapter 1: Rain and Holograms', date: '1 day ago', read: false },
      { id: '2_c2', title: 'Chapter 2: The Datacore Heist', date: '12 hours ago', read: false },
      { id: '2_c3', title: 'Chapter 3: Ghost in the Machine', date: '2 hours ago', read: false },
    ]
  },
  '3': {
    id: '3',
    title: 'Whispers of the Old Gods',
    author: 'M.R. Thorne',
    synopsis: 'Elanor thought Abyssal Bay was just a sleepy fishing town. But when the tides recede further than ever before, revealing towering black monoliths covered in glowing carvings, the whispers begin.',
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400',
    tags: ['Horror', 'Mystery', 'Dark Fantasy'],
    stats: { reads: '920K', rating: '4.8', chapters: 3 },
    chaptersList: [
      { id: '3_c1', title: 'Chapter 1: The Sunken City', date: '3 days ago', read: false },
      { id: '3_c2', title: 'Chapter 2: The Whispering Monoliths', date: '2 days ago', read: false },
      { id: '3_c3', title: 'Chapter 3: Eyes in the Deep', date: '5 hours ago', read: false },
    ]
  },
  '4': {
    id: '4',
    title: 'Crown of Thorns',
    author: 'Sarah J.',
    synopsis: 'A mortal girl is forced to marry the cold-hearted prince of the Winter Fae to seal a peace treaty. But in a court of ice and lies, love is the most dangerous weapon of all.',
    coverImage: 'https://images.unsplash.com/photo-1629196914212-e56598c92a2a?auto=format&fit=crop&q=80&w=400',
    tags: ['Romance', 'Fantasy', 'Royalty'],
    stats: { reads: '2.1M', rating: '4.9', chapters: 3 },
    chaptersList: [
      { id: '4_c1', title: 'Chapter 1: The Winter Treaty', date: '1 week ago', read: false },
      { id: '4_c2', title: 'Chapter 2: The Court of Frost', date: '4 days ago', read: false },
      { id: '4_c3', title: 'Chapter 3: The Cold Prince', date: '1 day ago', read: false },
    ]
  },
  '5': {
    id: '5',
    title: 'Cybernetic Heart',
    author: 'Leo Vance',
    synopsis: 'In a future where emotions are biologically suppressed, a technician falls in love with an android scheduled for decommissioning, only to discover she might be more human than him.',
    coverImage: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&q=80&w=400',
    tags: ['Sci-Fi', 'Romance', 'Dystopian'],
    stats: { reads: '640K', rating: '4.6', chapters: 3 },
    chaptersList: [
      { id: '5_c1', title: 'Chapter 1: The Emotion-Suppressor', date: '2 weeks ago', read: false },
      { id: '5_c2', title: 'Chapter 2: Unit Alpha-7', date: '1 week ago', read: false },
      { id: '5_c3', title: 'Chapter 3: Spark of Life', date: '3 days ago', read: false },
    ]
  }
};

export const bookTitles: Record<string, string> = {
  '1': 'The Starlight Heir',
  '2': 'Neon Shadows',
  '3': 'Whispers of the Old Gods',
  '4': 'Crown of Thorns',
  '5': 'Cybernetic Heart',
};

/** IDs of the built-in mock books */
export const MOCK_BOOK_IDS = ['1', '2', '3', '4', '5'];

/** Check if a book ID belongs to a user-authored book (not a built-in mock) */
export const isUserAuthoredBook = (_bookId: string): boolean => true;
