import React, { useState, useEffect } from 'react';
import { GameShell } from '../GameShell';
import { GameResult } from '../GameResult';
import { playPositiveFeedback, playNegativeFeedback } from '../../../utils/gameHelpers';
import { shuffleArray, getRandomItems } from '../../../data/games/bankUtils';
import { motion } from 'motion/react';
import { Brain, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

const MEMORY_POOL = [
  { emoji: '🍎', name: 'التفاحة' },
  { emoji: '🍌', name: 'الموزة' },
  { emoji: '🚗', name: 'السيارة' },
  { emoji: '🚀', name: 'الصاروخ' },
  { emoji: '🌸', name: 'الوردة' },
  { emoji: '🦁', name: 'الأسد' },
  { emoji: '⚽', name: 'الكرة' },
  { emoji: '⭐', name: 'النجمة' },
  { emoji: '🐥', name: 'الكتكوت' },
  { emoji: '🎈', name: 'البالون' },
  { emoji: '🐘', name: 'الفيل' },
  { emoji: '🐟', name: 'السمكة' },
  { emoji: '🍇', name: 'العنب' },
  { emoji: '✈️', name: 'الطائرة' },
  { emoji: '📕', name: 'الكتاب' },
  { emoji: '🐝', name: 'النحلة' },
  { emoji: '🍓', name: 'الفراولة' },
  { emoji: '🐰', name: 'الأرنب' },
  { emoji: '🐮', name: 'البقرة' },
  { emoji: '🚂', name: 'القطار' },
  { emoji: '🍊', name: 'البرتقالة' },
  { emoji: '🎁', name: 'الهدية' },
  { emoji: '🎂', name: 'الكعكة' },
  { emoji: '🍦', name: 'الآيس كريم' },
  { emoji: '🍉', name: 'البطيخ' },
  { emoji: '🍍', name: 'الأناناس' },
  { emoji: '🐵', name: 'القرد' },
  { emoji: '🚢', name: 'السفينة' },
  { emoji: '🚌', name: 'الحافلة' },
  { emoji: '👟', name: 'الحذاء' },
  { emoji: '☂️', name: 'المظلة' },
  { emoji: '🔑', name: 'المفتاح' },
  { emoji: '⏰', name: 'الساعة' },
  { emoji: '💍', name: 'الخاتم' },
  { emoji: '👑', name: 'التاج' },
  { emoji: '🍕', name: 'البيتزا' },
  { emoji: '🍔', name: 'البرجر' },
  { emoji: '🍪', name: 'البسكويت' },
  { emoji: '🍩', name: 'الدونات' },
  { emoji: '🐸', name: 'الضفدع' },
  { emoji: '🦆', name: 'البطة' },
  { emoji: '🦋', name: 'الفراشة' },
  { emoji: '🐬', name: 'الدلفين' },
  { emoji: '🌙', name: 'القمر' },
  { emoji: '☀️', name: 'الشمس' },
  { emoji: '🐻', name: 'الدب' },
  { emoji: '🚲', name: 'الدراجة' },
  { emoji: '✏️', name: 'القلم' },
  { emoji: '🥑', name: 'الأفوكادو' },
  { emoji: '🍒', name: 'الكرز' },
];

interface FlashMemoryRound {
  id: string;
  cards: { id: number; emoji: string; name: string }[];
  target: { emoji: string; name: string };
}

interface FlashMemoryGameProps {
  onBack: () => void;
  onGoHome?: () => void;
}

export const FlashMemoryGame: React.FC<FlashMemoryGameProps> = ({ onBack, onGoHome }) => {
  const [rounds, setRounds] = useState<FlashMemoryRound[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isRevealed, setIsRevealed] = useState(true);
  const [timer, setTimer] = useState(3);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    setupNewGame();
  }, []);

  const setupNewGame = () => {
    const generatedRounds: FlashMemoryRound[] = [];
    const targets = getRandomItems(MEMORY_POOL, 10);
    for (let i = 0; i < 10; i++) {
      const target = targets[i];
      const wrongs = MEMORY_POOL.filter((item) => item.emoji !== target.emoji);
      const selectedWrongs = getRandomItems(wrongs, 3);
      const selectedItems = [target, ...selectedWrongs];

      generatedRounds.push({
        id: `round_${i}_${Date.now()}`,
        cards: shuffleArray(
          selectedItems.map((item, idx) => ({ id: idx, emoji: item.emoji, name: item.name }))
        ),
        target,
      });
    }

    setRounds(generatedRounds);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    startRoundTimer();
    setGameFinished(false);
  };

  const startRoundTimer = () => {
    setIsRevealed(true);
    setTimer(3);
    setSelectedCardId(null);
    setIsAnswered(false);
  };

  useEffect(() => {
    if (gameFinished || !isRevealed) return;

    if (timer > 0) {
      const timeout = setTimeout(() => setTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(timeout);
    } else {
      setIsRevealed(false);
    }
  }, [timer, isRevealed, gameFinished]);

  if (rounds.length === 0) return null;

  const currentRound = rounds[currentIndex];

  const handleCardClick = (card: { id: number; emoji: string; name: string }) => {
    if (isRevealed || isAnswered) return;

    setSelectedCardId(card.id);
    setIsAnswered(true);

    if (card.emoji === currentRound.target.emoji) {
      playPositiveFeedback();
      setScore((prev) => prev + 10);
      setCorrectCount((prev) => prev + 1);
    } else {
      playNegativeFeedback();
      setWrongCount((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex + 1 < rounds.length) {
        setCurrentIndex((prev) => prev + 1);
        startRoundTimer();
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
        totalQuestions={rounds.length}
        onReplay={setupNewGame}
        onOtherGames={onBack}
        onGoHome={onGoHome}
      />
    );
  }

  return (
    <GameShell
      title="تذكر البطاقات 🧠"
      icon="🧠"
      currentQuestion={currentIndex + 1}
      totalQuestions={rounds.length}
      score={score}
      correctCount={correctCount}
      wrongCount={wrongCount}
      onBack={onBack}
      onRestart={setupNewGame}
    >
      <div className="bg-white rounded-[40px] p-6 md:p-8 border-4 border-[#F1F5F9] shadow-xl space-y-8 text-center">
        {/* Banner Header */}
        <div className="space-y-2">
          {isRevealed ? (
            <div className="inline-flex items-center gap-2 bg-[#FEF3C7] text-[#78350F] px-5 py-2 rounded-full border border-[#FDE68A] text-xs font-black animate-bounce">
              <Brain className="w-4 h-4 text-amber-500" />
              <span>احْفَظْ أَمَاكِنَ الصُّوَرِ جَيِّداً! مُتَبَقِّي ({timer}) ثَوَانٍ...</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-[#E0F2FE] text-[#0369A1] px-5 py-2 rounded-full border border-[#BAE6FD] text-xs font-black">
              <Sparkles className="w-4 h-4 text-[#0284C7]" />
              <span>أَيْنَ كَانَتْ صُورَةُ ({currentRound.target.name} {currentRound.target.emoji})؟</span>
            </div>
          )}
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto pt-2">
          {currentRound.cards.map((card) => {
            const showContent = isRevealed || isAnswered || selectedCardId === card.id;
            const isCorrect = card.emoji === currentRound.target.emoji;
            const isSelected = selectedCardId === card.id;

            let btnStyle =
              'bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] border-[#1D4ED8] text-white hover:brightness-110';

            if (showContent) {
              if (isAnswered && isCorrect) {
                btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-black scale-105';
              } else if (isAnswered && isSelected && !isCorrect) {
                btnStyle = 'bg-rose-100 border-rose-500 text-rose-900 opacity-75';
              } else {
                btnStyle = 'bg-[#FEF3C7] border-[#FDE68A] text-[#78350F] font-black';
              }
            }

            return (
              <motion.button
                key={card.id}
                whileHover={{ scale: isRevealed || isAnswered ? 1 : 1.05 }}
                whileTap={{ scale: isRevealed || isAnswered ? 1 : 0.95 }}
                disabled={isRevealed || isAnswered}
                onClick={() => handleCardClick(card)}
                className={`h-32 rounded-3xl border-4 transition-all flex flex-col items-center justify-center cursor-pointer shadow-md relative overflow-hidden ${btnStyle}`}
              >
                {showContent ? (
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center justify-center space-y-1"
                  >
                    <span className="text-5xl">{card.emoji}</span>
                    <span className="text-xs font-black">{card.name}</span>
                  </motion.div>
                ) : (
                  <span className="text-4xl">❓</span>
                )}

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
