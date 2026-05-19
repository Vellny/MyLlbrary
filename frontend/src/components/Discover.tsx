import { Link } from 'react-router-dom';
import './Discover.css';

// --- MOCK DATA ---
const mockFeaturedBook = {
  id: '1',
  title: 'The Starlight Heir',
  author: 'Elara Vance',
  synopsis: 'In a world where the Sun King’s Law is absolute, Elara discovers a power forbidden for centuries: the silver rain of falling stars.',
  coverImage: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=800',
  tags: ['Fantasy', 'Magic', 'Adventure'],
};

const mockTrendingBooks = [
  { id: '2', title: 'Neon Shadows', author: 'J.T. Cole', coverImage: 'https://images.unsplash.com/photo-1555679427-1f6dfcce943b?auto=format&fit=crop&q=80&w=400' },
  { id: '3', title: 'Whispers of the Old Gods', author: 'M.R. Thorne', coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400' },
  { id: '4', title: 'Crown of Thorns', author: 'Sarah J.', coverImage: 'https://images.unsplash.com/photo-1629196914212-e56598c92a2a?auto=format&fit=crop&q=80&w=400' },
  { id: '5', title: 'Cybernetic Heart', author: 'Leo Vance', coverImage: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&q=80&w=400' },
];

const mockCategories = ['All', 'Romance', 'Fantasy', 'Sci-Fi', 'Mystery', 'Thriller', 'Horror'];

export default function Discover() {
  return (
    <div className="discover-page">
      {/* Hero / Featured Book Section */}
      <section className="hero-section">
        <div className="hero-background" style={{ backgroundImage: `url(${mockFeaturedBook.coverImage})` }}>
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <span className="featured-badge">Featured Story</span>
          <h1 className="hero-title">{mockFeaturedBook.title}</h1>
          <p className="hero-author">by {mockFeaturedBook.author}</p>
          <p className="hero-synopsis">{mockFeaturedBook.synopsis}</p>
          <div className="hero-tags">
            {mockFeaturedBook.tags.map(tag => (
              <span key={tag} className="tag glass-panel">{tag}</span>
            ))}
          </div>
          <Link to={`/book/${mockFeaturedBook.id}`} className="read-btn primary-btn">
            Read Now
          </Link>
        </div>
      </section>

      {/* Categories Horizontal Scroll */}
      <section className="categories-section">
        <div className="categories-container">
          {mockCategories.map((category, index) => (
            <button key={category} className={`category-pill ${index === 0 ? 'active' : ''}`}>
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="trending-section">
        <h2 className="section-title">Trending Now</h2>
        <div className="book-carousel">
          {mockTrendingBooks.map(book => (
            <Link to={`/book/${book.id}`} key={book.id} className="book-card">
              <div className="book-cover-wrapper">
                <img src={book.coverImage} alt={book.title} className="book-cover" />
              </div>
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">{book.author}</p>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Newly Updated Section (reusing mock data for structure) */}
      <section className="trending-section">
        <h2 className="section-title text-gradient">Newly Updated</h2>
        <div className="book-carousel">
          {[...mockTrendingBooks].reverse().map(book => (
            <Link to={`/book/${book.id}`} key={`new-${book.id}`} className="book-card">
              <div className="book-cover-wrapper">
                <img src={book.coverImage} alt={book.title} className="book-cover" />
              </div>
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">{book.author}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
