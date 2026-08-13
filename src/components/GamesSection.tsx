import React, { useState, lazy, Suspense } from 'react';
import { Gamepad2, Sparkles, Star, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { playButtonClickSFX } from '../utils/mp3Player';

// Category 1: Intelligence (Lazy loaded)
const PuzzleGame = lazy(() => import('./games/intelligence/PuzzleGame').then(m => ({ default: m.PuzzleGame })));
const OddOneOutGame = lazy(() => import('./games/intelligence/OddOneOutGame').then(m => ({ default: m.OddOneOutGame })));
const PatternGame = lazy(() => import('./games/intelligence/PatternGame').then(m => ({ default: m.PatternGame })));
const SequenceGame = lazy(() => import('./games/intelligence/SequenceGame').then(m => ({ default: m.SequenceGame })));
const LogicChoiceGame = lazy(() => import('./games/intelligence/LogicChoiceGame').then(m => ({ default: m.LogicChoiceGame })));

// Category 2: Focus (Lazy loaded)
const ImageMatchingGame = lazy(() => import('./games/ImageMatchingGame').then(m => ({ default: m.ImageMatchingGame })));
const FindImageGame = lazy(() => import('./games/focus/FindImageGame').then(m => ({ default: m.FindImageGame })));
const VisualDifferenceGame = lazy(() => import('./games/focus/VisualDifferenceGame').then(m => ({ default: m.VisualDifferenceGame })));
const FlashMemoryGame = lazy(() => import('./games/focus/FlashMemoryGame').then(m => ({ default: m.FlashMemoryGame })));

// Category 3: Math (Lazy loaded)
const NumberChoiceGame = lazy(() => import('./games/math/NumberChoiceGame').then(m => ({ default: m.NumberChoiceGame })));
const NumberListeningGame = lazy(() => import('./games/math/NumberListeningGame').then(m => ({ default: m.NumberListeningGame })));
const CountingGame = lazy(() => import('./games/math/CountingGame').then(m => ({ default: m.CountingGame })));
const BiggerSmallerGame = lazy(() => import('./games/math/BiggerSmallerGame').then(m => ({ default: m.BiggerSmallerGame })));
const NumberOrderingGame = lazy(() => import('./games/math/NumberOrderingGame').then(m => ({ default: m.NumberOrderingGame })));
const AddSubtractGame = lazy(() => import('./games/math/AddSubtractGame').then(m => ({ default: m.AddSubtractGame })));

// Category 4: Language (Lazy loaded)
const ListenLetterGame = lazy(() => import('./games/ListenLetterGame').then(m => ({ default: m.ListenLetterGame })));
const HarakatGame = lazy(() => import('./games/HarakatGame').then(m => ({ default: m.HarakatGame })));
const LetterPictureGame = lazy(() => import('./games/LetterPictureGame').then(m => ({ default: m.LetterPictureGame })));
const CompleteWordGame = lazy(() => import('./games/CompleteWordGame').then(m => ({ default: m.CompleteWordGame })));

// Category 5: Skills (Lazy loaded)
const ClassificationGame = lazy(() => import('./games/skills/ClassificationGame').then(m => ({ default: m.ClassificationGame })));
const GroupMatchingGame = lazy(() => import('./games/skills/GroupMatchingGame').then(m => ({ default: m.GroupMatchingGame })));
const ShapeSortingGame = lazy(() => import('./games/skills/ShapeSortingGame').then(m => ({ default: m.ShapeSortingGame })));
const SizeOrderingGame = lazy(() => import('./games/skills/SizeOrderingGame').then(m => ({ default: m.SizeOrderingGame })));
const SimilarMatchingGame = lazy(() => import('./games/skills/SimilarMatchingGame').then(m => ({ default: m.SimilarMatchingGame })));

const GameLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[380px] p-8 text-center space-y-4">
    <div className="w-14 h-14 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin"></div>
    <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-900 px-5 py-2 rounded-full font-black text-sm border border-teal-200 shadow-2xs">
      <span>جاري تشغيل اللعبة... 🎮</span>
    </div>
  </div>
);

export type GameCategoryKey = 'intelligence' | 'focus' | 'math' | 'language' | 'skills';

export interface GameDef {
  key: string;
  title: string;
  description: string;
  icon: string;
  badge: string;
}

export interface CategoryDef {
  key: GameCategoryKey;
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
  borderColor: string;
  badgeColor: string;
  games: GameDef[];
}

