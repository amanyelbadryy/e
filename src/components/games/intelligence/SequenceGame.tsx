import React, { useState, useEffect } from 'react';
import { GameShell } from '../GameShell';
import { GameResult } from '../GameResult';
import { getSequenceQuestions, SequenceQuestion } from '../../../data/games/sequenceQuestions';
import { playPositiveFeedback, playNegativeNextQuestionFeedback } from '../../../utils/gameHelpers';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';

interface SequenceGameProps {
  onBack: () => void;
  onGoHome?: () => void;
}

export const SequenceGame: React.FC<SequenceGameProps> = ({ onBack, onGoHome }) => {
  const [questions, setQuestions] = useState<SequenceQuestion[]>([]);
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
    const deck = getSequenceQuestions(10);
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

  const handleOptionClick = (opt: { emoji: string; name: string }) => {
    if (isAnswered) return;

    setSelectedEmoji(opt.emoji);
    setIsAnswered(true);

    if (opt.emoji === currentQ.correctEmoji) {
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
      title="رتب الأحداث 🔗"
      icon="🔗"
      currentQuestion={currentIndex + 1}
      totalQuestions={questions.length}
      score={score}
      correctCount={correctCount}
      wrongCount={wrongCount}
      onBack={onBack}
      onRestart={setupNewGame}
    >
      <div className="bg-white rounded-[40px] p-6 md:p-8 border-4 border-[#F1F5F9] shadow-xl space-y-8 text-center">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#F0FDF4] text-[#166534] px-4 py-1.5 rounded-full border border-[#BBF7D0] text-xs font-black">
            <Sparkles className="w-4 h-4 text-[#16A34A]" />
            <span>{currentQ.title}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-[#1E293B]">
            اخْتَرِ الخُطْوَةَ القَادِمَةَ الصَّحِيحَةَ لِإِكْمَالِ التَّرْتِيبِ! 🔗
          </h3>
        </div>

        {/* Sequence steps preview */}
        <motion.div
          key={currentQ.id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#F8FAFC] p-6 rounded-3xl border-4 border-[#E2E8F0] shadow-inner flex items-center justify-center gap-2 sm:gap-4 flex-wrap max-w-2xl mx-auto"
        >
          {currentQ.stepsDisplay.map((step, idx) => (
            <React.Fragment key={idx}>
              <div
                className={`px-4 py-3 rounded-2xl flex items-center justify-center text-lg sm:text-xl font-black shadow-sm border-2 ${
                  step.includes('❓')
                    ? 'bg-amber-100 border-amber-400 text-amber-900 animate-pulse'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                {step.includes('❓') && isAnswered
                  ? `${currentQ.correctEmoji} ${currentQ.correctName}`
                  : step}
              </div>
              {idx < currentQ.stepsDisplay.length - 1 && (
                <ArrowLeft className="w-5 h-5 text-slate-400 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-2">
          {currentQ.options.map((opt) => {
            const isSelected = selectedEmoji === opt.emoji;
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
                onClick={() => handleOptionClick(opt)}
                className={`p-5 rounded-3xl border-4 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-md ${btnStyle}`}
              >
                <span className="text-5xl">{opt.emoji}</span>
                <span className="text-sm font-black">{opt.name}</span>

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
