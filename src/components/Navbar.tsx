import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, 
  HelpCircle, 
  BarChart3, 
  ShieldCheck, 
  Cpu, 
  Flame, 
  Award, 
  Sparkles,
  UserCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    userRole, 
    setUserRole, 
    isAdminAuthenticated,
    adminUser,
    logoutAdmin,
    currentStudent, 
    students, 
    setCurrentStudentId 
  } = useApp();

  const handleAdminTabClick = () => {
    setCurrentView('admin-portal');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Academic Sub-bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 flex flex-wrap justify-between items-center gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-200">CENTRAL INDIC COMPUTATIONAL LINGUISTICS PORTAL</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">Govt. Academic Multi-Dialect Repository & Java OOP Concurrency Framework</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Student Profile:</span>
            <select
              aria-label="Select student profile"
              value={currentStudent.id}
              onChange={(e) => setCurrentStudentId(e.target.value)}
              className="bg-slate-800 text-amber-300 font-medium text-xs px-2 py-0.5 rounded border border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.rollNo})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-0.5 rounded border border-slate-700">
            <span className="text-slate-400 text-[11px]">Portal Mode:</span>
            {isAdminAuthenticated ? (
              <button
                onClick={() => setCurrentView('admin-portal')}
                className="text-xs font-bold px-2 py-0.5 rounded transition-all bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1"
                title="Admin Authenticated - Click to manage"
              >
                <span>🛡️ {adminUser?.name.split(' ')[1] || 'Admin'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('admin-portal')}
                className="text-xs font-bold px-2 py-0.5 rounded transition-all bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1"
                title="Click to authenticate as University Administrator"
              >
                <span>🔒 Faculty Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Academic Brand */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => setCurrentView('flashcards')}
              className="cursor-pointer flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-rose-600 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
                भ
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                    BhashaSetu
                  </span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-amber-200">
                    भाषासेतु
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Indic Regional Dialects & Academic Concurrency Suite
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setCurrentView('flashcards')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'flashcards'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>State Flashcards</span>
            </button>

            <button
              onClick={() => setCurrentView('quiz')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'quiz'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Daily Practice Quiz</span>
            </button>

            <button
              onClick={() => setCurrentView('student-dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'student-dashboard'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Student Analytics</span>
            </button>

            <button
              onClick={() => setCurrentView('admin-portal')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'admin-portal'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-800 hover:text-amber-950 hover:bg-amber-50/80'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAdminAuthenticated ? 'Admin Center' : 'Admin Login Gateway'}</span>
              {!isAdminAuthenticated && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => setCurrentView('java-academic-lab')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'java-academic-lab'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Java OOP & Concurrency (10 Marks)</span>
            </button>
          </nav>

          {/* Gamification Counters & User Pill */}
          <div className="flex items-center gap-3">
            {/* Streak */}
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200/80 px-2.5 py-1 rounded-lg text-orange-700">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />
              <div className="text-left">
                <div className="text-xs font-extrabold leading-none">{currentStudent.currentStreak} Day</div>
                <div className="text-[9px] font-medium text-orange-600/80 leading-none">Streak</div>
              </div>
            </div>

            {/* Total XP */}
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg text-amber-800">
              <Award className="w-4 h-4 text-amber-500" />
              <div className="text-left">
                <div className="text-xs font-extrabold leading-none">{currentStudent.totalXp} XP</div>
                <div className="text-[9px] font-medium text-amber-600 leading-none">Scholar Level</div>
              </div>
            </div>

            {/* User Avatar */}
            <div 
              onClick={() => setCurrentView('student-dashboard')}
              className="cursor-pointer flex items-center gap-2 pl-2 border-l border-slate-200"
              title="Click to view personalized progress"
            >
              <img
                src={currentStudent.avatarUrl}
                alt={currentStudent.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">{currentStudent.name}</div>
                <div className="text-[10px] text-slate-500 leading-tight">{currentStudent.rollNo}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <div className="flex md:hidden overflow-x-auto gap-1 p-2 bg-slate-100 border-t border-slate-200 scrollbar-none">
        <button
          onClick={() => setCurrentView('flashcards')}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium ${
            currentView === 'flashcards' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700'
          }`}
        >
          <BookOpen className="w-3 h-3" /> Flashcards
        </button>
        <button
          onClick={() => setCurrentView('quiz')}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium ${
            currentView === 'quiz' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700'
          }`}
        >
          <HelpCircle className="w-3 h-3" /> Quiz
        </button>
        <button
          onClick={() => setCurrentView('student-dashboard')}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium ${
            currentView === 'student-dashboard' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700'
          }`}
        >
          <BarChart3 className="w-3 h-3" /> Progress
        </button>
        <button
          onClick={() => setCurrentView('admin-portal')}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium ${
            currentView === 'admin-portal' ? 'bg-amber-600 text-white' : 'bg-white text-slate-700'
          }`}
        >
          <ShieldCheck className="w-3 h-3" /> Admin
        </button>
        <button
          onClick={() => setCurrentView('java-academic-lab')}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium ${
            currentView === 'java-academic-lab' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700'
          }`}
        >
          <Cpu className="w-3 h-3" /> Java OOP (10 M)
        </button>
      </div>
    </header>
  );
};
