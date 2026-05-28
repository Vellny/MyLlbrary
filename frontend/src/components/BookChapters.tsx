import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockBooksDict, isUserAuthoredBook } from '../data/mockBooks';
import type { Book, ChapterListItem } from '../types';
import './BookDetail.css'; // Kita bisa gunakan style dari BookDetail untuk chapter list

export default function BookChapters() {
  const params = useParams();
  const navigate = useNavigate();
  const bookId = params.id || '1';

  // Ambil detail buku (sama seperti di BookDetail)
  const getBookDetails = (): Book => {
    if (isUserAuthoredBook(bookId)) {
      try {
        const saved = localStorage.getItem('user_authored_books');
        if (saved) {
          const userBooks: Book[] = JSON.parse(saved);
          const found = userBooks.find((b) => b.id === bookId);
          if (found) return found;
        }
      } catch (err) {
        console.error('Failed to parse user_authored_books:', err);
      }
    }
    return mockBooksDict[bookId] || mockBooksDict['1'];
  };

  const book = getBookDetails();

  return (
    <div className="book-detail-page">
      <div className="detail-header-bg">
        <div className="bg-blur" style={{ backgroundImage: `url(${book.coverImage})` }}></div>
        <button onClick={() => navigate(-1)} className="back-btn">
          <span>←</span> Back
        </button>
      </div>

      <div className="detail-content">
        <div className="main-info">
          <img src={book.coverImage} alt={book.title} className="detail-cover" />
          <div className="info-text">
            <h1 className="detail-title">{book.title}</h1>
            <p className="detail-author">{book.author}</p>
            <p className="detail-author" style={{ marginTop: '0.5rem', color: 'var(--primary-color)' }}>
              Semua Chapter ({book.chaptersList.length})
            </p>
          </div>
        </div>

        <div className="detail-body">
          <div className="chapters-section">
            <div className="chapter-list">
              {book.chaptersList.length === 0 && (
                <div className="empty-chapters-state">
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 1rem', fontSize: '0.95rem' }}>
                    📖 Belum ada chapter.
                  </p>
                </div>
              )}
              {book.chaptersList.map((chapter: ChapterListItem) => (
                <Link to={`/read/${chapter.id}`} key={chapter.id} className={`chapter-item ${chapter.read ? 'read' : ''}`}>
                  <div className="chapter-info">
                    <span className="chapter-title">{chapter.title}</span>
                    <span className="chapter-date">{chapter.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
