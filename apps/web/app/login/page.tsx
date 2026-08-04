"use client";

import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import Link from 'next/link';
import { ArrowRight, Mail, Lock, CheckCircle2, UserRound } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403) {
          setStep('otp');
          setMessage('A verification code has been sent to your email.');
          return;
        }
        throw new Error(data.error || 'Login failed');
      }

      window.location.href = `${dashboardUrl}?token=${data.token}`;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'OTP verification failed');

      window.location.href = `${dashboardUrl}?token=${data.token}`;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google login failed');

      window.location.href = `${dashboardUrl}?token=${data.token}`;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/guest`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not start guest session');
      window.location.href = `${dashboardUrl}?token=${data.token}`;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative px-4">
      {/* Subtle Mesh Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />

      <div className="w-full max-w-[420px] bg-white/5 dark:bg-[#121212]/50 backdrop-blur-3xl border border-black/5 dark:border-white/10 p-8 sm:p-10 rounded-[32px] shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground text-center">
            {step === 'login' ? 'Sign In' : 'Verify Email'}
          </h2>
          <p className="text-muted-foreground text-center mt-2 text-sm">
            {step === 'login' 
              ? 'Enter your details to proceed.' 
              : 'Enter the 6-digit OTP code sent to your email.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-3 rounded-2xl mb-6 text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {step === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground ml-1 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground/60" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-black/[0.03] dark:bg-white/[0.03] border border-transparent rounded-[20px] focus:bg-background focus:border-primary/30 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-[15px]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground ml-1 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground/60" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-black/[0.03] dark:bg-white/[0.03] border border-transparent rounded-[20px] focus:bg-background focus:border-primary/30 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-[15px]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-foreground text-background hover:opacity-90 disabled:opacity-50 transition-all rounded-[20px] font-medium flex items-center justify-center gap-2 text-[15px]"
            >
              {loading ? 'Signing in...' : 'Continue'} <ArrowRight className="w-4 h-4" />
            </button>

            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-muted-foreground text-xs uppercase tracking-wider font-medium">or</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Sign In failed')}
                theme="outline"
                shape="pill"
                size="large"
                width="100%"
              />
            </div>

            {/* Guest Login */}
            <div className="relative flex pt-2 pb-2 items-center">
              <div className="flex-grow border-t border-border" />
              <span className="flex-shrink mx-4 text-muted-foreground text-xs uppercase tracking-wider font-medium">or</span>
              <div className="flex-grow border-t border-border" />
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleGuestLogin}
              className="w-full py-3.5 border border-border bg-transparent hover:bg-muted/50 disabled:opacity-50 transition-all rounded-[20px] font-medium flex items-center justify-center gap-2 text-[15px] text-muted-foreground hover:text-foreground"
            >
              <UserRound className="w-4 h-4" />
              {loading ? 'Starting session...' : 'Continue as Guest'}
            </button>

            <p className="text-center text-muted-foreground font-medium mt-4 text-[14px]">
              Don't have an account?{' '}
              <Link href="/signup" className="text-foreground hover:text-primary transition-colors font-semibold">
                Sign up
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground ml-1 uppercase tracking-wider">Verification Code</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-4 text-center tracking-[0.75em] text-2xl font-medium bg-black/[0.03] dark:bg-white/[0.03] border border-transparent rounded-[20px] focus:bg-background focus:border-primary/30 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-foreground text-background hover:opacity-90 disabled:opacity-50 transition-all rounded-[20px] font-medium flex items-center justify-center gap-2 text-[15px]"
            >
              {loading ? 'Verifying...' : 'Verify'} <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setStep('login')}
              className="w-full text-center text-muted-foreground hover:text-foreground font-medium transition-colors text-[14px]"
            >
              Back to Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
