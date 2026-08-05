// ============================================================
// NDURANCE — Login Page
// Apple WWDC 2026 Liquid Glass
// ============================================================

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) { setError('Please fill in all fields.'); return; }
    setError('');
    setIsLoading(true);
    try {
      await login({ username, password, rememberMe: remember });
      onNavigate('dashboard');
    } catch {
      setError('Invalid username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="auth-bg">
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
        <div className="auth-blob auth-blob-3" />
        <div className="auth-noise" />
      </div>

      {/* Card */}
      <div className="login-card glass-card-strong nd-scale-in">
        {/* Logo */}
        <div className="login-logo nd-fade-up">
          <div className="logo-mark">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L28 26H4L16 2Z" fill="url(#logoGrad)" opacity="0.9"/>
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FF6B9D"/>
                  <stop offset="100%" stopColor="#8B5CF6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="logo-name">NDURANCE</span>
        </div>

        <div className="login-header nd-fade-up delay-1">
          <h2>Welcome back</h2>
          <p>Sign in to your coach account</p>
        </div>

        {error && (
          <div className="login-error nd-fade-in">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form nd-fade-up delay-2">
          {/* Username */}
          <div className="nd-input-wrap">
            <input
              id="login-username"
              className="nd-input"
              type="text"
              placeholder=" "
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
            />
            <label className="nd-label" htmlFor="login-username">Name or Username</label>
          </div>

          {/* Password */}
          <div className="nd-input-wrap">
            <input
              id="login-password"
              className="nd-input"
              type={showPass ? 'text' : 'password'}
              placeholder=" "
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{ paddingRight: '52px' }}
            />
            <label className="nd-label" htmlFor="login-password">Password</label>
            <button
              type="button"
              className="pass-toggle"
              onClick={() => setShowPass(s => !s)}
              aria-label={showPass ? 'Hide password' : 'Show password'}
            >
              {showPass ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>

          {/* Remember me + Forgot */}
          <div className="login-options">
            <label className="nd-checkbox">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
              <span className="nd-checkbox-box" />
              <span>Remember me</span>
            </label>
            <button type="button" className="forgot-link">Forgot password?</button>
          </div>

          {/* Submit */}
          <button type="submit" className="nd-btn nd-btn-primary nd-btn-full nd-btn-lg" disabled={isLoading}>
            {isLoading ? <span className="nd-spinner" /> : 'Sign In'}
          </button>
        </form>

        <div className="login-footer nd-fade-up delay-3">
          <span>Don't have an account?</span>
          <button className="signup-link" onClick={() => onNavigate('signup')}>
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}
