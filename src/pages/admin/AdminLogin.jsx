import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../seo/SEO';
import toast from 'react-hot-toast';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  KeyRound, 
  CheckCircle2, 
  X
} from 'lucide-react';

import { getLoginRateLimitStatus } from '../../utils/jwtSecurity';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // General Status
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Check rate limit status on mount and update countdown
  useEffect(() => {
    const checkRate = () => {
      const status = getLoginRateLimitStatus();
      if (status.isLocked) {
        setLockoutSeconds(status.remainingSeconds);
      } else {
        setLockoutSeconds(0);
      }
    };

    checkRate();
    const interval = setInterval(() => {
      setLockoutSeconds(prev => {
        if (prev <= 1) {
          checkRate();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState(null); // 'success' | 'error' | null
  const [resetMsg, setResetMsg] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const { login, resetPassword, isFirebaseConfigured } = useAuth();
  const navigate = useNavigate();

  // Email/Password Submit
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (lockoutSeconds > 0) {
      toast.error(`Security lockout active. Please wait ${lockoutSeconds} seconds.`);
      return;
    }

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      toast.error('Please enter both your admin email and password.');
      setError('Please provide both your admin email and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(cleanEmail, password);
      toast.success('Authenticated: 256-Bit JWT Session Established!');
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      // Re-check rate limit on failure
      const status = getLoginRateLimitStatus();
      if (status.isLocked) {
        setLockoutSeconds(status.remainingSeconds);
      }
      const msg = err.message || 'Invalid email or password. Please try again.';
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      toast.error('Please enter your admin email address.');
      setResetStatus('error');
      setResetMsg('Please enter your admin email address.');
      return;
    }

    setResetLoading(true);
    setResetStatus(null);

    try {
      const res = await resetPassword(resetEmail.trim());
      const successText = res.message || `Password reset link sent to ${resetEmail}. Check your inbox.`;
      toast.success('Password reset link sent! Check your inbox.');
      setResetStatus('success');
      setResetMsg(successText);
    } catch (err) {
      const errorText = err.message || 'Failed to send password reset email.';
      toast.error(errorText);
      setResetStatus('error');
      setResetMsg(errorText);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071827] text-white flex flex-col justify-center items-center px-4 relative overflow-hidden py-12">
      <SEO title="Admin Login | Jai Bhavani Constructions" />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-water/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern-dark opacity-20 pointer-events-none" />

      {/* Top back link */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Website</span>
        </Link>
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Main Card */}
        <div className="bg-[#0b2138]/90 backdrop-blur-xl border border-white/15 rounded-3xl p-7 sm:p-9 shadow-2xl space-y-6">
          
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-white mx-auto flex items-center justify-center p-1 border-2 border-brand-water/40 shadow-lg shadow-brand-water/10">
              <img src="/jbc-logo.png" alt="JBC Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
            
            <div className="pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-water/20 border border-brand-water/30 text-brand-water text-[11px] font-bold uppercase tracking-wider mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Authentication</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                JBC Admin Portal
              </h1>
              <p className="text-xs text-slate-300">
                Sign in with your email and password to manage website content
              </p>
            </div>
          </div>

          {/* Error Message Box */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Email & Password Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-brand-water focus:ring-1 focus:ring-brand-water transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setShowForgotModal(true);
                  }}
                  className="text-[11px] text-brand-water hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-brand-water focus:ring-1 focus:ring-brand-water transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Brute-force Lockout Warning */}
            {lockoutSeconds > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2.5 animate-pulse">
                <Lock className="w-4 h-4 shrink-0 text-amber-400" />
                <span className="font-semibold">
                  Brute-force security lockout active. Retrying enabled in <strong className="text-white">{lockoutSeconds}s</strong>.
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || lockoutSeconds > 0}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-water via-[#1080bd] to-[#0d6fa7] hover:from-[#1da3ec] hover:to-brand-water text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-water/20 hover:shadow-brand-water/40 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-98"
            >
              <span>{loading ? 'Authenticating & Issuing JWT...' : lockoutSeconds > 0 ? `Locked (${lockoutSeconds}s)` : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Cryptographic JWT Security Footer Badge */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>256-Bit RFC 7519 Cryptographic JWT Identity Security</span>
          </div>

        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b2138] border border-white/15 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-water/20 text-brand-water flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Reset Admin Password</h3>
              </div>
              <button 
                onClick={() => {
                  setShowForgotModal(false);
                  setResetStatus(null);
                }} 
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Enter your admin email address below and we'll send you a secure Firebase password reset link.
            </p>

            {resetStatus && (
              <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                resetStatus === 'success' 
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200' 
                  : 'bg-red-500/15 border-red-500/30 text-red-200'
              }`}>
                {resetStatus === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{resetMsg}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter admin email"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-brand-water focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="px-5 py-2 rounded-xl bg-brand-water hover:bg-[#1da3ec] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {resetLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
