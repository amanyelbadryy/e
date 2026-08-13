import React, { useState, lazy, Suspense } from 'react';
import { ALPHABET_DATA } from '../data/alphabetData';
import { ArabicLetter } from '../types';
import { playMP3, playButtonClickSFX } from '../utils/mp3Player';
import {
  playPositiveFeedback,
  playNegativeNextQuestionFeedback,
} from '../utils/gameHelpers';
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
  Volume2,
  HelpCircle,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';
import { LetterCard } from './LetterCard';
import { WordCard } from './WordCard';

const LetterQuizSection = lazy(() =>
  import('./letters/LetterQuizSection').then((m) => ({ default: m.LetterQuizSection }))
);

const QuizLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[350px] p-8 text-center space-y-4">
    <div className="w-14 h-14 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin"></div>
    <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-900 px-5 py-2 rounded-full font-black text-sm border border-teal-200 shadow-2xs">
      <span>جاري تجهيز اختبار الحروف... 🎯</span>
    </div>
  </div>
);

type SectionTab = 'pronunciation' | 'harakat' | 'quiz';

export const LettersView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SectionTab>('pronunciation');
  
  // Single active letter state (index in ALPHABET_DATA 0-27)
  const [currentLetterIndex, setCurrentLetterIndex] = useState<number>(0);
  const currentLetter = ALPHABET_DATA[currentLetterIndex];

  // Active Haraka selection in Tab 2
  const [activeHaraka, setActiveHaraka] = useState<'fatha' | 'kasra' | 'damma'>('fatha');

  if (activeTab === 'quiz') {
    return (
      <Suspense fallback={<QuizLoadingFallback />}>
        <LetterQuizSection onBack={() => setActiveTab('pronunciation')} />
      </Suspense>
    );
  }

  const handleTabChange = (tab: SectionTab) => {
    playButtonClickSFX();
    setActiveTab(tab);
  };

  const handleSelectLetterByIndex = (index: number) => {
    playButtonClickSFX();
    setCurrentLetterIndex(index);
    playMP3(ALPHABET_DATA[index].audio);
  };

  const handlePlaySound = (audioUrl: string) => {
    playMP3(audioUrl);
  };

  const handleNextLetter = () => {
    const nextIndex = (currentLetterIndex + 1) % ALPHABET_DATA.length;
    handleSelectLetterByIndex(nextIndex);
  };

  const handlePrevLetter = () => {
    const prevIndex = (currentLetterIndex - 1 + ALPHABET_DATA.length) % ALPHABET_DATA.length;
    handleSelectLetterByIndex(prevIndex);
  };

  // Shared Letter Navigation Buttons Row Component
  const LetterNavigationRows = () => (
    <div className="bg-white p-3 sm:p-4 rounded-2xl border-2 border-teal-200/90 shadow-2xs space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs sm:text-sm font-black text-teal-950">
          صفوف أزرار الحروف الـ٢٨ (اختر الحرف للتنقل):
        </span>
        <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
          ٢٨ حرفاً
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {ALPHABET_DATA.map((item, index) => {
          const isActive = index === currentLetterIndex;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectLetterByIndex(index)}
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl font-black text-base sm:text-lg transition-all cursor-pointer border ${
                isActive
                  ? 'bg-teal-600 text-white border-teal-700 shadow-md scale-105 ring-2 ring-teal-400/50'
                  : 'bg-teal-50/60 text-slate-800 border-teal-200/90 hover:bg-teal-100/80 hover:border-teal-300'
              }`}
              title={`حرف ${item.name}`}
              aria-label={`اختر حرف ${item.name}`}
            >
              {item.letter}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      dir="rtl"
      className="w-full max-w-6xl mx-auto px-4 py-8 pb-28 space-y-8 box-border overflow-x-hidden font-sans"
    >
      {/* 1. Header Section */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-teal-100 text-teal-900 px-3.5 py-1 rounded-full font-black text-xs sm:text-sm border border-teal-200 shadow-2xs">
          <BookOpen className="w-4 h-4 text-teal-700" />
          <span>🔤 قسم الحروف</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          أحرف الهجاء
        </h1>
      </div>

      {/* Action Cards Section */}
      <div className="space-y-4">
        {/* Top Row: 2 Big Cards side by side (نطق الكلمات & الحركات الثلاثة) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Card 1: نطق الكلمات */}
          <button
            type="button"
            onClick={() => {
              handleTabChange('pronunciation');
            }}
            className={`bg-gradient-to-br from-emerald-500 to-teal-700 rounded-3xl p-4 sm:p-6 border-4 border-teal-800 shadow-lg text-white flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-3 sm:gap-4 cursor-pointer hover:scale-[1.01] active:scale-95 transition-all h-full ${
              activeTab === 'pronunciation' ? 'ring-4 ring-emerald-300' : ''
            }`}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-inner">
              🔊
            </div>
            <div className="space-y-1">
              <div className="inline-block bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black text-emerald-100">
                كلمات الحروف 🔊
              </div>
              <h3 className="text-base sm:text-xl font-black">نطق الكلمات</h3>
              <p className="text-xs sm:text-sm font-bold text-teal-100">
                جميع كلمات الحروف العربية وأصواتها
              </p>
            </div>
          </button>

          {/* Card 2: الحركات الثلاثة */}
          <button
            type="button"
            onClick={() => {
              handleTabChange('harakat');
              setActiveHaraka('fatha');
            }}
            className={`bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-3xl p-4 sm:p-6 border-4 border-purple-800 shadow-lg text-white flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-3 sm:gap-4 cursor-pointer hover:scale-[1.01] active:scale-95 transition-all h-full ${
              activeTab === 'harakat' ? 'ring-4 ring-pink-300' : ''
            }`}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-inner">
              ✨
            </div>
            <div className="space-y-1">
              <div className="inline-block bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black text-pink-100">
                الحركات الثلاث ✨
              </div>
              <h3 className="text-base sm:text-xl font-black">الحركات الثلاثة</h3>
              <p className="text-xs sm:text-sm sm:text-base font-black tracking-widest text-pink-100 bg-white/20 px-3 py-0.5 rounded-full inline-block">
                َ &nbsp; ِ &nbsp; ُ
              </p>
            </div>
          </button>
        </div>

        {/* Featured "Test Yourself" Quiz Banner Button */}
        <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 rounded-3xl p-5 md:p-6 border-4 border-teal-700 shadow-lg text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-right">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-inner">
              🎯
            </div>
            <div>
              <div className="inline-flex items-center gap-1 bg-amber-300 text-amber-950 px-3 py-0.5 rounded-full text-xs font-black mb-1">
                <span>اختبار شامل ⭐ 100 سؤال</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black">🎯 اختبر نفسك في الحروف</h3>
              <p className="text-xs md:text-sm font-bold text-teal-100">
                اختبار عشوائي ممتع يتكون من 100 سؤال متنوع يشمل الاستماع، الكلمات، الحركات، والتمييز البصري
              </p>
            </div>
          </div>

          <button
            onClick={() => handleTabChange('quiz')}
            className="w-full md:w-auto bg-amber-300 hover:bg-amber-200 text-amber-950 px-8 py-3.5 rounded-2xl font-black text-base shadow-md active:scale-95 transition-all cursor-pointer shrink-0 border-b-4 border-amber-500"
          >
            ابدأ الاختبار الآن 🎯
          </button>
        </div>
      </div>

      {/* 3. Main Content Container */}
      <div className="bg-teal-50/40 rounded-3xl border-2 border-teal-100/90 p-3 sm:p-6 shadow-2xs">
        {/* TAB 1: Pronunciation & Word (نطق الكلمات) */}
        {activeTab === 'pronunciation' && (
          <div className="space-y-5 max-w-3xl mx-auto">
            {/* Title Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-3.5 sm:p-4 rounded-2xl border-2 border-teal-200 shadow-2xs gap-2">
              <div className="flex items-center gap-2 font-black text-teal-900 text-base sm:text-lg">
                <span className="text-xl">🔊</span>
                <span>قسم نطق الكلمات</span>
                <span className="text-xs bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full font-bold">٢٨ كلمة</span>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs sm:text-sm font-bold text-teal-700/90">
                  اضغط الكلمة أو الحرف لاستماع الصوت 🔊
                </p>
                <button
                  type="button"
                  onClick={() => handleTabChange('pronunciation')}
                  className="px-3 py-1 rounded-xl bg-teal-100 hover:bg-teal-200 text-teal-900 text-xs font-black transition-all cursor-pointer border border-teal-300"
                >
                  ← رجوع
                </button>
              </div>
            </div>

            {/* 1. Letter buttons rows */}
            <LetterNavigationRows />

            {/* 2. SINGLE LARGE CARD FOR CURRENT ACTIVE LETTER */}
            <motion.div
              key={currentLetter.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <LetterCard
                letter={currentLetter.letter}
                letterName={currentLetter.name}
                letterAudioUrl={currentLetter.audio}
                word={currentLetter.basicWord.word}
                subText={currentLetter.basicWord.translation || `كلمة تبدأ بحرف ${currentLetter.letter}`}
                emoji={currentLetter.basicWord.emoji}
                wordAudioUrl={currentLetter.basicWord.audio}
                onPlayAudio={handlePlaySound}
              />
            </motion.div>

            {/* 3. Prev / Next Navigation bar */}
            <div className="flex items-center justify-between bg-white p-3 sm:p-4 rounded-2xl border border-teal-200 shadow-2xs">
              <button
                onClick={handlePrevLetter}
                className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-teal-100 hover:bg-teal-200 active:bg-teal-300 text-teal-900 font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer border border-teal-300/60"
                title="الحرف السابق"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>السابق</span>
              </button>

              <div className="text-center">
                <span className="text-xs sm:text-sm font-black text-teal-900 block">
                  الحرف رقم {currentLetter.id} من ٢٨
                </span>
                <span className="text-[11px] font-bold text-teal-700/80">
                  (حرف {currentLetter.name})
                </span>
              </div>

              <button
                onClick={handleNextLetter}
                className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-teal-100 hover:bg-teal-200 active:bg-teal-300 text-teal-900 font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer border border-teal-300/60"
                title="الحرف التالي"
              >
                <span>التالي</span>
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Harakat (الحركات الثلاث) */}
        {activeTab === 'harakat' && (
          <div className="space-y-5 max-w-4xl mx-auto">
            {/* Header Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-3.5 sm:p-4 rounded-2xl border-2 border-purple-200 shadow-2xs gap-3">
              <div className="flex items-center gap-2 font-black text-purple-900 text-base sm:text-lg">
                <span className="text-xl">✨</span>
                <span>الحركات الثلاثة</span>
                <button
                  type="button"
                  onClick={() => handleTabChange('harakat')}
                  className="mr-2 px-3 py-1 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-black transition-all cursor-pointer border border-purple-300"
                >
                  ← رجوع
                </button>
              </div>

              {/* Harakat Sub-tabs */}
              <div className="flex items-center gap-1.5 bg-purple-50 p-1 rounded-xl border border-purple-200">
                <button
                  type="button"
                  onClick={() => setActiveHaraka('fatha')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    activeHaraka === 'fatha'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-purple-900 hover:bg-purple-100'
                  }`}
                >
                  ☀️ الفتحة ( َ )
                </button>
                <button
                  type="button"
                  onClick={() => setActiveHaraka('kasra')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    activeHaraka === 'kasra'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-purple-900 hover:bg-purple-100'
                  }`}
                >
                  💧 الكسرة ( ِ )
                </button>
                <button
                  type="button"
                  onClick={() => setActiveHaraka('damma')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    activeHaraka === 'damma'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-purple-900 hover:bg-purple-100'
                  }`}
                >
                  🌺 الضمة ( ُ )
                </button>
              </div>
            </div>

            {/* Letter selection rows */}
            <LetterNavigationRows />

            {/* Harakat Details Container for active letter */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl border-2 border-teal-200 shadow-xs space-y-6">
              {/* Main Header */}
              <div className="text-center space-y-2 border-b border-teal-100 pb-3">
                <div className="inline-flex items-center gap-2 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-200">
                  <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="text-sm font-black text-teal-900">
                    الحركات الثلاث لحرف ({currentLetter.letter}) - {currentLetter.name}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-teal-800/80">
                  اضغط الحرف نفسه لسماع صوته بالحركة 🔊 واضغط "استمع للكلمة" لسماع نطق الكلمة
                </p>
              </div>

              {/* 3 HARAKAT CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {/* 1. FATHA CARD */}
                <div className={`bg-white rounded-3xl border-2 border-rose-200 p-5 flex flex-col items-center justify-between text-center space-y-4 shadow-2xs hover:shadow-md hover:border-rose-300 transition-all ${
                  activeHaraka === 'fatha' ? 'ring-4 ring-rose-400 scale-[1.02] shadow-md border-rose-400' : ''
                }`}>
                  {/* Badge Header */}
                  <div className="bg-rose-500 text-white text-xs sm:text-sm font-black px-4 py-1 rounded-full shadow-2xs">
                    الفتحة ( َ ) ☀️
                  </div>

                  {/* Movement Letter Button (الحرف بالحركة هو زر صوت الحركة فقط) */}
                  <button
                    type="button"
                    onClick={() => handlePlaySound(currentLetter.harakat.fatha.audio)}
                    className="w-full py-5 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100/90 active:bg-rose-200 border-2 border-rose-200 transition-all cursor-pointer flex flex-col items-center justify-center group focus:outline-none focus:ring-4 focus:ring-rose-200 active:scale-95"
                    title={`اضغط حرف (${currentLetter.harakat.fatha.symbol}) لسماع صوت الحركة 🔊`}
                    aria-label={`استمع لصوت حركة الفتحة ${currentLetter.harakat.fatha.symbol}`}
                  >
                    <span className="text-5xl sm:text-6xl font-black text-rose-600 drop-shadow-2xs group-hover:scale-110 transition-transform">
                      {currentLetter.harakat.fatha.symbol}
                    </span>
                    <span className="text-[11px] font-bold text-rose-700/90 mt-1">
                      (اضغط الحرف لسماع الحركة) 🔊
                    </span>
                  </button>

                  {/* Word Display */}
                  <div className="space-y-1 my-1 w-full">
                    <div className="text-3xl sm:text-4xl">
                      {currentLetter.harakat.fatha.emoji || '⭐'}
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 truncate px-1">
                      {currentLetter.harakat.fatha.word}
                    </div>
                  </div>

                  {/* Word Audio Button */}
                  <button
                    type="button"
                    onClick={() => handlePlaySound(currentLetter.harakat.fatha.wordAudio)}
                    className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white px-3 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-2xs hover:shadow active:scale-95 transition-all cursor-pointer border border-teal-500"
                    title={`استمع لنطق كلمة ${currentLetter.harakat.fatha.word} 🔊`}
                    aria-label={`استمع لنطق كلمة ${currentLetter.harakat.fatha.word}`}
                  >
                    <Volume2 className="w-4 h-4 shrink-0" />
                    <span>🔊 استمع للكلمة</span>
                  </button>
                </div>

                {/* 2. KASRA CARD */}
                <div className={`bg-white rounded-3xl border-2 border-sky-200 p-5 flex flex-col items-center justify-between text-center space-y-4 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all ${
                  activeHaraka === 'kasra' ? 'ring-4 ring-sky-400 scale-[1.02] shadow-md border-sky-400' : ''
                }`}>
                  {/* Badge Header */}
                  <div className="bg-sky-500 text-white text-xs sm:text-sm font-black px-4 py-1 rounded-full shadow-2xs">
                    الكسرة ( ِ ) 💧
                  </div>

                  {/* Movement Letter Button (الحرف بالحركة هو زر صوت الحركة فقط) */}
                  <button
                    type="button"
                    onClick={() => handlePlaySound(currentLetter.harakat.kasra.audio)}
                    className="w-full py-5 px-3 rounded-2xl bg-sky-50 hover:bg-sky-100/90 active:bg-sky-200 border-2 border-sky-200 transition-all cursor-pointer flex flex-col items-center justify-center group focus:outline-none focus:ring-4 focus:ring-sky-200 active:scale-95"
                    title={`اضغط حرف (${currentLetter.harakat.kasra.symbol}) لسماع صوت الحركة 🔊`}
                    aria-label={`استمع لصوت حركة الكسرة ${currentLetter.harakat.kasra.symbol}`}
                  >
                    <span className="text-5xl sm:text-6xl font-black text-sky-600 drop-shadow-2xs group-hover:scale-110 transition-transform">
                      {currentLetter.harakat.kasra.symbol}
                    </span>
                    <span className="text-[11px] font-bold text-sky-700/90 mt-1">
                      (اضغط الحرف لسماع الحركة) 🔊
                    </span>
                  </button>

                  {/* Word Display */}
                  <div className="space-y-1 my-1 w-full">
                    <div className="text-3xl sm:text-4xl">
                      {currentLetter.harakat.kasra.emoji || '⭐'}
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 truncate px-1">
                      {currentLetter.harakat.kasra.word}
                    </div>
                  </div>

                  {/* Word Audio Button */}
                  <button
                    type="button"
                    onClick={() => handlePlaySound(currentLetter.harakat.kasra.wordAudio)}
                    className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white px-3 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-2xs hover:shadow active:scale-95 transition-all cursor-pointer border border-teal-500"
                    title={`استمع لنطق كلمة ${currentLetter.harakat.kasra.word} 🔊`}
                    aria-label={`استمع لنطق كلمة ${currentLetter.harakat.kasra.word}`}
                  >
                    <Volume2 className="w-4 h-4 shrink-0" />
                    <span>🔊 استمع للكلمة</span>
                  </button>
                </div>

                {/* 3. DAMMA CARD */}
                <div className={`bg-white rounded-3xl border-2 border-purple-200 p-5 flex flex-col items-center justify-between text-center space-y-4 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all ${
                  activeHaraka === 'damma' ? 'ring-4 ring-purple-400 scale-[1.02] shadow-md border-purple-400' : ''
                }`}>
                  {/* Badge Header */}
                  <div className="bg-purple-500 text-white text-xs sm:text-sm font-black px-4 py-1 rounded-full shadow-2xs">
                    الضمة ( ُ ) 🌺
                  </div>

                  {/* Movement Letter Button (الحرف بالحركة هو زر صوت الحركة فقط) */}
                  <button
                    type="button"
                    onClick={() => handlePlaySound(currentLetter.harakat.damma.audio)}
                    className="w-full py-5 px-3 rounded-2xl bg-purple-50 hover:bg-purple-100/90 active:bg-purple-200 border-2 border-purple-200 transition-all cursor-pointer flex flex-col items-center justify-center group focus:outline-none focus:ring-4 focus:ring-purple-200 active:scale-95"
                    title={`اضغط حرف (${currentLetter.harakat.damma.symbol}) لسماع صوت الحركة 🔊`}
                    aria-label={`استمع لصوت حركة الضمة ${currentLetter.harakat.damma.symbol}`}
                  >
                    <span className="text-5xl sm:text-6xl font-black text-purple-600 drop-shadow-2xs group-hover:scale-110 transition-transform">
                      {currentLetter.harakat.damma.symbol}
                    </span>
                    <span className="text-[11px] font-bold text-purple-700/90 mt-1">
                      (اضغط الحرف لسماع الحركة) 🔊
                    </span>
                  </button>

                  {/* Word Display */}
                  <div className="space-y-1 my-1 w-full">
                    <div className="text-3xl sm:text-4xl">
                      {currentLetter.harakat.damma.emoji || '⭐'}
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 truncate px-1">
                      {currentLetter.harakat.damma.word}
                    </div>
                  </div>

                  {/* Word Audio Button */}
                  <button
                    type="button"
                    onClick={() => handlePlaySound(currentLetter.harakat.damma.wordAudio)}
                    className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white px-3 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-2xs hover:shadow active:scale-95 transition-all cursor-pointer border border-teal-500"
                    title={`استمع لنطق كلمة ${currentLetter.harakat.damma.word} 🔊`}
                    aria-label={`استمع لنطق كلمة ${currentLetter.harakat.damma.word}`}
                  >
                    <Volume2 className="w-4 h-4 shrink-0" />
                    <span>🔊 استمع للكلمة</span>
                  </button>
                </div>
              </div>

              {/* Prev / Next Navigation bar */}
              <div className="flex items-center justify-between bg-teal-50/60 p-3 sm:p-4 rounded-2xl border border-teal-200/90 pt-3">
                <button
                  onClick={handlePrevLetter}
                  className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-teal-100 active:bg-teal-200 text-teal-900 font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer border border-teal-300/80 shadow-2xs"
                  title="الحرف السابق"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>السابق</span>
                </button>

                <div className="text-center">
                  <span className="text-xs sm:text-sm font-black text-teal-900 block">
                    الحرف رقم {currentLetter.id} من ٢٨
                  </span>
                  <span className="text-[11px] font-bold text-teal-700/80">
                    (حرف {currentLetter.name})
                  </span>
                </div>

                <button
                  onClick={handleNextLetter}
                  className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-teal-100 active:bg-teal-200 text-teal-900 font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer border border-teal-300/80 shadow-2xs"
                  title="الحرف التالي"
                >
                  <span>التالي</span>
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

