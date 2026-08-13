import React, { useState, useEffect } from 'react';
import { ALPHABET_DATA } from '../../data/alphabetData';
import { getRandomItems, shuffleArray } from '../../data/games/bankUtils';
import { playMP3 } from '../../utils/mp3Player';
import { playPositiveFeedback, playNegativeFeedback } from '../../utils/gameHelpers';
import { GameShell } from './GameShell';
import { GameResult } from './GameResult';
import { motion } from 'motion/react';

interface MemoryGameProps {
  onBack: () => void;
  onGoHome?: () => void;
}

interface MemoryCard {
  id: string;
  pairId: string;
  display: string;
  subText?: string;
  audio?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ onBack, onGoHome }) => {
  const PAIRS_COUNT = 6; // 12 cards grid
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<MemoryCard[]>([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    setupBoard();
  }, []);

  const setupBoard = () => {
    const selectedLetters = getRandomItems(ALPHABET_DATA, PAIRS_COUNT);

    const deck: MemoryCard[] = [];

    selectedLetters.forEach((l) => {
      deck.push({
        id: `card-letter-${l.id}`,
        pairId: `pair-${l.id}`,
        display: l.letter,
        audio: l.audio,
        isFlipped: false,
        isMatched: false,
      });

      deck.push({
        id: `card-picture-${l.id}`,
        pairId: `pair-${l.id}`,
        display: l.basicWord.emoji,
        subText: l.basicWord.word,
        audio: l.basicWord.audio,
        isFlipped: false,
        isMatched: false,
      });
    });

    setCards(shuffleArray(deck));
    setFlippedCards([]);
  };

  const handleCardClick = (clickedCard: MemoryCard) => {
    if (clickedCard.isFlipped || clickedCard.isMatched || flippedCards.length >= 2) return;

    if (clickedCard.audio) {
      playMP3(clickedCard.audio);
    }

    const updatedCards = cards.map((c) => (c.id === clickedCard.id ? { ...c, isFlipped: true } : c));
    setCards(updatedCards);

    const newFlipped = [...flippedCards, clickedCard];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (first.pairId === second.pairId) {
        playPositiveFeedback();
        setScore((prev) => prev + 10);
        setCorrectCount((prev) => prev + 1);

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.pairId === first.pairId ? { ...c, isMatched: true } : c))
          );
          setFlippedCards([]);

          const remainingUnmatched = updatedCards.filter((c) => !c.isMatched && c.pairId !== first.pairId);
          if (remainingUnmatched.length === 0) {
            setGameFinished(true);
          }
        }, 800);
      } else {
        setWrongCount((prev) => prev + 1);
        playNegativeFeedback();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === first.id || c.id === second.id ? { ...c, isFlipped: false } : c))
          );
          setFlippedCards([]);
        }, 1200);
      }
    }
  };

  const handleRestart = () => {
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setGameFinished(false);
    setupBoard();
  };

  if (gameFinished) {
    return (
      <GameResult
        score={score}
        correctCount={correctCount}
        wrongCount={wrongCount}
        totalQuestions={PAIRS_COUNT}
        onReplay={handleRestart}
        onOtherGames={onBack}
        onGoHome={onGoHome}
      />
    );
  }

  return (
    <GameShell
      title="لعبة الذاكرة"
      icon="🧠"
      currentQuestion={correctCount + 1}
      totalQuestions={PAIRS_COUNT}
      score={score}
      correctCount={correctCount}
      wrongCount={wrongCount}
      onBack={onBack}
      onRestart={handleRestart}
    >
      <div className="bg-white rounded-[40px] p-6 md:p-8 border-4 border-[#F1F5F9] shadow-xl space-y-6 text-center">
        <div className="space-y-2">
          <span className="text-xs font-black bg-[#E0F2FE] text-[#0369A1] px-4 py-1.5 rounded-full border border-[#BAE6FD]">
            اقلب البطاقات وابحث عن الأزواج المتطابقة
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-[#1E293B]">
            اِبْحَثْ عَنْ الحَرْفِ وَصُورَتِهِ المُنَاسِبَةِ!
          </h3>
        </div>

        {/* 12 Memory Cards Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-2">
          {cards.map((card) => {
            const isVisible = card.isFlipped || card.isMatched;

            return (
              <motion.button
                key={card.id}
                whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
                whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
                disabled={card.isMatched}
                onClick={() => handleCardClick(card)}
                className={`h-28 md:h-32 rounded-3xl border-4 font-black transition-all flex flex-col items-center justify-center cursor-pointer shadow-md ${
                  card.isMatched
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800 opacity-60 scale-95'
                    : isVisible
                    ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#78350F] shadow-lg scale-105'
                    : 'bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] border-[#1D4ED8] text-white hover:brightness-110'
                }`}
              >
                {isVisible ? (
                  <div className="space-y-1">
                    <span className="text-4xl md:text-5xl">{card.display}</span>
                    {card.subText && (
                      <div className="text-xs font-extrabold text-[#78350F]">{card.subText}</div>
                    )}
                  </div>
                ) : (
                  <span className="text-4xl">❓</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
};
