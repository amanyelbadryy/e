import React, { useState, useEffect } from 'react';
import { generate100NumberQuizQuestions, NumberQuizQuestion } from '../../data/games/numberQuizQuestions';
import { playMP3, playButtonClickSFX } from '../../utils/mp3Player';
import { playPositiveFeedback, playNegativeNextQuestionFeedback } from '../../utils/gameHelpers';
import { GameShell } from '../games/GameShell';
import { GameResult } from '../games/GameResult';
import { Volume2, Sparkles, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NumberQuizSectionProps {
  onBack: () => void;
  onGoHome?: () => void;
}

export const NumberQuizSection: React.FC<NumberQuizSectionProps> = ({ onBack, onGoHome }) => {
  const [questions, setQuestions] = useState<NumberQuizQuestion[]>(() => generate100NumberQuizQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);

  const currentQuestion = questions[currentIndex];

  // Auto-play audio when entering a listening type question
  useEffect(() => {
    if (!isProcessingAnswer && currentQuestion && currentQuestion.type === 'listen' && currentQuestion.audio) {
      playMP3(currentQuestion.audio);
    }
  }, [currentIndex, currentQuestion, isProcessingAnswer]);

  const handleRestartQuiz = () => {
    playButtonClickSFX();
    // Generate fresh shuffled 100 questions and reset all state
    setQuestions(generate100NumberQuizQuestions());
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerCorrect(null);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setIsFinished(false);
    setIsProcessingAnswer(false);
  };

  const handleSelectOption = async (option: string) => {
    if (selectedOption !== null || isProcessingAnswer) return; // Prevent double clicking

    setIsProcessingAnswer(true);
    setSelectedOption(option);
    const correct = option === currentQuestion.correctAnswer;
    setIsAnswerCorrect(correct);

    let feedbackPromise: Promise<void>;
    if (correct) {
      setScore((prev) => prev + 10);
      setCorrectCount((prev) => prev + 1);
      feedbackPromise = playPositiveFeedback();
    } else {
      setWrongCount((prev) => prev + 1);
      feedbackPromise = playNegativeNextQuestionFeedback();
    }

    // Wait for feedback audio to finish completely via onended
    await feedbackPromise;

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerCorrect(null);
      setIsProcessingAnswer(false);
    } else {
      setIsFinished(true);
      setIsProcessingAnswer(false);
    }
  };

  if (isFinished) {
    return (
      <GameResult
        score={score}
        correctCount={correctCount}
        wrongCount={wrongCount}
        totalQuestions={questions.length}
        onReplay={handleRestartQuiz}
        onOtherGames={onBack}
        onGoHome={onGoHome}
      />
    );
  }

  return (
    <GameShell
      title="🎯 اختبر نفسك في الأرقام"
      description="اختبار شامل وعشوائي لتقييم معرفتك بالأرقام والعد"
      icon="🎯"
      currentQuestion={currentIndex + 1}
      totalQuestions={questions.length}
      score={score}
      correctCount={correctCount}
      wrongCount={wrongCount}
      onBack={onBack}
      onRestart={handleRestartQuiz}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white p-6 md:p-8 rounded-[36px] border-4 border-teal-200 shadow-xl space-y-6 text-center"
        >
          {/* Question Header & Prompt */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-950 px-4 py-1.5 rounded-full font-black text-xs border border-teal-300">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>اختبار الأرقام التفاعلي</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-relaxed">
              {currentQuestion.prompt}
            </h3>

            {currentQuestion.subPrompt && (
              <p className="text-xs md:text-sm font-bold text-teal-800">
                {currentQuestion.subPrompt}
              </p>
            )}
          </div>

          {/* Special Visual display for Type 2 (Count Group) */}
          {currentQuestion.type === 'count_group' && currentQuestion.emojis && (
            <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-200 flex flex-wrap items-center justify-center gap-3 max-w-lg mx-auto">
              {currentQuestion.emojis.map((e, idx) => (
                <span key={idx} className="text-5xl md:text-6xl drop-shadow-sm hover:scale-110 transition-transform">
                  {e}
                </span>
              ))}
            </div>
          )}

          {/* Special Audio Button for Type 3 (Listen) */}
          {currentQuestion.type === 'listen' && currentQuestion.audio && (
            <div className="py-2 flex justify-center">
              <button
                onClick={() => {
                  playButtonClickSFX();
                  playMP3(currentQuestion.audio!);
                }}
                className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-8 py-4 rounded-2xl font-black text-xl flex items-center gap-3 shadow-lg shadow-teal-200 active:scale-95 transition-all border-2 border-white cursor-pointer animate-pulse"
              >
                <Volume2 className="w-7 h-7" />
                <span>🔊 اسمع الرقم</span>
              </button>
            </div>
          )}

          {/* Options Display Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-2xl mx-auto pt-2">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrectOpt = option === currentQuestion.correctAnswer;

              let btnStyle = 'bg-white hover:bg-teal-50 border-teal-200 text-slate-900 shadow-sm';

              if (selectedOption !== null) {
                if (isSelected) {
                  if (isAnswerCorrect) {
                    btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-lg ring-4 ring-emerald-200 scale-105';
                  } else {
                    btnStyle = 'bg-rose-500 text-white border-rose-600 shadow-lg ring-4 ring-rose-200 scale-105';
                  }
                } else if (isCorrectOpt) {
                  btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                } else {
                  btnStyle = 'bg-slate-100 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option)}
                  disabled={selectedOption !== null || isProcessingAnswer}
                  className={`p-5 rounded-3xl border-4 font-black transition-all text-2xl flex items-center justify-center min-h-[90px] cursor-pointer ${btnStyle}`}
                >
                  <span className="leading-snug">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Answer Feedback Indicator */}
          {selectedOption !== null && (
            <div className="pt-2 flex items-center justify-center gap-2 font-black text-lg">
              {isAnswerCorrect ? (
                <span className="text-emerald-600 flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <span>إجابة صحيحة! أحسنت 🌟</span>
                </span>
              ) : (
                <span className="text-rose-600 flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-2xl border border-rose-200">
                  <XCircle className="w-6 h-6 text-rose-600" />
                  <span>إجابة خاطئة! سننتقل للسؤال التالي...</span>
                </span>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </GameShell>
  );
};
