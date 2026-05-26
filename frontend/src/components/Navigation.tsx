import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './Navigation.css';

export default function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Don't show navigation in the reader view
  if (location.pathname.startsWith('/read/')) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

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
            <span className="nav-icon">🧭</span>
            <span className="nav-text">Discover</span>
          </Link>
          <Link to="/create-novel" className={`nav-item ${location.pathname === '/create-novel' ? 'active' : ''}`}>
            <span className="nav-icon">✍️</span>
            <span className="nav-text">Write</span>
          </Link>
          <Link to="/bookshelf" className={`nav-item ${location.pathname === '/bookshelf' ? 'active' : ''}`}>
            <span className="nav-icon">📚</span>
            <span className="nav-text">Bookshelf</span>
          </Link>
          
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
