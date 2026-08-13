import React, { useState } from 'react';
import { getHarakatDeck, HarakatQuestion } from '../../data/games/harakatQuestions';
import { playMP3, playButtonClickSFX } from '../../utils/mp3Player';
import { playPositiveFeedback, playNegativeNextQuestionFeedback } from '../../utils/gameHelpers';
import { GameShell } from './GameShell';
import { GameResult } from './GameResult';
import { Volume2, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HarakatGameProps {
  onBack: () => void;
  onGoHome?: () => void;
}

export const HarakatGame: React.FC<HarakatGameProps> = ({ onBack, onGoHome }) => {
  const TOTAL_QUESTIONS = 10;
  const [questionDeck, setQuestionDeck] = useState<HarakatQuestion[]>(() =>
    getHarakatDeck(TOTAL_QUESTIONS)
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameFinished, setGameFinished] = useState(false);

  const currentItem = questionDeck[questionIndex];

  const harakaNames = {
    fatha: 'الْفَتْحَة ( َ )',
    kasra: 'الْكَسْرَة ( ِ )',
    damma: 'الضَّمَّة ( ُ )',
  };

  const handleSelect = (optType: 'fatha' | 'kasra' | 'damma') => {
    if (selectedType !== null) return;
    playButtonClickSFX();
    setSelectedType(optType);

    if (optType === currentItem.harakaType) {
      setIsCorrect(true);
      setScore((prev) => prev + 10);
      setCorrectCount((prev) => prev + 1);
      playPositiveFeedback();
    } else {
      setIsCorrect(false);
      setWrongCount((prev) => prev + 1);
      playNegativeNextQuestionFeedback();
    }
  };

  const handleNext = () => {
    playButtonClickSFX();
    if (questionIndex + 1 >= TOTAL_QUESTIONS) {
      setGameFinished(true);
    } else {
      setSelectedType(null);
      setIsCorrect(null);
      setQuestionIndex((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    playButtonClickSFX();
    setQuestionDeck(getHarakatDeck(TOTAL_QUESTIONS));
    setQuestionIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setSelectedType(null);
    setIsCorrect(null);
    setGameFinished(false);
  };

  if (gameFinished) {
    return (
      <GameResult
        score={score}
        correctCount={correctCount}
        wrongCount={wrongCount}
        totalQuestions={TOTAL_QUESTIONS}
        onReplay={handleRestart}
        onOtherGames={onBack}
        onGoHome={onGoHome}
      />
    );
  }

  if (!currentItem) return null;

  return (
    <GameShell
      title="لعبة الحركات"
      icon="✏️"
      currentQuestion={questionIndex + 1}
      totalQuestions={TOTAL_QUESTIONS}
      score={score}
      correctCount={correctCount}
      wrongCount={wrongCount}
      onBack={onBack}
      onRestart={handleRestart}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="bg-white rounded-[40px] p-6 md:p-8 border-4 border-[#F1F5F9] shadow-xl flex flex-col justify-between min-h-[580px] md:min-h-[620px] text-center"
        >
          {/* Header */}
          <div className="space-y-2 min-h-[64px]">
            <span className="text-xs font-black bg-[#FEF3C7] text-[#78350F] px-4 py-1.5 rounded-full border border-[#FDE68A] inline-block">
              سؤال {questionIndex + 1} من {TOTAL_QUESTIONS}
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-[#1E293B]">
              اختر شكل الحرف المناسب لـ {harakaNames[currentItem.harakaType]}
            </h3>
            <p className="text-sm font-bold text-[#64748B]">
              استمع إلى النطق واختر رمز الحركة الصحيح!
            </p>
          </div>

          {/* Question Area - Fixed height & centered element */}
          <div className="min-h-[220px] flex items-center justify-center py-2">
            <div className="bg-[#FEF2F2] p-6 rounded-[32px] border-4 border-[#FEE2E2] space-y-4 max-w-sm w-full mx-auto">
              <div className="text-7xl font-extrabold text-[#991B1B]">
                {currentItem.targetSymbol}
              </div>
              <button
                onClick={() => {
                  playButtonClickSFX();
                  playMP3(currentItem.audio);
                }}
                className="bg-[#EF4444] text-white px-6 py-3 rounded-full text-base font-black inline-flex items-center gap-2 shadow-md border-b-4 border-[#DC2626] hover:bg-[#DC2626] cursor-pointer active:scale-95 transition-transform"
              >
                <Volume2 className="w-5 h-5" />
                <span>اسمع صوت الحرف بالحركة</span>
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto w-full min-h-[100px] items-center">
            {currentItem.options.map((opt) => {
              const isSelected = selectedType === opt.type;
              let btnStyle = 'bg-white hover:bg-[#F8FAFC] border-[#E2E8F0] text-[#1E293B]';

              if (isSelected) {
                btnStyle = isCorrect
                  ? 'bg-[#4ADE80] text-white border-[#16A34A] shadow-lg'
                  : 'bg-[#FF6B6B] text-white border-[#DC2626] shadow-lg';
              }

              return (
                <button
                  key={opt.type}
                  disabled={selectedType !== null}
                  onClick={() => handleSelect(opt.type)}
                  className={`p-5 rounded-3xl border-4 font-extrabold text-5xl shadow-md transition-colors cursor-pointer flex items-center justify-center min-h-[88px] ${btnStyle}`}
                >
                  {opt.symbol}
                </button>
              );
            })}
          </div>

          {/* Reserved Result Area - Prevents Layout Shift */}
          <div className="result-area min-h-[130px] flex flex-col items-center justify-center pt-2">
            {selectedType !== null ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-3"
              >
                {isCorrect ? (
                  <div className="p-3.5 bg-[#DCFCE7] text-emerald-950 rounded-2xl border border-[#86EFAC] font-black text-lg flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <span>إجابة صحيحة! ({currentItem.targetSymbol}) هي الحركة الصحيحة 🌟</span>
                  </div>
                ) : (
                  <div className="p-3.5 bg-rose-100 text-rose-950 rounded-2xl border border-rose-300 font-black text-lg flex items-center justify-center gap-2">
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                    <span>حاول مرة أخرى! الإجابة الصحيحة هي ({currentItem.targetSymbol})</span>
                  </div>
                )}

                <button
                  onClick={handleNext}
                  className="bg-[#FFD93D] text-[#5F4B00] px-8 py-3 rounded-full font-black text-lg shadow-lg border-b-4 border-[#EAB308] flex items-center justify-center gap-2 mx-auto hover:bg-[#FACC15] cursor-pointer active:scale-95 transition-transform"
                >
                  <span>السؤال التالي</span>
                  <RotateCcw className="w-5 h-5" />
                </button>
              </motion.div>
            ) : (
              <div className="h-[120px] w-full" />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </GameShell>
  );
};
