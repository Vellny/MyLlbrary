import React, { useState, useEffect, type FormEvent } from 'react'
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import './Login.css'

export default function RegisterPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirmation: false })

  const nameValid = name.length > 0
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const passwordValid = password.length >= 8
  const confirmationValid = password === passwordConfirmation && passwordConfirmation.length > 0
  const formValid = nameValid && emailValid && passwordValid && confirmationValid

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (status) setStatus(null)
  }, [name, email, password, passwordConfirmation])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setTouched({ name: true, email: true, password: true, confirmation: true })

    if (!formValid) return

    setLoading(true)
    setStatus(null)

    try {
      await api.get('/sanctum/csrf-cookie')
      const response = await api.post('/api/register', { 
        name, 
        email, 
        password, 
        password_confirmation: passwordConfirmation 
      })

      if (response.status === 201) {
        setStatus({ type: 'success', message: 'Registrasi berhasil! Mengalihkan...' })
        setTimeout(() => {
          login(response.data.user)
        }, 1000)
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal registrasi.'
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
            <UserPlus size={28} />
          </div>
          <h1 className="login-title">Buat Akun</h1>
          <p className="login-subtitle">Bergabunglah dengan MyLibrary hari ini</p>
        </div>

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
            <label className="login-label">Nama Lengkap</label>
            <div className={`login-input-wrap ${touched.name && !nameValid ? 'login-input-wrap--error' : ''}`}>
              <User size={18} className="login-input-icon" />
              <input
                type="text"
                placeholder="Nama Anda"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                onBlur={() => setTouched((prev: any) => ({ ...prev, name: true }))}
                disabled={loading}
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">Email</label>
            <div className={`login-input-wrap ${touched.email && !emailValid ? 'login-input-wrap--error' : ''}`}>
              <Mail size={18} className="login-input-icon" />
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                onBlur={() => setTouched((prev: any) => ({ ...prev, email: true }))}
                disabled={loading}
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">Kata Sandi</label>
            <div className={`login-input-wrap ${touched.password && !passwordValid ? 'login-input-wrap--error' : ''}`}>
              <Lock size={18} className="login-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                onBlur={() => setTouched((prev: any) => ({ ...prev, password: true }))}
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

          <div className="login-field">
            <label className="login-label">Konfirmasi Sandi</label>
            <div className={`login-input-wrap ${touched.confirmation && !confirmationValid ? 'login-input-wrap--error' : ''}`}>
              <Lock size={18} className="login-input-icon" />
              <input
                type="password"
                placeholder="Ulangi kata sandi"
                value={passwordConfirmation}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordConfirmation(e.target.value)}
                onBlur={() => setTouched((prev: any) => ({ ...prev, confirmation: true }))}
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? <Loader2 size={20} className="login-spinner" /> : 'Daftar'}
          </button>
        </form>

        <div className="login-divider">
          <span>atau daftar dengan</span>
        </div>

        <div className="login-social-grid">
          <button 
            type="button" 
            className="login-social-btn login-social-btn--google"
            onClick={() => window.location.href = '/api/auth/google'}
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
            onClick={() => window.location.href = '/api/auth/facebook'}
          >
            <svg className="login-social-icon fill-white" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Facebook</span>
          </button>
        </div>

        <p className="login-footer-text">
          Sudah punya akun? <Link to="/login" className="login-link login-link--accent">Masuk di sini</Link>
        </p>
      </motion.div>
    </div>
  )
}
