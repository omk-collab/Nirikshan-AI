import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { userService } from '../services/userService';
import { mockUsers } from '../data/mockUsers';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both administrative email and access key.');
      return;
    }

    const matchedUser = mockUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!matchedUser) {
      setError('Invalid demo credentials. User account not found.');
      return;
    }

    if (password !== 'password123') {
      setError('Invalid demo credentials. Incorrect passcode.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      localStorage.setItem('nirikshan_token', 'demo-jwt-token-xyz');
      userService.setCurrentUser(matchedUser);
      setIsLoading(false);
      navigate('/dashboard');
    }, 300);
  };

  const handleQuickSelect = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-amber-500 shadow-xl shadow-indigo-600/30 mb-4">
          <ShieldCheck className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Nirikshan<span className="text-indigo-400">-AI</span>
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-sm mx-auto">
          AI-Powered MPLADS Monitoring & Risk Intelligence Platform
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Government Decision Support &bull; Decision Support Gateway
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-2xl shadow-2xl border border-slate-800">
          {error && (
            <div className="mb-5 flex items-center gap-2.5 rounded-lg bg-rose-950/60 border border-rose-800/60 p-3 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Official Email
              </label>
              <div className="mt-1.5 relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@gov.in or admin@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password / Secure Passcode
              </label>
              <div className="mt-1.5 relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                />
                Remember this terminal
              </label>
              <a
                href="#reset"
                onClick={(e) => {
                  e.preventDefault();
                  alert("In demo mode, use passcode: password123 for all registered demo accounts.");
                }}
                className="text-indigo-400 hover:underline"
              >
                Forgot access key?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-150 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating Terminal...</span>
              ) : (
                <>
                  <span>Access Intelligence Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
              One-Click Demo Access
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickSelect('admin@example.com')}
                className="p-2.5 rounded-lg border border-slate-800 bg-slate-950 hover:border-indigo-600/60 hover:bg-slate-900 transition-colors text-left"
              >
                <div className="font-semibold text-white truncate">Ministry Admin</div>
                <div className="text-[10px] text-slate-400 font-mono truncate">admin@example.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('state.mh@example.com')}
                className="p-2.5 rounded-lg border border-slate-800 bg-slate-950 hover:border-indigo-600/60 hover:bg-slate-900 transition-colors text-left"
              >
                <div className="font-semibold text-white truncate">State Authority</div>
                <div className="text-[10px] text-slate-400 font-mono truncate">state.mh@example.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('dc.pune@example.com')}
                className="p-2.5 rounded-lg border border-slate-800 bg-slate-950 hover:border-indigo-600/60 hover:bg-slate-900 transition-colors text-left"
              >
                <div className="font-semibold text-white truncate">District Authority</div>
                <div className="text-[10px] text-slate-400 font-mono truncate">dc.pune@example.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('ee.pwd@example.com')}
                className="p-2.5 rounded-lg border border-slate-800 bg-slate-950 hover:border-indigo-600/60 hover:bg-slate-900 transition-colors text-left"
              >
                <div className="font-semibold text-white truncate">Officer (MH PWD)</div>
                <div className="text-[10px] text-slate-400 font-mono truncate">ee.pwd@example.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('officer.up@example.com')}
                className="p-2.5 rounded-lg border border-slate-800 bg-slate-950 hover:border-indigo-600/60 hover:bg-slate-900 transition-colors text-left"
              >
                <div className="font-semibold text-white truncate">Officer (UP Jal)</div>
                <div className="text-[10px] text-slate-400 font-mono truncate">officer.up@example.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('analyst@example.com')}
                className="p-2.5 rounded-lg border border-slate-800 bg-slate-950 hover:border-indigo-600/60 hover:bg-slate-900 transition-colors text-left"
              >
                <div className="font-semibold text-white truncate">Risk Analyst</div>
                <div className="text-[10px] text-slate-400 font-mono truncate">analyst@example.com</div>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Demo Access Portal &bull; MoSPI & State/District Planning Authorities
        </p>
      </div>
    </div>
  );
}

