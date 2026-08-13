import React, { useEffect } from 'react';
import { Trophy, Star, Target, XCircle, RotateCcw, Gamepad2, Home, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { playSuccessLevelPassedSFX, playButtonClickSFX } from '../../utils/mp3Player';

interface GameResultProps {
  score: number;
  correctCount: number;
  wrongCount: number;
  totalQuestions?: number;
  onReplay: () => void;
  onOtherGames: () => void;
  onGoHome?: () => void;
}

export const GameResult: React.FC<GameResultProps> = ({
  score,
  correctCount,
  wrongCount,
  totalQuestions = 10,
  onReplay,
  onOtherGames,
  onGoHome,
}) => {
  useEffect(() => {
    playSuccessLevelPassedSFX();
  }, []);

  const percentage = Math.round((correctCount / totalQuestions) * 100);

  let ratingText = 'أحسنت محاولة جيدة! 👍';
  let starsAwarded = 1;

  if (percentage >= 90) {
    ratingText = '🎉 رائع جداً! أنت عبقري وممتاز! 🌟';
    starsAwarded = 3;
  } else if (percentage >= 60) {
    ratingText = '👏 أحسنت! أداء رائع ومميز! ⭐';
    starsAwarded = 2;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[40px] p-8 border-4 border-[#F1F5F9] shadow-2xl space-y-8 text-center max-w-xl mx-auto dir-rtl"
    >
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-[#FEF3C7] text-[#78350F] px-5 py-2 rounded-full border border-[#FDE68A] font-black text-sm">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>اكتمل التحدي بنجاح!</span>
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-[#1E293B]">
          {ratingText}
        </h2>
      </div>

      {/* Star Icons display */}
      <div className="flex items-center justify-center gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: i < starsAwarded ? 1.2 : 0.9, rotate: 0 }}
            transition={{ delay: i * 0.2 }}
            className={`text-6xl ${i < starsAwarded ? 'drop-shadow-lg' : 'opacity-30 grayscale'}`}
          >
            ⭐
          </motion.div>
        ))}
      </div>

      {/* Score Summary Box */}
      <div className="bg-[#FFFBEB] rounded-3xl p-6 border-4 border-[#FEF3C7] grid grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <div className="text-xs font-black text-[#78350F]">النقاط</div>
          <div className="text-3xl font-black text-[#D97706]">{score} ⭐</div>
        </div>

        <div className="space-y-1 border-x-2 border-[#FDE68A]">
          <div className="text-xs font-black text-[#78350F]">الإجابات الصحيحة</div>
          <div className="text-3xl font-black text-[#16A34A]">{correctCount} / {totalQuestions}</div>
        </div>

        <div className="space-y-1">
          <div className="text-xs font-black text-[#78350F]">الأخطاء</div>
          <div className="text-3xl font-black text-[#DC2626]">{wrongCount} ❌</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          onClick={() => {
            playButtonClickSFX();
            onReplay();
          }}
          className="w-full bg-[#4ADE80] text-white py-4 rounded-full font-black text-lg shadow-lg border-b-4 border-[#16A34A] hover:bg-[#22C55E] flex items-center justify-center gap-3 cursor-pointer active:scale-95 transition-transform"
        >
          <RotateCcw className="w-6 h-6" />
          <span>العب مرة أخرى 🔄</span>
        </button>

        <button
          onClick={() => {
            playButtonClickSFX();
            onOtherGames();
          }}
          className="w-full bg-[#3B82F6] text-white py-4 rounded-full font-black text-lg shadow-lg border-b-4 border-[#1D4ED8] hover:bg-[#2563EB] flex items-center justify-center gap-3 cursor-pointer active:scale-95 transition-transform"
        >
          <Gamepad2 className="w-6 h-6" />
          <span>ألعاب أخرى 🎮</span>
        </button>

        {onGoHome && (
          <button
            onClick={() => {
              playButtonClickSFX();
              onGoHome();
            }}
            className="w-full bg-[#F1F5F9] text-[#475569] hover:text-[#1E293B] py-3.5 rounded-full font-black text-base border-2 border-[#E2E8F0] hover:bg-[#E2E8F0] flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>الرئيسية 🏠</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
