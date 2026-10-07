import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LanguageItem, QuizQuestion, VoiceFeedbackItem, StudentProfile, Region } from '../types';
import {
  ShieldCheck,
  Users,
  FileText,
  Mic,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  BarChart2,
  Compass,
  Sparkles,
  Calendar,
  X,
  LogOut,
  Download,
  Award,
  RotateCcw,
  Search,
  Filter,
  Check,
  Clock,
  Layers,
  ChevronRight,
  TrendingUp,
  Activity
} from 'lucide-react';

export const AdminPortalView: React.FC = () => {
  const {
    isAdminAuthenticated,
    adminUser,
    adminLogs,
    logoutAdmin,
    awardStudentBonusXp,
    resetStudentProgress,
    students,
    languages,
    voiceFeedbacks,
    quizQuestions,
    moderateVoiceFeedback,
    addLanguageItem,
    deleteLanguageItem,
    addQuizQuestion,
    deleteQuizQuestion
  } = useApp();

  const [activeTab, setActiveTab] = useState<'students' | 'moderation' | 'lessons' | 'quizzes' | 'audit'>('students');
  const [inspectingStudent, setInspectingStudent] = useState<StudentProfile | null>(null);
  const [studentSearchQuery, setStudentSearchQuery] = useState<string>('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('All');

  // Bonus XP modal state
  const [bonusXpAmount, setBonusXpAmount] = useState<number>(100);
  const [bonusReason, setBonusReason] = useState<string>('Exemplary dialect phonetics practice');
  const [showBonusSuccess, setShowBonusSuccess] = useState<boolean>(false);

  // New Lesson Modal Form
  const [showAddLessonModal, setShowAddLessonModal] = useState<boolean>(false);
  const [newLesson, setNewLesson] = useState<Omit<LanguageItem, 'id'>>({
    state: 'Rajasthan',
    region: 'North',
    languageName: 'Rajasthani (Marwari)',
    languageFamily: 'Indo-Aryan',
    scriptName: 'Devanagari',
    category: 'Greetings',
    wordOriginal: 'खम्मा घणी, सा! कांई हाल चाल है?',
    transliteration: 'Khamma Ghani, saa! Kaai haal chaal hai?',
    englishMeaning: 'Royal salutations / May peace be with you, how are you?',
    audioPhonetic: 'Khum-maa Ghun-nee, saa! Kaanye haal chaal hai?',
    speechLangCode: 'hi-IN',
    difficulty: 'Beginner',
    culturalTip: 'Traditional Rajputana greeting of deep respect. The customary reply to "Khamma Ghani" is "Ghani Khamma".',
    dialectVariations: [
      {
        dialectName: 'Marwari Standard (Jodhpur)',
        regionDistrict: 'Jodhpur, Nagaur',
        samplePhrase: 'घणी खम्मा सा, किकर हो?',
        transliteration: 'Ghani Khamma saa, kikar ho?',
        differenceNote: 'Classic Desert Thar cadence with cordial "kikar ho".'
      },
      {
        dialectName: 'Mewari (Udaipur)',
        regionDistrict: 'Udaipur, Chittorgarh',
        samplePhrase: 'राम राम सा, कस्या हाल है?',
        transliteration: 'Ram Ram saa, kasya haal hai?',
        differenceNote: 'Mewari hills intonation preserving older Western Rajasthani grammar.'
      }
    ]
  });

  // New Quiz Modal Form
  const [showAddQuizModal, setShowAddQuizModal] = useState<boolean>(false);
  const [newQuiz, setNewQuiz] = useState<Omit<QuizQuestion, 'id'>>({
    type: 'meaning_choice',
    state: 'Goa',
    languageName: 'Konkani',
    question: 'In coastal Konkani culture, what does the signature blessing "Dev borem korum" communicate?',
    promptText: 'देव बरें करूं (Dev borem korum)',
    options: [
      'It asks for direction to the beach.',
      'It translates to "May God do good to you" (Heartfelt thank you).',
      'It strictly means "Halt the fishing boat".',
      'It is an announcement of lunch.'
    ],
    correctIndex: 1,
    explanation: '"Dev borem korum" is the revered Goan Konkani expression of thanks and goodwill, praying for divine benevolence.',
    points: 15,
    difficulty: 'medium'
  });

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    addLanguageItem(newLesson);
    setShowAddLessonModal(false);
  };

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    addQuizQuestion(newQuiz);
    setShowAddQuizModal(false);
  };

  const handleAwardBonus = (studentId: string) => {
    awardStudentBonusXp(studentId, bonusXpAmount, bonusReason);
    setShowBonusSuccess(true);
    setTimeout(() => {
      setShowBonusSuccess(false);
    }, 2000);
  };

  const handleExportCohortReport = () => {
    const reportData = {
      academicInstitution: 'Central Indic Computational Linguistics Portal',
      generatedBy: adminUser?.name || 'Administrator',
      timestamp: new Date().toISOString(),
      cohortSummary: {
        totalStudents: students.length,
        averageAccuracy: avgCohortAccuracy + '%',
        totalCurriculumLessons: languages.length,
        totalQuizQuestions: quizQuestions.length
      },
      students: students.map(s => ({
        rollNo: s.rollNo,
        name: s.name,
        department: s.department,
        streak: s.currentStreak,
        totalXp: s.totalXp,
        averageAccuracy: s.averageAccuracy,
        quizzesTaken: s.quizHistory.length,
        regionalProgress: s.regionalProgress
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Indic_Cohort_Analytics_Report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(studentSearchQuery.toLowerCase());
    const matchesDept = selectedDeptFilter === 'All' || s.department.includes(selectedDeptFilter);
    return matchesSearch && matchesDept;
  });

  const avgCohortAccuracy = Math.round(
    students.reduce((acc, s) => acc + s.averageAccuracy, 0) / (students.length || 1)
  );

  const totalQuizzesTaken = students.reduce((acc, s) => acc + s.quizHistory.length, 0);
  const pendingModerationCount = voiceFeedbacks.filter(f => f.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Executive Session Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-amber-900/40 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={adminUser?.avatarUrl}
              alt={adminUser?.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-amber-400 border border-slate-700"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-lg sm:text-xl text-white">
                  {adminUser?.name}
                </span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  {adminUser?.role}
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {adminUser?.clearanceLevel}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {adminUser?.department} • Last Active: {adminUser?.lastLogin}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCohortReport}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors shadow-xs"
              title="Download full analytics data as JSON"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export Cohort Report</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-900/60 hover:bg-rose-900 text-rose-200 font-bold text-xs border border-rose-700/60 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Global Administrative KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-800/80">
          <div className="bg-slate-800/60 border border-slate-700/70 p-3 rounded-2xl text-center">
            <Users className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <div className="text-lg font-black text-white">{students.length}</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Students</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/70 p-3 rounded-2xl text-center">
            <FileText className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <div className="text-lg font-black text-white">{languages.length}</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Curriculum Lessons</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/70 p-3 rounded-2xl text-center">
            <BarChart2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <div className="text-lg font-black text-emerald-400">{avgCohortAccuracy}%</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Cohort Accuracy</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/70 p-3 rounded-2xl text-center">
            <HelpCircle className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
            <div className="text-lg font-black text-white">{totalQuizzesTaken}</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Quizzes Completed</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/70 p-3 rounded-2xl text-center">
            <Mic className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <div className="text-lg font-black text-amber-400">{pendingModerationCount}</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Pending Moderation</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/70 p-3 rounded-2xl text-center">
            <Activity className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <div className="text-lg font-black text-white">3 Workers</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">JVM Concurrency</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'students'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Track Everything & Student Roster</span>
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
            activeTab === 'moderation'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Voice Feedback & Moderation Queue</span>
          {pendingModerationCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingModerationCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('lessons')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'lessons'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Curriculum & State Lessons ({languages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'quizzes'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Quiz Question Bank ({quizQuestions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'audit'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Academic Audit Trail ({adminLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: Student Progress & Cohort Analytics ("Track Everything & Check Progress") */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Student Cohort Intelligence & Progress Tracker
                </h3>
                <p className="text-xs text-slate-500">
                  Complete real-time oversight of all enrolled students, accuracy rates, and dialect proficiency
                </p>
              </div>

              {/* Search & Department Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                    placeholder="Search name or roll no..."
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <select
                  aria-label="Filter by department"
                  value={selectedDeptFilter}
                  onChange={(e) => setSelectedDeptFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-700 font-medium"
                >
                  <option value="All">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Linguistics">Linguistics</option>
                  <option value="Information Technology">Information Technology</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Student Dossier</th>
                    <th className="py-3 px-4">Department & Level</th>
                    <th className="py-3 px-4">Streak</th>
                    <th className="py-3 px-4">Total XP</th>
                    <th className="py-3 px-4">Audio Accuracy</th>
                    <th className="py-3 px-4">Quizzes Taken</th>
                    <th className="py-3 px-4">Weekly Effort</th>
                    <th className="py-3 px-4 text-right">Deep-Dive Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map(student => {
                    const totalWeeklyHrs = student.studyHoursThisWeek.reduce((a, b) => a + b, 0).toFixed(1);
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={student.avatarUrl}
                              alt={student.name}
                              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-200"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{student.name}</div>
                              <div className="text-[11px] text-slate-500 font-mono">{student.rollNo}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800">{student.department}</div>
                          <div className="text-[11px] text-amber-700 font-semibold">{student.levelTitle}</div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-orange-600">
                          {student.currentStreak} Days
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-amber-700">
                          {student.totalXp} XP
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-black px-2 py-0.5 rounded-full ${
                              student.averageAccuracy >= 90
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {student.averageAccuracy}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          {student.quizHistory.length} Sessions
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {totalWeeklyHrs} hrs
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setInspectingStudent(student)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect Charts</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Voice Feedback & Dialect Moderation Queue */}
      {activeTab === 'moderation' && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Voice Recognition Feedback & Phonetic Moderation Queue
              </h3>
              <p className="text-xs text-slate-500">
                Review submitted voice recordings from students, verify acoustic tolerances, and calibrate regional speech models
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {voiceFeedbacks.map(item => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  item.status === 'pending'
                    ? 'bg-amber-50/50 border-amber-200'
                    : item.status === 'approved'
                    ? 'bg-emerald-50/30 border-emerald-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-slate-900 font-serif">
                      {item.wordOriginal}
                    </span>
                    <span className="text-xs text-indigo-700 font-medium italic">
                      "{item.transliteration}"
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-slate-800">
                      {item.languageName}
                    </span>
                    <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.audioIssueCategory}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-mono">{item.submittedAt}</span>
                    <span
                      className={`font-bold px-2.5 py-0.5 rounded-full ${
                        item.status === 'pending'
                          ? 'bg-amber-200 text-amber-900'
                          : item.status === 'approved'
                          ? 'bg-emerald-200 text-emerald-900'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Submissions Detail */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>
                      Submitted by student: <strong>{item.studentName}</strong>
                    </span>
                    <span>
                      Acoustic Score: <strong className="text-indigo-600 font-bold">{item.accuracyScore}%</strong>
                    </span>
                  </div>
                  <div className="text-slate-800 leading-relaxed font-serif">
                    Recognized speech transcript: "{item.userTranscript}"
                  </div>
                  <div className="text-slate-600 pt-1 border-t border-slate-100">
                    <strong className="text-slate-700">Dialectological Feedback Note: </strong>
                    {item.userComment}
                  </div>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center justify-end gap-2 pt-3">
                  {item.status === 'pending' && (
                    <>
                      <button
                        onClick={() => moderateVoiceFeedback(item.id, 'approved')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve & Calibrate Model
                      </button>
                      <button
                        onClick={() => moderateVoiceFeedback(item.id, 'reviewed')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" /> Mark Reviewed
                      </button>
                      <button
                        onClick={() => moderateVoiceFeedback(item.id, 'rejected')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject Sample
                      </button>
                    </>
                  )}
                  {item.status !== 'pending' && (
                    <span className="text-xs text-slate-500 font-medium">
                      Moderation recorded. Acoustic database updated.
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Curriculum & Dialect Manager */}
      {activeTab === 'lessons' && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                State Language & Dialect Curriculum Directory
              </h3>
              <p className="text-xs text-slate-500">
                Author new state vocabulary, assign regional linguistic families, and configure localized dialect shifts
              </p>
            </div>
            <button
              onClick={() => setShowAddLessonModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition-all"
            >
              <Plus className="w-4 h-4" /> Add State Language Entry
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">State & Region</th>
                  <th className="py-3 px-4">Language & Script</th>
                  <th className="py-3 px-4">Native Phrase</th>
                  <th className="py-3 px-4">English Meaning</th>
                  <th className="py-3 px-4">Dialect Variations</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {languages.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.state}</div>
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {item.region}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{item.languageName}</div>
                      <div className="text-[11px] text-slate-500">{item.scriptName}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-sm font-serif">
                      {item.wordOriginal}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{item.englishMeaning}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-md border border-amber-200">
                        {item.dialectVariations.length} Sub-dialects
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => deleteLanguageItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Quiz Question Bank */}
      {activeTab === 'quizzes' && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Gamified Quiz Question Repository
              </h3>
              <p className="text-xs text-slate-500">
                Maintain regional dialect questions, correct indexes, and academic linguistic explanations
              </p>
            </div>
            <button
              onClick={() => setShowAddQuizModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition-all"
            >
              <Plus className="w-4 h-4" /> Create Quiz Question
            </button>
          </div>

          <div className="space-y-3">
            {quizQuestions.map(q => (
              <div key={q.id} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-amber-300 transition-colors space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      {q.state} ({q.languageName})
                    </span>
                    <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      {q.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-500">+{q.points} pts</span>
                  </div>
                  <button
                    onClick={() => deleteQuizQuestion(q.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="font-bold text-sm text-slate-900">{q.question}</div>
                <div className="text-xs text-indigo-600 font-semibold font-serif">
                  Anchor: "{q.promptText}"
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                  {q.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`text-xs p-2 rounded-lg border ${
                        oIdx === q.correctIndex
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {String.fromCharCode(65 + oIdx)}. {opt}
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-slate-500 pt-1">
                  <strong className="text-slate-700">Explanation: </strong>
                  {q.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Academic Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Institutional Governance & Administration Audit Trail
            </h3>
            <p className="text-xs text-slate-500">
              Immutable chronological record of administrator interventions, bonus awards, and curriculum modifications
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Administrator</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Action Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {adminLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-500">{log.timestamp}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{log.adminName}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md text-[10px]">
                        {log.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{log.actionSummary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: Individual Student Deep-Dive ("Track Everything & Check Progress") */}
      {inspectingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={inspectingStudent.avatarUrl}
                  alt={inspectingStudent.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-400"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg text-slate-900">{inspectingStudent.name}</h3>
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      {inspectingStudent.rollNo}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {inspectingStudent.department} • {inspectingStudent.semester}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectingStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Individual Student Real-time Charts */}
            <div className="space-y-5">
              {/* Regional Dialect Fluency Progress Bars */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Compass className="w-4 h-4 text-indigo-600" /> Real-Time Regional Dialect Mastery
                </h4>

                <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {(Object.entries(inspectingStudent.regionalProgress) as [Region, number][]).map(([reg, val]) => (
                    <div key={reg} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{reg} India</span>
                        <span className="font-mono text-indigo-700">{val}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{ width: `${val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Study Hours Bars */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Calendar className="w-4 h-4 text-amber-600" /> Weekly Practice Hours Distribution
                </h4>
                <div className="h-28 flex items-end justify-between gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-200">
                  {inspectingStudent.studyHoursThisWeek.map((hrs, idx) => {
                    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    const barHeight = Math.min(100, Math.round((hrs / 3.5) * 100));
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <span className="text-[10px] font-mono font-bold text-slate-500">{hrs}h</span>
                        <div className="w-full max-w-[20px] bg-slate-200 rounded-t-sm h-full flex items-end">
                          <div
                            className="w-full bg-amber-500 rounded-t-sm"
                            style={{ height: `${barHeight}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500">{days[idx]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quiz History Audit */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <BarChart2 className="w-4 h-4 text-emerald-600" /> Quiz & Exam History ({inspectingStudent.quizHistory.length} attempts)
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-40 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                      <tr>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Dialect Focus</th>
                        <th className="py-2 px-3">Score</th>
                        <th className="py-2 px-3">Percentage</th>
                        <th className="py-2 px-3">XP Earned</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inspectingStudent.quizHistory.map((q, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-3 font-mono text-slate-500">{q.date}</td>
                          <td className="py-2 px-3 font-bold text-slate-900">{q.languageFocus}</td>
                          <td className="py-2 px-3">{q.score} pts</td>
                          <td className="py-2 px-3 font-extrabold text-emerald-700">{q.percentage}%</td>
                          <td className="py-2 px-3 text-amber-700 font-bold">+{q.xpEarned} XP</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Admin Actions: Award Bonus XP & Reset attempts */}
              <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" /> Administrative Academic Interventions
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="number"
                    value={bonusXpAmount}
                    onChange={(e) => setBonusXpAmount(Number(e.target.value))}
                    className="w-24 bg-white border border-amber-300 rounded-lg p-1.5 text-xs font-bold text-slate-900"
                  />
                  <input
                    type="text"
                    value={bonusReason}
                    onChange={(e) => setBonusReason(e.target.value)}
                    placeholder="Reason for bonus..."
                    className="flex-1 bg-white border border-amber-300 rounded-lg p-1.5 text-xs text-slate-900"
                  />
                  <button
                    onClick={() => handleAwardBonus(inspectingStudent.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                  >
                    Grant Bonus XP
                  </button>
                  <button
                    onClick={() => {
                      resetStudentProgress(inspectingStudent.id);
                      setInspectingStudent(null);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs"
                  >
                    Reset Quiz Attempts
                  </button>
                </div>

                {showBonusSuccess && (
                  <div className="text-xs font-bold text-emerald-700 flex items-center gap-1 animate-in fade-in">
                    <Check className="w-4 h-4" /> Academic Bonus Dispatched Successfully!
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setInspectingStudent(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Add New State Language Lesson */}
      {showAddLessonModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">Add State Language Lesson Entry</h3>
              <button onClick={() => setShowAddLessonModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLesson} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State / Territory</label>
                  <input
                    type="text"
                    required
                    value={newLesson.state}
                    onChange={(e) => setNewLesson({ ...newLesson, state: e.target.value })}
                    className="w-full bg-slate-50 border rounded-lg p-2 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cultural Region</label>
                  <select
                    value={newLesson.region}
                    onChange={(e) => setNewLesson({ ...newLesson, region: e.target.value as Region })}
                    className="w-full bg-slate-50 border rounded-lg p-2 font-medium"
                  >
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="North-East">North-East</option>
                    <option value="Central">Central</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Language Name</label>
                  <input
                    type="text"
                    required
                    value={newLesson.languageName}
                    onChange={(e) => setNewLesson({ ...newLesson, languageName: e.target.value })}
                    className="w-full bg-slate-50 border rounded-lg p-2 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Script Name</label>
                  <input
                    type="text"
                    required
                    value={newLesson.scriptName}
                    onChange={(e) => setNewLesson({ ...newLesson, scriptName: e.target.value })}
                    className="w-full bg-slate-50 border rounded-lg p-2 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Native Script Phrase</label>
                <input
                  type="text"
                  required
                  value={newLesson.wordOriginal}
                  onChange={(e) => setNewLesson({ ...newLesson, wordOriginal: e.target.value })}
                  className="w-full bg-slate-50 border rounded-lg p-2 font-medium font-serif text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Transliteration</label>
                  <input
                    type="text"
                    required
                    value={newLesson.transliteration}
                    onChange={(e) => setNewLesson({ ...newLesson, transliteration: e.target.value })}
                    className="w-full bg-slate-50 border rounded-lg p-2 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">English Meaning</label>
                  <input
                    type="text"
                    required
                    value={newLesson.englishMeaning}
                    onChange={(e) => setNewLesson({ ...newLesson, englishMeaning: e.target.value })}
                    className="w-full bg-slate-50 border rounded-lg p-2 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cultural Etiquette Context</label>
                <textarea
                  rows={2}
                  value={newLesson.culturalTip}
                  onChange={(e) => setNewLesson({ ...newLesson, culturalTip: e.target.value })}
                  className="w-full bg-slate-50 border rounded-lg p-2 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddLessonModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Save Curriculum Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add New Quiz Question */}
      {showAddQuizModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">Add Regional Quiz Question</h3>
              <button onClick={() => setShowAddQuizModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuiz} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target State</label>
                  <input
                    type="text"
                    required
                    value={newQuiz.state}
                    onChange={(e) => setNewQuiz({ ...newQuiz, state: e.target.value })}
                    className="w-full bg-slate-50 border rounded-lg p-2 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Language</label>
                  <input
                    type="text"
                    required
                    value={newQuiz.languageName}
                    onChange={(e) => setNewQuiz({ ...newQuiz, languageName: e.target.value })}
                    className="w-full bg-slate-50 border rounded-lg p-2 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Question Prompt</label>
                <input
                  type="text"
                  required
                  value={newQuiz.question}
                  onChange={(e) => setNewQuiz({ ...newQuiz, question: e.target.value })}
                  className="w-full bg-slate-50 border rounded-lg p-2 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Linguistic Anchor / Word</label>
                <input
                  type="text"
                  required
                  value={newQuiz.promptText}
                  onChange={(e) => setNewQuiz({ ...newQuiz, promptText: e.target.value })}
                  className="w-full bg-slate-50 border rounded-lg p-2 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Options (Select radio for Correct Answer):</label>
                {newQuiz.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={newQuiz.correctIndex === idx}
                      onChange={() => setNewQuiz({ ...newQuiz, correctIndex: idx })}
                    />
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => {
                        const next = [...newQuiz.options];
                        next[idx] = e.target.value;
                        setNewQuiz({ ...newQuiz, options: next });
                      }}
                      className="flex-1 bg-slate-50 border rounded-lg p-1.5 font-medium"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Academic Explanation</label>
                <textarea
                  rows={2}
                  value={newQuiz.explanation}
                  onChange={(e) => setNewQuiz({ ...newQuiz, explanation: e.target.value })}
                  className="w-full bg-slate-50 border rounded-lg p-2 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddQuizModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Publish Quiz Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
