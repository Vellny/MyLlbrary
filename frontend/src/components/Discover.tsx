import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, TrendingUp, Sparkles } from 'lucide-react';
import { mockFeaturedBook, mockTrendingBooks, mockCategories, extendedCategories, mockBooksDict } from '../data/mockBooks';
import type { Book, BookSummary } from '../types';
import './Discover.css';

function loadUserBooks(): BookSummary[] {
  const saved = localStorage.getItem('user_authored_books');
  if (!saved) return [];
  try {
    const userBooks: Book[] = JSON.parse(saved);
    return userBooks.map((b) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      coverImage: b.coverImage
    }));
  } catch {
    return [];
  }
}

function getAllSearchableBooks(): { id: string; title: string; author: string; coverImage: string; tags: string[] }[] {
  // Combine mock books with user books
  const allBooks: { id: string; title: string; author: string; coverImage: string; tags: string[] }[] = [];

  // Add all mock books from the dictionary
  for (const book of Object.values(mockBooksDict)) {
    allBooks.push({
      id: book.id,
      title: book.title,
      author: book.author,
      coverImage: book.coverImage,
      tags: book.tags || [],
    });
  }

  // Add user-authored books
  const saved = localStorage.getItem('user_authored_books');
  if (saved) {
    try {
      const userBooks: Book[] = JSON.parse(saved);
      for (const b of userBooks) {
        if (!allBooks.find(ab => ab.id === b.id)) {
          allBooks.push({
            id: b.id,
            title: b.title,
            author: b.author,
            coverImage: b.coverImage,
            tags: b.tags || [],
          });
        }
      }
    } catch { /* ignore */ }
  }

  return allBooks;
}

export default function Discover() {
  const navigate = useNavigate();
  const userBooks = loadUserBooks();
  const [trendingBooks] = useState<BookSummary[]>(
    userBooks.length > 0 ? [...userBooks, ...mockTrendingBooks] : mockTrendingBooks
  );
  const [newlyUpdatedBooks] = useState<BookSummary[]>(
    userBooks.length > 0 ? [...userBooks, ...[...mockTrendingBooks].reverse()] : [...mockTrendingBooks].reverse()
  );
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const allBooks = useMemo(() => getAllSearchableBooks(), []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allBooks.filter(book =>
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.tags.some(tag => tag.toLowerCase().includes(q))
    ).slice(0, 8); // Limit to 8 results
  }, [searchQuery, allBooks]);

  const showResults = isSearchFocused && searchQuery.trim().length > 0;

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchResults]);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        navigate(`/book/${searchResults[selectedIndex].id}`);
        setIsSearchFocused(false);
        setSearchQuery('');
      }
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
      searchInputRef.current?.blur();
    }
  }

  function clearSearch() {
    setSearchQuery('');
    setSelectedIndex(-1);
    searchInputRef.current?.focus();
  }

  return (
    <div className="discover-page">
      {/* Search Section - Top of page */}
      <section className="search-section">
        <div className="search-container" ref={searchContainerRef}>
          <div className={`search-bar ${isSearchFocused ? 'search-bar--focused' : ''} ${showResults ? 'search-bar--has-results' : ''}`}>
            <Search size={20} className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search books, authors, or genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={handleSearchKeyDown}
              id="search-input"
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={clearSearch} aria-label="Clear search">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="search-results-dropdown">
              {searchResults.length > 0 ? (
                <>
                  <div className="search-results-header">
                    <Sparkles size={14} />
                    <span>{searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found</span>
                  </div>
                  {searchResults.map((book, index) => (
                    <Link
                      to={`/book/${book.id}`}
                      key={book.id}
                      className={`search-result-item ${index === selectedIndex ? 'search-result-item--selected' : ''}`}
                      onClick={() => {
                        setIsSearchFocused(false);
                        setSearchQuery('');
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className="search-result-cover">
                        <img src={book.coverImage} alt={book.title} />
                      </div>
                      <div className="search-result-info">
                        <h4 className="search-result-title">{book.title}</h4>
                        <p className="search-result-author">by {book.author}</p>
                        {book.tags.length > 0 && (
                          <div className="search-result-tags">
                            {book.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="search-result-tag">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <BookOpen size={16} className="search-result-arrow" />
                    </Link>
                  ))}
                </>
              ) : (
                <div className="search-no-results">
                  <Search size={32} className="search-no-results-icon" />
                  <p>No books found for "<strong>{searchQuery}</strong>"</p>
                  <span>Try searching by title, author, or genre</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

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
          {showAllCategories && extendedCategories.map((category) => (
            <button
              key={category}
              className={`category-pill ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
          <button
            className="category-pill see-all-btn"
            onClick={() => setShowAllCategories(!showAllCategories)}
            style={{ fontWeight: 700, color: 'var(--accent-primary)', border: '1px solid rgba(244, 63, 94, 0.3)' }}
          >
            {showAllCategories ? 'Show Less' : 'See All'}
          </button>
        </div>
      </section>

      {/* Trending Section */}
      <section className="trending-section">
        <h2 className="section-title">
          <TrendingUp size={20} className="section-title-icon" />
          Trending Now
        </h2>
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
        <h2 className="section-title text-gradient">
          <Sparkles size={20} className="section-title-icon" />
          Newly Updated
        </h2>
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
