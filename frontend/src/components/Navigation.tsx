import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Crown, Award, Coins } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { getCoins, isVIP, redeemVIP, VIP_COST, MILESTONES, getReadingProgress, getClaimedMilestones } from '../services/rewards';
import './Navigation.css';

export default function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const userId = user?.id ?? 'guest';
  const [coins, setCoins] = useState(getCoins(userId));
  const [vip, setVip] = useState(isVIP(userId));
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Refresh coin balance on navigation and periodically
  useEffect(() => {
    setCoins(getCoins(userId));
    setVip(isVIP(userId));
    const interval = setInterval(() => {
      setCoins(getCoins(userId));
      setVip(isVIP(userId));
    }, 2000);
    return () => clearInterval(interval);
  }, [location.pathname, userId]);

  // Close panel on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    }
    if (panelOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [panelOpen]);

  // Close panel on route change
  useEffect(() => { setPanelOpen(false); }, [location.pathname]);

  // Don't show navigation in the reader view
  if (location.pathname.startsWith('/read/')) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  // Get current book from path for progress display (e.g. /book/1)
  const bookMatch = location.pathname.match(/^\/book\/([^/]+)/);
  const currentBookId = bookMatch ? bookMatch[1] : null;
  // We don't know totalChapters from nav, so show a generic "per-book" progress note
  // If on a book page, try reading progress from localStorage mockBooksDict chapter count
  const progress = currentBookId ? getReadingProgress(userId, currentBookId, 10) : 0;
  const claimed = currentBookId ? getClaimedMilestones(userId, currentBookId) : [];

  return (
    <nav className="glass-panel main-nav">
      <div className="nav-container">
        {/* Desktop Logo */}
        <div className="nav-logo">
          <Link to="/">
            <span className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              MyLibrary
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <span className="nav-text">Discover</span>
          </Link>
          <Link to="/create-novel" className={`nav-item ${location.pathname === '/create-novel' ? 'active' : ''}`}>
            <span className="nav-text">Write</span>
          </Link>
          <Link to="/bookshelf" className={`nav-item ${location.pathname === '/bookshelf' ? 'active' : ''}`}>
            <span className="nav-text">Bookshelf</span>
          </Link>

          {/* Coin Balance — clickable to open rewards panel */}
          <div className="nav-coins-wrapper" ref={panelRef}>
            <button
              className={`nav-coins ${panelOpen ? 'active' : ''}`}
              onClick={() => setPanelOpen(v => !v)}
              title={`${coins} Star Coins${vip ? ' · VIP Member' : ''} — click to view rewards`}
            >
              <span className="coin-icon">🪙</span>
              <span className="coin-count">{coins}</span>
              {vip && <span className="vip-badge">VIP</span>}
            </button>

            {/* Rewards Dropdown Panel */}
            {panelOpen && (
              <div className="rewards-dropdown glass-panel">
                {/* VIP Exchange */}
                <div className="rd-vip-row">
                  <div className="rd-vip-info">
                    <Crown size={15} className="rd-crown" />
                    <span>Your Balance: <strong className="rd-coin-highlight">{coins} coins</strong></span>
                  </div>
                  {!vip ? (
                    <button
                      className={`rd-vip-btn ${coins >= VIP_COST ? '' : 'disabled'}`}
                      onClick={() => {
                        if (redeemVIP(userId)) {
                          setVip(true);
                          setCoins(getCoins(userId));
                        } else {
                          alert(`You need ${VIP_COST} coins to redeem VIP. Keep reading!`);
                        }
                      }}
                    >
                      <Crown size={13} />
                      Redeem VIP ({VIP_COST} coins)
                    </button>
                  ) : (
                    <span className="rd-vip-active">
                      <Crown size={13} />
                      VIP Active
                    </span>
                  )}
                </div>

                {/* Reading Progress — only when on a book page */}
                {currentBookId ? (
                  <>
                    <div className="rd-progress-header">
                      <Award size={16} className="rd-award" />
                      <span className="rd-progress-title">Reading Progress</span>
                      <span className="rd-progress-pct">{progress}%</span>
                    </div>
                    <div className="rd-bar-bg">
                      <div className="rd-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="rd-milestones">
                      {MILESTONES.map((m) => {
                        const isClaimed = claimed.includes(m.percent);
                        const isReached = progress >= m.percent;
                        return (
                          <div
                            key={m.percent}
                            className={`rd-milestone ${isClaimed ? 'claimed' : ''} ${isReached && !isClaimed ? 'reached' : ''} ${!isReached ? 'locked' : ''}`}
                          >
                            <div className="rd-badge">{isClaimed ? '✓' : `${m.percent}%`}</div>
                            <span className="rd-label">{m.label.split('—')[1]?.trim()}</span>
                            <div className="rd-reward">
                              <Coins size={11} />
                              <span>{m.coins}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <p className="rd-hint">📖 Open a book to track your reading progress here.</p>
                )}
              </div>
            )}
          </div>

          {/* Mobile Profile Link / Desktop User Menu */}
          <div className="nav-user">
            {user ? (
              <div className="user-menu-wrapper">
                <Link to="/profile" className="nav-item">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="nav-avatar" />
                  ) : (
                    <span className="nav-icon">👤</span>
                  )}
                  <span className="nav-text">Profile</span>
                </Link>
                {/* Desktop Dropdown */}
                <div className="user-dropdown glass-panel">
                  <div className="dropdown-header">
                    <p style={{ fontWeight: 'bold' }}>{user.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.email}</p>
                  </div>
                  <button onClick={handleLogout} className="dropdown-btn logout-btn">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className={`nav-item ${location.pathname === '/login' ? 'active' : ''}`}>
                <span className="nav-icon">🔑</span>
                <span className="nav-text">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

