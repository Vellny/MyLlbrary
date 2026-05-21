import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { 
  User as UserIcon, 
  Award, 
  LogOut, 
  ShieldAlert, 
  ShieldCheck, 
  Save, 
  Calendar, 
  KeyRound, 
  Sparkles,
  BookMarked,
  Camera
} from 'lucide-react';
import './ProfilePage.css';

const PRESETS = [
  { name: 'Scholar', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
  { name: 'Mysterious Knight', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
  { name: 'Cosmic Explorer', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
  { name: 'Fantasy Wizard', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
  { name: 'Ancient Sage', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200' },
  { name: 'Dreamer', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' },
];

export default function ProfilePage() {
  const { user, logout, loading, updateUser } = useAuth();
  const navigate = useNavigate();

  // Form edit states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Avatar Picker states
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    } else if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="profile-page" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading profile...</p>
      </div>
    );
  }

  if (!user) return null;

  // Get user initials for avatar fallback safely
  const getInitials = (userName: string) => {
    if (!userName) return 'U';
    const parts = userName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    try {
      const response = await api.post('/api/user/update', { name });
      updateUser(response.data.user);
      setSaveStatus('success');
      setIsEditing(false);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error('Failed to update profile', err);
      setSaveStatus('error');
    }
  };

  const handleSelectAvatar = async (url: string) => {
    setSaveStatus('saving');
    try {
      const response = await api.post('/api/user/update', { name: user.name, avatar: url });
      updateUser(response.data.user);
      setSaveStatus('success');
      setShowAvatarPicker(false);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error('Failed to update avatar', err);
      setSaveStatus('error');
    }
  };

  const handleCustomAvatarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAvatarUrl.trim()) {
      handleSelectAvatar(customAvatarUrl.trim());
    }
  };

  return (
    <div className="profile-page">
      {/* Cover Banner */}
      <div className="profile-cover-banner" />

      {/* Profile Intro Card */}
      <div className="profile-intro-card">
        <div className="profile-avatar-wrapper" onClick={() => setShowAvatarPicker(true)}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="profile-avatar-img" />
          ) : (
            <div className="profile-avatar-fallback">
              {getInitials(user.name)}
            </div>
          )}
          <div className="profile-avatar-overlay">
            <Camera size={20} style={{ marginBottom: '4px' }} />
            <span>Edit Photo</span>
          </div>
        </div>
        <div className="profile-user-info">
          <h1 className="profile-user-name">
            {user.name}
            <span className="profile-member-badge">VIP Member</span>
          </h1>
          <p className="profile-user-email">{user.email}</p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="profile-content-grid">
        
        {/* Left Side: Account Details & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Account Details Card */}
          <div className="profile-glass-card glass-panel">
            <h2 className="profile-card-title">
              <UserIcon size={20} className="text-gradient" />
              Account Details
            </h2>
            
            <form onSubmit={handleSave} className="profile-form">
              <div className="profile-form-group">
                <label className="profile-form-label">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  disabled={!isEditing}
                  className="profile-form-input"
                />
              </div>

              <div className="profile-form-group">
                <label className="profile-form-label">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  disabled={true} // Email matches OAuth/Primary login
                  className="profile-form-input"
                  style={{ opacity: 0.6 }}
                />
              </div>

              {isEditing ? (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="profile-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Save size={16} />
                    {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setName(user.name); setIsEditing(false); }}
                    className="profile-form-input"
                    style={{ cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  type="button" 
                  onClick={() => setIsEditing(true)}
                  className="profile-btn-primary"
                >
                  Edit Profile
                </button>
              )}

              {saveStatus === 'success' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.9rem' }}>
                  <ShieldCheck size={16} />
                  Changes saved successfully!
                </div>
              )}

              {saveStatus === 'error' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.9rem' }}>
                  <ShieldAlert size={16} />
                  Failed to save changes. Please try again.
                </div>
              )}
            </form>
          </div>

          {/* Security & System Info */}
          <div className="profile-glass-card glass-panel">
            <h2 className="profile-card-title">
              <KeyRound size={20} className="text-gradient" />
              Preferences & Info
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} /> Member Since
                </span>
                <span style={{ fontWeight: 'bold' }}>May 2026</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={16} /> Premium Level
                </span>
                <span className="text-gradient" style={{ fontWeight: 'bold' }}>Level 5 (Scholar)</span>
              </div>
            </div>
            <button onClick={logout} className="profile-btn-logout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              <LogOut size={16} />
              Logout from MyLibrary
            </button>
          </div>
        </div>

        {/* Right Side: Stats & Reading Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Stats Summary */}
          <div className="profile-glass-card glass-panel">
            <h2 className="profile-card-title">
              <Award size={20} className="text-gradient" />
              Reading Statistics
            </h2>
            <div className="profile-stats-grid">
              <div className="profile-stat-box glass-panel">
                <div className="profile-stat-val">3</div>
                <div className="profile-stat-lbl">Books Added</div>
              </div>
              <div className="profile-stat-box glass-panel">
                <div className="profile-stat-val">12</div>
                <div className="profile-stat-lbl">Chapters Read</div>
              </div>
              <div className="profile-stat-box glass-panel">
                <div className="profile-stat-val">4.8h</div>
                <div className="profile-stat-lbl">Hours Reading</div>
              </div>
            </div>
          </div>

          {/* Recent Reading Activity */}
          <div className="profile-glass-card glass-panel">
            <h2 className="profile-card-title">
              <BookMarked size={20} className="text-gradient" />
              Recent Reading Activity
            </h2>
            
            <div className="profile-activity-list">
              <div className="profile-activity-item">
                <img 
                  src="https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=800" 
                  alt="The Starlight Heir" 
                  className="profile-activity-book-cover"
                />
                <div className="profile-activity-details">
                  <div className="profile-activity-title">The Starlight Heir</div>
                  <div className="profile-activity-chapter">Chapter 3: The Gilded Cage</div>
                  <div className="profile-activity-time">Last read: 5 minutes ago</div>
                </div>
                <button 
                  onClick={() => navigate('/read/1_c3')} 
                  className="profile-activity-resume-btn"
                >
                  Resume
                </button>
              </div>

              <div className="profile-activity-item" style={{ opacity: 0.7 }}>
                <img 
                  src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800" 
                  alt="Shadows of Omiris" 
                  className="profile-activity-book-cover"
                />
                <div className="profile-activity-details">
                  <div className="profile-activity-title">Shadows of Omiris</div>
                  <div className="profile-activity-chapter">Chapter 1: The Ashlands</div>
                  <div className="profile-activity-time">Last read: 1 day ago</div>
                </div>
                <button 
                  onClick={() => navigate('/read/1_c1')} 
                  className="profile-activity-resume-btn"
                >
                  Resume
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <div className="ai-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="ai-modal-card glass-panel" style={{ maxWidth: '480px', padding: '2.5rem', textAlign: 'left', alignItems: 'stretch', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.75rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Change Profile Photo</h2>
              <button 
                onClick={() => setShowAvatarPicker(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Select a beautiful preset avatar or enter a custom image URL:
              </p>
              
              {/* Preset Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handleSelectAvatar(preset.url)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
                  >
                    <img 
                      src={preset.url} 
                      alt={preset.name} 
                      style={{ 
                        width: '70px', 
                        height: '70px', 
                        borderRadius: '50%', 
                        objectFit: 'cover', 
                        border: user.avatar === preset.url ? '3px solid var(--accent-primary)' : '2px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                      }} 
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom URL Input Form */}
              <form onSubmit={handleCustomAvatarSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.25rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Or enter a custom image URL:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="url"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    style={{
                      flex: 1,
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--bg-glass-border)',
                      color: 'var(--text-primary)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.85rem'
                    }}
                  />
                  <button 
                    type="submit"
                    className="profile-btn-primary"
                    style={{ padding: '0.5rem 1rem', alignSelf: 'stretch', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                  >
                    Apply URL
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
