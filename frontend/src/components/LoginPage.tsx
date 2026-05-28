import React, { useState, useEffect, type FormEvent } from 'react'
import { Eye, EyeOff, Mail, Lock, LogIn, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import type { SavedAccount } from '../types'
import api from '../api'
import './Login.css'

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePassword(password: string): boolean {
  return password.length >= 8
}

function loadSavedAccounts(): SavedAccount[] {
  const saved = localStorage.getItem('saved_accounts')
  if (!saved) return []
  try {
    return JSON.parse(saved)
  } catch {
    return []
  }
}

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [remember, setRemember] = useState(false)
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>(loadSavedAccounts)

  const passwordInputRef = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)

  const emailValid = validateEmail(email)
  const passwordValid = validatePassword(password)
  const formValid = emailValid && passwordValid

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [status])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setEmailTouched(true)
    setPasswordTouched(true)

    if (!formValid) return

    setLoading(true)
    setStatus(null)

    try {
      await api.get('/sanctum/csrf-cookie')
      const response = await api.post('/api/login', { email, password, remember })

      if (response.status === 200) {
        setStatus({ type: 'success', message: 'Login successful! Redirecting...' })
        setTimeout(() => {
          login(response.data.user)
        }, 1000)
      } else {
        setStatus({ type: 'error', message: response.data.message || 'Incorrect email or password.' })
      }
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response: { data: { message: string } } }).response?.data?.message
        : 'Failed to connect to the server.'
      setStatus({ type: 'error', message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-blob login-blob--1" />
      <div className="login-blob login-blob--2" />

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
      >
        <div className="login-header">
          <div className="login-logo">
            <LogIn size={28} />
          </div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your MyLibrary account</p>
        </div>

        {/* Saved Accounts Switcher Grid */}
        {savedAccounts.length > 0 && (
          <div className="saved-accounts-section" style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Choose a Saved Account
            </h3>
            <div className="saved-accounts-grid" style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {savedAccounts.map((acc: SavedAccount) => {
                const initials = acc.name ? acc.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
                const isSelected = email === acc.email;
                return (
                  <div 
                    key={acc.email} 
                    className="saved-account-card glass-panel"
                    onClick={() => {
                      setEmail(acc.email);
                      if (passwordInputRef.current) passwordInputRef.current.focus();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.6rem 1rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      border: isSelected ? '1px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.08)',
                      background: isSelected ? 'rgba(138, 75, 243, 0.1)' : 'rgba(255,255,255,0.02)',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      minWidth: '165px',
                      flexShrink: 0
                    }}
                  >
                    <div 
                      className="saved-avatar" 
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #8a4bf3, #c14bf3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#fff',
                        flexShrink: 0
                      }}
                    >
                      {initials}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', textAlign: 'left' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {acc.name}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {acc.email}
                      </span>
                    </div>

                    {/* Delete Saved Account button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = savedAccounts.filter((x: SavedAccount) => x.email !== acc.email);
                        setSavedAccounts(updated);
                        localStorage.setItem('saved_accounts', JSON.stringify(updated));
                        if (email === acc.email) setEmail('');
                      }}
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: 'rgba(239, 68, 68, 0.9)',
                        color: '#fff',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.6rem',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                        transition: 'all 0.2s ease',
                        padding: 0
                      }}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <AnimatePresence>
          {status && (
            <motion.div
              className={`login-alert login-alert--${status.type}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{status.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label className="login-label">Email</label>
            <div className={`login-input-wrap ${emailTouched && !emailValid ? 'login-input-wrap--error' : ''}`}>
              <Mail size={18} className="login-input-icon" />
              <input
                type="email"
                placeholder="name@email.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <div className={`login-input-wrap ${passwordTouched && !passwordValid ? 'login-input-wrap--error' : ''}`}>
              <Lock size={18} className="login-input-icon" />
              <input
                ref={passwordInputRef}
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                disabled={loading}
              />
              <button
                type="button"
                className="login-toggle-pw"
                onClick={() => setShowPassword((v: boolean) => !v)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="login-remember-row">
            <label className="login-remember-label">
              <input 
                type="checkbox" 
                checked={remember} 
                onChange={(e) => setRemember(e.target.checked)} 
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="login-forgot-link">Forgot password?</a>
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? <Loader2 size={20} className="login-spinner" /> : 'Sign In'}
          </button>
        </form>

        <div className="login-divider">
          <span>or sign in with</span>
        </div>

        <div className="login-social-grid">
          <button 
            type="button" 
            className="login-social-btn login-social-btn--google"
            onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || ''}/api/auth/google`}
          >
            <svg className="login-social-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google</span>
          </button>

          <button 
            type="button" 
            className="login-social-btn login-social-btn--facebook"
            onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || ''}/api/auth/facebook`}
          >
            <svg className="login-social-icon fill-white" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Facebook</span>
          </button>
        </div>

        <p className="login-footer-text">
          Don't have an account? <Link to="/register" className="login-link login-link--accent">Sign up now</Link>
        </p>
      </motion.div>
    </div>
  )
}
