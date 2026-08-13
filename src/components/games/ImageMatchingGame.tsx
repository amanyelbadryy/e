import React, { useState, useEffect } from 'react';
import { GameShell } from './GameShell';
import { GameResult } from './GameResult';
import {
  getImageMatchingDeck,
  ImageMatchingCard,
} from '../../data/games/imageMatchingData';
import { playPositiveFeedback, playNegativeFeedback } from '../../utils/gameHelpers';
import { motion } from 'motion/react';
import { CheckCircle2, Sparkles, Target, Star, RotateCcw } from 'lucide-react';

interface ImageMatchingGameProps {
  onBack: () => void;
  onGoHome?: () => void;
  pairsCount?: number;
}

export const ImageMatchingGame: React.FC<ImageMatchingGameProps> = ({
  onBack,
  onGoHome,
  pairsCount = 10,
}) => {
  const [cards, setCards] = useState<ImageMatchingCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<ImageMatchingCard[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [matchedCount, setMatchedCount] = useState(0);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    setupNewGame();
  }, [pairsCount]);

  const setupNewGame = () => {
    const newDeck = getImageMatchingDeck(pairsCount);
    setCards(newDeck);
    setSelectedCards([]);
    setIsLocked(false);
    setMatchedCount(0);
    setAttemptsCount(0);
    setScore(0);
    setGameFinished(false);
  };

  const handleCardClick = (clickedCard: ImageMatchingCard) => {
    // Prevent clicking if locked, already revealed, matched, or already in selected list
    if (
      isLocked ||
      clickedCard.state !== 'hidden' ||
      selectedCards.length >= 2 ||
      selectedCards.some((c) => c.id === clickedCard.id)
    ) {
      return;
    }

    // Reveal clicked card
    const updatedCards = cards.map((c) =>
      c.id === clickedCard.id ? { ...c, state: 'revealed' as const } : c
    );
    setCards(updatedCards);

    const newSelected = [...selectedCards, clickedCard];
    setSelectedCards(newSelected);

    // If 2 cards are flipped, compare them
    if (newSelected.length === 2) {
      setIsLocked(true);
      setAttemptsCount((prev) => prev + 1);

      const [first, second] = newSelected;

      if (first.pairId === second.pairId) {
        // MATCH FOUND
        playPositiveFeedback();
        setScore((prev) => prev + 10);

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.pairId === first.pairId ? { ...c, state: 'matched' as const } : c
            )
          );
          setSelectedCards([]);
          setIsLocked(false);

          const newMatched = matchedCount + 1;
          setMatchedCount(newMatched);

          if (newMatched >= pairsCount) {
            setGameFinished(true);
          }
        }, 600);
      } else {
        // NO MATCH
        playNegativeFeedback();

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first.id || c.id === second.id
                ? { ...c, state: 'hidden' as const }
                : c
            )
          );
          setSelectedCards([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  const handleRestart = () => {
    setupNewGame();
  };

  if (gameFinished) {
    return (
      <div className="space-y-6 max-w-xl mx-auto dir-rtl">
        <GameResult
          score={score}
          correctCount={matchedCount}
          wrongCount={Math.max(0, attemptsCount - matchedCount)}
          totalQuestions={pairsCount}
          onReplay={handleRestart}
          onOtherGames={onBack}
          onGoHome={onGoHome}
        />
      </div>
    );
  }

  return (
    <GameShell
      title="طابق الصور 🧩"
      icon="🧩"
      currentQuestion={matchedCount}
      totalQuestions={pairsCount}
      score={score}
      correctCount={matchedCount}
      wrongCount={Math.max(0, attemptsCount - matchedCount)}
      onBack={onBack}
      onRestart={handleRestart}
    >
      <div className="bg-white rounded-[40px] p-4 sm:p-6 md:p-8 border-4 border-[#F1F5F9] shadow-xl space-y-6 text-center">
        {/* Header Title & Subtitle */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#E0F2FE] text-[#0369A1] px-4 py-1.5 rounded-full border border-[#BAE6FD] text-xs font-black">
            <Sparkles className="w-4 h-4 text-[#0284C7]" />
            <span>اقلب البطاقات وابحث عن الصورتين المتطابقتين</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-[#1E293B]">
            طَابِقِ الصُّوَرَ المُمَاثِلَةَ! 🧩
          </h3>
        </div>

        {/* Live Counters Banner */}
        <div className="bg-[#FAF5FF] p-3.5 rounded-2xl border-2 border-[#F3E8FF] flex items-center justify-around max-w-lg mx-auto text-sm font-black text-[#6B21A8] shadow-inner">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🧩</span>
            <span>الأزواج: {matchedCount} / {pairsCount}</span>
          </div>
          <div className="h-5 w-0.5 bg-[#E9D5FF]" />
          <div className="flex items-center gap-1.5">
            <span className="text-base">🎯</span>
            <span>المحاولات: {attemptsCount}</span>
          </div>
          <div className="h-5 w-0.5 bg-[#E9D5FF]" />
          <div className="flex items-center gap-1.5">
            <span className="text-base">⭐</span>
            <span>النقاط: {score}</span>
          </div>
        </div>

        {/* 20 Cards Responsive Grid (5 cols Desktop, 4 cols Mobile) */}
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 md:gap-4 max-w-2xl mx-auto pt-2 min-h-[420px] items-center justify-center">
          {cards.map((card) => {
            const isVisible = card.state === 'revealed' || card.state === 'matched';
            const isMatched = card.state === 'matched';

            return (
              <motion.button
                key={card.id}
                whileHover={{ scale: isMatched ? 1 : 1.05 }}
                whileTap={{ scale: isMatched ? 1 : 0.95 }}
                disabled={isMatched || isLocked}
                onClick={() => handleCardClick(card)}
                className={`h-24 sm:h-28 md:h-32 w-full rounded-2xl md:rounded-3xl border-4 font-black transition-all flex flex-col items-center justify-center cursor-pointer shadow-md select-none relative overflow-hidden ${
                  isMatched
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800 opacity-60 scale-95'
                    : isVisible
                    ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#78350F] shadow-lg scale-105'
                    : 'bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] border-[#1D4ED8] text-white hover:brightness-110'
                }`}
              >
                {isVisible ? (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center space-y-1 p-1"
                  >
                    <span className="text-3xl sm:text-4xl md:text-5xl">{card.emoji}</span>
                    <span className="text-[10px] sm:text-xs font-black text-[#78350F] truncate max-w-[70px]">
                      {card.name}
                    </span>
                    {isMatched && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute top-1.5 right-1.5" />
                    )}
                  </motion.div>
                ) : (
                  <span className="text-3xl sm:text-4xl opacity-80">❓</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
};