const GAME_CATEGORIES: CategoryDef[] = [
  {
    key: 'intelligence',
    title: '🧠 ألعاب الذكاء والتفكير',
    subtitle: 'ألغاز ممتعة، أنماط متسلسلة، واكتشاف الأشكال المختلفة',
    icon: '🧠',
    gradient: 'from-[#8B5CF6] to-[#6D28D9]',
    borderColor: 'border-[#7C3AED]',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    games: [
      { key: 'puzzle', title: '🧩 حل اللغز', description: 'اسمع اللغز واكتشف الإجابة الصحيحة بالذكاء.', icon: '🧩', badge: 'ألغاز' },
      { key: 'odd_one_out', title: '🔍 اكتشف المختلف', description: 'اعثر على العنصر الذي لا ينتمي للمجموعة.', icon: '🔍', badge: 'تمييز' },
      { key: 'pattern', title: '🧠 أكمل النمط', description: 'لاحظ تسلسل الأشكال واختر الشكل المناسب.', icon: '🧠', badge: 'أنماط' },
      { key: 'sequence', title: '🔗 رتب الأحداث', description: 'رتب الخطوات المتتالية بشكل منطقي صحيح.', icon: '🔗', badge: 'ترتيب' },
      { key: 'logic', title: '💡 اختر الحل الصحيح', description: 'فكر في الموقف واختر التصرف الأذكى.', icon: '💡', badge: 'منطق' },
    ],
  },
  {
    key: 'focus',
    title: '👀 ألعاب التركيز والانتباه',
    subtitle: 'قوِّ قوة ملاحظتك وذاكرتك البصرية الباهرة',
    icon: '👀',
    gradient: 'from-[#0284C7] to-[#0369A1]',
    borderColor: 'border-[#0284C7]',
    badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
    games: [
      { key: 'image_matching', title: '🧩 طابق الصور', description: 'اقلب البطاقات وابحث عن الصورتين المتطابقتين.', icon: '🧩', badge: 'ذاكرة' },
      { key: 'find_image', title: '👀 أين الصورة؟', description: 'ابحث عن الصورة المطلوبة بسرعة في الشبكة.', icon: '👀', badge: 'تركيز' },
      { key: 'visual_diff', title: '🔎 ابحث عن المختلف', description: 'لاحظ أدق التفاصيل واكتشف الاختلاف.', icon: '🔎', badge: 'ملاحظة' },
      { key: 'flash_memory', title: '🧠 تذكر البطاقات', description: 'احفظ أماكن البطاقات قبل أن تختفي!', icon: '🧠', badge: 'تذكر' },
    ],
  },
  {
    key: 'math',
    title: '🔢 ألعاب الحساب والرياضيات',
    subtitle: 'استمتع بالأرقام، العد، والمقارنات الشيقة',
    icon: '🔢',
    gradient: 'from-[#10B981] to-[#047857]',
    borderColor: 'border-[#059669]',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    games: [
      { key: 'num_choice', title: '🔢 اختر الرقم الصحيح', description: 'تعرف على شكل الرقم وطابقه بنجاح.', icon: '🔢', badge: 'أرقام' },
      { key: 'num_listen', title: '🔊 اسمع الرقم واختره', description: 'استمع لنطق الرقم بالصوت ثم اختره.', icon: '🔊', badge: 'استماع' },
      { key: 'counting', title: '🍎 عد الأشياء', description: 'عُدَّ التفاح والبالونات واختر العدد المناسب.', icon: '🍎', badge: 'عد' },
      { key: 'bigger_smaller', title: '📈 الأكبر والأصغر', description: 'قارن الأحجام والأعداد بين بطاقتين.', icon: '📈', badge: 'مقارنة' },
      { key: 'num_ordering', title: '🔢 ترتيب الأرقام', description: 'أكمل تسلسل الأعداد المفقودة بالترتيب.', icon: '🔢', badge: 'تسلسل' },
      { key: 'add_subtract', title: '➕➖ الجمع والطرح', description: 'حُلَّ المَسَائِلَ الحِسَابِيَّةَ البَسِيطَةَ مَعَ الرُّسُومَاتِ!', icon: '➕', badge: 'حساب' },
    ],
  },
  {
    key: 'language',
    title: '🔤 ألعاب اللغة والحروف',
    subtitle: 'أتقن الحروف العربية والحركات والكلمات النطقية',
    icon: '🔤',
    gradient: 'from-[#F59E0B] to-[#D97706]',
    borderColor: 'border-[#D97706]',
    badgeColor: 'bg-[#FEF3C7] text-[#78350F] border-[#FDE68A]',
    games: [
      { key: 'listen_letter', title: '🔊 اسمع الحرف واختره', description: 'اضغط زر الاستماع واختر الحرف المطابق.', icon: '🔊', badge: 'نطق' },
      { key: 'harakat', title: '✏️ حركة الحرف', description: 'اختر الحرف مع الحركة الصحيحة (فتحة/كسرة/ضمة).', icon: '✏️', badge: 'حركات' },
      { key: 'letter_picture', title: '🖼️ الحرف والصورة', description: 'طابق الحرف الأول مع الصورة المناسبة.', icon: '🖼️', badge: 'صور' },
      { key: 'complete_word', title: '🧩 أكمل الكلمة', description: 'اختر الحرف الناقص لإكمال الكلمة واستمع لنطقها.', icon: '🧩', badge: 'كلمات' },
    ],
  },
  {
    key: 'skills',
    title: '🎯 ألعاب المهارات والتصنيف',
    subtitle: 'تصنيف الأشكال، الأحجام، والمجموعات المتشابهة',
    icon: '🎯',
    gradient: 'from-[#EC4899] to-[#BE185D]',
    borderColor: 'border-[#DB2777]',
    badgeColor: 'bg-pink-100 text-pink-900 border-pink-300',
    games: [
      { key: 'classification', title: '📂 صنّف الأشياء', description: 'صنف العناصر حسب الفواكه والحيوانات والوسائل.', icon: '📂', badge: 'تصنيف' },
      { key: 'group_matching', title: '🧩 طابق مع المجموعة', description: 'صل العنصر بالمجموعة التي ينتمي إليها.', icon: '🧩', badge: 'عائلات' },
      { key: 'shape_sorting', title: '🔷 تصنيف الأشكال', description: 'تعرف على الدائرة والمربع والمثلث.', icon: '🔷', badge: 'أشكال' },
      { key: 'size_ordering', title: '📏 مقارنة الأحجام', description: 'ميز بين الكائنات الكبيرة والصغيرة جداً.', icon: '📏', badge: 'أحجام' },
      { key: 'similar_matching', title: '🔗 وصل المتشابه', description: 'صل البقرة بالحليب والدجاجة بالبيضة!', icon: '🔗', badge: 'توصيل' },
    ],
  },
];

