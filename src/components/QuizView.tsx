import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QuizQuestion } from '../types';
import { speechSynthesisService } from '../services/speechSynthesisService';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  Volume2,
  CheckCircle2,
  XCircle,
  Flame,
  Award,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Trophy,
  Clock,
  BookOpen
} from 'lucide-react';

export const QuizView: React.FC = () => {
  const {
    quizQuestions,
    currentStudent,
    recordQuizResult,
    setCurrentView
  } = useApp();

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);
  const [startTime] = useState<number>(Date.now());
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const currentQuestion: QuizQuestion = quizQuestions[currentIdx] || quizQuestions[0];

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    speechSynthesisService.speakPhrase(
      currentQuestion.promptText,
      'hi-IN',
      0.85,
      1.0,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore(prev => prev + currentQuestion.points);
      setStreakCount(prev => prev + 1);
      // Small celebratory confetti for correct answer
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.8 }
      });
    } else {
      setStreakCount(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Complete Quiz
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsQuizComplete(true);
    const elapsedSec = Math.round((Date.now() - startTime) / 1000);
    const maxScore = quizQuestions.reduce((acc, q) => acc + q.points, 0);
    const percentage = Math.round((score / (maxScore || 1)) * 100);
    const earnedXp = score * 3;

    // Big confetti on finish
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    recordQuizResult({
      score,
      totalQuestions: quizQuestions.length,
      percentage,
      timeSpentSeconds: elapsedSec,
      xpEarned: earnedXp,
      languageFocus: 'Pan-Indic State Dialects & Scripts'
    });
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreakCount(0);
    setIsQuizComplete(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Gamification Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Flame className="w-6 h-6 fill-orange-500 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Practice Streak
            </div>
            <div className="text-base font-extrabold text-slate-900">
              {currentStudent.currentStreak} Days Consistent!
            </div>
          </div>
        </div>

        {/* Current Round Score */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-slate-500 font-semibold">Session Score</div>
            <div className="text-lg font-black text-indigo-600">{score} pts</div>
          </div>

          <div className="text-right pl-4 border-l border-slate-200">
            <div className="text-xs text-slate-500 font-semibold">Streak Multiplier</div>
            <div className="text-sm font-bold text-orange-600 flex items-center gap-1 justify-end">
              <span>{streakCount}x in a row</span>
            </div>
          </div>
        </div>
      </div>

      {!isQuizComplete ? (
        <div className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden">
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-amber-500 h-2 transition-all duration-300"
              style={{
                width: `${((currentIdx + 1) / quizQuestions.length) * 100}%`
              }}
            />
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Header info */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Question {currentIdx + 1} of {quizQuestions.length}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  {currentQuestion.state}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  +{currentQuestion.points} pts
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {currentQuestion.question}
              </h2>

              {/* Prompt Text & Audio Player */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Linguistic Anchor
                  </div>
                  <div className="text-2xl font-bold text-slate-900 font-serif">
                    {currentQuestion.promptText}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePlayAudio}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    isPlayingAudio
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isPlayingAudio ? 'Speaking...' : 'Listen Pronunciation'}</span>
                </button>
              </div>
            </div>

            {/* Options Grid */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctIndex;
                let btnStyle = 'border-slate-200 hover:border-indigo-400 bg-white text-slate-800';

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/30';
                  } else if (isSelected) {
                    btnStyle = 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-500/30';
                  } else {
                    btnStyle = 'opacity-60 border-slate-200 bg-slate-50 text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-xl border-2 font-medium text-sm transition-all flex items-center justify-between group ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation Box */}
            {isAnswered && (
              <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                    Academic Linguistic Explanation
                  </span>
                </div>
                <p className="text-xs text-indigo-950 leading-relaxed font-normal">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Bottom Next Question Button */}
            {isAnswered && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm shadow-md shadow-indigo-600/20 hover:scale-102 transition-all"
                >
                  <span>
                    {currentIdx + 1 === quizQuestions.length ? 'Complete Quiz Round' : 'Next Question'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Complete Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center animate-bounce">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Splendid Practice Session!
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              You have strengthened your understanding of India’s state language phonetics and regional dialect boundaries.
            </p>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto py-2">
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
              <div className="text-xs font-semibold text-indigo-600">Total Score</div>
              <div className="text-2xl font-black text-indigo-950">{score}</div>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="text-xs font-semibold text-amber-700">XP Gained</div>
              <div className="text-2xl font-black text-amber-950">+{score * 3} XP</div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="text-xs font-semibold text-emerald-700">Accuracy</div>
              <div className="text-2xl font-black text-emerald-950">
                {Math.round((score / (quizQuestions.reduce((a, b) => a + b.points, 0) || 1)) * 100)}%
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Practice Again
            </button>
            <button
              onClick={() => setCurrentView('student-dashboard')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
            >
              <Award className="w-4 h-4" /> View My Academic Analytics
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
