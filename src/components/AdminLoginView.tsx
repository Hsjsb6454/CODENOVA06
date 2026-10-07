import React, { useState } from 'react';
import { useApp, DEMO_ADMINS } from '../context/AppContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  GraduationCap,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

export const AdminLoginView: React.FC = () => {
  const { loginAdmin, setCurrentView } = useApp();

  const [email, setEmail] = useState<string>('admin@bhashasetu.edu.in');
  const [password, setPassword] = useState<string>('bhasha2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = loginAdmin(email, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failure.');
      }
    }, 400);
  };

  const handleQuickLogin = (adminEmail: string, pass: string) => {
    setEmail(adminEmail);
    setPassword(pass);
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      loginAdmin(adminEmail, pass);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Informational Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-bold border border-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>FACULTY GOVERNANCE PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Academic Administration & Dialect Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Authorized faculty and linguistic research fellows can monitor real-time student cohorts, inspect detailed progress charts, calibrate voice recognition models, and author state curricula.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900">Student Progress Tracking</div>
                <div className="text-slate-500 mt-0.5">
                  Real-time dialect mastery, weekly practice hours, and quiz score analytics for all enrolled students.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900">Voice Recognition Moderation</div>
                <div className="text-slate-500 mt-0.5">
                  Review student voice samples, phonetic tolerances, and dialect shift notes.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900">Curriculum & Question Bank</div>
                <div className="text-slate-500 mt-0.5">
                  Full CRUD authority across state phrases, localized dialects, and gamified quizzes.
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setCurrentView('flashcards')}
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Return to Student Learning Portal</span>
            </button>
          </div>
        </div>

        {/* Right Login Card Column */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Administrator Authentication
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter institutional credentials or select a verified demo administrator below
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Institutional Faculty Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@bhashasetu.edu.in"
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Security Passkey / Credential
                  </label>
                  <span className="text-[11px] text-amber-700 font-semibold">
                    Demo: bhasha2026
                  </span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold text-xs shadow-md shadow-amber-600/20 hover:scale-101 transition-all disabled:opacity-60"
                >
                  <span>{isLoading ? 'Verifying Faculty Credentials...' : 'Sign In to Admin Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick 1-Click Demo Profiles */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                Quick 1-Click Demo Faculty Credentials
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => handleQuickLogin('admin@bhashasetu.edu.in', 'bhasha2026')}
                  className="cursor-pointer p-3 rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 transition-all text-left group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src={DEMO_ADMINS[0].avatarUrl}
                      alt={DEMO_ADMINS[0].name}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-amber-300"
                    />
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 group-hover:text-amber-700">
                        {DEMO_ADMINS[0].name}
                      </div>
                      <div className="text-[10px] text-amber-700 font-semibold">
                        {DEMO_ADMINS[0].role}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Email: admin@bhashasetu.edu.in
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Passkey: bhasha2026
                  </div>
                </div>

                <div
                  onClick={() => handleQuickLogin('priya.moderator@bhashasetu.edu.in', 'linguist2026')}
                  className="cursor-pointer p-3 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all text-left group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src={DEMO_ADMINS[1].avatarUrl}
                      alt={DEMO_ADMINS[1].name}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-300"
                    />
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-700">
                        {DEMO_ADMINS[1].name}
                      </div>
                      <div className="text-[10px] text-indigo-700 font-semibold">
                        {DEMO_ADMINS[1].role}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Email: priya.moderator@bhashasetu.edu.in
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Passkey: linguist2026
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