interface GamesSectionProps {
  onGoHome?: () => void;
}

export const GamesSection: React.FC<GamesSectionProps> = ({ onGoHome }) => {
  const [activeCategory, setActiveCategory] = useState<GameCategoryKey | null>(null);
  const [activeGameKey, setActiveGameKey] = useState<string | null>(null);

  const handleBackToCategories = () => {
    playButtonClickSFX();
    setActiveCategory(null);
    setActiveGameKey(null);
  };

  const handleBackToGames = () => {
    playButtonClickSFX();
    setActiveGameKey(null);
  };

  // Find Category Def if selected
  const currentCategoryDef = GAME_CATEGORIES.find((c) => c.key === activeCategory);

  // Active Game Render Logic
  if (activeGameKey) {
    let gameComponent: React.ReactNode = null;
    switch (activeGameKey) {
      // Category 1: Intelligence
      case 'puzzle':
        gameComponent = <PuzzleGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;
      case 'odd_one_out':
        gameComponent = <OddOneOutGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;
      case 'pattern':
        gameComponent = <PatternGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;
      case 'sequence':
        gameComponent = <SequenceGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;
      case 'logic':
        gameComponent = <LogicChoiceGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;

      // Category 2: Focus
      case 'image_matching':
        gameComponent = <ImageMatchingGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;
      case 'find_image':
        gameComponent = <FindImageGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;
      case 'visual_diff':
        gameComponent = <VisualDifferenceGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;
      case 'flash_memory':
        gameComponent = <FlashMemoryGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;

      // Category 3: Math
      case 'num_choice':
        gameComponent = <NumberChoiceGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;
      case 'num_listen':
        gameComponent = <NumberListeningGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;
      case 'counting':
        gameComponent = <CountingGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;
      case 'bigger_smaller':
        gameComponent = <BiggerSmallerGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;
      case 'num_ordering':
        gameComponent = <NumberOrderingGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;
      case 'add_subtract':
        gameComponent = <AddSubtractGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;

      // Category 4: Language
      case 'listen_letter':
        gameComponent = <ListenLetterGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;
      case 'harakat':
        gameComponent = <HarakatGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;
      case 'letter_picture':
        gameComponent = <LetterPictureGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;
      case 'complete_word':
        gameComponent = <CompleteWordGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;

      // Category 5: Skills
      case 'classification':
        gameComponent = <ClassificationGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;
      case 'group_matching':
        gameComponent = <GroupMatchingGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;
      case 'shape_sorting':
        gameComponent = <ShapeSortingGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;
      case 'size_ordering':
        gameComponent = <SizeOrderingGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;
      case 'similar_matching':
        gameComponent = <SimilarMatchingGame onBack={handleBackToGames} onGoHome={onGoHome} />;
        break;

      default:
        break;
    }

    if (gameComponent) {
      return (
        <Suspense fallback={<GameLoadingFallback />}>
          {gameComponent}
        </Suspense>
      );
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn dir-rtl max-w-6xl mx-auto pb-12">
      {/* 1. MAIN CATEGORY SELECTION VIEW */}
      {activeCategory === null && (
        <>
          {/* Main Hero Header */}
          <section className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 rounded-[36px] p-6 md:p-8 border-4 border-teal-700 shadow-xl shadow-teal-200 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-right">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-black text-amber-200">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>أقسام الألعاب التعليمية المصنفة</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black flex items-center justify-center md:justify-start gap-3">
                <Gamepad2 className="w-9 h-9 text-amber-300" />
                <span>🎮 مَدِينَةُ الأَلْعَابِ التَّعْلِيمِيَّةِ</span>
              </h2>
              <p className="text-sm md:text-base font-bold text-teal-100">
                اخْتَرِ القِسْمَ المُنَاسِبَ لِتَخُوضَ مَغَامَرَةً مُمْتِعَةً مَلِيئَةً بِالتَّحَدِّي وَالذَّكَاءِ!
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20 text-center shrink-0">
              <div className="flex items-center justify-center gap-1 text-2xl font-black text-amber-300">
                <Star className="w-6 h-6 fill-amber-300" />
                <span>5 أقسام / 25 لعبة</span>
              </div>
              <p className="text-xs font-bold text-teal-100 mt-1">ألعاب تفاعلية بالكامل 100%</p>
            </div>
          </section>

          {/* Categories Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GAME_CATEGORIES.map((cat) => (
              <motion.div
                key={cat.key}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  playButtonClickSFX();
                  setActiveCategory(cat.key);
                }}
                className="bg-white p-6 rounded-[36px] border-4 border-[#F1F5F9] hover:border-[#3B82F6] shadow-md hover:shadow-2xl transition-all cursor-pointer space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-md bg-gradient-to-br ${cat.gradient} text-white`}
                    >
                      {cat.icon}
                    </div>
                    <span
                      className={`text-xs font-black px-3 py-1.5 rounded-full border ${cat.badgeColor}`}
                    >
                      5 ألعاب
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-[#1E293B] pt-1">{cat.title}</h3>
                  <p className="text-sm font-bold text-[#64748B] leading-relaxed">{cat.subtitle}</p>
                </div>

                <div className="pt-2">
                  <button className="w-full bg-[#3B82F6] text-white py-3.5 rounded-full font-black text-base shadow-lg border-b-4 border-[#1D4ED8] hover:bg-[#2563EB] flex items-center justify-center gap-2 cursor-pointer">
                    <span>دخول القسم</span>
                    <ArrowRight className="w-5 h-5 rotate-180" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* 2. SPECIFIC CATEGORY GAMES VIEW */}
      {activeCategory !== null && currentCategoryDef && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-[32px] border-4 border-[#F1F5F9] shadow-md">
            <div className="flex items-center gap-4 text-right">
              <button
                onClick={handleBackToCategories}
                className="bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E293B] p-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <ArrowRight className="w-5 h-5" />
                <span>الأقسام الرئيسية</span>
              </button>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-[#1E293B]">
                  {currentCategoryDef.title}
                </h2>
                <p className="text-xs md:text-sm font-bold text-[#64748B]">
                  {currentCategoryDef.subtitle}
                </p>
              </div>
            </div>

            <span className="bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] px-4 py-2 rounded-full font-black text-xs shrink-0">
              اختر إحدى الألعاب الـ 5 للبدء!
            </span>
          </div>

          {/* Games Grid for Category */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCategoryDef.games.map((g) => (
              <motion.div
                key={g.key}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  playButtonClickSFX();
                  setActiveGameKey(g.key);
                }}
                className="bg-white p-6 rounded-[36px] border-4 border-[#F1F5F9] hover:border-[#3B82F6] shadow-md hover:shadow-2xl transition-all cursor-pointer space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                      {g.icon}
                    </div>
                    <span className="text-xs font-black bg-[#F1F5F9] text-[#64748B] px-3 py-1 rounded-full border border-[#E2E8F0]">
                      {g.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#1E293B]">{g.title}</h3>
                  <p className="text-sm font-bold text-[#64748B] leading-relaxed">
                    {g.description}
                  </p>
                </div>

                <div className="pt-2">
                  <button className="w-full bg-[#10B981] text-white py-3 rounded-full font-black text-sm shadow border-b-4 border-[#047857] hover:bg-[#059669] flex items-center justify-center gap-2 cursor-pointer">
                    <span>ابدأ اللعبة</span>
                    <span>🎮</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
