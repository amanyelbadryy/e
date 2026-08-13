import { useState, useEffect, lazy, Suspense } from 'react';
import { TabType } from './types';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { initLazyBackgroundMusic } from './utils/mp3Player';
import { motion, AnimatePresence } from 'motion/react';

// Lazy load heavy views for fast startup
const LettersView = lazy(() =>
  import('./components/LettersView').then((m) => ({ default: m.LettersView }))
);
const NumbersView = lazy(() =>
  import('./components/NumbersView').then((m) => ({ default: m.NumbersView }))
);
const ColoringView = lazy(() =>
  import('./components/ColoringView').then((m) => ({ default: m.ColoringView }))
);
const GamesView = lazy(() =>
  import('./components/GamesView').then((m) => ({ default: m.GamesView }))
);
const HeroJourney = lazy(() =>
  import('./components/games/HeroJourney').then((m) => ({ default: m.HeroJourney }))
);
const SettingsView = lazy(() =>
  import('./components/SettingsView').then((m) => ({ default: m.SettingsView }))
);

const SectionLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[350px] p-8 text-center space-y-4">
    <div className="w-14 h-14 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin"></div>
    <div className="inline-flex items-center gap-2 bg-teal-100/90 text-teal-900 px-5 py-2 rounded-full font-black text-sm border border-teal-200 shadow-2xs">
      <span className="animate-bounce">✨</span>
      <span>جاري التحميل...</span>
      <span className="animate-bounce">✨</span>
    </div>
  </div>
);

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [starsCount, setStarsCount] = useState<number>(() => {
    const saved = localStorage.getItem('alab_w_amrah_stars');
    return saved ? parseInt(saved, 10) : 5; // Default 5 welcome stars
  });

  useEffect(() => {
    localStorage.setItem('alab_w_amrah_stars', starsCount.toString());
  }, [starsCount]);

  useEffect(() => {
    // إعداد الاستماع لأول تفاعل لتشغيل الموسيقى بدون تحميل مسبق أو إنشاء Audio عند الإقلاع
    initLazyBackgroundMusic();
  }, []);

  const handleAddStars = (amount: number) => {
    setStarsCount((prev) => prev + amount);
  };

  const handleResetStars = () => {
    setStarsCount(0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-teal-50/60 via-cyan-50/30 to-teal-50/60 text-slate-800 font-['Tajawal',sans-serif] dir-rtl selection:bg-teal-200">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        starsCount={starsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentTab === 'home' && (
              <HomeView
                onSelectTab={(tab) => setCurrentTab(tab)}
                starsCount={starsCount}
              />
            )}

            <Suspense fallback={<SectionLoadingFallback />}>
              {currentTab === 'letters' && <LettersView />}

              {currentTab === 'numbers' && <NumbersView />}

              {currentTab === 'coloring' && <ColoringView />}

              {currentTab === 'games' && (
                <GamesView onAddStars={handleAddStars} onGoHome={() => setCurrentTab('home')} />
              )}

              {currentTab === 'hero_journey' && (
                <HeroJourney
                  onBack={() => setCurrentTab('home')}
                  onGoHome={() => setCurrentTab('home')}
                  onAddStars={handleAddStars}
                />
              )}

              {currentTab === 'settings' && (
                <SettingsView
                  onResetStars={handleResetStars}
                  starsCount={starsCount}
                />
              )}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Simple Footer */}
      <footer className="hidden md:block py-6 text-center text-xs font-bold text-teal-900/80 border-t border-teal-200/60 bg-teal-100/40">
        <p>"ألعب وأمرح" لتعليم الأطفال — Amany Elbadry © 2026</p>
      </footer>
    </div>
  );
}
