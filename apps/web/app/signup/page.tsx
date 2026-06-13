"use client";

import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import Link from 'next/link';
import { ArrowRight, Sparkles, Mail, Lock, User, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'signup' | 'otp'>('signup');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://autoapply-backend-wkqq.onrender.com';
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001';

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      setStep('otp');
      setMessage('Account created successfully! A verification code has been sent to your email.');
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

      // Redirect to dashboard with token
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
      if (!res.ok) throw new Error(data.error || 'Google signup failed');

      // Redirect to dashboard with token
      window.location.href = `${dashboardUrl}?token=${data.token}`;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      {/* Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-secondary/30 backdrop-blur-xl border border-border/50 p-8 md:p-10 rounded-3xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <h2 className="text-3xl font-black text-foreground text-center">
            {step === 'signup' ? 'Get Started' : 'Verify Email'}
          </h2>
          <p className="text-secondary-foreground text-center mt-2 font-medium">
            {step === 'signup' 
              ? 'Create a free account to automate your applications' 
              : 'Enter the 6-digit OTP code sent to your email.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-2xl mb-6 text-sm font-semibold">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-primary/10 border border-primary/30 text-primary p-4 rounded-2xl mb-6 text-sm font-semibold flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        {step === 'signup' ? (
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-background/50 border border-border/50 rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-background/50 border border-border/50 rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-background/50 border border-border/50 rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 transition-all rounded-2xl font-bold flex items-center justify-center gap-2 text-lg shadow-lg"
            >
              {loading ? 'Creating account...' : 'Create Account'} <ArrowRight className="w-5 h-5" />
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-border/50"></div>
              <span className="flex-shrink mx-4 text-muted-foreground text-sm font-bold">or connect with</span>
              <div className="flex-grow border-t border-border/50"></div>
            </div>

            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Sign In failed')}
                theme="filled_black"
                shape="pill"
                width="100%"
              />
            </div>

            <p className="text-center text-muted-foreground font-semibold mt-8 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">6-Digit Verification Code</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-4 text-center tracking-[1em] text-2xl font-bold bg-background/50 border border-border/50 rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 transition-all rounded-2xl font-bold flex items-center justify-center gap-2 text-lg shadow-lg"
            >
              {loading ? 'Verifying...' : 'Verify OTP & Log In'} <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setStep('signup')}
              className="w-full text-center text-primary font-semibold hover:underline text-sm"
            >
              Back to Signup
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
