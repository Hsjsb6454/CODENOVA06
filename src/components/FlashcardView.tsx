import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LanguageItem, Region, VoicePersona } from '../types';
import { speechSynthesisService, VoiceOption } from '../services/speechSynthesisService';
import { VoiceFeedbackModal } from './VoiceFeedbackModal';
import {
  Volume2,
  RotateCw,
  Bookmark,
  CheckCircle,
  Mic,
  MapPin,
  Sparkles,
  Search,
  BookOpen,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  UserCheck,
  User,
  GraduationCap,
  Zap,
  Globe,
  Headphones,
  Check
} from 'lucide-react';

const REGIONS: (Region | 'All')[] = ['All', 'North', 'South', 'East', 'West', 'North-East', 'Central'];

const POPULAR_LANGUAGES = [
  'All Languages',
  'Hindi',
  'Tamil',
  'Telugu',
  'Kannada',
  'Malayalam',
  'Bengali (Bangla)',
  'Marathi',
  'Gujarati',
  'Punjabi',
  'Odia',
  'Assamese (Asamiya)'
];

const CATEGORIES = [
  'All',
  'Greetings',
  'Travel & Food',
  'Everyday Life',
  'Politeness',
  'Numbers & Time',
  'Family & Relations',
  'Culture & Festivals'
];

const VOICE_PERSONAS: { id: VoicePersona; label: string; icon: string; desc: string }[] = [
  { id: 'female', label: 'Female Native', icon: '👩', desc: 'Clear melodic Indic soprano' },
  { id: 'male', label: 'Male Speaker', icon: '👨', desc: 'Warm deep baritone' },
  { id: 'tutor', label: 'Slow Tutor', icon: '🎓', desc: 'Slowed 0.75x for clear phonetics' },
  { id: 'conversational', label: 'Native Fast', icon: '⚡', desc: 'Fluent 1.15x everyday tempo' },
  { id: 'native_elder', label: 'Elder Accent', icon: '👴', desc: 'Traditional rustic cadence' }
];

const ITEMS_PER_PAGE = 12;

