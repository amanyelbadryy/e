import React, { useState, useEffect } from 'react';
import { GameShell } from '../GameShell';
import { GameResult } from '../GameResult';
import { getPuzzleQuestions, PuzzleQuestion } from '../../../data/games/puzzleQuestions';
import { playPositiveFeedback, playNegativeNextQuestionFeedback } from '../../../utils/gameHelpers';
import { motion } from 'motion/react';
import { HelpCircle, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

interface PuzzleGameProps {
  onBack: () => void;
  onGoHome?: () => void;
}

export const PuzzleGame: React.FC<PuzzleGameProps> = ({ onBack, onGoHome }) => {
  const [questions, setQuestions] = useState<PuzzleQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    setupNewGame();
  }, []);

  const setupNewGame = () => {
    const deck = getPuzzleQuestions(10);
    setQuestions(deck);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setGameFinished(false);
  };

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  const handleOptionClick = (optionEmoji: string) => {
    if (isAnswered) return;

    setSelectedOption(optionEmoji);
    setIsAnswered(true);

    if (optionEmoji === currentQ.correctEmoji) {
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
        setSelectedOption(null);
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
      title="حل اللغز 🧩"
      icon="🧩"
      currentQuestion={currentIndex + 1}
      totalQuestions={questions.length}
      score={score}
      correctCount={correctCount}
      wrongCount={wrongCount}
      onBack={onBack}
      onRestart={setupNewGame}
    >
      <div className="bg-white rounded-[40px] p-6 md:p-8 border-4 border-[#F1F5F9] shadow-xl space-y-8 text-center">
        {/* Banner header */}
        <div className="inline-flex items-center gap-2 bg-[#FEF3C7] text-[#78350F] px-4 py-1.5 rounded-full border border-[#FDE68A] text-xs font-black">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>اسْتَمِعْ إِلَى اللُّغْزِ وَاخْتَرِ الإِجَابَةَ الصَّحِيحَةَ!</span>
        </div>

        {/* Riddle Card */}
        <motion.div
          key={currentQ.id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] p-6 md:p-8 rounded-3xl border-4 border-[#BFDBFE] shadow-inner space-y-4 max-w-2xl mx-auto"
        >
          <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-md border-2 border-[#93C5FD]">
            <HelpCircle className="w-8 h-8 text-[#2563EB]" />
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-[#1E3A8A] leading-relaxed">
            "{currentQ.riddle}"
          </h3>
        </motion.div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-2">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt.emoji;
            const isCorrect = opt.emoji === currentQ.correctEmoji;

            let btnStyle =
              'bg-[#F8FAFC] border-[#E2E8F0] text-[#1E293B] hover:bg-[#F1F5F9] hover:border-[#3B82F6]';

            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-black scale-105';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-rose-100 border-rose-500 text-rose-900 opacity-75';
              }
            }

            return (
              <motion.button
                key={opt.emoji}
                whileHover={{ scale: isAnswered ? 1 : 1.05 }}
                whileTap={{ scale: isAnswered ? 1 : 0.95 }}
                disabled={isAnswered}
                onClick={() => handleOptionClick(opt.emoji)}
                className={`p-5 rounded-3xl border-4 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-md ${btnStyle}`}
              >
                <span className="text-5xl">{opt.emoji}</span>
                <span className="text-base font-black">{opt.name}</span>

                {isAnswered && isCorrect && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-1" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-6 h-6 text-rose-600 mt-1" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
};
