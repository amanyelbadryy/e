import React from 'react';
import { Trophy, Star, Target, XCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { playButtonClickSFX } from '../../utils/mp3Player';

interface GameShellProps {
  title: string;
  description?: string;
  icon?: string;
  currentQuestion: number;
  totalQuestions?: number;
  score: number;
  correctCount: number;
  wrongCount: number;
  onBack: () => void;
  onRestart: () => void;
  children: React.ReactNode;
}

export const GameShell: React.FC<GameShellProps> = ({
  title,
  description,
  icon = '🎮',
  currentQuestion,
  totalQuestions = 10,
  score,
  correctCount,
  wrongCount,
  onBack,
  onRestart,
  children,
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto dir-rtl">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap bg-white p-4 rounded-3xl border-4 border-[#F1F5F9] shadow-md">
        <button
          onClick={() => {
            playButtonClickSFX();
            onBack();
          }}
          className="bg-[#3B82F6] text-white px-4 py-2.5 rounded-full font-black text-sm shadow-md border-b-4 border-[#1D4ED8] hover:bg-[#2563EB] flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
        >
          <ArrowRight className="w-4 h-4" />
          <span>قائمة الألعاب</span>
        </button>

        <div className="flex items-center gap-2 text-[#1E293B]">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-xl md:text-2xl font-black">{title}</h2>
        </div>

        <button
          onClick={() => {
            playButtonClickSFX();
            onRestart();
          }}
          title="إعادة اللعبة"
          className="bg-[#F1F5F9] text-[#64748B] hover:text-[#1E293B] p-2.5 rounded-full border-2 border-[#E2E8F0] cursor-pointer transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Progress & Live Score Bar */}
      <div className="bg-gradient-to-r from-[#FFD93D] to-[#FACC15] rounded-3xl p-4 border-4 border-[#F59E0B] shadow-md text-[#451A03] flex items-center justify-between gap-4 flex-wrap">
        {/* Question progress */}
        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-2xl border border-amber-200">
          <span className="text-xs font-black text-[#78350F]">السؤال:</span>
          <span className="text-lg font-black text-[#451A03]">
            {currentQuestion} / {totalQuestions}
          </span>
        </div>

        {/* Live stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/80 px-3.5 py-1.5 rounded-xl border border-amber-200 shadow-sm">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-black">{score} ⭐</span>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-900 px-3.5 py-1.5 rounded-xl border border-emerald-300 shadow-sm">
            <Target className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-black">{correctCount} 🎯</span>
          </div>

          <div className="flex items-center gap-1.5 bg-rose-100 text-rose-900 px-3.5 py-1.5 rounded-xl border border-rose-300 shadow-sm">
            <XCircle className="w-4 h-4 text-rose-600" />
            <span className="text-sm font-black">{wrongCount} ❌</span>
          </div>
        </div>
      </div>

      {/* Main Game Screen Content */}
      <div>{children}</div>
    </div>
  );
};
