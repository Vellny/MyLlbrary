import { useParams, Link, useNavigate } from 'react-router-dom';
import './BookDetail.css';

// --- MOCK DATA ---
const mockBookData = {
  id: '1',
  title: 'The Starlight Heir',
  author: 'Elara Vance',
  synopsis: 'In a world where the Sun King’s Law is absolute, light is life and darkness is a sin. But when the stars begin to fall like silver rain, Elara discovers a power that has been forbidden for centuries. Now, she must choose between the safety of the Sun Court and the dangerous whispers of the night.',
  coverImage: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=800',
  tags: ['Fantasy', 'Magic', 'Adventure', 'Dystopian'],
  stats: {
    reads: '1.2M',
    rating: '4.9',
    chapters: 120
  },
  chaptersList: [
    { id: 'c1', title: 'Chapter 1: The Night of Silver Rain', date: '2 hours ago', read: true },
    { id: 'c2', title: 'Chapter 2: Shards of Silence', date: '1 hour ago', read: false },
    { id: 'c3', title: 'Chapter 3: The King\'s Shadow', date: '30 mins ago', read: false },

  ]
};

export default function BookDetail() {
  const params = useParams();
  const navigate = useNavigate()
  // In a real app, use params.id to fetch the book. Using it here to silence the unused variable warning.
  const book = { ...mockBookData, id: params.id || mockBookData.id };

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

            <div className="detail-stats glass-panel">
              <div className="stat-item">
                <span className="stat-value">{book.stats.reads}</span>
                <span className="stat-label">Reads</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">⭐ {book.stats.rating}</span>
                <span className="stat-label">Rating</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">{book.stats.chapters}</span>
                <span className="stat-label">Chapters</span>
              </div>
            </div>

            <div className="action-buttons">
              <Link to={`/read/${book.chaptersList[0].id}`} className="primary-btn read-full-btn">
                Start Reading
              </Link>
              <button className="secondary-btn glass-panel">
                <span className="nav-icon">➕</span> Add to Library
              </button>
            </div>
          </div>
        </div>

        <div className="detail-body">
          <div className="synopsis-section">
            <h2 className="section-title">Synopsis</h2>
            <div className="tags-container">
              {book.tags.map(tag => (
                <span key={tag} className="tag tag-outline">{tag}</span>
              ))}
            </div>
            <p className="synopsis-text">{book.synopsis}</p>
          </div>

          <div className="chapters-section">
            <div className="chapters-header">
              <h2 className="section-title">Chapters ({book.stats.chapters})</h2>
              <button className="sort-btn">Oldest to Newest</button>
            </div>

            <div className="chapter-list">
              {book.chaptersList.map((chapter) => (
                <Link to={`/read/${chapter.id}`} key={chapter.id} className={`chapter-item ${chapter.read ? 'read' : ''}`}>
                  <div className="chapter-info">
                    <span className="chapter-title">{chapter.title}</span>
                    <span className="chapter-date">{chapter.date}</span>
                  </div>
                </Link>
              ))}
              <button className="load-more-btn glass-panel">Load More Chapters</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
