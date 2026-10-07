import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Region, QuizResult } from '../types';
import {
  BarChart3,
  Calendar,
  Clock,
  Award,
  Flame,
  CheckCircle,
  TrendingUp,
  BookOpen,
  Mic,
  Compass,
  ChevronRight,
  Filter,
  UserCheck
} from 'lucide-react';

export const StudentDashboardView: React.FC = () => {
  const { currentStudent, students, setCurrentStudentId, learnedWordIds, setCurrentView } = useApp();
  const [selectedHistoryFilter, setSelectedHistoryFilter] = useState<string>('All');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const regionalData = Object.entries(currentStudent.regionalProgress) as [Region, number][];

  const filteredHistory = currentStudent.quizHistory.filter(q => {
    if (selectedHistoryFilter === 'All') return true;
    if (selectedHistoryFilter === 'High (90%+)') return q.percentage >= 90;
    if (selectedHistoryFilter === 'Moderate (70-89%)') return q.percentage >= 70 && q.percentage < 90;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Academic Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentStudent.avatarUrl}
              alt={currentStudent.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-50 border border-slate-200 shadow-sm"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {currentStudent.name}
                </h1>
                <span className="bg-indigo-50 text-indigo-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {currentStudent.rollNo}
                </span>
                <span className="bg-amber-50 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                  {currentStudent.levelTitle}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {currentStudent.department} • {currentStudent.semester} Academic Assessment
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400">Switch Student Dossier:</span>
                <select
                  aria-label="Switch Student Dossier"
                  value={currentStudent.id}
                  onChange={(e) => setCurrentStudentId(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2 py-0.5 text-slate-800 font-semibold focus:ring-1 focus:ring-indigo-500"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNo})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
            <div className="bg-orange-50 border border-orange-200/80 p-3 rounded-2xl text-center">
              <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1 fill-orange-500" />
              <div className="text-lg font-black text-orange-950 leading-none">
                {currentStudent.currentStreak}
              </div>
              <div className="text-[10px] font-bold text-orange-700 uppercase tracking-wider mt-1">
                Day Streak
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200/80 p-3 rounded-2xl text-center">
              <Award className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <div className="text-lg font-black text-amber-950 leading-none">
                {currentStudent.totalXp}
              </div>
              <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mt-1">
                Total XP
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200/80 p-3 rounded-2xl text-center">
              <BookOpen className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
              <div className="text-lg font-black text-indigo-950 leading-none">
                {learnedWordIds.size}
              </div>
              <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider mt-1">
                Mastered
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200/80 p-3 rounded-2xl text-center">
              <Mic className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <div className="text-lg font-black text-emerald-950 leading-none">
                {currentStudent.averageAccuracy}%
              </div>
              <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mt-1">
                Accuracy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Progress Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Regional Mastery Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600" /> Regional Dialect & State Language Mastery
              </h3>
              <p className="text-xs text-slate-500">
                Curriculum completion index across the six cultural zones of India
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
              Real-time Sync
            </span>
          </div>

          {/* Regional Progress Visual Bars */}
          <div className="space-y-3.5 pt-2">
            {regionalData.map(([reg, val]) => (
              <div key={reg} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    {reg} India
                  </span>
                  <span className="font-mono text-slate-900">{val}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      val >= 85
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : val >= 70
                        ? 'bg-gradient-to-r from-indigo-500 to-blue-400'
                        : 'bg-gradient-to-r from-amber-500 to-orange-400'
                    }`}
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              Proficiency Benchmark: <strong>Pan-Indic Level 4 (Advanced Scholar)</strong>
            </span>
            <button
              onClick={() => setCurrentView('flashcards')}
              className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Practice Weaker Dialects</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Chart 2: Weekly Practice Effort & Hours (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" /> Weekly Study Hours
              </h3>
              <span className="text-xs font-bold text-slate-500">
                Total: {currentStudent.studyHoursThisWeek.reduce((a, b) => a + b, 0).toFixed(1)} hrs
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Daily time dedicated to pronunciation practice & quizzes
            </p>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2">
            {currentStudent.studyHoursThisWeek.map((hrs, idx) => {
              const maxHrs = 3.5;
              const barHeight = Math.min(100, Math.round((hrs / maxHrs) * 100));
              const isToday = idx === 6; // Sunday/Current day

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="text-[10px] font-mono font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">
                    {hrs}h
                  </div>
                  <div className="w-full max-w-[28px] bg-slate-100 rounded-t-lg h-full max-h-[120px] flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        isToday
                          ? 'bg-gradient-to-t from-amber-600 to-amber-400'
                          : 'bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-700'
                      }`}
                      style={{ height: `${barHeight}%` }}
                    />
                  </div>
                  <span className={`text-[11px] font-bold ${isToday ? 'text-amber-700 font-extrabold' : 'text-slate-500'}`}>
                    {daysOfWeek[idx]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              Study pace is <strong>24% higher</strong> than department cohort baseline.
            </span>
          </div>
        </div>
      </div>

      {/* Quiz & Lesson Tracker Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" /> Quiz & Lesson Tracker (Personalized History)
            </h3>
            <p className="text-xs text-slate-500">
              Audit trail of assessment sessions, phonetic accuracy, and XP gains
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              aria-label="Filter assessment records"
              value={selectedHistoryFilter}
              onChange={(e) => setSelectedHistoryFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-700 font-semibold focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Assessment Records</option>
              <option value="High (90%+)">Distinction (90%+)</option>
              <option value="Moderate (70-89%)">Satisfactory (70-89%)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Module / Dialect Focus</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">XP Earned</th>
                <th className="py-3 px-4 text-right">Academic Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistory.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-600">{item.date}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{item.languageFocus}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{item.score} pts</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-extrabold px-2.5 py-0.5 rounded-full ${
                        item.percentage >= 90
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.percentage}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{item.timeSpentSeconds}s</td>
                  <td className="py-3.5 px-4 font-bold text-amber-600">+{item.xpEarned} XP</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
