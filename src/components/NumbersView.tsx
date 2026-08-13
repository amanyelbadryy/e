import React, { useState, lazy, Suspense } from 'react';
import { NUMBERS_DATA } from '../data/numbersData';
import { ArabicNumber } from '../types';
import { playMP3, playButtonClickSFX } from '../utils/mp3Player';
import { Volume2, Sparkles, Hash, CheckCircle2, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const NumberQuizSection = lazy(() =>
  import('./numbers/NumberQuizSection').then((m) => ({ default: m.NumberQuizSection }))
);

const QuizLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[350px] p-8 text-center space-y-4">
    <div className="w-14 h-14 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin"></div>
    <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-900 px-5 py-2 rounded-full font-black text-sm border border-teal-200 shadow-2xs">
      <span>جاري تجهيز اختبار الأرقام... 🔢</span>
    </div>
  </div>
);

export const NumbersView: React.FC = () => {
  const [selectedNumber, setSelectedNumber] = useState<ArabicNumber>(NUMBERS_DATA[1]); // Default to 1
  const [countedItems, setCountedItems] = useState<number[]>([]);
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);

  const handleSelectNumber = (num: ArabicNumber) => {
    setSelectedNumber(num);
    setCountedItems([]);
    playMP3(num.audio);
  };

  const handleTapItem = (itemIndex: number) => {
    // Only accept tapping the NEXT sequential element (far right to left)
    if (itemIndex === countedItems.length) {
      const nextCount = countedItems.length + 1;
      setCountedItems((prev) => [...prev, itemIndex]);

      // Play MP3 for the count (1 -> "واحد", 2 -> "اثنان", etc.)
      const countNumberData = NUMBERS_DATA.find((n) => n.number === nextCount);
      if (countNumberData?.audio) {
        playMP3(countNumberData.audio);
      }
    }
  };

  const handleResetCount = () => {
    playButtonClickSFX();
    setCountedItems([]);
  };

  if (isQuizActive) {
    return (
      <Suspense fallback={<QuizLoadingFallback />}>
        <NumberQuizSection onBack={() => setIsQuizActive(false)} />
      </Suspense>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-28 space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-900 px-4 py-1.5 rounded-full font-black text-sm border border-teal-200 shadow-2xs">
          <Hash className="w-4 h-4 text-teal-700" />
          <span>قسم الأرقام من ٠ إلى ١٠</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900">
          تعلم العد واستمع إلى أصوات الأرقام 🔢
        </h2>
        <p className="text-sm md:text-base font-bold text-teal-800/80">
          اضغط على الرقم لسماع صوته ورؤية الأشياء لمساعدتك في العد البصري الممتع
        </p>
      </div>

      {/* Featured "Test Yourself" Quiz Banner Button */}
      <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 rounded-3xl p-5 md:p-6 border-4 border-teal-700 shadow-lg text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-right">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-inner">
            🎯
          </div>
          <div>
            <div className="inline-flex items-center gap-1 bg-amber-300 text-amber-950 px-3 py-0.5 rounded-full text-xs font-black mb-1">
              <span>اختبار شامل ⭐ 100 سؤال</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black">🎯 اختبر نفسك في الأرقام</h3>
            <p className="text-xs md:text-sm font-bold text-teal-100">
              اختبار عشوائي ممتع يتكون من 100 سؤال متنوع يشمل الاستماع، العد، الأعداد التالية والسابقة، والمقارنات
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playButtonClickSFX();
            setIsQuizActive(true);
          }}
          className="w-full md:w-auto bg-amber-300 hover:bg-amber-200 text-amber-950 px-8 py-3.5 rounded-2xl font-black text-base shadow-md active:scale-95 transition-all cursor-pointer shrink-0 border-b-4 border-amber-500"
        >
          ابدأ الاختبار الآن 🎯
        </button>
      </div>

      {/* Numbers Buttons Selection Grid (0 to 10) */}

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3">
        {NUMBERS_DATA.map((item) => {
          const isSelected = selectedNumber.id === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectNumber(item)}
              className={`p-4 rounded-3xl border-4 transition-all duration-200 flex flex-col items-center justify-center min-h-[110px] ${
                isSelected
                  ? `${item.color} border-teal-400 ring-4 ring-teal-200 shadow-xl scale-105`
                  : 'bg-white hover:bg-teal-50/60 border-teal-200/80 text-slate-800 shadow-2xs'
              }`}
            >
              <span className={`text-4xl font-black mb-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                {item.digit}
              </span>
              <span className={`text-xs font-black ${isSelected ? 'text-white/90' : 'text-slate-600'}`}>
                {item.word}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Main Selected Number Detail & Counter Interactive Canvas */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedNumber.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="bg-white rounded-3xl p-6 md:p-8 border-4 border-teal-200 shadow-xl space-y-8"
        >
          {/* Top Info Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-teal-50 via-cyan-50 to-teal-100 p-6 rounded-3xl border-2 border-teal-200">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-teal-500 to-cyan-600 text-white flex items-center justify-center text-6xl font-black shadow-lg shadow-teal-200 border-4 border-white">
                {selectedNumber.digit}
              </div>

              <div className="space-y-1 text-center md:text-right">
                <div className="inline-flex items-center gap-1.5 bg-teal-200/80 text-teal-950 px-3 py-1 rounded-full text-xs font-black">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>الرقم {selectedNumber.number}</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900">{selectedNumber.word}</h3>
                <p className="text-sm font-bold text-teal-800">{selectedNumber.countName}</p>
              </div>
            </div>

            {/* Play Sound Button */}
            <button
              onClick={() => {
                playMP3(selectedNumber.audio);
              }}
              className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-teal-200 transition-transform active:scale-95 border-2 border-teal-500 cursor-pointer"
            >
              <Volume2 className="w-7 h-7" />
              <span>استمع لصوت الرقم ({selectedNumber.digit})</span>
            </button>
          </div>

          {/* Interactive Item Counter Area */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h4 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <span>عدّ الأشياء:</span>
                  <span className="text-teal-900 dir-ltr bg-teal-100 px-3 py-0.5 rounded-full text-base font-black border border-teal-300">
                    {countedItems.length} / {selectedNumber.number}
                  </span>
                </h4>

                {countedItems.length > 0 && (
                  <button
                    onClick={handleResetCount}
                    className="text-xs font-bold text-teal-800 hover:text-teal-950 bg-teal-100 hover:bg-teal-200 px-3 py-1 rounded-full border border-teal-300 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span>إعادة العد</span>
                    <span>🔄</span>
                  </button>
                )}
              </div>

              {selectedNumber.number > 0 && countedItems.length === selectedNumber.number && (
                <div className="flex items-center gap-1.5 text-emerald-600 font-black text-sm bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ممتاز! أكملت العد بنجاح 🎉</span>
                </div>
              )}
            </div>

            {selectedNumber.number === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 space-y-2">
                <div className="text-6xl">⚪</div>
                <div className="text-lg font-black text-slate-700">الرقم صفر يعني "لا شيء"!</div>
                <div className="text-xs font-bold text-slate-600">لا توجد عناصر للعد في هذا الرقم.</div>
              </div>
            ) : (
              <div dir="rtl" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                {Array.from({ length: selectedNumber.number }).map((_, idx) => {
                  const isCounted = countedItems.includes(idx);
                  const isNextToCount = idx === countedItems.length;

                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: isNextToCount ? 1.08 : 1 }}
                      whileTap={{ scale: isNextToCount ? 0.92 : 1 }}
                      onClick={() => handleTapItem(idx)}
                      className={`p-6 rounded-2xl border-2 font-black transition-all flex flex-col items-center justify-center gap-2 ${
                        isCounted
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-950 shadow-md ring-2 ring-emerald-300'
                          : isNextToCount
                          ? 'bg-white hover:bg-amber-50 border-amber-400 text-slate-800 shadow-md ring-2 ring-amber-200 cursor-pointer animate-pulse'
                          : 'bg-white/60 border-slate-200 text-slate-400 cursor-not-allowed opacity-70'
                      }`}
                    >
                      <span className="text-5xl">{selectedNumber.emoji}</span>
                      <span className="text-xs font-black bg-slate-100 px-2.5 py-1 rounded-full">
                        {isCounted
                          ? `✓ (${idx + 1})`
                          : isNextToCount
                          ? `اضغط للعد (${idx + 1})`
                          : `(${idx + 1})`}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
