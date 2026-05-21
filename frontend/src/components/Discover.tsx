import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockFeaturedBook, mockTrendingBooks, mockCategories } from '../data/mockBooks';
import type { BookSummary } from '../types';
import './Discover.css';

export default function Discover() {
  const [trendingBooks, setTrendingBooks] = useState<BookSummary[]>(mockTrendingBooks);
  const [newlyUpdatedBooks, setNewlyUpdatedBooks] = useState<BookSummary[]>([...mockTrendingBooks].reverse());
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const saved = localStorage.getItem('user_authored_books');
    if (saved) {
      try {
        const userBooks = JSON.parse(saved);
        const formatted: BookSummary[] = userBooks.map((b: BookSummary) => ({
          id: b.id,
          title: b.title,
          author: b.author,
          coverImage: b.coverImage
        }));
        setTrendingBooks([...formatted, ...mockTrendingBooks]);
        setNewlyUpdatedBooks([...formatted, ...[...mockTrendingBooks].reverse()]);
      } catch (err) {
        console.error('Failed to parse user_authored_books:', err);
      }
    }
  }, []);

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
          {mockCategories.map((category) => (
            <button
              key={category}
              className={`category-pill ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="trending-section">
        <h2 className="section-title">Trending Now</h2>
        <div className="book-carousel">
          {trendingBooks.map(book => (
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
      
      {/* Newly Updated Section */}
      <section className="trending-section">
        <h2 className="section-title text-gradient">Newly Updated</h2>
        <div className="book-carousel">
          {newlyUpdatedBooks.map(book => (
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
