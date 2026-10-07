import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LanguageItem,
  QuizQuestion,
  QuizResult,
  StudentProfile,
  VoiceFeedbackItem,
  ThreadExecutionLog,
  Region,
  AdminUser,
  AdminActivityLog
} from '../types';
import {
  INDIAN_LANGUAGES_DATA,
  INITIAL_QUIZ_QUESTIONS,
  INITIAL_STUDENTS,
  INITIAL_VOICE_FEEDBACK
} from '../data/indianLanguagesData';
import {
  GenericRepository,
  IndicAcademicThreadPool
} from '../services/oop/JavaOOPArchitecture';

type AppView = 'flashcards' | 'quiz' | 'student-dashboard' | 'admin-portal' | 'java-academic-lab';

export const DEMO_ADMINS: AdminUser[] = [
  {
    id: 'admin-01',
    name: 'Prof. Dr. Ayush Sharma',
    email: 'admin@bhashasetu.edu.in',
    role: 'Dean / SuperAdmin',
    department: 'Center for Indic Computational Linguistics',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    lastLogin: '2026-10-07 09:30 AM',
    clearanceLevel: 'LEVEL_4_FULL_GOVERNANCE'
  },
  {
    id: 'admin-02',
    name: 'Dr. Priya Iyer',
    email: 'priya.moderator@bhashasetu.edu.in',
    role: 'Senior Linguistic Moderator',
    department: 'Dravidian & Indo-Aryan Phonology Lab',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    lastLogin: '2026-10-07 08:15 AM',
    clearanceLevel: 'LEVEL_3_MODERATOR'
  }
];

export const INITIAL_ADMIN_LOGS: AdminActivityLog[] = [
  {
    id: 'act-01',
    timestamp: '2026-10-07 09:32',
    adminName: 'Prof. Dr. Ayush Sharma',
    category: 'STUDENT_EVALUATION',
    actionSummary: 'Reviewed 6th semester Dravidian phonology accuracy benchmarks for Ayush Sharma.'
  },
  {
    id: 'act-02',
    timestamp: '2026-10-06 17:10',
    adminName: 'Dr. Priya Iyer',
    category: 'VOICE_MODERATION',
    actionSummary: 'Approved retroflex calibration for Tamil phrase (ta-01).'
  },
  {
    id: 'act-03',
    timestamp: '2026-10-05 14:22',
    adminName: 'Prof. Dr. Ayush Sharma',
    category: 'CURRICULUM_UPDATE',
    actionSummary: 'Added new dialect nuances for Chhattisgarhi and Bundeli modules.'
  }
];

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  userRole: 'student' | 'admin';
  setUserRole: (role: 'student' | 'admin') => void;
  
  // Admin Authentication & Session
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  adminLogs: AdminActivityLog[];
  loginAdmin: (email: string, password: string) => { success: boolean; error?: string };
  logoutAdmin: () => void;
  awardStudentBonusXp: (studentId: string, amount: number, reason: string) => void;
  resetStudentProgress: (studentId: string) => void;
  logAdminActivity: (category: AdminActivityLog['category'], actionSummary: string) => void;

  // Data
  languages: LanguageItem[];
  students: StudentProfile[];
  currentStudent: StudentProfile;
  setCurrentStudentId: (id: string) => void;
  voiceFeedbacks: VoiceFeedbackItem[];
  quizQuestions: QuizQuestion[];
  learnedWordIds: Set<string>;
  bookmarkedWordIds: Set<string>;
  threadLogs: ThreadExecutionLog[];

  // Actions
  toggleLearnedWord: (id: string) => void;
  toggleBookmark: (id: string) => void;
  submitVoiceFeedback: (feedback: Omit<VoiceFeedbackItem, 'id' | 'submittedAt' | 'status'>) => void;
  moderateVoiceFeedback: (id: string, status: VoiceFeedbackItem['status']) => void;
  recordQuizResult: (result: Omit<QuizResult, 'quizId' | 'date'>) => void;
  
  // Admin Content Management
  addLanguageItem: (item: Omit<LanguageItem, 'id'>) => void;
  updateLanguageItem: (item: LanguageItem) => void;
  deleteLanguageItem: (id: string) => void;
  addQuizQuestion: (question: Omit<QuizQuestion, 'id'>) => void;
  deleteQuizQuestion: (id: string) => void;

  // Concurrency Simulation
  runThreadSimulation: () => Promise<void>;
  clearThreadLogs: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Generic repository instances demonstrating Collections & Generics
