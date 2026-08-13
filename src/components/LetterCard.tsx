import React from 'react';
import { Volume2 } from 'lucide-react';
import { playButtonClickSFX } from '../utils/mp3Player';

export interface LetterCardProps {
  letter: string;           // e.g. "أ"
  letterName?: string;     // e.g. "أَلِف"
  letterAudioUrl?: string; // Audio URL for letter sound
  word: string;             // e.g. "أَسَد"
  subText?: string;         // e.g. "أسد شجاع" or translation
  emoji?: string;           // e.g. "🦁"
  imageUrl?: string;        // Optional image URL
  wordAudioUrl?: string;    // Audio URL for word sound
  audioUrl?: string;        // Fallback single audio URL
  onPlayAudio?: (url: string) => void;
  onClick?: () => void;
  className?: string;
}

export const LetterCard: React.FC<LetterCardProps> = ({
  letter,
  letterName,
  letterAudioUrl,
  word,
  subText,
  emoji,
  imageUrl,
  wordAudioUrl,
  audioUrl,
  onPlayAudio,
  onClick,
  className = '',
}) => {
  const effectiveLetterAudio = letterAudioUrl || audioUrl;
  const effectiveWordAudio = wordAudioUrl || audioUrl;

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
      className={`w-full rounded-2xl sm:rounded-3xl bg-white border-2 border-teal-200/90 shadow-sm hover:border-teal-400 transition-all p-4 sm:p-6 flex items-center justify-between box-border relative select-none overflow-hidden ${
        onClick ? 'cursor-pointer active:scale-[0.99]' : ''
      } ${className}`}
    >
      {/* 1. RIGHT SECTION: LETTER (القسم الأيمن - الحرف) */}
      <div className="flex flex-col items-center justify-center min-w-[110px] sm:min-w-[160px] p-2 text-center shrink-0 space-y-1.5">
        {/* Big Letter */}
        <span className="text-5xl sm:text-7xl font-black text-teal-600 leading-none drop-shadow-2xs">
          {letter}
        </span>
        {letterName && (
          <span className="text-xs sm:text-sm font-bold text-teal-800/90 mt-1 truncate max-w-[140px]">
            حرف {letterName}
          </span>
        )}

        {/* Listen to Letter Button */}
        {effectiveLetterAudio && onPlayAudio && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPlayAudio(effectiveLetterAudio);
            }}
            className="mt-3 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-2xs hover:shadow active:scale-95 transition-all cursor-pointer border border-teal-500 whitespace-nowrap"
            title="استمع للحرف 🔊"
            aria-label="استمع للحرف"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span>اسمع الحرف</span>
          </button>
        )}
      </div>

      {/* 2. VERTICAL DIVIDER (خط فاصل رأسي خفيف) */}
      <div className="w-px self-stretch bg-teal-200/80 my-2 mx-2 sm:mx-4 shrink-0" />

      {/* 3. LEFT SECTION: IMAGE + WORD + DESCRIPTION + LISTEN TO WORD (القسم الأيسر - الكلمة والصورة) */}
      <div className="flex-1 min-w-0 flex flex-col items-center justify-center p-2 text-center space-y-1.5">
        {/* Image / Emoji */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-3xl sm:text-4xl shadow-2xs mb-1 shrink-0 overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={word} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <span>{emoji || '⭐'}</span>
          )}
        </div>

        {/* Word */}
        <h3 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight truncate w-full">
          {word}
        </h3>

        {/* Subtext / Description */}
        {subText && (
          <p className="text-xs sm:text-sm font-bold text-teal-800/80 truncate w-full">
            {subText}
          </p>
        )}

        {/* Listen to Word Button */}
        {effectiveWordAudio && onPlayAudio && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPlayAudio(effectiveWordAudio);
            }}
            className="mt-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-2xs hover:shadow active:scale-95 transition-all cursor-pointer border border-teal-500 whitespace-nowrap"
            title="استمع للكلمة 🔊"
            aria-label="استمع للكلمة"
          >
            <Volume2 className="w-4 h-4 shrink-0" />
            <span>اسمع الكلمة</span>
          </button>
        )}
      </div>
    </div>
  );
};



