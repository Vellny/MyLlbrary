import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import type { Book } from '../types';
import './Bookshelf.css';

interface LibraryBook {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  progress: number;
  currentChapter: number;
}

function loadUserLibrary(): LibraryBook[] {
  const saved = localStorage.getItem('user_authored_books');
  if (!saved) return [];
  try {
    const userBooks: Book[] = JSON.parse(saved);
    return userBooks.map((b) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      coverImage: b.coverImage,
      progress: 0,
      currentChapter: 1
    }));
  } catch {
    return [];
  }
}

// --- MOCK DATA ---
const mockLibrary: LibraryBook[] = [
  { 
    id: '1', 
    title: 'The Starlight Heir', 
    author: 'Elara Vance', 
    coverImage: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=400',
    progress: 45,
    currentChapter: 1
  },
  { 
    id: '3', 
    title: 'Whispers of the Old Gods', 
    author: 'M.R. Thorne', 
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400',
    progress: 10,
    currentChapter: 1
  }
];

const initialLibrary: LibraryBook[] = [...loadUserLibrary(), ...mockLibrary];

export default function Bookshelf() {
  const { user } = useAuth();
  const [library] = useState(initialLibrary);

  // Redirect to login if unauthenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="bookshelf-page">
      <header className="bookshelf-header">
        <h1 className="page-title">My Bookshelf</h1>
        <div className="tabs">
          <button className="tab-btn active">Reading</button>
          <button className="tab-btn">Saved</button>
          <button className="tab-btn">Completed</button>
        </div>
      </header>

      <div className="library-grid">
        {library.length > 0 ? (
          library.map(book => (
            <div key={book.id} className="library-card">
              <Link to={`/book/${book.id}`} className="library-cover-link">
                <img src={book.coverImage} alt={book.title} className="library-cover" />
              </Link>
              <div className="library-info">
                <Link to={`/book/${book.id}`} className="library-title">{book.title}</Link>
                <p className="library-author">{book.author}</p>
                <div className="progress-container">
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${book.progress}%` }}></div>
                  </div>
                  <span className="progress-text">{book.progress}% • Ch {book.currentChapter}</span>
                </div>
                <Link to={`/read/${book.id}_c${book.currentChapter}`} className="continue-btn primary-btn">
                  Continue Reading
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <span className="empty-icon">📚</span>
            <h2>Your bookshelf is empty</h2>
            <p>Find your next favorite story in the Discover tab.</p>
            <Link to="/" className="primary-btn mt-4">Explore Books</Link>
          </div>
        )}
      </div>
    </div>
  );
}
