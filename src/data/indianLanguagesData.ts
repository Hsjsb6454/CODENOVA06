import { LanguageItem, QuizQuestion } from '../types';
import { HINDI_VOCABULARY } from './vocab/hindiVocab';
import { TAMIL_VOCABULARY } from './vocab/tamilVocab';
import { TELUGU_VOCABULARY } from './vocab/teluguVocab';
import { KANNADA_VOCABULARY } from './vocab/kannadaVocab';
import { MALAYALAM_VOCABULARY } from './vocab/malayalamVocab';
import { BENGALI_VOCABULARY } from './vocab/bengaliVocab';
import { MARATHI_VOCABULARY } from './vocab/marathiVocab';
import { GUJARATI_VOCABULARY } from './vocab/gujaratiVocab';
import { PUNJABI_VOCABULARY } from './vocab/punjabiVocab';
import { ODIA_VOCABULARY } from './vocab/odiaVocab';
import { REGIONAL_NORTH_EAST_CENTRAL_VOCABULARY } from './vocab/regionalNorthEastCentral';

export const INDIAN_LANGUAGES_DATA: LanguageItem[] = [
  ...HINDI_VOCABULARY,
  ...TAMIL_VOCABULARY,
  ...TELUGU_VOCABULARY,
  ...KANNADA_VOCABULARY,
  ...MALAYALAM_VOCABULARY,
  ...BENGALI_VOCABULARY,
  ...MARATHI_VOCABULARY,
  ...GUJARATI_VOCABULARY,
  ...PUNJABI_VOCABULARY,
  ...ODIA_VOCABULARY,
  ...REGIONAL_NORTH_EAST_CENTRAL_VOCABULARY
];