export const FlashcardView: React.FC = () => {
  const {
    languages,
    learnedWordIds,
    bookmarkedWordIds,
    toggleLearnedWord,
    toggleBookmark
  } = useApp();

  const [selectedRegion, setSelectedRegion] = useState<Region | 'All'>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All Languages');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePersona, setActivePersona] = useState<VoicePersona>('female');
  const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [selectedDialectIndices, setSelectedDialectIndices] = useState<Record<string, number>>({});
  const [activeVoiceItem, setActiveVoiceItem] = useState<LanguageItem | null>(null);
  const [speakingCardId, setSpeakingCardId] = useState<string | null>(null);

  // Initialize browser voices
  useEffect(() => {
    const updateVoices = () => {
      const v = speechSynthesisService.getAvailableVoices();
      setAvailableVoices(v);
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Update persona
  const handlePersonaChange = (p: VoicePersona) => {
    setActivePersona(p);
    speechSynthesisService.setVoicePersona(p);
  };

  const handleVoiceURIChange = (uri: string) => {
    setSelectedVoiceURI(uri);
    speechSynthesisService.setSelectedVoiceURI(uri ? uri : null);
  };

  // Filter languages
  const filteredLanguages = languages.filter(item => {
    const matchesRegion = selectedRegion === 'All' || item.region === selectedRegion;
    const matchesLang =
      selectedLanguage === 'All Languages' ||
      item.languageName.toLowerCase().startsWith(selectedLanguage.toLowerCase().slice(0, 4));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.languageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.wordOriginal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.englishMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.transliteration.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesLang && matchesCategory && matchesSearch;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredLanguages.length / ITEMS_PER_PAGE) || 1;
  const paginatedItems = filteredLanguages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRegion, selectedLanguage, selectedCategory, searchQuery]);

  const handleFlipCard = (id: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handlePlayAudio = (e: React.MouseEvent, item: LanguageItem, phraseToSpeak?: string) => {
    e.stopPropagation();
    const phrase = phraseToSpeak || item.wordOriginal;
    setSpeakingCardId(item.id);
    speechSynthesisService.speakPhrase(
      phrase,
      item.speechLangCode,
      0.9,
      1.0,
      () => setSpeakingCardId(item.id),
      () => setSpeakingCardId(null),
      activePersona
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 -top-10 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pan-Indic Multi-Voice Speech & Dialectology Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Learn India’s State Languages & Pronunciations
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Practice authentic pronunciations with multiple voice personas (Female, Male, Slow Tutor, Native). Browse hundreds of words across Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Odia, and regional dialects.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <Headphones className="w-3.5 h-3.5 text-amber-400" />
              <strong>{languages.length} Words</strong> with Native Audio
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <strong>{learnedWordIds.size}</strong> Mastered Cards
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              <strong>5 Voice Personas</strong> Active
            </span>
          </div>
        </div>
      </div>

      {/* MULTI-VOICE PERSONA CONTROLS */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b pb-3">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Pronunciation Voice Persona
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              (Choose acoustic timbre, speed & pitch)
            </span>
          </div>

          {/* Browser Voice URI Picker */}
          {availableVoices.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 font-semibold whitespace-nowrap">
                Device Synthesizer:
              </span>
              <select
                aria-label="Device Synthesizer Voice"
                value={selectedVoiceURI}
                onChange={(e) => handleVoiceURIChange(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-slate-800 max-w-[220px] truncate"
              >
                <option value="">Default AI Indic Speech Voice</option>
                {availableVoices.map(v => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Persona Options Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {VOICE_PERSONAS.map(p => {
            const isSelected = activePersona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handlePersonaChange(p.id)}
                className={`flex items-start gap-2 p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span className="text-lg">{p.icon}</span>
                <div className="overflow-hidden">
                  <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                    {p.label}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">
                    {p.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 space-y-4">
        {/* Language Tabs Quick Selector */}
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-600" /> Select State Language:
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {POPULAR_LANGUAGES.map(lang => {
              const isSelected = selectedLanguage === lang;
              const count =
                lang === 'All Languages'
                  ? languages.length
                  : languages.filter(l => l.languageName.toLowerCase().startsWith(lang.toLowerCase().slice(0, 4))).length;

              return (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{lang}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Region & Search & Category */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-1 border-t border-slate-100">
          {/* Region Tabs */}
          <div className="md:col-span-5 flex items-center gap-1 overflow-x-auto">
            <span className="text-xs font-bold text-slate-500 pr-1 flex items-center gap-1 whitespace-nowrap">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Region:
            </span>
            {REGIONS.map(reg => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`flex-shrink-0 px-2 py-1 rounded-lg text-xs font-semibold ${
                  selectedRegion === reg
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="md:col-span-4 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search words, scripts, meaning..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3 flex items-center gap-2 justify-end">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Topic:</span>
            <select
              aria-label="Filter by Topic"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-semibold"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Counter & Active Voice Status */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <div>
            Showing <strong>{filteredLanguages.length} words</strong> with native audio
            {selectedLanguage !== 'All Languages' && ` for ${selectedLanguage}`}
          </div>
          <div className="flex items-center gap-1.5">
            <span>Active Voice:</span>
            <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
              {VOICE_PERSONAS.find(p => p.id === activePersona)?.label}
            </span>
          </div>
        </div>
      </div>

      {/* FLASHCARDS GRID */}
      {filteredLanguages.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No regional cards match your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or select "All Languages" to discover words across India.
          </p>
          <button
            onClick={() => {
              setSelectedRegion('All');
              setSelectedLanguage('All Languages');
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-xs font-bold text-indigo-600 hover:underline pt-2"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedItems.map(item => {
            const isFlipped = !!flippedCards[item.id];
            const isLearned = learnedWordIds.has(item.id);
            const isBookmarked = bookmarkedWordIds.has(item.id);
            const activeDialectIdx = selectedDialectIndices[item.id] ?? 0;
            const currentDialect = item.dialectVariations[activeDialectIdx] || item.dialectVariations[0];

            return (
              <div
                key={item.id}
                className="perspective-1000 min-h-[460px] cursor-pointer group"
                onClick={() => handleFlipCard(item.id)}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-500 transform-style-3d rounded-2xl ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* ================= CARD FRONT ================= */}
                  <div className="absolute inset-0 backface-hidden bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:shadow-lg transition-all p-5 flex flex-col justify-between overflow-hidden">
                    {/* Top Badges */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="bg-indigo-50 text-indigo-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-indigo-200">
                            {item.state}
                          </span>
                          <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            {item.languageName}
                          </span>
                          <span className="bg-amber-50 text-amber-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
                            {item.category}
                          </span>
                        </div>

                        {/* Mastery & Bookmark icons */}
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => toggleBookmark(item.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isBookmarked
                                ? 'text-amber-500 bg-amber-50'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                            }`}
                            title="Bookmark this phrase"
                          >
                            <Bookmark className="w-4 h-4 fill-current" />
                          </button>
                          <button
                            onClick={() => toggleLearnedWord(item.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isLearned
                                ? 'text-emerald-600 bg-emerald-50'
                                : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100'
                            }`}
                            title="Mark as Mastered"
                          >
                            <CheckCircle className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                      </div>

                      {/* Main Script Display */}
                      <div className="py-6 text-center space-y-3">
                        <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-snug tracking-normal px-2">
                          {item.wordOriginal}
                        </div>

                        <div className="text-indigo-600 font-semibold text-sm">
                          "{item.transliteration}"
                        </div>

                        <div className="text-xs text-slate-500 font-mono bg-slate-50 py-1 px-3 rounded-full inline-block border border-slate-200">
                          Phonetic: {item.audioPhonetic}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Meaning preview */}
                    <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 text-center">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        English Meaning
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        {item.englishMeaning}
                      </div>
                    </div>

                    {/* Bottom Action Controls */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handlePlayAudio(e, item)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                          speakingCardId === item.id
                            ? 'bg-amber-500 text-white animate-pulse'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>{speakingCardId === item.id ? 'Speaking...' : 'Pronounce'}</span>
                      </button>

                      <button
                        onClick={() => setActiveVoiceItem(item)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-bold transition-colors border border-slate-200"
                        title="Open Voice Recognition Lab"
                      >
                        <Mic className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Practice Mic</span>
                      </button>

                      <button
                        onClick={() => handleFlipCard(item.id)}
                        className="flex items-center gap-1 text-slate-400 hover:text-indigo-600 text-xs font-semibold p-1"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Dialects</span>
                      </button>
                    </div>
                  </div>

                  {/* ================= CARD BACK ================= */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 text-white rounded-2xl shadow-xl p-5 flex flex-col justify-between overflow-y-auto border border-slate-800">
                    <div>
                      {/* Back Header */}
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                            Regional Dialects of {item.state}
                          </span>
                          <h4 className="font-extrabold text-sm text-white">{item.languageName} Nuances</h4>
                        </div>
                        <button
                          onClick={() => handleFlipCard(item.id)}
                          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md"
                        >
                          <RotateCw className="w-3 h-3" /> Flip Back
                        </button>
                      </div>

                      {/* Cultural Etiquette Context */}
                      <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 mb-3 space-y-1">
                        <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" /> Cultural Etiquette & Lore
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {item.culturalTip}
                        </p>
                      </div>

                      {/* Dialect Selector Tabs */}
                      <div className="space-y-2">
                        <div className="text-[11px] font-semibold text-slate-400">
                          Select Regional Sub-Dialect:
                        </div>
                        <div className="flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
                          {item.dialectVariations.map((d, dIdx) => (
                            <button
                              key={d.dialectName}
                              onClick={() =>
                                setSelectedDialectIndices(prev => ({
                                  ...prev,
                                  [item.id]: dIdx
                                }))
                              }
                              className={`text-[10px] px-2 py-1 rounded-md font-bold transition-all ${
                                activeDialectIdx === dIdx
                                  ? 'bg-amber-500 text-slate-950 font-extrabold'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              {d.dialectName.split('(')[0].trim()}
                            </button>
                          ))}
                        </div>

                        {/* Selected Dialect Detail Card */}
                        {currentDialect && (
                          <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700 text-left space-y-1.5 mt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold text-amber-300">
                                {currentDialect.dialectName}
                              </span>
                              <span className="text-[9px] text-slate-400">
                                {currentDialect.regionDistrict}
                              </span>
                            </div>

                            <div className="text-base font-bold text-white font-serif">
                              {currentDialect.samplePhrase}
                            </div>
                            <div className="text-xs text-indigo-300 italic">
                              "{currentDialect.transliteration}"
                            </div>
                            <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-700/50">
                              <strong className="text-amber-400 font-semibold">Linguistic Shift: </strong>
                              {currentDialect.differenceNote}
                            </div>

                            {/* Speak Dialect Button */}
                            <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={(e) => handlePlayAudio(e, item, currentDialect.samplePhrase)}
                                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-amber-400/10 hover:bg-amber-400/20 px-2.5 py-1 rounded-lg border border-amber-400/30 transition-colors"
                              >
                                <Volume2 className="w-3 h-3" /> Listen to this Dialect
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Back Actions */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActiveVoiceItem(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all"
                      >
                        <Mic className="w-3.5 h-3.5" /> Practice Voice & Submit
                      </button>

                      <button
                        onClick={() => toggleLearnedWord(item.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 ${
                          isLearned
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-white/10 text-slate-300 hover:bg-white/20'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{isLearned ? 'Learned' : 'Mark Learned'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredLanguages.length} total words)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page number buttons */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                let pageNum = idx + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = Math.min(totalPages - 4 + idx, currentPage - 2 + idx);
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                      currentPage === pageNum
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Voice Recognition Practice Modal */}
      {activeVoiceItem && (
        <VoiceFeedbackModal
          item={activeVoiceItem}
          onClose={() => setActiveVoiceItem(null)}
        />
      )}
    </div>
  );
};
