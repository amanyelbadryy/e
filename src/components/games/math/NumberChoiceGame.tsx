import React, { useState, useEffect } from 'react';
import { GameShell } from '../GameShell';
import { GameResult } from '../GameResult';
import { getNumberChoiceQuestions, NumberChoiceQuestion } from '../../../data/games/mathQuestions';
import { playPositiveFeedback, playNegativeNextQuestionFeedback } from '../../../utils/gameHelpers';
import { motion } from 'motion/react';
import { Hash, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

interface NumberChoiceGameProps {
  onBack: () => void;
  onGoHome?: () => void;
}

export const NumberChoiceGame: React.FC<NumberChoiceGameProps> = ({ onBack, onGoHome }) => {
  const [questions, setQuestions] = useState<NumberChoiceQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selectedDigit, setSelectedDigit] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    setupNewGame();
  }, []);

  const setupNewGame = () => {
    const deck = getNumberChoiceQuestions(10);
    setQuestions(deck);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setSelectedDigit(null);
    setIsAnswered(false);
    setGameFinished(false);
  };

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  const handleOptionClick = (digit: string) => {
    if (isAnswered) return;

    setSelectedDigit(digit);
    setIsAnswered(true);

    if (digit === currentQ.correctDigit) {
      playPositiveFeedback();
      setScore((prev) => prev + 10);
      setCorrectCount((prev) => prev + 1);
    } else {
      playNegativeNextQuestionFeedback();
      setWrongCount((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedDigit(null);
        setIsAnswered(false);
      } else {
        setGameFinished(true);
      }
    }, 1200);
  };

  if (gameFinished) {
    return (
      <GameResult
        score={score}
        correctCount={correctCount}
        wrongCount={wrongCount}
        totalQuestions={questions.length}
        onReplay={setupNewGame}
        onOtherGames={onBack}
        onGoHome={onGoHome}
      />
    );
  }

  return (
    <GameShell
      title="اختر الرقم الصحيح 🔢"
      icon="🔢"
      currentQuestion={currentIndex + 1}
      totalQuestions={questions.length}
      score={score}
      correctCount={correctCount}
      wrongCount={wrongCount}
      onBack={onBack}
      onRestart={setupNewGame}
    >
      <div className="bg-white rounded-[40px] p-6 md:p-8 border-4 border-[#F1F5F9] shadow-xl space-y-8 text-center">
        {/* Banner Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#E0F2FE] text-[#0369A1] px-4 py-1.5 rounded-full border border-[#BAE6FD] text-xs font-black">
            <Sparkles className="w-4 h-4 text-[#0284C7]" />
            <span>عَالَمُ الأَرْقَامِ المُمْتِعِ</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-[#1E293B]">
            {currentQ.prompt}
          </h3>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto pt-2">
          {currentQ.options.map((digit) => {
            const isSelected = selectedDigit === digit;
            const isCorrect = digit === currentQ.correctDigit;

            let btnStyle =
              'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9] hover:border-[#3B82F6] text-[#1E293B]';

            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-black scale-105';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-rose-100 border-rose-500 text-rose-900 opacity-75';
              }
            }

            return (
              <motion.button
                key={digit}
                whileHover={{ scale: isAnswered ? 1 : 1.08 }}
                whileTap={{ scale: isAnswered ? 1 : 0.92 }}
                disabled={isAnswered}
                onClick={() => handleOptionClick(digit)}
                className={`h-28 rounded-3xl border-4 transition-all flex flex-col items-center justify-center cursor-pointer shadow-md relative ${btnStyle}`}
              >
                <span className="text-5xl font-black">{digit}</span>

                {isAnswered && isCorrect && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 absolute top-2 right-2" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-6 h-6 text-rose-600 absolute top-2 right-2" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
};
