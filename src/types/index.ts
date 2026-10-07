export type Region = 'North' | 'South' | 'East' | 'West' | 'North-East' | 'Central';

export interface DialectVariation {
  dialectName: string;
  regionDistrict: string;
  samplePhrase: string;
  transliteration: string;
  differenceNote: string;
}

export type VoicePersona = 'female' | 'male' | 'tutor' | 'conversational' | 'native_elder';

export interface LanguageItem {
  id: string;
  state: string;
  region: Region;
  languageName: string;
  languageFamily: 'Indo-Aryan' | 'Dravidian' | 'Tibeto-Burman' | 'Austroasiatic';
  scriptName: string;
  category: 'Greetings' | 'Travel & Food' | 'Politeness' | 'Everyday Life' | 'Culture & Festivals' | 'Numbers & Time' | 'Family & Relations';
  wordOriginal: string;
  transliteration: string;
  englishMeaning: string;
  audioPhonetic: string;
  dialectVariations: DialectVariation[];
  culturalTip: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  speechLangCode: string;
}

export interface VoiceFeedbackItem {
  id: string;
  wordId: string;
  wordOriginal: string;
  transliteration: string;
  languageName: string;
  userTranscript: string;
  accuracyScore: number;
  audioIssueCategory: 'Accent mismatch' | 'Unclear consonant' | 'Speed too fast' | 'Dialect difference' | 'Correct Pronunciation';
  userComment: string;
  studentName: string;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  recordedAudioDuration?: number;
}

export interface QuizQuestion {
  id: string;
  type: 'audio_choice' | 'meaning_choice' | 'dialect_match' | 'script_transliteration';
  state: string;
  languageName: string;
  question: string;
  promptText: string;
  audioItem?: LanguageItem;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizResult {
  quizId: string;
  date: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpentSeconds: number;
  xpEarned: number;
  languageFocus: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  rollNo: string;
  department: string;
  semester: string;
  avatarUrl: string;
  currentStreak: number;
  totalXp: number;
  levelTitle: string;
  languagesMastered: string[];
  flashcardsPracticed: number;
  voiceTestsCompleted: number;
  averageAccuracy: number;
  quizHistory: QuizResult[];
  regionalProgress: Record<Region, number>; // percentage 0-100
  studyHoursThisWeek: number[]; // 7 days (Mon-Sun)
}

export interface ThreadExecutionLog {
  id: string;
  threadName: string;
  timestamp: string;
  action: string;
  status: 'RUNNING' | 'WAITING' | 'LOCKED' | 'COMPLETED' | 'EXCEPTION';
  detail: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Dean / SuperAdmin' | 'Senior Linguistic Moderator' | 'Curriculum Evaluator';
  department: string;
  avatarUrl: string;
  lastLogin: string;
  clearanceLevel: 'LEVEL_4_FULL_GOVERNANCE' | 'LEVEL_3_MODERATOR';
}

export interface AdminActivityLog {
  id: string;
  timestamp: string;
  adminName: string;
  category: 'STUDENT_EVALUATION' | 'CURRICULUM_UPDATE' | 'VOICE_MODERATION' | 'EXAM_BANK';
  actionSummary: string;
}
