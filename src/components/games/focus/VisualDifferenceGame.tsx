import React, { useState, useEffect } from 'react';
import { GameShell } from '../GameShell';
import { GameResult } from '../GameResult';
import { getVisualDifferenceQuestions, VisualDifferenceQuestion } from '../../../data/games/visualDifferenceQuestions';
import { playPositiveFeedback, playNegativeNextQuestionFeedback } from '../../../utils/gameHelpers';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, XCircle } from 'lucide-react';

interface VisualDifferenceGameProps {
  onBack: () => void;
  onGoHome?: () => void;
}

export const VisualDifferenceGame: React.FC<VisualDifferenceGameProps> = ({ onBack, onGoHome }) => {
  const [questions, setQuestions] = useState<VisualDifferenceQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    setupNewGame();
  }, []);

  const setupNewGame = () => {
    const deck = getVisualDifferenceQuestions(10);
    setQuestions(deck);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setSelectedIndex(null);
    setIsAnswered(false);
    setGameFinished(false);
  };

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  const handleCardClick = (item: { emoji: string; isDifferent: boolean }, idx: number) => {
    if (isAnswered) return;

    setSelectedIndex(idx);
    setIsAnswered(true);

    if (item.isDifferent) {
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
        setSelectedIndex(null);
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
      title="ابحث عن المختلف 🔎"
      icon="🔎"
      currentQuestion={currentIndex + 1}
      totalQuestions={questions.length}
      score={score}
      correctCount={correctCount}
      wrongCount={wrongCount}
      onBack={onBack}
      onRestart={setupNewGame}
    >
      <div className="bg-white rounded-[40px] p-6 md:p-8 border-4 border-[#F1F5F9] shadow-xl space-y-8 text-center">
        <div className="inline-flex items-center gap-2 bg-[#FFFBEB] text-[#92400E] px-4 py-1.5 rounded-full border border-[#FDE68A] text-xs font-black">
          <Sparkles className="w-4 h-4 text-[#D97706]" />
          <span>{currentQ.promptText}</span>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto pt-2">
          {currentQ.items.map((item, idx) => {
            const isSelected = selectedIndex === idx;
            const isDifferent = item.isDifferent;

            let btnStyle =
              'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9] hover:border-[#3B82F6] text-[#1E293B]';

            if (isAnswered) {
              if (isDifferent) {
                btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-black scale-105';
              } else if (isSelected && !isDifferent) {
                btnStyle = 'bg-rose-100 border-rose-500 text-rose-900 opacity-75';
              }
            }

            return (
              <motion.button
                key={idx}
                whileHover={{ scale: isAnswered ? 1 : 1.08 }}
                whileTap={{ scale: isAnswered ? 1 : 0.92 }}
                disabled={isAnswered}
                onClick={() => handleCardClick(item, idx)}
                className={`h-32 rounded-3xl border-4 transition-all flex flex-col items-center justify-center cursor-pointer shadow-md relative ${btnStyle}`}
              >
                <span className="text-6xl">{item.emoji}</span>

                {isAnswered && isDifferent && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 absolute top-2 right-2" />
                )}
                {isAnswered && isSelected && !isDifferent && (
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
