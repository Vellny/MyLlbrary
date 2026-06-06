import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Menu, X, Award, Coins } from 'lucide-react';
import { bookTitles, isUserAuthoredBook, mockBooksDict } from '../data/mockBooks';
import { allChaptersContent } from '../data/mockChapters';
import { markChapterRead, checkAndClaimMilestones, getReadChapters } from '../services/rewards';
import { useAuth } from '../context/useAuth';
import type { Book, ChapterListItem } from '../types';
import './Reader.css';

export default function Reader() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id ?? 'guest';
  const [showControls, setShowControls] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Theme state
  const [theme, setTheme] = useState('dark'); // 'light', 'dark', 'sepia'
  const [fontSize, setFontSize] = useState(1.1);

  // Reward notification
  const [rewardNotification, setRewardNotification] = useState<{ coins: number; label: string } | null>(null);

  // Get current chapter and book details
  const currentId = chapterId || '1_c1';
  const hasBookPrefix = currentId.includes('_');
  const bookId = hasBookPrefix ? currentId.split('_')[0] : '1';
  const chapterKey = hasBookPrefix ? currentId.split('_')[1] : currentId;
  const chapterNum = parseInt(chapterKey.replace('c', '')) || 1;

  // Resolve list of chapters for the current book dynamically
  const bookChapters = (() => {
    try {
      const saved = localStorage.getItem('user_authored_books');
      if (saved) {
        const userBooks: Book[] = JSON.parse(saved);
        const found = userBooks.find((b) => b.id === bookId);
        if (found) return found.chaptersList || [];
      }
    } catch (err) {
      console.error('Failed to parse user_authored_books:', err);
    }

    const mockBook = mockBooksDict[bookId];
    if (mockBook) return mockBook.chaptersList || [];

    const fallback: ChapterListItem[] = [
      { id: `${bookId}_c1`, title: 'Chapter 1: ' + (bookId === '1' ? 'The Night of Silver Rain' : bookId === '2' ? 'Rain and Holograms' : bookId === '3' ? 'The Sunken City' : bookId === '4' ? 'The Winter Treaty' : 'The Emotion-Suppressor'), date: '', read: false },
      { id: `${bookId}_c2`, title: 'Chapter 2: ' + (bookId === '1' ? 'Shards of Silence' : bookId === '2' ? 'The Datacore Heist' : bookId === '3' ? 'The Whispering Monoliths' : bookId === '4' ? 'The Court of Frost' : 'Unit Alpha-7'), date: '', read: false },
      { id: `${bookId}_c3`, title: 'Chapter 3: ' + (bookId === '1' ? 'The Gilded Cage' : bookId === '2' ? 'Ghost in the Machine' : bookId === '3' ? 'Eyes in the Deep' : bookId === '4' ? 'The Cold Prince' : 'Spark of Life'), date: '', read: false }
    ];
    return fallback;
  })();

  const totalChapters = bookChapters.length;

  // Resolve content using prefixed format
  const contentKey = hasBookPrefix ? currentId : `1_${currentId}`;
  
  // Dynamic chapter content resolution (supporting newly created local novels)
  const getChapterContent = () => {
    if (!isUserAuthoredBook(bookId)) {
      if (allChaptersContent[contentKey]) return allChaptersContent[contentKey];

      // Procedurally generate unique content for middle chapters to make them all different!
      const fragments = [
        "The wind howled through the narrow corridors, carrying with it the scent of impending danger. They knew that turning back was no longer an option.",
        "Shadows danced along the ancient stone walls. Every step forward felt heavier than the last, weighed down by the burden of their choices.",
        "A sudden sound broke the silence—a sharp crack that echoed endlessly. Hands instinctively reached for weapons, eyes scanning the darkness.",
        "\"We can't stay here much longer,\" a voice whispered, barely audible over the beating of their own hearts.",
        "Memories of the past flickered in their minds, bittersweet and painful, serving as the only warmth in this cold, unforgiving place.",
        "The path ahead split into two, both shrouded in an impenetrable gloom. The map was useless here; they had to rely on pure instinct.",
        "A strange glowing light appeared in the distance. Was it a trap? Or the salvation they had been desperately searching for?",
        "Fatigue was setting in, tearing at their muscles and clouding their judgment, but the fiery resolve in their eyes refused to die out.",
        "\"Look at this,\" someone said, pointing at a strange runic symbol carved into the earth. It was ancient, pulsing with a faint, dormant magic.",
        "Suddenly, the ground trembled. Dust fell from the ceiling as a low, guttural roar vibrated through the very soles of their boots."
      ];

      // Seed a pseudo-random generator based on chapter number to keep it consistent
      const numMatch = contentKey.match(/_c(\d+)$/);
      const num = numMatch ? parseInt(numMatch[1], 10) : 1;
      let content = '';
      
      // Generate roughly 2500 words by combining fragments uniquely based on the chapter
      for (let i = 0; i < 150; i++) {
        // Pseudo-random index based on chapter number and loop index
        const index = ((num * 73) + (i * 37) + (num * i)) % fragments.length;
        content += fragments[index] + " ";
        if (i % 3 === 0) content += "\n\n";
      }

      return content;
    }
    try {
      const saved = localStorage.getItem('user_reader_chapters');
      if (saved) {
        const chapters = JSON.parse(saved);
        if (chapters[contentKey]) return chapters[contentKey];
      }
    } catch (err) {
      console.error('Failed to parse user_reader_chapters:', err);
    }
    return "Content for this chapter is coming soon! Our scribes are working hard to transcribe the ancient scrolls.";
  };

  const currentContent = getChapterContent();

  const bookTitleResolved = (() => {
    if (isUserAuthoredBook(bookId)) {
      try {
        const saved = localStorage.getItem('user_authored_books');
        if (saved) {
          const userBooks: Book[] = JSON.parse(saved);
          const found = userBooks.find((b) => b.id === bookId);
          if (found) return found.title;
        }
      } catch (err) {
        console.error('Failed to parse user_authored_books:', err);
      }
    }
    return bookTitles[bookId] || 'The Starlight Heir';
  })();

  const bookCoverResolved = (() => {
    if (isUserAuthoredBook(bookId)) {
      try {
        const saved = localStorage.getItem('user_authored_books');
        if (saved) {
          const userBooks: Book[] = JSON.parse(saved);
          const found = userBooks.find((b) => b.id === bookId);
          if (found && found.coverImage) return found.coverImage;
        }
      } catch (err) {
        // ignore
      }
    }
    const mockBook = mockBooksDict[bookId];
    if (mockBook && mockBook.coverImage) return mockBook.coverImage;
    return 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=800'; // Default cover
  })();

  // Mark chapter as read and check milestones
  const markAndReward = useCallback(() => {
    markChapterRead(userId, bookId, contentKey);
    const newMilestones = checkAndClaimMilestones(userId, bookId, totalChapters);
    if (newMilestones.length > 0) {
      const latest = newMilestones[newMilestones.length - 1];
      setRewardNotification({ coins: latest.coins, label: latest.label });
      setTimeout(() => setRewardNotification(null), 5000);
    }
  }, [userId, bookId, contentKey, totalChapters]);

  // Auto-mark chapter as read when opening it and scroll to top
  useEffect(() => {
    markAndReward();
    document.querySelector('.reader-page')?.scrollTo({ top: 0, behavior: 'instant' });
  }, [markAndReward]);

  // Get read chapters for drawer display
  const readChaptersSet = new Set(getReadChapters(userId, bookId));

  // Calculate reading progress
  const progressPercent = totalChapters > 0 ? Math.round((readChaptersSet.size / totalChapters) * 100) : 0;

  // Toggle controls on click
  const toggleControls = () => setShowControls(!showControls);

  // Dynamic navigation within the active book
  const handleNext = () => {
    if (chapterNum < totalChapters) {
      navigate(`/read/${bookId}_c${chapterNum + 1}`);
    }
  };

  const handlePrev = () => {
    if (chapterNum > 1) {
      navigate(`/read/${bookId}_c${chapterNum - 1}`);
    }
  };

  return (
    <div className={`reader-page theme-${theme}`} onClick={toggleControls}>
      {/* Milestone Reward Notification */}
      {rewardNotification && (
        <div className="reward-notification" onClick={e => e.stopPropagation()}>
          <div className="reward-notification-content">
            <div className="reward-icon-wrap">
              <Award size={28} className="reward-icon" />
            </div>
            <div className="reward-text">
              <h4>🎉 Milestone Reached!</h4>
              <p>{rewardNotification.label}</p>
              <div className="reward-coins">
                <Coins size={16} />
                <span>+{rewardNotification.coins} coins earned!</span>
              </div>
            </div>
          </div>
          <div className="reward-progress-fill" />
        </div>
      )}

      {/* Top Navbar */}
      <div className={`reader-header ${showControls ? 'visible' : ''}`} onClick={e => e.stopPropagation()}>
        <button onClick={() => navigate(-1)} className="reader-btn">
          ← Back
        </button>
        <div className="chapter-info">
          <span className="book-title-mini">{bookTitleResolved}</span>
          <span className="chapter-title-mini">Chapter {chapterNum}</span>
        </div>
        <button onClick={() => setIsDrawerOpen(true)} className="reader-btn">
          <Menu size={20} />
        </button>
      </div>

      {/* Reading Progress Bar */}
      <div className={`reader-progress-bar ${showControls ? 'visible' : ''}`}>
        <div className="reader-progress-fill" style={{ width: `${progressPercent}%` }} />
        <span className="reader-progress-text">{progressPercent}%</span>
      </div>

      {/* Chapters Side Drawer (Hamburger Menu) */}
      <div className={`chapters-drawer glass-panel ${isDrawerOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <h3 className="drawer-title text-gradient">Chapters</h3>
          <button className="drawer-close-btn" onClick={() => setIsDrawerOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Back to Book Cover Link */}
        <div className="drawer-book-link" onClick={() => navigate(`/book/${bookId}`)}>
          <img src={bookCoverResolved} alt="Book Cover" className="drawer-book-cover" />
          <div className="drawer-book-details">
            <span className="drawer-book-title">{bookTitleResolved}</span>
            <span className="drawer-book-action">← Back to Synopsis</span>
          </div>
        </div>

        {/* Progress in Drawer */}
        <div className="drawer-progress">
          <div className="drawer-progress-bar">
            <div className="drawer-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="drawer-progress-label">{readChaptersSet.size}/{totalChapters} chapters · {progressPercent}%</span>
        </div>

        <div className="drawer-chapters-list">
          {bookChapters.map((chapter: ChapterListItem, idx: number) => {
            const isCurrent = chapter.id === contentKey;
            const isRead = readChaptersSet.has(chapter.id);
            return (
              <div 
                key={chapter.id} 
                className={`drawer-chapter-item ${isCurrent ? 'active' : ''} ${isRead ? 'read' : ''}`}
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate(`/read/${chapter.id}`);
                }}
              >
                <span className="drawer-chap-num">{isRead ? '✓' : idx + 1}</span>
                <span className="drawer-chap-title">{chapter.title}</span>
              </div>
            );
          })}
        </div>
      </div>
      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}></div>
      )}

      {/* Content Area */}
      <div className="reader-content-container" style={{ fontSize: `${fontSize}rem` }}>
        <h1 className="chapter-heading">Chapter {chapterNum}</h1>
        <div className="reading-text">
          {currentContent.trim().split('\n\n').map((paragraph: string, idx: number) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Bottom Navbar / Controls */}
      <div className={`reader-footer ${showControls ? 'visible' : ''}`} onClick={e => e.stopPropagation()}>

        <div className="reader-settings">
          <div className="setting-group">
            <button onClick={() => setFontSize(f => Math.max(0.8, f - 0.1))} className="setting-btn">A-</button>
            <span className="setting-label">Size</span>
            <button onClick={() => setFontSize(f => Math.min(2.0, f + 0.1))} className="setting-btn">A+</button>
          </div>

          <div className="setting-group theme-toggles">
            <button onClick={() => setTheme('light')} className={`theme-btn btn-light ${theme === 'light' ? 'active' : ''}`}></button>
            <button onClick={() => setTheme('sepia')} className={`theme-btn btn-sepia ${theme === 'sepia' ? 'active' : ''}`}></button>
            <button onClick={() => setTheme('dark')} className={`theme-btn btn-dark ${theme === 'dark' ? 'active' : ''}`}></button>
          </div>
        </div>

        <div className="chapter-nav">
          <button onClick={handlePrev} className="nav-chapter-btn" disabled={chapterNum <= 1}>← Previous</button>
          <button onClick={handleNext} className="nav-chapter-btn" disabled={chapterNum >= totalChapters}>Next →</button>
        </div>
      </div>
    </div>
  );
}
