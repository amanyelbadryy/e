import React, { useState, useEffect } from 'react';
import { GameShell } from '../GameShell';
import { GameResult } from '../GameResult';
import { getAddSubtractQuestions, AddSubtractQuestion } from '../../../data/games/addSubtractQuestions';
import { playPositiveFeedback, playNegativeNextQuestionFeedback } from '../../../utils/gameHelpers';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, XCircle, Calculator } from 'lucide-react';

interface AddSubtractGameProps {
  onBack: () => void;
  onGoHome?: () => void;
}

export const AddSubtractGame: React.FC<AddSubtractGameProps> = ({ onBack, onGoHome }) => {
  const [questions, setQuestions] = useState<AddSubtractQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    setupNewGame();
  }, []);

  const setupNewGame = () => {
    const deck = getAddSubtractQuestions(10);
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

  const handleOptionClick = (option: number) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQ.correctAnswer) {
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
      title="الجمع والطرح ➕➖"
      icon="➕"
      currentQuestion={currentIndex + 1}
      totalQuestions={questions.length}
      score={score}
      correctCount={correctCount}
      wrongCount={wrongCount}
      onBack={onBack}
      onRestart={setupNewGame}
    >
      <div className="bg-white rounded-[40px] p-6 md:p-8 border-4 border-[#F1F5F9] shadow-xl space-y-8 text-center">
        <div className="inline-flex items-center gap-2 bg-[#ECFDF5] text-[#065F46] px-4 py-1.5 rounded-full border border-[#A7F3D0] text-xs font-black">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span>حُلَّ المَسْأَلَةَ الحِسَابِيَّةَ وَاخْتَرِ الإِجَابَةَ الصَّحِيحَةَ!</span>
        </div>

        {/* Question Display Container */}
        <div className="bg-[#F8FAFC] border-4 border-[#E2E8F0] p-6 md:p-8 rounded-[32px] space-y-4">
          <div className="flex items-center justify-center gap-2 text-emerald-600 font-black text-sm">
            <Calculator className="w-5 h-5" />
            <span>{currentQ.type === 'add' ? 'مَسْأَلَةُ جَمْعٍ' : 'مَسْأَلَةُ طَرِحٍ'}</span>
          </div>

          {/* Visual Prompt if available */}
          {currentQ.visualPrompt && (
            <div className="text-3xl md:text-4xl font-extrabold tracking-wider text-[#1E293B] dir-ltr bg-white py-3 px-6 rounded-2xl border-2 border-[#CBD5E1] inline-block shadow-inner">
              {currentQ.visualPrompt}
            </div>
          )}

          {/* Numeric Equation */}
          <div className="text-4xl md:text-5xl font-black text-[#1E293B] dir-ltr">
            {currentQ.numPrompt}
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === currentQ.correctAnswer;

            let buttonStyle = 'bg-white text-[#1E293B] border-4 border-[#F1F5F9] hover:border-[#10B981] hover:bg-[#F0FDF4]';

            if (isAnswered) {
              if (isCorrect) {
                buttonStyle = 'bg-[#10B981] text-white border-4 border-[#047857] shadow-lg scale-105';
              } else if (isSelected) {
                buttonStyle = 'bg-[#EF4444] text-white border-4 border-[#B91C1C]';
              } else {
                buttonStyle = 'bg-[#F8FAFC] text-[#94A3B8] border-4 border-[#E2E8F0] opacity-50';
              }
            }

            return (
              <motion.button
                key={`${option}_${idx}`}
                whileHover={{ scale: isAnswered ? 1 : 1.05 }}
                whileTap={{ scale: isAnswered ? 1 : 0.95 }}
                disabled={isAnswered}
                onClick={() => handleOptionClick(option)}
                className={`py-6 px-4 rounded-3xl font-black text-3xl md:text-4xl transition-all cursor-pointer flex items-center justify-center gap-3 relative shadow-md ${buttonStyle}`}
              >
                <span>{option}</span>

                {isAnswered && isCorrect && (
                  <CheckCircle2 className="w-7 h-7 text-white absolute left-4" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-7 h-7 text-white absolute left-4" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
};