export const INITIAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-01',
    type: 'audio_choice',
    state: 'Tamil Nadu',
    languageName: 'Tamil',
    question: 'Listen to the audio or read the phrase: "வணக்கம், நீங்கள் எப்படி இருக்கிறீர்கள்?". Which region does this classical language originate from?',
    promptText: 'வணக்கம் (Vanakkam)',
    options: ['South India (Tamil Nadu)', 'North India (Punjab)', 'East India (Odisha)', 'West India (Gujarat)'],
    correctIndex: 0,
    explanation: 'Vanakkam is the traditional respectful Tamil greeting originating from Tamil Nadu in South India, one of the world\'s oldest classical languages.',
    points: 10,
    difficulty: 'easy'
  },
  {
    id: 'q-02',
    type: 'dialect_match',
    state: 'Karnataka',
    languageName: 'Kannada',
    question: 'In coastal Karnataka (Udupi & Kundapura), how does the regional "Kundagannada" dialect commonly inquire about well-being?',
    promptText: 'Dialect Identification: Kundagannada',
    options: [
      'ಏನ್ರಿ, ಆರಾಮ ಅದೀರೇನು? (Hubballi dialect)',
      'ಎಂದ್ ಕತೆ? ಎಲ್ಲ ಸುಕಾನೇನಾ? (Kundagannada)',
      'ನಮಸ್ಕಾರముండి, బాగున్నారా? (Coastal Telugu)',
      'ਕਿੱਦਾਂ ਓ ਸਾਰੇ? (Doabi Punjabi)'
    ],
    correctIndex: 1,
    explanation: 'Kundagannada spoken in coastal Kundapura features the distinctive expression "Endh kathe? Ella sukaaneena?" with rich local coastal idiom.',
    points: 15,
    difficulty: 'medium'
  },
  {
    id: 'q-03',
    type: 'meaning_choice',
    state: 'Gujarat',
    languageName: 'Gujarati',
    question: 'When departing or saying goodbye in Gujarati, why is the phrase "આવજો (Aavjo)" culturally preferred over a literal goodbye?',
    promptText: 'આવજો (Aavjo)',
    options: [
      'It literally asks for permission to leave the house immediately.',
      'It means "Please come back again soon", reinforcing continued hospitality.',
      'It translates strictly to "Safe travels tomorrow morning".',
      'It is an apology for staying too long.'
    ],
    correctIndex: 1,
    explanation: '"Aavjo" originates from the root "aav" (come), gently urging the guest to return soon rather than bidding a permanent departure.',
    points: 10,
    difficulty: 'easy'
  },
  {
    id: 'q-04',
    type: 'dialect_match',
    state: 'Maharashtra',
    languageName: 'Marathi',
    question: 'Which dialect of Marathi spoken in the Vidarbha region (Nagpur/Amravati) is famous for addressing peers affectionately as "बापू (Bapu)" or "भाऊ (Bhau)"?',
    promptText: 'Marathi Regional Dialects',
    options: ['Puneri Marathi', 'Varhadi Marathi', 'Malvani Marathi', 'Ahirani Marathi'],
    correctIndex: 1,
    explanation: 'Varhadi Marathi, spoken in Vidarbha, is celebrated for its warm folk cadence and affectionate colloquial terms like "Bapu" and "Kastam kaay".',
    points: 15,
    difficulty: 'medium'
  },
  {
    id: 'q-05',
    type: 'audio_choice',
    state: 'Chhattisgarh',
    languageName: 'Chhattisgarhi',
    question: 'What is the sacred environmental and indigenous meaning behind the central Indian greeting "जय जोहार (Jai Johar)"?',
    promptText: 'जय जोहार (Jai Johar)',
    options: [
      'It strictly means "Good evening at sunset".',
      'It salutes all of Mother Nature, ancestors, and the living community.',
      'It is an official court title for kings.',
      'It translates to "Hurry up, time is passing".'
    ],
    correctIndex: 1,
    explanation: '"Jai Johar" is a historic indigenous salutation across Central India that honors nature, ancestors, and the collective spirit of the community.',
    points: 15,
    difficulty: 'easy'
  },
  {
    id: 'q-06',
    type: 'script_transliteration',
    state: 'Punjab',
    languageName: 'Punjabi',
    question: 'Which writing script is used for writing the Punjabi phrase "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ" (Sat Sri Akal) in India?',
    promptText: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ',
    options: ['Devanagari script', 'Gurmukhi script', 'Sharada script', 'Grantha script'],
    correctIndex: 1,
    explanation: 'Punjabi in India is officially written in the Gurmukhi script ("from the mouth of the Guru"), standardized in the 16th century.',
    points: 10,
    difficulty: 'easy'
  },
  {
    id: 'q-07',
    type: 'dialect_match',
    state: 'West Bengal',
    languageName: 'Bengali',
    question: 'How does the Kongu dialect of Tamil Nadu distinguish itself in daily spoken conversation?',
    promptText: 'Kongu Dialect Trait',
    options: [
      'It drops all vowel endings completely.',
      'It appends the polite honorific suffix "-nga" (e.g. Vanakkamunga, Vanganga).',
      'It uses only Sanskrit loanwords.',
      'It is spoken in whisper tones.'
    ],
    correctIndex: 1,
    explanation: 'Kongu Tamil (Coimbatore, Erode, Tirupur) is renowned across South India for its melodic politeness, suffixing "-nga" to almost every verb.',
    points: 15,
    difficulty: 'medium'
  }
];