const languageRepo = new GenericRepository<LanguageItem>('LanguageRepository', INDIAN_LANGUAGES_DATA);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('flashcards');
  const [userRole, setUserRole] = useState<'student' | 'admin'>('student');

  // Admin Auth state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('bhasha_admin_auth') === 'true';
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('bhasha_admin_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return isAdminAuthenticated ? DEMO_ADMINS[0] : null;
  });

  const [adminLogs, setAdminLogs] = useState<AdminActivityLog[]>(() => {
    const saved = localStorage.getItem('bhasha_admin_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_ADMIN_LOGS;
  });

  const [languages, setLanguages] = useState<LanguageItem[]>(() => {
    const saved = localStorage.getItem('bhasha_languages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INDIAN_LANGUAGES_DATA.length) {
          return parsed;
        }
      } catch {}
    }
    return INDIAN_LANGUAGES_DATA;
  });

  const [students, setStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('bhasha_students');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_STUDENTS;
  });

  const [currentStudentId, setCurrentStudentId] = useState<string>('stu-01');

  const [voiceFeedbacks, setVoiceFeedbacks] = useState<VoiceFeedbackItem[]>(() => {
    const saved = localStorage.getItem('bhasha_voice_feedbacks');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_VOICE_FEEDBACK;
  });

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() => {
    const saved = localStorage.getItem('bhasha_quiz_questions');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_QUIZ_QUESTIONS;
  });

  const [learnedWordIds, setLearnedWordIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('bhasha_learned_words');
    if (saved) {
      try { return new Set(JSON.parse(saved)); } catch {}
    }
    return new Set(['hi-01', 'ta-01']);
  });

  const [bookmarkedWordIds, setBookmarkedWordIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('bhasha_bookmarked_words');
    if (saved) {
      try { return new Set(JSON.parse(saved)); } catch {}
    }
    return new Set(['kn-01']);
  });

  const [threadLogs, setThreadLogs] = useState<ThreadExecutionLog[]>([]);

  // Setup thread pool subscriber
  useEffect(() => {
    const threadPool = IndicAcademicThreadPool.getInstance();
    setThreadLogs(threadPool.getLogs());
    const unsub = threadPool.subscribeLogs(logs => {
      setThreadLogs([...logs]);
    });
    return unsub;
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('bhasha_languages', JSON.stringify(languages));
  }, [languages]);

  useEffect(() => {
    localStorage.setItem('bhasha_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('bhasha_voice_feedbacks', JSON.stringify(voiceFeedbacks));
  }, [voiceFeedbacks]);

  useEffect(() => {
    localStorage.setItem('bhasha_quiz_questions', JSON.stringify(quizQuestions));
  }, [quizQuestions]);

  useEffect(() => {
    localStorage.setItem('bhasha_learned_words', JSON.stringify(Array.from(learnedWordIds)));
  }, [learnedWordIds]);

  useEffect(() => {
    localStorage.setItem('bhasha_bookmarked_words', JSON.stringify(Array.from(bookmarkedWordIds)));
  }, [bookmarkedWordIds]);

  const currentStudent = students.find(s => s.id === currentStudentId) || students[0];

  const toggleLearnedWord = (id: string) => {
    setLearnedWordIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    // Update student progress count
    setStudents(prev =>
      prev.map(s => {
        if (s.id === currentStudentId) {
          const totalMastered = learnedWordIds.has(id)
            ? Math.max(0, s.flashcardsPracticed - 1)
            : s.flashcardsPracticed + 1;
          return {
            ...s,
            flashcardsPracticed: totalMastered,
            totalXp: s.totalXp + 25
          };
        }
        return s;
      })
    );
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedWordIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const submitVoiceFeedback = (feedbackData: Omit<VoiceFeedbackItem, 'id' | 'submittedAt' | 'status'>) => {
    const newItem: VoiceFeedbackItem = {
      ...feedbackData,
      id: 'vf-' + Date.now().toString(36),
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending'
    };
    setVoiceFeedbacks(prev => [newItem, ...prev]);

    // Reward student with XP and increment voice test metric
    setStudents(prev =>
      prev.map(s => {
        if (s.id === currentStudentId) {
          return {
            ...s,
            totalXp: s.totalXp + 50,
            voiceTestsCompleted: s.voiceTestsCompleted + 1,
            averageAccuracy: Math.round(((s.averageAccuracy * s.voiceTestsCompleted + feedbackData.accuracyScore) / (s.voiceTestsCompleted + 1)) * 10) / 10
          };
        }
        return s;
      })
    );
  };

  const moderateVoiceFeedback = (id: string, status: VoiceFeedbackItem['status']) => {
    setVoiceFeedbacks(prev =>
      prev.map(item => (item.id === id ? { ...item, status } : item))
    );
  };

  const recordQuizResult = (resultData: Omit<QuizResult, 'quizId' | 'date'>) => {
    const newResult: QuizResult = {
      ...resultData,
      quizId: 'quiz-' + Date.now().toString(36),
      date: new Date().toISOString().split('T')[0]
    };

    setStudents(prev =>
      prev.map(s => {
        if (s.id === currentStudentId) {
          const updatedHistory = [newResult, ...s.quizHistory];
          const newStreak = s.currentStreak + 1;
          const newXp = s.totalXp + resultData.xpEarned;
          
          // Boost regional progress
          const updatedRegional: Record<Region, number> = { ...s.regionalProgress };
          (Object.keys(updatedRegional) as Region[]).forEach(reg => {
            updatedRegional[reg] = Math.min(100, updatedRegional[reg] + 4);
          });

          return {
            ...s,
            currentStreak: newStreak,
            totalXp: newXp,
            quizHistory: updatedHistory,
            regionalProgress: updatedRegional
          };
        }
        return s;
      })
    );
  };

  const addLanguageItem = (itemData: Omit<LanguageItem, 'id'>) => {
    const newItem: LanguageItem = {
      ...itemData,
      id: 'lang-' + Date.now().toString(36)
    };
    setLanguages(prev => [newItem, ...prev]);
    languageRepo.save(newItem);
  };

  const updateLanguageItem = (item: LanguageItem) => {
    setLanguages(prev => prev.map(l => (l.id === item.id ? item : l)));
    languageRepo.save(item);
  };

  const deleteLanguageItem = (id: string) => {
    setLanguages(prev => prev.filter(l => l.id !== id));
    languageRepo.deleteById(id);
  };

  const addQuizQuestion = (qData: Omit<QuizQuestion, 'id'>) => {
    const newQ: QuizQuestion = {
      ...qData,
      id: 'q-' + Date.now().toString(36)
    };
    setQuizQuestions(prev => [...prev, newQ]);
  };

  const deleteQuizQuestion = (id: string) => {
    setQuizQuestions(prev => prev.filter(q => q.id !== id));
  };

  const loginAdmin = (email: string, password: string): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const matched = DEMO_ADMINS.find(a => a.email.toLowerCase() === trimmedEmail);

    // Accept demo credentials
    const isPasswordValid = 
      password === 'bhasha2026' || 
      password === 'admin123' || 
      password === 'linguist2026' ||
      (matched && password === 'admin');

    if (matched && isPasswordValid) {
      const updatedAdmin = { ...matched, lastLogin: new Date().toLocaleTimeString() };
      setIsAdminAuthenticated(true);
      setAdminUser(updatedAdmin);
      setUserRole('admin');
      localStorage.setItem('bhasha_admin_auth', 'true');
      localStorage.setItem('bhasha_admin_user', JSON.stringify(updatedAdmin));
      logAdminActivity('STUDENT_EVALUATION', `Session initiated by ${updatedAdmin.name} (${updatedAdmin.role}).`);
      return { success: true };
    }

    if (!matched) {
      return { success: false, error: 'Unrecognized institutional academic email address.' };
    }
    return { success: false, error: 'Invalid security passkey. Use demo passkey "bhasha2026" or "admin123".' };
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    setUserRole('student');
    localStorage.removeItem('bhasha_admin_auth');
    localStorage.removeItem('bhasha_admin_user');
  };

  const logAdminActivity = (category: AdminActivityLog['category'], actionSummary: string) => {
    const newEntry: AdminActivityLog = {
      id: 'act-' + Date.now().toString(36),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      adminName: adminUser ? adminUser.name : 'System Administrator',
      category,
      actionSummary
    };
    setAdminLogs(prev => {
      const next = [newEntry, ...prev].slice(0, 50);
      localStorage.setItem('bhasha_admin_logs', JSON.stringify(next));
      return next;
    });
  };

  const awardStudentBonusXp = (studentId: string, amount: number, reason: string) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            totalXp: s.totalXp + amount
          };
        }
        return s;
      })
    );
    logAdminActivity('STUDENT_EVALUATION', `Awarded +${amount} XP bonus to student (${studentId}): ${reason}`);
  };

  const resetStudentProgress = (studentId: string) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            flashcardsPracticed: 0,
            voiceTestsCompleted: 0,
            quizHistory: []
          };
        }
        return s;
      })
    );
    logAdminActivity('STUDENT_EVALUATION', `Reset assessment attempts for student (${studentId}).`);
  };

  const runThreadSimulation = async () => {
    const pool = IndicAcademicThreadPool.getInstance();
    await pool.runBatchAudioConcurrentSimulation();
  };

  const clearThreadLogs = () => {
    setThreadLogs([]);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        userRole,
        setUserRole,
        isAdminAuthenticated,
        adminUser,
        adminLogs,
        loginAdmin,
        logoutAdmin,
        awardStudentBonusXp,
        resetStudentProgress,
        logAdminActivity,
        languages,
        students,
        currentStudent,
        setCurrentStudentId,
        voiceFeedbacks,
        quizQuestions,
        learnedWordIds,
        bookmarkedWordIds,
        threadLogs,
        toggleLearnedWord,
        toggleBookmark,
        submitVoiceFeedback,
        moderateVoiceFeedback,
        recordQuizResult,
        addLanguageItem,
        updateLanguageItem,
        deleteLanguageItem,
        addQuizQuestion,
        deleteQuizQuestion,
        runThreadSimulation,
        clearThreadLogs
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
