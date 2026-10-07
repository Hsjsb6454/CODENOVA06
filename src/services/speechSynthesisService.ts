/**
 * Multi-Voice Audio Pronunciation & Synthesis Engine for Indic State Languages
 */

import { VoicePersona } from '../types';

export interface VoiceOption {
  voiceURI: string;
  name: string;
  lang: string;
  isIndic: boolean;
}

class SpeechSynthesisService {
  private static instance: SpeechSynthesisService;
  private audioCtx: AudioContext | null = null;
  private isSpeaking: boolean = false;
  private selectedVoiceURI: string | null = null;
  private activePersona: VoicePersona = 'female';

  private constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Warm up voices
      window.speechSynthesis.onvoiceschanged = () => {
        // triggers cache update
      };
    }
  }

  public static getInstance(): SpeechSynthesisService {
    if (!SpeechSynthesisService.instance) {
      SpeechSynthesisService.instance = new SpeechSynthesisService();
    }
    return SpeechSynthesisService.instance;
  }

  public getAvailableVoices(): VoiceOption[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return [];
    }
    const voices = window.speechSynthesis.getVoices();
    return voices.map(v => {
      const isIndic =
        v.lang.includes('IN') ||
        v.lang.startsWith('hi') ||
        v.lang.startsWith('ta') ||
        v.lang.startsWith('te') ||
        v.lang.startsWith('kn') ||
        v.lang.startsWith('ml') ||
        v.lang.startsWith('bn') ||
        v.lang.startsWith('mr') ||
        v.lang.startsWith('gu') ||
        v.lang.startsWith('pa') ||
        v.lang.startsWith('or') ||
        v.lang.startsWith('as');
      return {
        voiceURI: v.voiceURI,
        name: v.name,
        lang: v.lang,
        isIndic
      };
    });
  }

  public setSelectedVoiceURI(uri: string | null) {
    this.selectedVoiceURI = uri;
  }

  public setVoicePersona(persona: VoicePersona) {
    this.activePersona = persona;
  }

  public getVoicePersona(): VoicePersona {
    return this.activePersona;
  }

  /**
   * Speaks the target phrase using Web Speech Synthesis with language fallback and persona configuration
   */
  public async speakPhrase(
    text: string,
    langCode: string = 'hi-IN',
    baseRate: number = 0.9,
    basePitch: number = 1.0,
    onStart?: () => void,
    onEnd?: () => void,
    personaOverride?: VoicePersona
  ): Promise<void> {
    if (typeof window === 'undefined') return;

    const persona = personaOverride || this.activePersona;

    // Calculate persona-specific pitch and speech rate adjustments
    let finalPitch = basePitch;
    let finalRate = baseRate;

    switch (persona) {
      case 'female':
        finalPitch = 1.18;
        finalRate = baseRate * 0.95;
        break;
      case 'male':
        finalPitch = 0.82;
        finalRate = baseRate * 0.95;
        break;
      case 'tutor':
        finalPitch = 1.0;
        finalRate = Math.max(0.65, baseRate * 0.75); // Slower for clear phonetics
        break;
      case 'conversational':
        finalPitch = 1.05;
        finalRate = Math.min(1.3, baseRate * 1.15); // Faster native cadence
        break;
      case 'native_elder':
        finalPitch = 0.75;
        finalRate = baseRate * 0.85;
        break;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // cancel any active utterance

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = finalRate;
      utterance.pitch = finalPitch;

      const voices = window.speechSynthesis.getVoices();

      // Priority 1: User explicitly chosen voiceURI
      let chosenVoice: SpeechSynthesisVoice | undefined;
      if (this.selectedVoiceURI) {
        chosenVoice = voices.find(v => v.voiceURI === this.selectedVoiceURI);
      }

      // Priority 2: Voice matching persona gender and language
      if (!chosenVoice) {
        const langPrefix = langCode.toLowerCase().slice(0, 2);
        const matchingLangVoices = voices.filter(
          v => v.lang.toLowerCase().startsWith(langPrefix) || v.lang.toLowerCase().includes(langCode.toLowerCase())
        );

        if (matchingLangVoices.length > 0) {
          // If female, look for voices containing female keywords or second voice
          if (persona === 'female') {
            chosenVoice = matchingLangVoices.find(v => /female|woman|zira|kalpana|priya|anjali/i.test(v.name)) || matchingLangVoices[0];
          } else if (persona === 'male' || persona === 'native_elder') {
            chosenVoice = matchingLangVoices.find(v => /male|man|david|ravi|arjun|neel/i.test(v.name)) || matchingLangVoices[matchingLangVoices.length - 1];
          } else {
            chosenVoice = matchingLangVoices[0];
          }
        }
      }

      // Priority 3: Any Indian English / Indian voice fallback
      if (!chosenVoice) {
        chosenVoice = voices.find(v => v.lang.includes('IN')) || voices[0];
      }

      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        if (onStart) onStart();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        // Fallback to melodic synthesized chime if system speech errors
        this.playAcousticToneFallback(text, finalPitch);
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      this.playAcousticToneFallback(text, finalPitch);
      if (onEnd) setTimeout(onEnd, 1000);
    }
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
  }

  /**
   * Web Audio API synthesized harmonic tone fallback
   */
  private playAcousticToneFallback(phrase: string, pitchFactor: number = 1.0): void {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtxClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      const baseFreq = 320 * pitchFactor;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.15, now + 0.4);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // ignore audio context failures
    }
  }
}

export const speechSynthesisService = SpeechSynthesisService.getInstance();
