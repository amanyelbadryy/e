import React, { useState, useEffect } from 'react';
import { GameShell } from '../GameShell';
import { GameResult } from '../GameResult';
import { getOddOneOutQuestions, OddOneOutQuestion } from '../../../data/games/oddOneOutQuestions';
import { playPositiveFeedback, playNegativeNextQuestionFeedback } from '../../../utils/gameHelpers';
import { motion } from 'motion/react';
import { Search, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

interface OddOneOutGameProps {
  onBack: () => void;
  onGoHome?: () => void;
}

export const OddOneOutGame: React.FC<OddOneOutGameProps> = ({ onBack, onGoHome }) => {
  const [questions, setQuestions] = useState<OddOneOutQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    setupNewGame();
  }, []);

  const setupNewGame = () => {
    const deck = getOddOneOutQuestions(10);
    setQuestions(deck);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setSelectedName(null);
    setIsAnswered(false);
    setGameFinished(false);
  };

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  const handleItemClick = (item: { emoji: string; name: string; isOdd: boolean }) => {
    if (isAnswered) return;

    setSelectedName(item.name);
    setIsAnswered(true);

    if (item.isOdd) {
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
        setSelectedName(null);
        setIsAnswered(false);
      } else {
        setGameFinished(true);
      }
    }, 1400);
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
      title="اكتشف المختلف 🔍"
      icon="🔍"
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
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#E0F2FE] text-[#0369A1] px-4 py-1.5 rounded-full border border-[#BAE6FD] text-xs font-black">
            <Search className="w-4 h-4 text-[#0284C7]" />
            <span>{currentQ.categoryTitle}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-[#1E293B]">
            اخْتَرِ العُنْصُرَ المُخْتَلِفَ الَّذِي لاَ يَنْتَمِي لِلْمَجْمُوعَةِ! 🔍
          </h3>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-2">
          {currentQ.items.map((item) => {
            const isSelected = selectedName === item.name;
            const isOdd = item.isOdd;

            let btnStyle =
              'bg-[#F8FAFC] border-[#E2E8F0] text-[#1E293B] hover:bg-[#F1F5F9] hover:border-[#3B82F6]';

            if (isAnswered) {
              if (isOdd) {
                btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-black scale-105';
              } else if (isSelected && !isOdd) {
                btnStyle = 'bg-rose-100 border-rose-500 text-rose-900 opacity-75';
              }
            }

            return (
              <motion.button
                key={item.name}
                whileHover={{ scale: isAnswered ? 1 : 1.05 }}
                whileTap={{ scale: isAnswered ? 1 : 0.95 }}
                disabled={isAnswered}
                onClick={() => handleItemClick(item)}
                className={`p-6 rounded-3xl border-4 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-md ${btnStyle}`}
              >
                <span className="text-5xl md:text-6xl">{item.emoji}</span>
                <span className="text-base font-black">{item.name}</span>

                {isAnswered && isOdd && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-1" />
                )}
                {isAnswered && isSelected && !isOdd && (
                  <XCircle className="w-6 h-6 text-rose-600 mt-1" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Explanation text on answer */}
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-[#F0FDF4] border-2 border-[#BBF7D0] text-[#166534] rounded-2xl font-black text-sm max-w-md mx-auto"
          >
            💡 {currentQ.explanation}
          </motion.div>
        )}
      </div>
    </GameShell>
  );
};