export const INITIAL_STUDENTS: any[] = [
  {
    id: 'stu-01',
    name: 'Ayush Sharma',
    rollNo: 'CS-2024-041',
    department: 'Computer Science & Indic Linguistics',
    semester: '6th Semester',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    currentStreak: 7,
    totalXp: 1850,
    levelTitle: 'Senior Polyglot Scholar',
    languagesMastered: ['Hindi', 'Tamil', 'Marathi', 'Punjabi'],
    flashcardsPracticed: 142,
    voiceTestsCompleted: 38,
    averageAccuracy: 91.4,
    studyHoursThisWeek: [1.2, 1.8, 2.4, 1.5, 2.0, 3.1, 2.5],
    regionalProgress: {
      'North': 92,
      'South': 85,
      'East': 74,
      'West': 88,
      'North-East': 62,
      'Central': 78
    },
    quizHistory: [
      {
        quizId: 'quiz-01',
        date: '2026-10-06',
        score: 75,
        totalQuestions: 5,
        percentage: 95,
        timeSpentSeconds: 145,
        xpEarned: 220,
        languageFocus: 'South & West Dialects'
      },
      {
        quizId: 'quiz-02',
        date: '2026-10-04',
        score: 60,
        totalQuestions: 5,
        percentage: 88,
        timeSpentSeconds: 180,
        xpEarned: 180,
        languageFocus: 'North-East & Central Languages'
      }
    ]
  },
  {
    id: 'stu-02',
    name: 'Priya Iyer',
    rollNo: 'CS-2024-082',
    department: 'Computational Linguistics',
    semester: '6th Semester',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    currentStreak: 12,
    totalXp: 2420,
    levelTitle: 'Lead Dravidian & Indo-Aryan Fellow',
    languagesMastered: ['Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali'],
    flashcardsPracticed: 210,
    voiceTestsCompleted: 56,
    averageAccuracy: 95.2,
    studyHoursThisWeek: [2.0, 2.5, 2.2, 3.0, 2.8, 3.5, 3.0],
    regionalProgress: {
      'North': 80,
      'South': 98,
      'East': 86,
      'West': 82,
      'North-East': 70,
      'Central': 75
    },
    quizHistory: [
      {
        quizId: 'quiz-03',
        date: '2026-10-06',
        score: 80,
        totalQuestions: 5,
        percentage: 100,
        timeSpentSeconds: 120,
        xpEarned: 250,
        languageFocus: 'Dravidian Phonetics'
      }
    ]
  },
  {
    id: 'stu-03',
    name: 'Rohan Sen',
    rollNo: 'IT-2024-019',
    department: 'Information Technology',
    semester: '4th Semester',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    currentStreak: 4,
    totalXp: 1120,
    levelTitle: 'Junior Regional Researcher',
    languagesMastered: ['Bengali', 'Odia', 'Assamese'],
    flashcardsPracticed: 85,
    voiceTestsCompleted: 22,
    averageAccuracy: 84.7,
    studyHoursThisWeek: [0.8, 1.2, 1.5, 1.0, 1.8, 2.0, 1.4],
    regionalProgress: {
      'North': 65,
      'South': 55,
      'East': 94,
      'West': 60,
      'North-East': 85,
      'Central': 60
    },
    quizHistory: [
      {
        quizId: 'quiz-04',
        date: '2026-10-05',
        score: 55,
        totalQuestions: 5,
        percentage: 82,
        timeSpentSeconds: 160,
        xpEarned: 140,
        languageFocus: 'Eastern Scripts'
      }
    ]
  }
];

export const INITIAL_VOICE_FEEDBACK: any[] = [
  {
    id: 'vf-101',
    wordId: 'hi-001',
    wordOriginal: 'नमस्ते, आप कैसे हैं?',
    transliteration: 'Namaste, aap kaise hain?',
    languageName: 'Hindi',
    userTranscript: 'नमस्ते आप कैसे है',
    accuracyScore: 92,
    audioIssueCategory: 'Dialect difference',
    userComment: 'In Bhojpuri-speaking Varanasi homes, native speakers emphasize nasalization at the end. Recommended recording an authentic Awadhi/Bhojpuri variant toggle.',
    studentName: 'Ayush Sharma',
    submittedAt: '2026-10-06 14:32',
    status: 'pending'
  },
  {
    id: 'vf-102',
    wordId: 'ta-001',
    wordOriginal: 'வணக்கம், நீங்கள் எப்படி இருக்கிறீர்கள்?',
    transliteration: 'Vanakkam, neengal eppadi irukkireergal?',
    languageName: 'Tamil',
    userTranscript: 'வணக்கம் நீங்கள் எப்படி இருக்கிறீர்கள்',
    accuracyScore: 97,
    audioIssueCategory: 'Correct Pronunciation',
    userComment: 'The speech synthesis pitch is clear, but adding retroflex "zh" (ழ) sound demonstration in flashcards would help non-native learners significantly.',
    studentName: 'Priya Iyer',
    submittedAt: '2026-10-05 11:15',
    status: 'approved'
  },
  {
    id: 'vf-103',
    wordId: 'pa-001',
    wordOriginal: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਤੁਹਾਡਾ ਕੀ ਹਾਲ ਹੈ?',
    transliteration: 'Sat Sri Akal, tuhada ki haal hai?',
    languageName: 'Punjabi',
    userTranscript: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਤੁਹਾਡਾ ਕੀ ਹਾਲ ਹੈ',
    accuracyScore: 88,
    audioIssueCategory: 'Speed too fast',
    userComment: 'Default TTS playback speed is slightly rapid for beginners learning Gurmukhi consonants. Slowing default playback to 0.85x helps distinguish aspirated consonants.',
    studentName: 'Rohan Sen',
    submittedAt: '2026-10-04 17:40',
    status: 'reviewed'
  }
];
