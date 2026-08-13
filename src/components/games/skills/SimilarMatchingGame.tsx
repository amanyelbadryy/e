import React, { useState, useEffect } from 'react';
import { GameShell } from '../GameShell';
import { GameResult } from '../GameResult';
import { getSimilarMatchingPairs, SimilarMatchingPair } from '../../../data/games/classificationQuestions';
import { playPositiveFeedback, playNegativeFeedback } from '../../../utils/gameHelpers';
import { shuffleArray } from '../../../data/games/bankUtils';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface SimilarMatchingGameProps {
  onBack: () => void;
  onGoHome?: () => void;
}

export const SimilarMatchingGame: React.FC<SimilarMatchingGameProps> = ({ onBack, onGoHome }) => {
  const [pairs, setPairs] = useState<SimilarMatchingPair[]>([]);
  const [rightItems, setRightItems] = useState<{ id: string; emoji: string; name: string }[]>([]);
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    setupNewGame();
  }, []);

  const setupNewGame = () => {
    const selectedPairs = getSimilarMatchingPairs(4);
    setPairs(selectedPairs);

    // Shuffle right items separately
    const rightShuffled = shuffleArray(
      selectedPairs.map((p) => ({ id: p.id, emoji: p.item2Emoji, name: p.item2Name }))
    );
    setRightItems(rightShuffled);

    setSelectedLeftId(null);
    setMatchedIds([]);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setGameFinished(false);
  };

  const handleLeftClick = (id: string) => {
    if (matchedIds.includes(id)) return;
    setSelectedLeftId(id);
  };

  const handleRightClick = (targetId: string) => {
    if (!selectedLeftId || matchedIds.includes(targetId)) return;

    if (selectedLeftId === targetId) {
      playPositiveFeedback();
      const newMatched = [...matchedIds, targetId];
      setMatchedIds(newMatched);
      setScore((prev) => prev + 10);
      setCorrectCount((prev) => prev + 1);
      setSelectedLeftId(null);

      if (newMatched.length === pairs.length) {
        setTimeout(() => setGameFinished(true), 1200);
      }
    } else {
      playNegativeFeedback();
      setWrongCount((prev) => prev + 1);
      setSelectedLeftId(null);
    }
  };

  if (gameFinished) {
    return (
      <GameResult
        score={score}
        correctCount={correctCount}
        wrongCount={wrongCount}
        totalQuestions={pairs.length}
        onReplay={setupNewGame}
        onOtherGames={onBack}
        onGoHome={onGoHome}
      />
    );
  }

  return (
    <GameShell
      title="وصل المتشابه 🔗"
      icon="🔗"
      currentQuestion={matchedIds.length}
      totalQuestions={pairs.length}
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
            <Sparkles className="w-4 h-4 text-[#0284C7]" />
            <span>انْقُرْ عَلَى العُنْصُرِ فِي اليَمِينِ ثُمَّ انْقُرْ عَلَى مَا يُنَاسِبُهُ فِي اليَسَارِ!</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-[#1E293B]">
            صِلْ كُلَّ عُنْصُرٍ بِمَا يُنَاسِبُهُ أَوْ يَرْتَبِطُ بِهِ! 🔗
          </h3>
        </div>

        {/* Two Columns Grid */}
        <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto pt-2">
          {/* Left Column (Source Items) */}
          <div className="space-y-3">
            <div className="text-sm font-black text-slate-500 mb-2">الْمَجْمُوعَةُ الأُولَى</div>
            {pairs.map((p) => {
              const isMatched = matchedIds.includes(p.id);
              const isSelected = selectedLeftId === p.id;

              let btnStyle = 'bg-[#F8FAFC] border-[#E2E8F0] text-[#1E293B] hover:border-[#3B82F6]';
              if (isMatched) {
                btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 opacity-80';
              } else if (isSelected) {
                btnStyle = 'bg-amber-100 border-amber-500 text-amber-900 scale-105 shadow-lg';
              }

              return (
                <motion.button
                  key={p.id}
                  whileTap={{ scale: isMatched ? 1 : 0.95 }}
                  disabled={isMatched}
                  onClick={() => handleLeftClick(p.id)}
                  className={`w-full p-4 rounded-2xl border-4 transition-all flex items-center justify-between cursor-pointer shadow-md ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{p.item1Emoji}</span>
                    <span className="text-base font-black">{p.item1Name}</span>
                  </div>
                  {isMatched && <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                </motion.button>
              );
            })}
          </div>

          {/* Right Column (Target Items) */}
          <div className="space-y-3">
            <div className="text-sm font-black text-slate-500 mb-2">الْمَجْمُوعَةُ الثَّانِيَةُ</div>
            {rightItems.map((item) => {
              const isMatched = matchedIds.includes(item.id);

              let btnStyle = 'bg-[#F8FAFC] border-[#E2E8F0] text-[#1E293B] hover:border-[#10B981]';
              if (isMatched) {
                btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 opacity-80';
              }

              return (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: isMatched ? 1 : 0.95 }}
                  disabled={isMatched || !selectedLeftId}
                  onClick={() => handleRightClick(item.id)}
                  className={`w-full p-4 rounded-2xl border-4 transition-all flex items-center justify-between cursor-pointer shadow-md ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{item.emoji}</span>
                    <span className="text-base font-black">{item.name}</span>
                  </div>
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
