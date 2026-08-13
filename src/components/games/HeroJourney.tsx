import React, { useState, useEffect } from 'react';
import { GameShell } from './GameShell';
import { GameResult } from './GameResult';
import { playPositiveFeedback, playNegativeNextQuestionFeedback, playNextStageFeedback } from '../../utils/gameHelpers';
import { ALPHABET_DATA } from '../../data/alphabetData';
import { NUMBERS_DATA } from '../../data/numbersData';
import { playMP3, playGameLevelUpSFX, playSuccessLevelPassedSFX, playButtonClickSFX, stopPronunciationAudio } from '../../utils/mp3Player';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, ArrowRight, ShieldCheck, Sparkles, Award, Lock, CheckCircle2, RotateCcw, Home, Volume2 } from 'lucide-react';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface HeroJourneyProps {
  onBack: () => void;
  onGoHome: () => void;
  onAddStars?: (amount: number) => void;
}

export const HeroJourney: React.FC<HeroJourneyProps> = ({ onBack, onGoHome, onAddStars }) => {
  const TOTAL_STAGES = 100;
  const TOTAL_QUESTIONS_PER_STAGE = 10;

  // View state: 'grid' (100 stages overview) or 'playing' (active stage)
  const [viewMode, setViewMode] = useState<'grid' | 'playing'>('grid');
  const [stageNonce, setStageNonce] = useState<number>(0);

  // Stages completion state & stars rating persistence
  const [completedStages, setCompletedStages] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('alab_hero_completed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [stageStars, setStageStars] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('alab_hero_stars');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Current playing stage & questions state
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [stageCorrectCount, setStageCorrectCount] = useState<number>(0);
  const [stageWrongCount, setStageWrongCount] = useState<number>(0);
  const [stageFinished, setStageFinished] = useState(false);
  const [journeyFinished, setJourneyFinished] = useState(false);
  const [earnedStarsCurrentRun, setEarnedStarsCurrentRun] = useState<number>(0);
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);

  // Save progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('alab_hero_completed', JSON.stringify(completedStages));
    } catch (e) {
      console.error(e);
    }
  }, [completedStages]);

  useEffect(() => {
    try {
      localStorage.setItem('alab_hero_stars', JSON.stringify(stageStars));
    } catch (e) {
      console.error(e);
    }
  }, [stageStars]);

  // Helper to pad index numbers
  const formatIndex = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  // Generate exactly 10 unique non-repeating questions per stage with randomized letter/number distribution
  const generateStageQuestions = (stage: number) => {
    const questions = [];

    // Shuffle entire alphabet and numbers for this stage instance
    const stageLetters = shuffleArray(ALPHABET_DATA);
    const stageNumbers = shuffleArray(NUMBERS_DATA);

    // Helper to get 3 random incorrect letter names
    const get3OtherNames = (currentId: number) => {
      const others = ALPHABET_DATA.filter((l) => l.id !== currentId);
      return shuffleArray(others).slice(0, 3).map((l) => l.name);
    };

    // Helper to get 3 random incorrect letter symbols
    const get3OtherLetters = (currentId: number) => {
      const others = ALPHABET_DATA.filter((l) => l.id !== currentId);
      return shuffleArray(others).slice(0, 3).map((l) => l.letter);
    };

    // Helper to get 3 random incorrect basic word + emoji
    const get3OtherWords = (currentId: number) => {
      const others = ALPHABET_DATA.filter((l) => l.id !== currentId);
      return shuffleArray(others).slice(0, 3).map((l) => `${l.basicWord.word} ${l.basicWord.emoji}`);
    };

    for (let q = 1; q <= TOTAL_QUESTIONS_PER_STAGE; q++) {
      const qId = `stage${stage}-question${formatIndex(q)}`;

      if (q === 1) {
        const letterObj = stageLetters[0];
        questions.push({
          id: qId,
          prompt: `المرحلة ${stage} — السؤال ${q}: ما اسم الحرف (${letterObj.letter})؟`,
          correctOption: letterObj.name,
          options: shuffleArray([letterObj.name, ...get3OtherNames(letterObj.id)]),
          audioUrl: letterObj.audio
        });
      } else if (q === 2) {
        const letterObj = stageLetters[1];
        questions.push({
          id: qId,
          prompt: `المرحلة ${stage} — السؤال ${q}: ما الكلمة المناسبة لـ (${letterObj.name})؟`,
          correctOption: `${letterObj.basicWord.word} ${letterObj.basicWord.emoji}`,
          options: shuffleArray([
            `${letterObj.basicWord.word} ${letterObj.basicWord.emoji}`,
            ...get3OtherWords(letterObj.id)
          ]),
          audioUrl: letterObj.basicWord.audio
        });
      } else if (q === 3) {
        const letterObj = stageLetters[2];
        const otherL = stageLetters[8];
        questions.push({
          id: qId,
          prompt: `المرحلة ${stage} — السؤال ${q}: ما صوت الحرف (${letterObj.letter}) بـالفتحة؟`,
          correctOption: letterObj.harakat.fatha.symbol,
          options: shuffleArray([
            letterObj.harakat.fatha.symbol,
            letterObj.harakat.kasra.symbol,
            letterObj.harakat.damma.symbol,
            otherL.harakat.fatha.symbol
          ]),
          audioUrl: letterObj.harakat.fatha.audio
        });
      } else if (q === 4) {
        const letterObj = stageLetters[3];
        const otherL = stageLetters[9];
        questions.push({
          id: qId,
          prompt: `المرحلة ${stage} — السؤال ${q}: ما صوت الحرف (${letterObj.letter}) بـالكسرة؟`,
          correctOption: letterObj.harakat.kasra.symbol,
          options: shuffleArray([
            letterObj.harakat.kasra.symbol,
            letterObj.harakat.fatha.symbol,
            letterObj.harakat.damma.symbol,
            otherL.harakat.kasra.symbol
          ]),
          audioUrl: letterObj.harakat.kasra.audio
        });
      } else if (q === 5) {
        const letterObj = stageLetters[4];
        const otherL = stageLetters[10] || stageLetters[0];
        questions.push({
          id: qId,
          prompt: `المرحلة ${stage} — السؤال ${q}: ما صوت الحرف (${letterObj.letter}) بـالضمة؟`,
          correctOption: letterObj.harakat.damma.symbol,
          options: shuffleArray([
            letterObj.harakat.damma.symbol,
            letterObj.harakat.fatha.symbol,
            letterObj.harakat.kasra.symbol,
            otherL.harakat.damma.symbol
          ]),
          audioUrl: letterObj.harakat.damma.audio
        });
      } else if (q === 6) {
        const letterObj = stageLetters[5];
        questions.push({
          id: qId,
          prompt: `المرحلة ${stage} — السؤال ${q}: الكلمة (${letterObj.harakat.fatha.word}) تحتوي على الحركة:`,
          correctOption: 'الفتحة َ',
          options: shuffleArray(['الفتحة َ', 'الكسرة ِ', 'الضمة ُ', 'السكون ْ']),
          audioUrl: letterObj.harakat.fatha.wordAudio
        });
      } else if (q === 7) {
        const numObj = stageNumbers[0];
        questions.push({
          id: qId,
          prompt: `المرحلة ${stage} — السؤال ${q}: كم عدد النجوم في هذه المجموعة؟ (${'⭐'.repeat(Math.max(1, numObj.number))})`,
          correctOption: String(numObj.number),
          options: shuffleArray(
            [
              String(numObj.number),
              String(Math.max(0, numObj.number - 1)),
              String(numObj.number + 1),
              String(numObj.number + 2)
            ].filter((v, i, a) => a.indexOf(v) === i)
          ),
          audioUrl: numObj.audio
        });
      } else if (q === 8) {
        const letterObj = stageLetters[6];
        questions.push({
          id: qId,
          prompt: `المرحلة ${stage} — السؤال ${q}: ما الحرف الأول في كلمة (${letterObj.basicWord.word})؟`,
          correctOption: letterObj.letter,
          options: shuffleArray([letterObj.letter, ...get3OtherLetters(letterObj.id)]),
          audioUrl: letterObj.audio
        });
      } else if (q === 9) {
        const a = ((stage * 3 + q * 2) % 5) + 1;
        const b = ((q * 4) % 5) + 1;
        const ans = a + b;
        questions.push({
          id: qId,
          prompt: `المرحلة ${stage} — السؤال ${q}: احسب المجموع: (${a} + ${b}) = ؟`,
          correctOption: String(ans),
          options: shuffleArray([String(ans), String(ans + 1), String(Math.max(0, ans - 1)), String(ans + 2)].filter((v, i, a) => a.indexOf(v) === i))
        });
      } else {
        const letterObj = stageLetters[7];
        questions.push({
          id: qId,
          prompt: `المرحلة ${stage} — السؤال ${q}: الكلمة (${letterObj.harakat.kasra.word}) تحتوي على الحركة:`,
          correctOption: 'الكسرة ِ',
          options: shuffleArray(['الكسرة ِ', 'الفتحة َ', 'الضمة ُ', 'السكون ْ']),
          audioUrl: letterObj.harakat.kasra.wordAudio
        });
      }
    }

    const shuffledQuestions = shuffleArray(questions);
    return shuffledQuestions.map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
  };

  const currentQuestions = React.useMemo(() => generateStageQuestions(currentStage), [currentStage, stageNonce]);
  const currentQ = currentQuestions[questionIndex];

  // Auto-play question audio when entering a question
  useEffect(() => {
    if (viewMode === 'playing' && !stageFinished && !isProcessingAnswer && currentQ && currentQ.audioUrl) {
      playMP3(currentQ.audioUrl);
    }
  }, [viewMode, questionIndex, currentQ, isProcessingAnswer, stageFinished]);

  // Play audio when entering stage (Stage 1 = no audio, Stage 2..100 = 05_elmarhala_eltalya.mp3)
  const startPlayingStage = async (stageNum: number) => {
    stopPronunciationAudio();
    playButtonClickSFX();
    setIsProcessingAnswer(true);
    setCurrentStage(stageNum);
    setStageNonce((prev) => prev + 1);
    setQuestionIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setStageCorrectCount(0);
    setStageWrongCount(0);
    setStageFinished(false);
    setViewMode('playing');

    if (stageNum > 1) {
      await playNextStageFeedback();
    }
    setIsProcessingAnswer(false);
  };

  const isStageUnlocked = (stageNum: number) => {
    if (stageNum === 1) return true;
    return completedStages.includes(stageNum - 1);
  };

  const handleSelectOption = async (option: string) => {
    if (selectedOption !== null || isProcessingAnswer) return;

    setIsProcessingAnswer(true);
    playButtonClickSFX();
    setSelectedOption(option);

    const correct = option === currentQ.correctOption;
    setIsCorrect(correct);

    let feedbackPromise: Promise<void>;
    let updatedCorrectCount = stageCorrectCount;
    let updatedWrongCount = stageWrongCount;

    if (correct) {
      updatedCorrectCount = stageCorrectCount + 1;
      setStageCorrectCount(updatedCorrectCount);
      feedbackPromise = playPositiveFeedback();
    } else {
      updatedWrongCount = stageWrongCount + 1;
      setStageWrongCount(updatedWrongCount);
      feedbackPromise = playNegativeNextQuestionFeedback();
    }

    // Wait for feedback audio to finish completely via onended
    await feedbackPromise;

    if (questionIndex + 1 < currentQuestions.length) {
      setQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setIsProcessingAnswer(false);
    } else {
      // Stage finished
      stopPronunciationAudio();
      const totalCorrect = updatedCorrectCount;
      let starsEarned = 1; // Default at least 1 star for completing
      if (totalCorrect >= 9) starsEarned = 3;
      else if (totalCorrect >= 6) starsEarned = 2;

      setEarnedStarsCurrentRun(starsEarned);

      if (!completedStages.includes(currentStage)) {
        setCompletedStages((prev) => [...prev, currentStage]);
      }

      setStageStars((prev) => ({
        ...prev,
        [currentStage]: Math.max(prev[currentStage] || 0, starsEarned)
      }));

      if (onAddStars) {
        onAddStars(starsEarned);
      }

      setStageFinished(true);
      playGameLevelUpSFX();
      setIsProcessingAnswer(false);
    }
  };

  const handleNextQuestion = () => {
    playButtonClickSFX();
    if (questionIndex + 1 < currentQuestions.length) {
      setQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      // Stage finished
      stopPronunciationAudio();
      const totalCorrect = stageCorrectCount + (isCorrect ? 1 : 0);
      let starsEarned = 1; // Default at least 1 star for completing
      if (totalCorrect >= 9) starsEarned = 3;
      else if (totalCorrect >= 6) starsEarned = 2;

      setEarnedStarsCurrentRun(starsEarned);

      if (!completedStages.includes(currentStage)) {
        setCompletedStages((prev) => [...prev, currentStage]);
      }

      setStageStars((prev) => ({
        ...prev,
        [currentStage]: Math.max(prev[currentStage] || 0, starsEarned)
      }));

      if (onAddStars) {
        onAddStars(starsEarned);
      }

      setStageFinished(true);
      playGameLevelUpSFX();
    }
  };

  const handleNextStage = () => {
    playButtonClickSFX();
    if (currentStage < TOTAL_STAGES) {
      startPlayingStage(currentStage + 1);
    } else {
      setJourneyFinished(true);
      playSuccessLevelPassedSFX();
    }
  };

  const totalEarnedStars: number = Object.values(stageStars).reduce<number>((acc, curr) => acc + (Number(curr) || 0), 0);

  // Render Journey Finished Screen
  if (journeyFinished) {
    return (
      <GameResult
        score={totalEarnedStars * 10}
        correctCount={completedStages.length * TOTAL_QUESTIONS_PER_STAGE}
        wrongCount={0}
        onRestart={() => {
          setJourneyFinished(false);
          setViewMode('grid');
        }}
        onBack={() => setViewMode('grid')}
        onGoHome={onGoHome}
      />
    );
  }

  // Render 100 Stages Overview Grid View
  if (viewMode === 'grid') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 pb-28 space-y-6 dir-rtl">
        {/* Main Hero Header */}
        <section className="bg-gradient-to-r from-amber-500 via-orange-500 to-teal-600 rounded-[36px] p-6 md:p-8 border-4 border-amber-300 shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-right">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black border border-white/30 text-amber-100">
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>المغامرة الكبرى للطفل البطل</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black flex items-center justify-center md:justify-start gap-3 drop-shadow-sm">
              <Trophy className="w-10 h-10 text-amber-200 animate-bounce" />
              <span>🏆 رِحْلَةُ الأَبْطَالِ (100 مَرْحَلَةٍ)</span>
            </h2>
            <p className="text-sm md:text-base font-bold text-amber-100 max-w-xl leading-relaxed">
              تَحَدَّ ذَكَاءَكَ وَاجْتَازِ المَرَاحِلَ المُتَتَالِيَةَ لِتَفْتَحَ المَرَاحِلَ القَادِمَةَ وَتَجْمَعَ جَمِيعَ النُّجُومِ! (10 أسئلة لكل مرحلة)
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 justify-center md:justify-start">
              <button
                onClick={onBack}
                className="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-2xl font-black text-sm transition-all flex items-center gap-2 cursor-pointer border border-white/30"
              >
                <span>العودة للرئيسية</span>
                <Home className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20 text-center">
              <div className="flex items-center justify-center gap-1.5 text-3xl font-black text-amber-200">
                <Star className="w-7 h-7 fill-amber-300 text-amber-300 animate-pulse" />
                <span>{totalEarnedStars}</span>
              </div>
              <p className="text-xs font-bold text-amber-100 mt-1">مجموع النجوم المكتسبة</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20 text-center">
              <div className="flex items-center justify-center gap-1.5 text-3xl font-black text-emerald-200">
                <CheckCircle2 className="w-7 h-7 text-emerald-300" />
                <span>{completedStages.length} / {TOTAL_STAGES}</span>
              </div>
              <p className="text-xs font-bold text-amber-100 mt-1">المراحل المكتملة</p>
            </div>
          </div>
        </section>

        {/* 100 Stages Grid */}
        <div className="bg-white p-6 rounded-[32px] border-4 border-amber-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xl font-black text-teal-950 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-500" />
              <span>خريطة المراحل الـ 100 (اختر مرحلة مفتوحة):</span>
            </h3>
            <span className="text-xs font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              انقر على المرحلة المفتوحة لبدء اللعب
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 max-h-[600px] overflow-y-auto p-1 scrollbar-thin">
            {Array.from({ length: TOTAL_STAGES }, (_, idx) => idx + 1).map((s) => {
              const unlocked = isStageUnlocked(s);
              const isCompleted = completedStages.includes(s);
              const stars = stageStars[s] || 0;

              return (
                <button
                  key={s}
                  onClick={() => unlocked && startPlayingStage(s)}
                  disabled={!unlocked}
                  className={`relative flex flex-col items-center justify-center py-3 px-2 rounded-2xl font-black text-base transition-all duration-200 border-2 cursor-pointer ${
                    unlocked
                      ? isCompleted
                        ? 'bg-gradient-to-b from-emerald-50 to-teal-100 border-emerald-400 text-teal-950 shadow-sm hover:scale-105 hover:shadow-md'
                        : 'bg-gradient-to-b from-amber-50 to-amber-100 border-amber-400 text-amber-950 shadow-sm hover:scale-105 hover:shadow-md ring-2 ring-amber-300'
                      : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>{s}</span>
                    {!unlocked && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                  </div>

                  {unlocked && (
                    <div className="flex items-center gap-0.5 mt-1">
                      {isCompleted ? (
                        Array.from({ length: 3 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < stars
                                ? 'text-amber-500 fill-amber-400'
                                : 'text-slate-300 fill-slate-200'
                            }`}
                          />
                        ))
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700">مفتوحة 🔓</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active Stage Play Mode
  return (
    <GameShell
      title={`🏆 رحلة الأبطال — المرحلة ${currentStage} من 100`}
      description="اجتاز الـ 100 مرحلة واجمع النجوم والوسامات لتصبح البطل الخارق!"
      icon="🏆"
      currentQuestion={questionIndex + 1}
      totalQuestions={TOTAL_QUESTIONS_PER_STAGE}
      score={stageCorrectCount * 10}
      correctCount={stageCorrectCount}
      wrongCount={stageWrongCount}
      onBack={() => setViewMode('grid')}
      onRestart={() => startPlayingStage(currentStage)}
    >
      <div className="space-y-6">
        {/* Top Bar: Return to Map & Mini Stage Selector */}
        <div className="bg-white p-4 rounded-3xl border-2 border-teal-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className="bg-teal-50 hover:bg-teal-100 text-teal-800 px-4 py-2 rounded-2xl font-black text-xs border border-teal-200 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لخريطة المراحل الـ 100</span>
            </button>

            <span className="text-xs font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
              المرحلة الحالية: {currentStage} / 100 (السؤال {questionIndex + 1} من {TOTAL_QUESTIONS_PER_STAGE})
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {Array.from({ length: TOTAL_STAGES }, (_, idx) => idx + 1).map((s) => {
              const unlocked = isStageUnlocked(s);
              const isCurrent = s === currentStage;
              const isDone = completedStages.includes(s);

              return (
                <button
                  key={s}
                  onClick={() => unlocked && startPlayingStage(s)}
                  disabled={!unlocked}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs shrink-0 transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-500 scale-105 shadow-md'
                      : isDone
                      ? 'bg-emerald-500 text-white'
                      : unlocked
                      ? 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                      : 'bg-slate-100 text-slate-400 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {s} {!unlocked && '🔒'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stage Question Card or Completion Banner */}
        {!stageFinished ? (
          <div className="bg-white p-8 rounded-3xl border-4 border-teal-200 shadow-md space-y-6 text-center">
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-slate-900 leading-relaxed">
                {currentQ.prompt}
              </h3>

              {currentQ.audioUrl && (
                <button
                  disabled={isProcessingAnswer}
                  onClick={() => {
                    if (isProcessingAnswer) return;
                    playButtonClickSFX();
                    if (currentQ.audioUrl) playMP3(currentQ.audioUrl);
                  }}
                  className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-full font-black text-sm transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>استمع للصوت 🔊</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption === opt;
                let btnStyle = 'bg-slate-50 hover:bg-teal-50 border-slate-200 text-slate-900';

                if (isSelected) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-lg scale-105';
                  } else {
                    btnStyle = 'bg-rose-500 text-white border-rose-600 shadow-lg scale-105';
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(opt)}
                    disabled={selectedOption !== null || isProcessingAnswer}
                    className={`p-5 rounded-2xl font-black text-2xl border-4 transition-all shadow-sm active:scale-95 cursor-pointer ${btnStyle} ${
                      selectedOption !== null || isProcessingAnswer ? 'cursor-not-allowed opacity-80' : ''
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {selectedOption && !isProcessingAnswer && (
              <div className="pt-4 flex justify-center">
                <button
                  onClick={handleNextQuestion}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3.5 rounded-2xl font-black text-base shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{questionIndex + 1 < TOTAL_QUESTIONS_PER_STAGE ? 'السؤال التالي' : 'عرض النتيجة'}</span>
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-amber-500 to-teal-600 p-8 rounded-3xl text-white text-center space-y-5 shadow-xl border-4 border-amber-300">
            <Award className="w-16 h-16 text-amber-200 mx-auto animate-bounce" />
            <h3 className="text-3xl font-black">أحسنت يا بطل! أتممت المرحلة {currentStage} بنجاح! 🌟</h3>

            <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-md py-3 px-6 rounded-2xl w-fit mx-auto border border-white/30">
              <span className="font-black text-lg">النجوم المكتسبة:</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 3 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-7 h-7 ${
                      i < earnedStarsCurrentRun
                        ? 'text-amber-300 fill-amber-300 animate-pulse'
                        : 'text-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-sm font-bold text-amber-100">
              تم فتح المرحلة التالية تلقائيًا في رحلة الأبطال (100 مرحلة)!
            </p>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleNextStage}
                className="bg-white text-teal-950 hover:bg-amber-100 px-8 py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>الانتقال للمرحلة التالية ({currentStage + 1})</span>
                <ArrowRight className="w-6 h-6 rotate-180" />
              </button>

              <button
                onClick={() => setViewMode('grid')}
                className="bg-black/20 hover:bg-black/30 text-white px-6 py-4 rounded-2xl font-black text-base border border-white/30 cursor-pointer transition-all active:scale-95"
              >
                العودة لخريطة المراحل
              </button>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};
