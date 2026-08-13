import React from 'react';
import { TabType } from '../types';
import { Sparkles, Home, BookOpen, Hash, Gamepad2, Trophy, Settings } from 'lucide-react';
import { playButtonClickSFX } from '../utils/mp3Player';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  starsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, starsCount }) => {
  const handleTabClick = (tab: TabType) => {
    playButtonClickSFX();
    onSelectTab(tab);
  };

  const navItems = [
    { id: 'home' as TabType, label: 'الرئيسية', desktopLabel: 'الرئيسية', icon: Home },
    { id: 'letters' as TabType, label: 'الحروف', desktopLabel: 'الحروف', icon: BookOpen },
    { id: 'numbers' as TabType, label: 'الأرقام', desktopLabel: 'الأرقام', icon: Hash },
    { id: 'games' as TabType, label: 'الألعاب', desktopLabel: 'الألعاب', icon: Gamepad2 },
    { id: 'hero_journey' as TabType, label: 'الأبطال', desktopLabel: 'رحلة الأبطال', icon: Trophy },
    { id: 'settings' as TabType, label: 'الإعدادات', desktopLabel: 'الإعدادات', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-sm border-b border-amber-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleTabClick('home')}
          className="flex items-center gap-3 group focus:outline-none focus:ring-4 focus:ring-teal-200 rounded-2xl p-1 transition-transform active:scale-95 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-white text-2xl font-black shadow-md shadow-teal-200 group-hover:rotate-6 transition-transform">
            🌟
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-black text-teal-950 tracking-tight">
              ألعب وأمرح
            </h1>
          </div>
        </button>

        {/* Navigation Tabs (Desktop & Tablet) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 bg-teal-50/80 p-1.5 rounded-3xl border border-teal-200/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-1.5 px-3 lg:px-4 py-2.5 rounded-2xl font-black text-sm lg:text-base transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-200 scale-105'
                    : 'text-teal-800 hover:bg-white/80 hover:text-teal-950'
                }`}
              >
                <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${isActive ? 'text-white' : 'text-teal-600'}`} />
                <span>{item.desktopLabel}</span>
              </button>
            );
          })}
        </nav>

        {/* Stars Counter */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-teal-100 to-cyan-100 px-3.5 py-2 rounded-2xl border border-teal-300 shadow-inner shrink-0">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 fill-amber-400 animate-pulse" />
          <span className="font-black text-lg sm:text-xl text-teal-950 dir-ltr">{starsCount}</span>
          <span className="text-xs font-black text-teal-800 hidden sm:inline">نجمة</span>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-teal-200 px-1 py-1.5 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1.5 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm scale-105 font-black'
                  : 'text-teal-800 hover:bg-teal-50 font-bold'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] sm:text-xs mt-0.5 leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
