import React, { useState, useEffect } from 'react';
import { ALPHABET_DATA } from '../../data/alphabetData';
import { getRandomItems, shuffleArray } from '../../data/games/bankUtils';
import { playMP3 } from '../../utils/mp3Player';
import { playPositiveFeedback, playNegativeFeedback } from '../../utils/gameHelpers';
import { GameShell } from './GameShell';
import { GameResult } from './GameResult';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface MatchingGameProps {
  onBack: () => void;
  onGoHome?: () => void;
}

interface CardItem {
  id: string;
  matchId: string;
  display: string;
  subDisplay?: string;
  audio?: string;
}

export const MatchingGame: React.FC<MatchingGameProps> = ({ onBack, onGoHome }) => {
  const PAIRS_PER_ROUND = 5; // 5 pairs per set = 10 cards total per round
  const [roundNumber, setRoundNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const [leftCards, setLeftCards] = useState<CardItem[]>([]);
  const [rightCards, setRightCards] = useState<CardItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<CardItem | null>(null);
  const [selectedRight, setSelectedRight] = useState<CardItem | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    setupNewRound();
  }, [roundNumber]);

  const setupNewRound = () => {
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedIds([]);

    const selectedLetters = getRandomItems(ALPHABET_DATA, PAIRS_PER_ROUND);

    const left: CardItem[] = selectedLetters.map((l) => ({
      id: `left-${l.id}`,
      matchId: `pair-${l.id}`,
      display: l.letter,
      audio: l.audio,
    }));

    const right: CardItem[] = selectedLetters.map((l) => ({
      id: `right-${l.id}`,
      matchId: `pair-${l.id}`,
      display: l.basicWord.emoji,
      subDisplay: l.basicWord.word,
      audio: l.basicWord.audio,
    }));

    setLeftCards(shuffleArray(left));
    setRightCards(shuffleArray(right));
  };

  const handleCardClick = (card: CardItem, isLeftColumn: boolean) => {
    if (matchedIds.includes(card.matchId)) return;

    if (card.audio) {
      playMP3(card.audio);
    }

    if (isLeftColumn) {
      setSelectedLeft(card);
      if (selectedRight) checkPairMatch(card, selectedRight);
    } else {
      setSelectedRight(card);
      if (selectedLeft) checkPairMatch(selectedLeft, card);
    }
  };

  const checkPairMatch = (left: CardItem, right: CardItem) => {
    if (left.matchId === right.matchId) {
      playPositiveFeedback();
      const newMatched = [...matchedIds, left.matchId];
      setMatchedIds(newMatched);
      setSelectedLeft(null);
      setSelectedRight(null);
      setScore((prev) => prev + 10);
      setCorrectCount((prev) => prev + 1);

      if (newMatched.length === PAIRS_PER_ROUND) {
        if (roundNumber >= 2) {
          setGameFinished(true);
        } else {
          setTimeout(() => setRoundNumber((prev) => prev + 1), 1200);
        }
      }
    } else {
      setWrongCount((prev) => prev + 1);
      playNegativeFeedback();
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 1000);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setRoundNumber(1);
    setGameFinished(false);
    setupNewRound();
  };

  if (gameFinished) {
    return (
      <GameResult
        score={score}
        correctCount={correctCount}
        wrongCount={wrongCount}
        totalQuestions={10}
        onReplay={handleRestart}
        onOtherGames={onBack}
        onGoHome={onGoHome}
      />
    );
  }

  return (
    <GameShell
      title="لعبة المطابقة"
      icon="🃏"
      currentQuestion={correctCount + 1}
      totalQuestions={10}
      score={score}
      correctCount={correctCount}
      wrongCount={wrongCount}
      onBack={onBack}
      onRestart={handleRestart}
    >
      <div className="bg-white rounded-[40px] p-6 md:p-8 border-4 border-[#F1F5F9] shadow-xl space-y-6 text-center">
        <div className="space-y-2">
          <span className="text-xs font-black bg-[#FDE8E8] text-[#9B1C1C] px-4 py-1.5 rounded-full border border-[#FBD5D5]">
            الجولة {roundNumber} من 2 (مطابقة الحرف مع الصورة)
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-[#1E293B]">
            طَابِقْ بَيْنَ الحَرْفِ وَالصُّورَةِ المُنَاسِبَةِ!
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto pt-2">
          {/* Left Column (Letters) */}
          <div className="space-y-3">
            <h4 className="text-base font-black text-[#64748B]">🔤 الحروف</h4>
            {leftCards.map((card) => {
              const isMatched = matchedIds.includes(card.matchId);
              const isSelected = selectedLeft?.id === card.id;

              return (
                <motion.button
                  key={card.id}
                  whileHover={{ scale: isMatched ? 1 : 1.03 }}
                  whileTap={{ scale: isMatched ? 1 : 0.97 }}
                  disabled={isMatched}
                  onClick={() => handleCardClick(card, true)}
                  className={`w-full p-4 rounded-3xl border-4 font-black text-4xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isMatched
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-800 opacity-60'
                      : isSelected
                      ? 'bg-[#FFD93D] border-[#EAB308] text-[#5F4B00] border-b-8 scale-105 shadow-lg'
                      : 'bg-white hover:bg-[#F8FAFC] border-[#E2E8F0] text-[#1E293B]'
                  }`}
                >
                  <span>{card.display}</span>
                  {isMatched && <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                </motion.button>
              );
            })}
          </div>

          {/* Right Column (Emojis / Pictures) */}
          <div className="space-y-3">
            <h4 className="text-base font-black text-[#64748B]">🖼️ الصور</h4>
            {rightCards.map((card) => {
              const isMatched = matchedIds.includes(card.matchId);
              const isSelected = selectedRight?.id === card.id;

              return (
                <motion.button
                  key={card.id}
                  whileHover={{ scale: isMatched ? 1 : 1.03 }}
                  whileTap={{ scale: isMatched ? 1 : 0.97 }}
                  disabled={isMatched}
                  onClick={() => handleCardClick(card, false)}
                  className={`w-full p-4 rounded-3xl border-4 font-black text-3xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isMatched
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-800 opacity-60'
                      : isSelected
                      ? 'bg-[#FFD93D] border-[#EAB308] text-[#5F4B00] border-b-8 scale-105 shadow-lg'
                      : 'bg-white hover:bg-[#F8FAFC] border-[#E2E8F0] text-[#1E293B]'
                  }`}
                >
                  <span>{card.display}</span>
                  {card.subDisplay && <span className="text-sm font-extrabold text-[#475569]">{card.subDisplay}</span>}
                  {isMatched && <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </GameShell>
  );
};
