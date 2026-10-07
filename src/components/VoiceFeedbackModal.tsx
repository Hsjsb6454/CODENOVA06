import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LanguageItem, VoiceFeedbackItem } from '../types';
import { speechRecognitionService, SpeechRecognitionResultData } from '../services/speechRecognitionService';
import { speechSynthesisService } from '../services/speechSynthesisService';
import {
  Mic,
  MicOff,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Send,
  X,
  Sparkles,
  HelpCircle,
  Activity
} from 'lucide-react';

interface VoiceFeedbackModalProps {
  item: LanguageItem;
  onClose: () => void;
}

export const VoiceFeedbackModal: React.FC<VoiceFeedbackModalProps> = ({ item, onClose }) => {
  const { currentStudent, submitVoiceFeedback } = useApp();

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [recognitionResult, setRecognitionResult] = useState<SpeechRecognitionResultData | null>(null);
  const [feedbackCategory, setFeedbackCategory] = useState<VoiceFeedbackItem['audioIssueCategory']>('Correct Pronunciation');
  const [userComment, setUserComment] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      speechRecognitionService.stopListening();
    };
  }, []);

  const handleStartSpeaking = async () => {
    setErrorStatus(null);
    setRecognitionResult(null);
    setIsRecording(true);

    await speechRecognitionService.startListening(
      item.speechLangCode,
      item.wordOriginal,
      (level) => setAudioLevel(level),
      (result) => {
        setIsRecording(false);
        setRecognitionResult(result);
        if (result.accuracyScore < 70) {
          setFeedbackCategory('Accent mismatch');
        } else if (result.accuracyScore >= 90) {
          setFeedbackCategory('Correct Pronunciation');
        }
      },
      (errorMsg) => {
        setIsRecording(false);
        setErrorStatus(errorMsg);
      }
    );
  };

  const handleStopSpeaking = () => {
    speechRecognitionService.stopListening();
    setIsRecording(false);
  };

  const handlePlayReferenceAudio = () => {
    setIsPlayingAudio(true);
    speechSynthesisService.speakPhrase(
      item.wordOriginal,
      item.speechLangCode,
      0.85,
      1.0,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recognitionResult && !userComment.trim()) {
      setErrorStatus('Please record your voice or provide a constructive comment.');
      return;
    }

    submitVoiceFeedback({
      wordId: item.id,
      wordOriginal: item.wordOriginal,
      transliteration: item.transliteration,
      languageName: item.languageName,
      userTranscript: recognitionResult?.transcript || item.wordOriginal,
      accuracyScore: recognitionResult?.accuracyScore || 85,
      audioIssueCategory: feedbackCategory,
      userComment: userComment || `Recorded by student ${currentStudent.name} for dialect refinement.`,
      studentName: currentStudent.name
    });

    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Mic className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Voice Recognition & Feedback</h3>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-400/30">
                  {item.state}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Practice pronunciation & help refine regional dialect acoustic models
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Pronunciation Feedback Logged!</h4>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Your voice sample and phonetic notes have been dispatched to the Academic Administration queue for model calibration. Earned <strong className="text-amber-600">+50 XP</strong>!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitFeedback} className="p-6 space-y-5">
            {/* Target Phrase Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center relative group">
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                Target Phrase ({item.languageName})
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1 font-serif tracking-wide">
                {item.wordOriginal}
              </div>
              <div className="text-sm font-medium text-indigo-700 italic">
                "{item.transliteration}"
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Meaning: {item.englishMeaning}
              </div>

              {/* Reference Audio Play Button */}
              <button
                type="button"
                onClick={handlePlayReferenceAudio}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition-colors"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-pulse text-indigo-600' : ''}`} />
                <span>{isPlayingAudio ? 'Playing Reference...' : 'Listen to Native Reference'}</span>
              </button>
            </div>

            {/* Voice Recognition Section */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-600" /> Real-Time Voice Recognition
                </span>
                {isRecording && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-600"></span> Listening...
                  </span>
                )}
              </div>

              {/* Live Waveform Indicator */}
              <div className="h-8 bg-slate-100 rounded-lg flex items-center justify-center gap-1 px-3 overflow-hidden">
                {isRecording ? (
                  Array.from({ length: 24 }).map((_, i) => (
                    <span
                      key={i}
                      className="w-1 bg-indigo-600 rounded-full transition-all duration-75"
                      style={{
                        height: `${Math.max(15, Math.min(100, audioLevel * (0.6 + Math.sin(i * 0.8) * 0.4)))}%`
                      }}
                    />
                  ))
                ) : (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    Click microphone below and speak the phrase in your natural voice
                  </span>
                )}
              </div>

              {/* Mic Action Button */}
              <div className="flex justify-center pt-1">
                {isRecording ? (
                  <button
                    type="button"
                    onClick={handleStopSpeaking}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 text-white font-bold text-xs shadow-md hover:bg-rose-700 transition-all animate-pulse"
                  >
                    <MicOff className="w-4 h-4" /> Stop & Evaluate Audio
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStartSpeaking}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs shadow-md shadow-indigo-600/20 hover:scale-102 transition-all"
                  >
                    <Mic className="w-4 h-4" /> Record My Pronunciation
                  </button>
                )}
              </div>

              {errorStatus && (
                <div className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200 flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{errorStatus}</span>
                </div>
              )}

              {/* Evaluation Results Box */}
              {recognitionResult && (
                <div className="mt-3 p-3.5 rounded-xl border bg-slate-50 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Transcribed Speech:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-700">Acoustic Score:</span>
                      <span
                        className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                          recognitionResult.accuracyScore >= 80
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : recognitionResult.accuracyScore >= 60
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {recognitionResult.accuracyScore}%
                      </span>
                    </div>
                  </div>

                  <div className="font-semibold text-sm text-slate-900 bg-white p-2 rounded-lg border border-slate-200">
                    "{recognitionResult.transcript}"
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {recognitionResult.feedbackText}
                  </p>
                </div>
              )}
            </div>

            {/* Diagnostic Classification & Comment */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pronunciation Diagnostic Category
                </label>
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value as any)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <option value="Correct Pronunciation">Native / Accurate Pronunciation</option>
                  <option value="Dialect difference">Dialect Nuance (Regional variation not in standard)</option>
                  <option value="Accent mismatch">Acoustic / Accent Mismatch</option>
                  <option value="Unclear consonant">Aspirated Consonant / Retroflex Unclear</option>
                  <option value="Speed too fast">Playback Tempo Too Fast</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Linguistic Feedback / Dialect Context Notes
                </label>
                <textarea
                  rows={2}
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="e.g., In Madurai Tamil, the vowel ending is slightly prolonged, or in Varhadi Marathi we soften the dental stop..."
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
              >
                <Send className="w-3.5 h-3.5" /> Submit to Academic Database
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
