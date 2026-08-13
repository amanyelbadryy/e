import React, { useState, useEffect } from 'react';
import { GameShell } from '../GameShell';
import { GameResult } from '../GameResult';
import { getClassificationQuestions, ClassificationQuestion } from '../../../data/games/classificationQuestions';
import { playPositiveFeedback, playNegativeFeedback } from '../../../utils/gameHelpers';
import { motion } from 'motion/react';
import { Layers, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

interface ClassificationGameProps {
  onBack: () => void;
  onGoHome?: () => void;
}

export const ClassificationGame: React.FC<ClassificationGameProps> = ({ onBack, onGoHome }) => {
  const [questions, setQuestions] = useState<ClassificationQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    setupNewGame();
  }, []);

  const setupNewGame = () => {
    const deck = getClassificationQuestions(10);
    setQuestions(deck);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setSelectedEmoji(null);
    setIsAnswered(false);
    setGameFinished(false);
  };

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  const handleOptionClick = (opt: { emoji: string; name: string; isCorrect: boolean }) => {
    if (isAnswered) return;

    setSelectedEmoji(opt.emoji);
    setIsAnswered(true);

    if (opt.isCorrect) {
      playPositiveFeedback();
      setScore((prev) => prev + 10);
      setCorrectCount((prev) => prev + 1);
    } else {
      playNegativeFeedback();
      setWrongCount((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedEmoji(null);
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
      title="صنّف الأشياء 📂"
      icon="📂"
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
            <Layers className="w-4 h-4 text-[#0284C7]" />
            <span>مَهَارَاتُ التَّصْنِيفِ المُمْتِعَةِ</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-[#1E293B]">
            {currentQ.categoryTitle}
          </h3>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto pt-2">
          {currentQ.options.map((opt) => {
            const isSelected = selectedEmoji === opt.emoji;
            const isCorrect = opt.isCorrect;

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
                key={opt.emoji}
                whileHover={{ scale: isAnswered ? 1 : 1.08 }}
                whileTap={{ scale: isAnswered ? 1 : 0.92 }}
                disabled={isAnswered}
                onClick={() => handleOptionClick(opt)}
                className={`p-6 rounded-3xl border-4 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-md relative ${btnStyle}`}
              >
                <span className="text-5xl">{opt.emoji}</span>
                <span className="text-sm font-black">{opt.name}</span>

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
