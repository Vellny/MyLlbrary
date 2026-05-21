import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockBooksDict, isUserAuthoredBook } from '../data/mockBooks';
import type { Book, ChapterListItem } from '../types';
import './BookDetail.css';

export default function BookDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const bookId = params.id || '1';

  // Dynamically resolve book details (checking localStorage first)
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

  // Add Chapter States
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [newChapTitle, setNewChapTitle] = useState('');
  const [newChapContent, setNewChapContent] = useState('');
  const [useAiForDraft, setUseAiForDraft] = useState(false);
  const [aiDraftPrompt, setAiDraftPrompt] = useState('');
  const [isAiDrafting, setIsAiDrafting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [writerTheme, setWriterTheme] = useState<'dark' | 'light'>('dark');

  const handlePublishChapter = () => {
    if (!newChapTitle.trim()) {
      setValidationError("Please enter a chapter title.");
      return;
    }
    if (!newChapContent.trim()) {
      setValidationError("Please write some chapter content.");
      return;
    }
    setValidationError(null);

    try {
      const saved = localStorage.getItem('user_authored_books');
      const userBooks: Book[] = saved ? JSON.parse(saved) : [];
      let bookIndex = userBooks.findIndex((b) => b.id === bookId);

      let targetBook: Book;
      if (bookIndex === -1) {
        // If not already in localStorage, clone it from mockBooksDict
        targetBook = JSON.parse(JSON.stringify(mockBooksDict[bookId] || mockBooksDict['1']));
        userBooks.push(targetBook);
        bookIndex = userBooks.length - 1;
      } else {
        targetBook = userBooks[bookIndex];
      }

      const newChapNum = (targetBook.chaptersList.length + 1);
      const newChapId = `${bookId}_c${newChapNum}`;

      const newChapterObj: ChapterListItem = {
        id: newChapId,
        title: `Chapter ${newChapNum}: ${newChapTitle}`,
        date: 'Just now',
        read: false
      };

      // Update book parameters
      targetBook.chaptersList.push(newChapterObj);
      targetBook.stats.chapters = newChapNum;
      userBooks[bookIndex] = targetBook;

      localStorage.setItem('user_authored_books', JSON.stringify(userBooks));

      // Save chapter prose text content
      const savedChapters = localStorage.getItem('user_reader_chapters');
      const readerChapters: Record<string, string> = savedChapters ? JSON.parse(savedChapters) : {};
      readerChapters[newChapId] = `Chapter ${newChapNum}: ${newChapTitle}\n\n${newChapContent}`;
      localStorage.setItem('user_reader_chapters', JSON.stringify(readerChapters));

      setNewChapTitle('');
      setNewChapContent('');
      setUseAiForDraft(false);
      setAiDraftPrompt('');
      setShowAddChapter(false);
    } catch (err) {
      console.error('Failed to publish chapter:', err);
      setValidationError('Failed to save chapter. Please try again.');
    }
  };

  const handleAiDraftChapter = async () => {
    if (!aiDraftPrompt.trim()) {
      setValidationError("Please describe what happens in this chapter first.");
      return;
    }
    setValidationError(null);
    setIsAiDrafting(true);

    const savedKey = localStorage.getItem('gemini_api_key') || '';
    if (savedKey.trim()) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${savedKey.trim()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a professional co-writer drafting a new chapter for a novel titled "${book.title}".
                Novel Synopsis: "${book.synopsis}"
                This is Chapter ${book.chaptersList.length + 1}.
                Chapter Plot Prompt: "${aiDraftPrompt}"
                
                Generate a single JSON object (no markdown block wrapping). The JSON object must match this schema EXACTLY:
                {
                  "title": "A highly creative title for this chapter",
                  "content": "The complete, detailed, beautiful chapter narrative (containing at least 3-4 rich paragraphs separated by newlines)."
                }`
              }]
            }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });

        if (!response.ok) throw new Error("API call failed");

        const result = await response.json();
        const jsonText = result.candidates[0].content.parts[0].text;
        const parsed = JSON.parse(jsonText);

        setNewChapTitle(parsed.title);
        setNewChapContent(parsed.content);
        setIsAiDrafting(false);
        return;
      } catch (err) {
        console.error("Gemini draft failed, running simulated drafting:", err);
        setValidationError("Failed to connect to Google Gemini API. Running in local simulation mode instead!");
      }
    }

    // Local simulated co-writer draft fallback
    setTimeout(() => {
      setNewChapTitle(`The Destiny of ${book.title.split(' ').pop()}`);
      setNewChapContent(`The wind sang a low, ominous tune as the characters entered the next stage of their trial. Inside the quiet chambers, the echoes of their previous decisions lingered like heavy frost.\n\n"We can't turn back now," she whispered, looking at the glowing seal in the distance. The prompt "${aiDraftPrompt}" had set a chain of events in motion that none of them could prevent.\n\nWith a resolute nod, they stepped forward into the radiant light, preparing to rewrite their own history.`);
      setIsAiDrafting(false);
    }, 1800);
  };

  const handleDeleteBook = () => {
    if (window.confirm("Are you sure you want to delete this novel? This cannot be undone.")) {
      try {
        // 1. Delete from user_authored_books
        const savedAuthored = localStorage.getItem('user_authored_books');
        if (savedAuthored) {
          const authored: Book[] = JSON.parse(savedAuthored);
          const filtered = authored.filter((b) => b.id !== bookId);
          localStorage.setItem('user_authored_books', JSON.stringify(filtered));
        }

        // 2. Delete from bookshelf_books
        const savedShelf = localStorage.getItem('bookshelf_books');
        if (savedShelf) {
          const shelf: string[] = JSON.parse(savedShelf);
          const filtered = shelf.filter((id) => id !== bookId);
          localStorage.setItem('bookshelf_books', JSON.stringify(filtered));
        }

        // 3. Delete custom chapters
        const savedChapters = localStorage.getItem('user_reader_chapters');
        if (savedChapters) {
          const chapters: Record<string, string> = JSON.parse(savedChapters);
          Object.keys(chapters).forEach(key => {
            if (key.startsWith(bookId + '_')) {
              delete chapters[key];
            }
          });
          localStorage.setItem('user_reader_chapters', JSON.stringify(chapters));
        }

        navigate('/bookshelf');
      } catch (err) {
        console.error('Failed to delete book:', err);
      }
    }
  };

  const isUserBook = isUserAuthoredBook(bookId);

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
              {book.chaptersList.length > 0 ? (
                <Link to={`/read/${book.chaptersList[0].id}`} className="primary-btn read-full-btn">
                  Start Reading
                </Link>
              ) : (
                <button onClick={() => setShowAddChapter(true)} className="primary-btn read-full-btn">
                  ✍️ Write Your First Chapter
                </button>
              )}
              <button className="secondary-btn glass-panel">
                <span className="nav-icon">➕</span> Add to Library
              </button>
              {isUserBook && (
                <button onClick={handleDeleteBook} className="delete-btn glass-panel">
                  <span className="nav-icon">🗑️</span> Delete Novel
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="detail-body">
          <div className="synopsis-section">
            <h2 className="section-title">Synopsis</h2>
            <div className="tags-container">
              {book.tags.map((tag: string) => (
                <span key={tag} className="tag tag-outline">{tag}</span>
              ))}
            </div>
            <p className="synopsis-text">{book.synopsis}</p>
          </div>

          <div className="chapters-section">
            <div className="chapters-header">
              <h2 className="section-title">Chapters ({book.stats.chapters})</h2>
              <div className="chapters-header-actions">
                {isUserBook && (
                  <button 
                    onClick={() => setShowAddChapter(true)} 
                    className="add-chap-btn"
                  >
                    ➕ Add Chapter
                  </button>
                )}
                <button className="sort-btn">Oldest to Newest</button>
              </div>
            </div>

            <div className="chapter-list">
              {book.chaptersList.length === 0 && (
                <div className="empty-chapters-state">
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 1rem', fontSize: '0.95rem' }}>
                    📖 No chapters yet. Click <strong>"Add Chapter"</strong> above to start writing your story!
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
              {book.chaptersList.length > 3 && (
                <button className="load-more-btn glass-panel">Load More Chapters</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Chapter Writer */}
      {showAddChapter && (
        <div className={`writer-fullscreen ${writerTheme === 'light' ? 'writer-light-mode' : 'writer-dark-mode'}`}>
          {/* Writer Top Bar */}
          <div className="writer-topbar">
            <div className="writer-topbar-left">
              <button 
                onClick={() => { setShowAddChapter(false); setValidationError(null); }} 
                className="writer-back-btn"
              >
                ← Back
              </button>
              <div className="writer-topbar-meta">
                <span className="writer-topbar-book">{book.title}</span>
                <span className="writer-topbar-chap">Chapter {book.chaptersList.length + 1}</span>
              </div>
            </div>
            <div className="writer-topbar-right">
              <span className="writer-word-count">
                {newChapContent.trim() ? newChapContent.trim().split(/\s+/).length : 0} words
              </span>
              <button 
                onClick={() => setWriterTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                className="writer-theme-btn"
                title="Toggle Theme Mode"
              >
                {writerTheme === 'dark' ? '☀️ Light' : '🌙 Dark'}
              </button>
              <button 
                onClick={handlePublishChapter}
                className="writer-publish-btn"
              >
                Publish Chapter
              </button>
            </div>
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="writer-error-banner">
              {validationError}
            </div>
          )}

          {/* Writer Body */}
          <div className="writer-body">
            <div className="writer-canvas">
              {/* Chapter Title Input */}
              <input 
                type="text"
                value={newChapTitle}
                onChange={(e) => setNewChapTitle(e.target.value)}
                placeholder="Untitled Chapter"
                className="writer-title-input"
              />

              {/* AI Assist Collapsible */}
              <div className="writer-ai-bar">
                <label className="writer-ai-toggle-label">
                  <input 
                    type="checkbox" 
                    checked={useAiForDraft} 
                    onChange={(e) => setUseAiForDraft(e.target.checked)} 
                  />
                  <span className="writer-ai-toggle-dot" />
                  <span>✨ AI Co-Writer</span>
                </label>

                {useAiForDraft && (
                  <div className="writer-ai-panel">
                    <textarea 
                      value={aiDraftPrompt}
                      onChange={(e) => setAiDraftPrompt(e.target.value)}
                      placeholder="Describe what happens in this chapter — e.g. 'They arrive at the ancient ruins and face the guardian beast...'"
                      className="writer-ai-prompt"
                    />
                    <button 
                      onClick={handleAiDraftChapter}
                      disabled={isAiDrafting}
                      className="writer-ai-gen-btn"
                    >
                      {isAiDrafting ? '⏳ Generating draft...' : '🪄 Generate Draft'}
                    </button>
                  </div>
                )}
              </div>

              {/* Main Prose Textarea */}
              <textarea 
                value={newChapContent}
                onChange={(e) => setNewChapContent(e.target.value)}
                placeholder="Start writing your story here...

The blank page is your canvas. Let the words flow freely — describe the sights, the sounds, the emotions of your characters. 

Each paragraph brings your world closer to life."
                className="writer-prose-textarea"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
