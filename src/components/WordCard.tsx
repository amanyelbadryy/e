import React from 'react';
import { Volume2 } from 'lucide-react';
import { playButtonClickSFX } from '../utils/mp3Player';

export interface WordCardProps {
  word: string;             // e.g. "أَسَد"
  subText?: string;         // e.g. "أسد شجاع" or translation
  emoji?: string;           // e.g. "🦁"
  imageUrl?: string;        // Optional image URL
  audioUrl?: string;        // Audio file path
  onPlayAudio?: (url: string) => void;
  onClick?: () => void;
  className?: string;
  badge?: string;           // Optional badge e.g. "أَ" or "الكلمة الأساسية"
  badgeColor?: string;
}

export const WordCard: React.FC<WordCardProps> = ({
  word,
  subText,
  emoji,
  imageUrl,
  audioUrl,
  onPlayAudio,
  onClick,
  className = '',
  badge,
  badgeColor = 'bg-teal-100 text-teal-900 border-teal-200',
}) => {
  const handleContainerClick = () => {
    if (onClick) {
      playButtonClickSFX();
      onClick();
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      dir="rtl"
      className={`w-full max-w-xl mx-auto rounded-2xl bg-white border-2 border-teal-200/90 hover:border-teal-400 p-3 sm:p-4 shadow-xs hover:shadow-md transition-all duration-150 flex items-center justify-between gap-3 sm:gap-4 box-border relative select-none overflow-hidden ${
        onClick ? 'cursor-pointer active:scale-[0.99]' : ''
      } ${className}`}
    >
      {/* 1. Right Side: Image/Emoji fixed container (الصورة في أقصى اليمين) */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-2xl sm:text-3xl shadow-xs shrink-0 overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={word} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <span>{emoji || '✨'}</span>
          )}
        </div>
        {badge && (
          <div
            className={`hidden sm:flex px-2 py-1 rounded-lg border text-xs font-black shrink-0 ${badgeColor}`}
          >
            {badge}
          </div>
        )}
      </div>

      {/* 2. Middle: Word and Description (الكلمة والوصف في المنتصف) */}
      <div className="flex-1 min-w-0 text-right px-1">
        <h3 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight truncate">
          {word}
        </h3>
        {subText && (
          <p className="text-xs sm:text-sm font-bold text-teal-700/80 truncate mt-0.5">
            {subText}
          </p>
        )}
      </div>

      {/* 3. Far Left: Separate Audio Button (زر السماعة في أقصى اليسار مع مسافة واضحة) */}
      {audioUrl && onPlayAudio && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPlayAudio(audioUrl);
          }}
          className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-xs hover:shadow active:scale-95 transition-all shrink-0 cursor-pointer border border-teal-500"
          title="اسمع الكلمة 🔊"
          aria-label="اسمع الكلمة"
        >
          <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden xs:inline">اسمع الكلمة</span>
        </button>
      )}
    </div>
  );
};

