import React, { useState } from 'react';
import { getWordPictureDeck, WordPictureQuestion } from '../../data/games/wordPictureQuestions';
import { playMP3 } from '../../utils/mp3Player';
import { playPositiveFeedback, playNegativeNextQuestionFeedback } from '../../utils/gameHelpers';
import { GameShell } from './GameShell';
import { GameResult } from './GameResult';
import { Volume2, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WordPictureGameProps {
  onBack: () => void;
  onGoHome?: () => void;
}

export const WordPictureGame: React.FC<WordPictureGameProps> = ({ onBack, onGoHome }) => {
  const TOTAL_QUESTIONS = 10;
  const [questionDeck, setQuestionDeck] = useState<WordPictureQuestion[]>(() =>
    getWordPictureDeck(TOTAL_QUESTIONS)
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameFinished, setGameFinished] = useState(false);

  const currentItem = questionDeck[questionIndex];

  const handleSelect = (wordChoice: string) => {
    if (selectedWord !== null) return;
    setSelectedWord(wordChoice);

    if (wordChoice === currentItem.correctWord) {
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
    if (questionIndex + 1 >= TOTAL_QUESTIONS) {
      setGameFinished(true);
    } else {
      setSelectedWord(null);
      setIsCorrect(null);
      setQuestionIndex((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    setQuestionDeck(getWordPictureDeck(TOTAL_QUESTIONS));
    setQuestionIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setSelectedWord(null);
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
      title="لعبة الكلمة والصورة"
      icon="📖"
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
              اختر الكلمة المناسبة لهذه الصورة!
            </h3>
          </div>

          {/* Question Area - Fixed height & centered element */}
          <div className="min-h-[220px] flex items-center justify-center py-2">
            <div className="bg-[#FFFBEB] p-6 rounded-[32px] border-4 border-[#FEF3C7] space-y-4 max-w-sm w-full mx-auto shadow-inner">
              <div className="text-8xl">{currentItem.emoji}</div>
              <button
                onClick={() => playMP3(currentItem.audio)}
                className="bg-[#F59E0B] text-white px-6 py-2.5 rounded-full text-base font-black inline-flex items-center gap-2 shadow-md border-b-4 border-[#D97706] hover:bg-[#D97706] cursor-pointer active:scale-95 transition-transform"
              >
                <Volume2 className="w-5 h-5" />
                <span>اسمع الصوت</span>
              </button>
            </div>
          </div>

          {/* Options Grid (Words) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto w-full min-h-[100px] items-center">
            {currentItem.options.map((opt, idx) => {
              const isSelected = selectedWord === opt;
              let btnStyle = 'bg-white hover:bg-[#F8FAFC] border-[#E2E8F0] text-[#1E293B]';

              if (isSelected) {
                btnStyle = isCorrect
                  ? 'bg-[#4ADE80] text-white border-[#16A34A] shadow-lg'
                  : 'bg-[#FF6B6B] text-white border-[#DC2626] shadow-lg';
              }

              return (
                <button
                  key={`${opt}-${idx}`}
                  disabled={selectedWord !== null}
                  onClick={() => handleSelect(opt)}
                  className={`p-5 rounded-3xl border-4 font-black text-3xl shadow-md transition-colors cursor-pointer flex items-center justify-center min-h-[72px] ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Reserved Result Area - Prevents Layout Shift */}
          <div className="result-area min-h-[130px] flex flex-col items-center justify-center pt-2">
            {selectedWord !== null ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-3"
              >
                {isCorrect ? (
                  <div className="p-3.5 bg-[#DCFCE7] text-emerald-950 rounded-2xl border border-[#86EFAC] font-black text-lg flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <span>إجابة صحيحة! الكلمة هي ({currentItem.correctWord}) 🌟</span>
                  </div>
                ) : (
                  <div className="p-3.5 bg-rose-100 text-rose-950 rounded-2xl border border-rose-300 font-black text-lg flex items-center justify-center gap-2">
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                    <span>حاول مجدداً! الكلمة الصحيحة هي ({currentItem.correctWord})</span>
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
