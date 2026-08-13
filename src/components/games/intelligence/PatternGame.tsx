import React, { useState, useEffect } from 'react';
import { GameShell } from '../GameShell';
import { GameResult } from '../GameResult';
import { getPatternQuestions, PatternQuestion } from '../../../data/games/patternQuestions';
import { playPositiveFeedback, playNegativeNextQuestionFeedback } from '../../../utils/gameHelpers';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, XCircle } from 'lucide-react';

interface PatternGameProps {
  onBack: () => void;
  onGoHome?: () => void;
}

export const PatternGame: React.FC<PatternGameProps> = ({ onBack, onGoHome }) => {
  const [questions, setQuestions] = useState<PatternQuestion[]>([]);
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
    const deck = getPatternQuestions(10);
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
      title="أكمل النمط 🧠"
      icon="🧠"
      currentQuestion={currentIndex + 1}
      totalQuestions={questions.length}
      score={score}
      correctCount={correctCount}
      wrongCount={wrongCount}
      onBack={onBack}
      onRestart={setupNewGame}
    >
      <div className="bg-white rounded-[40px] p-6 md:p-8 border-4 border-[#F1F5F9] shadow-xl space-y-8 text-center">
        <div className="inline-flex items-center gap-2 bg-[#FAF5FF] text-[#6B21A8] px-4 py-1.5 rounded-full border border-[#F3E8FF] text-xs font-black">
          <Sparkles className="w-4 h-4 text-[#9333EA]" />
          <span>لاَحِظِ التَّسَلْسُلَ ثُمَّ اخْتَرِ العُنْصُرَ المُنَاسِبَ لِعَلاَمَةِ الاسْتِفْهَامِ!</span>
        </div>

        {/* Pattern Display Strip */}
        <motion.div
          key={currentQ.id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#F8FAFC] p-6 rounded-3xl border-4 border-[#E2E8F0] shadow-inner flex items-center justify-center gap-3 flex-wrap max-w-2xl mx-auto"
        >
          {currentQ.patternDisplay.map((item, idx) => (
            <div
              key={idx}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-sm border-2 ${
                item === '❓'
                  ? 'bg-amber-100 border-amber-400 text-amber-800 font-black animate-pulse'
                  : 'bg-white border-slate-200'
              }`}
            >
              {item === '❓' && isAnswered ? currentQ.correctEmoji : item}
            </div>
          ))}
        </motion.div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto pt-2">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt;
            const isCorrect = opt === currentQ.correctEmoji;

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
                key={opt}
                whileHover={{ scale: isAnswered ? 1 : 1.05 }}
                whileTap={{ scale: isAnswered ? 1 : 0.95 }}
                disabled={isAnswered}
                onClick={() => handleOptionClick(opt)}
                className={`p-6 rounded-3xl border-4 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-md ${btnStyle}`}
              >
                <span className="text-5xl">{opt}</span>

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
