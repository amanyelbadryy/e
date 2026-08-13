import React, { useState, useEffect } from 'react';
import { GameShell } from '../GameShell';
import { GameResult } from '../GameResult';
import { getFindImageQuestions, FindImageQuestion } from '../../../data/games/findImageQuestions';
import { playPositiveFeedback, playNegativeFeedback } from '../../../utils/gameHelpers';
import { motion } from 'motion/react';
import { Eye, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

interface FindImageGameProps {
  onBack: () => void;
  onGoHome?: () => void;
}

export const FindImageGame: React.FC<FindImageGameProps> = ({ onBack, onGoHome }) => {
  const [questions, setQuestions] = useState<FindImageQuestion[]>([]);
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
    const deck = getFindImageQuestions(10);
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

  const handleCardClick = (item: { emoji: string; isTarget: boolean }, idx: number) => {
    if (isAnswered) return;

    setSelectedIndex(idx);
    setIsAnswered(true);

    if (item.isTarget) {
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
      title="أين الصورة؟ 👀"
      icon="👀"
      currentQuestion={currentIndex + 1}
      totalQuestions={questions.length}
      score={score}
      correctCount={correctCount}
      wrongCount={wrongCount}
      onBack={onBack}
      onRestart={setupNewGame}
    >
      <div className="bg-white rounded-[40px] p-6 md:p-8 border-4 border-[#F1F5F9] shadow-xl space-y-8 text-center">
        {/* Prompt Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#E0F2FE] text-[#0369A1] px-4 py-1.5 rounded-full border border-[#BAE6FD] text-xs font-black">
            <Eye className="w-4 h-4 text-[#0284C7]" />
            <span>قَوِِّ دِقَّةَ مُلاَحَظَتِكَ!</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-[#1E293B]">
            أَيْنَ صُورَةُ (<span className="text-[#0284C7] underline">{currentQ.targetName} {currentQ.targetEmoji}</span>)؟
          </h3>
        </div>

        {/* 8-Grid of Emojis */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-xl mx-auto pt-2">
          {currentQ.gridEmojis.map((item, idx) => {
            const isSelected = selectedIndex === idx;
            const isTarget = item.isTarget;

            let btnStyle =
              'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9] hover:border-[#3B82F6] text-[#1E293B]';

            if (isAnswered) {
              if (isTarget) {
                btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-black scale-105';
              } else if (isSelected && !isTarget) {
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
                className={`h-24 sm:h-28 rounded-3xl border-4 transition-all flex flex-col items-center justify-center cursor-pointer shadow-md relative ${btnStyle}`}
              >
                <span className="text-4xl sm:text-5xl">{item.emoji}</span>

                {isAnswered && isTarget && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 absolute top-2 right-2" />
                )}
                {isAnswered && isSelected && !isTarget && (
                  <XCircle className="w-5 h-5 text-rose-600 absolute top-2 right-2" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
};
