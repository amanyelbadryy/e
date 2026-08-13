import React from 'react';
import { TabType } from '../types';
import { BookOpen, Hash, Gamepad2, Trophy, Settings, Sparkles, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { playButtonClickSFX } from '../utils/mp3Player';

interface HomeViewProps {
  onSelectTab: (tab: TabType) => void;
  starsCount: number;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectTab, starsCount }) => {
  const handleNavClick = (tab: TabType) => {
    playButtonClickSFX();
    onSelectTab(tab);
  };
  const categories = [
    {
      id: 'letters' as TabType,
      title: 'الحروف العربية',
      subtitle: 'تعلم الحروف والأصوات بالحركات الثلاث (فتحة، كسرة، ضمة)',
      icon: BookOpen,
      bgGradient: 'from-rose-400 to-pink-500',
      shadowColor: 'shadow-pink-200',
      badge: '٢٨ حرفًا',
      emoji: '🔤',
      borderColor: 'border-pink-300'
    },
    {
      id: 'numbers' as TabType,
      title: 'الأرقام من ٠ إلى ١٠',
      subtitle: 'تعلم عد الأشياء وتعرف على أصوات الأرقام الجميلة',
      icon: Hash,
      bgGradient: 'from-sky-400 to-indigo-500',
      shadowColor: 'shadow-sky-200',
      badge: '١١ رقمًا',
      emoji: '🔢',
      borderColor: 'border-sky-300'
    },
    {
      id: 'games' as TabType,
      title: 'ألعاب الذكاء والتعلم',
      subtitle: 'اختبر معلوماتك في ٢٥ لعبة تفاعلية مصنفة وممتعة',
      icon: Gamepad2,
      bgGradient: 'from-emerald-400 to-teal-500',
      shadowColor: 'shadow-emerald-200',
      badge: '٢٥ لعبة',
      emoji: '🎮',
      borderColor: 'border-emerald-300'
    },
    {
      id: 'hero_journey' as TabType,
      title: 'رحلة الأبطال',
      subtitle: 'اجتاز الـ ١٠٠ مرحلة الشيقة واجمع النجوم والوسامات!',
      icon: Trophy,
      bgGradient: 'from-amber-400 to-orange-500',
      shadowColor: 'shadow-amber-200',
      badge: '١٠٠ مرحلة',
      emoji: '🏆',
      borderColor: 'border-amber-300'
    },
    {
      id: 'settings' as TabType,
      title: 'الإعدادات والدليل',
      subtitle: 'تفاصيل الصوت، حالة الملفات، وإصدار النظام البسيط',
      icon: Settings,
      bgGradient: 'from-purple-400 to-violet-500',
      shadowColor: 'shadow-purple-200',
      badge: 'نظام الصوت',
      emoji: '⚙️',
      borderColor: 'border-purple-300'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 space-y-8">
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 p-8 text-white shadow-xl shadow-teal-200 border-4 border-white"
      >
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-black tracking-wide border border-white/30">
            <Sparkles className="w-4 h-4 text-yellow-200" />
            <span>مرحباً بك في عالم التعلم الممتع!</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black leading-tight drop-shadow-sm">
            <span className="underline decoration-teal-200 decoration-wavy">ألعب وأمرح</span>
          </h2>
          <p className="text-lg md:text-xl font-bold opacity-95 leading-relaxed">
            تعلم الحروف العربية، الكلمات، الحركات والأرقام بلمسة واحدة وبأصوات تعليمية نقية وممتعة!
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => handleNavClick('letters')}
              className="bg-white text-teal-950 hover:bg-teal-50 px-6 py-3.5 rounded-2xl font-black text-lg shadow-lg shadow-black/10 transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>ابدأ التعلم الآن</span>
              <span className="text-2xl">🚀</span>
            </button>
            <div className="flex items-center gap-2 bg-black/10 px-4 py-3 rounded-2xl border border-white/20">
              <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              <span className="font-black text-lg">رصيدك: {starsCount} نجمة</span>
            </div>
          </div>
        </div>

        {/* Decorative Floating Emojis */}
        <div className="absolute -left-4 -bottom-6 text-8xl opacity-30 select-none pointer-events-none rotate-12">
          🎈
        </div>
        <div className="absolute left-32 top-4 text-7xl opacity-20 select-none pointer-events-none -rotate-12">
          ⭐
        </div>
      </motion.div>


      {/* Main Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleNavClick(cat.id)}
              className={`group relative overflow-hidden bg-white text-right p-6 rounded-3xl border-4 ${cat.borderColor} shadow-lg ${cat.shadowColor} hover:shadow-xl transition-all duration-300 active:scale-98 flex flex-col justify-between min-h-[200px] cursor-pointer`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${cat.bgGradient} text-white shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-800 border border-slate-200 shadow-sm">
                  {cat.badge}
                </span>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{cat.emoji}</span>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-teal-600 transition-colors">
                    {cat.title}
                  </h3>
                </div>
                <p className="text-sm font-bold text-slate-600 leading-relaxed">
                  {cat.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-teal-800">
                <span>اضغط للدخول</span>
                <span className="text-lg transition-transform group-hover:-translate-x-2">👈</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
