import React, { useState, useEffect } from 'react';
import {
  getAppSettings,
  saveAppSettings,
  AppSettings,
  playNotificationSFX,
  playButtonClickSFX
} from '../utils/mp3Player';
import {
  Settings,
  Volume2,
  Music,
  Sparkles,
  Mic,
  Bell,
  PlayCircle,
  AlertCircle,
  CheckCircle2,
  Smartphone,
  Star,
  RefreshCw,
  Gamepad2
} from 'lucide-react';

interface SettingsViewProps {
  onResetStars: () => void;
  starsCount: number;
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  ariaLabel?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  id,
  ariaLabel
}) => {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => {
        playButtonClickSFX();
        if (!disabled) onChange(!checked);
      }}
      className={`relative inline-flex items-center h-10 rounded-full w-28 px-1 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 border-2 select-none dir-ltr ${
        disabled
          ? 'bg-slate-200 border-slate-300 opacity-60 cursor-not-allowed'
          : checked
          ? 'bg-teal-600 border-teal-700 shadow-xs'
          : 'bg-slate-300 border-slate-400'
      }`}
    >
      {/* State Text Label inside button */}
      <span
        className={`absolute text-[11px] font-black transition-opacity duration-200 ${
          checked ? 'right-3 text-white' : 'left-3 text-slate-700'
        }`}
      >
        {checked ? 'مفعّل ON' : 'مغلق OFF'}
      </span>

      {/* Sliding Circle Knob */}
      <span
        className={`inline-block w-8 h-8 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out flex items-center justify-center text-xs font-black ${
          checked ? 'translate-x-18 text-teal-700' : 'translate-x-0 text-slate-400'
        }`}
      >
        {checked ? '✓' : '✕'}
      </span>
    </button>
  );
};

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetStars, starsCount }) => {
  const [settings, setSettings] = useState<AppSettings>(() => getAppSettings());
  const [notificationPermission, setNotificationPermission] = useState<string>('default');
  const [isNativeEnv, setIsNativeEnv] = useState<boolean>(false);

  // Load initial settings and check OS permissions / environment
  useEffect(() => {
    setSettings(getAppSettings());

    // Check Notification API support
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    } else {
      setNotificationPermission('unsupported');
    }

    // Check if running in Capacitor/Native environment
    if (typeof window !== 'undefined') {
      const win = window as any;
      if (win.Capacitor || win.AndroidInterface || win.cordova) {
        setIsNativeEnv(true);
      } else {
        setIsNativeEnv(false);
      }
    }
  }, []);

  // Update a single setting independently
  const handleToggle = (key: keyof AppSettings, value: boolean) => {
    // If turning notifications ON, request browser/OS permission
    if (key === 'notificationsEnabled' && value) {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        Notification.requestPermission().then((permission) => {
          setNotificationPermission(permission);
          if (permission === 'granted') {
            const updated = saveAppSettings({ [key]: true });
            setSettings(updated);
            playNotificationSFX();
          } else {
            // Permission denied or dismissed by OS
            const updated = saveAppSettings({ [key]: false });
            setSettings(updated);
          }
        });
        return;
      } else {
        setNotificationPermission('unsupported');
        const updated = saveAppSettings({ [key]: false });
        setSettings(updated);
        return;
      }
    }

    const updated = saveAppSettings({ [key]: value });
    setSettings(updated);
    if (key === 'soundEffectsEnabled' && value) {
      playButtonClickSFX();
    }
  };

  const handleVolumeChange = (key: keyof AppSettings, value: number) => {
    const updated = saveAppSettings({ [key]: value });
    setSettings(updated);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-28 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-1.5 rounded-full font-black text-sm border border-teal-200">
          <Gamepad2 className="w-4 h-4 text-teal-600" />
          <span>تفضيلات التحكم</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center justify-center gap-2">
          <span>⚙️ الإعدادات</span>
          <span className="text-3xl md:text-4xl">🎮</span>
        </h2>
        <p className="text-sm font-bold text-slate-600">
          التحكم المستقل بأصوات الخلفية والمؤثرات والإشعارات بكل سهولة
        </p>
      </div>

      {/* SECTION 1: AUDIO SETTINGS (إعدادات الصوت) */}
      <div className="bg-white rounded-3xl p-6 border-4 border-teal-200 shadow-md space-y-5">
        <div className="flex items-center gap-3 border-b border-teal-100 pb-4">
          <div className="p-3 bg-teal-500 text-white rounded-2xl shadow-xs">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">🔊 إعدادات الصوت</h3>
            <p className="text-xs font-bold text-teal-700">تحكم بـ 3 أنواع من الأصوات بشكل مستقل تماماً</p>
          </div>
        </div>

        <div className="space-y-4 divide-y divide-slate-100">
          {/* 1. Pronunciation Sounds Row */}
          <div className="pt-2 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl mt-0.5 shrink-0">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    🔊 أصوات النطق
                  </h4>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">
                    أصوات الحروف والحركات والكلمات والأرقام (التعليمية).
                  </p>
                </div>
              </div>

              <ToggleSwitch
                id="pronunciation-toggle"
                ariaLabel="أصوات النطق"
                checked={settings.pronunciationEnabled}
                onChange={(val) => handleToggle('pronunciationEnabled', val)}
              />
            </div>

            {/* Slider */}
            <div className="flex items-center gap-3 bg-rose-50/80 p-3 rounded-2xl border border-rose-200">
              <span className="text-xs font-black text-rose-900 w-24 shrink-0 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-rose-600" />
                مستوى الصوت:
              </span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={Math.round((settings.pronunciationVolume ?? 0.7) * 100)}
                onChange={(e) => handleVolumeChange('pronunciationVolume', Number(e.target.value) / 100)}
                className="w-full h-3 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-600 focus:outline-none"
              />
              <span className="text-xs font-black text-rose-900 w-12 text-center bg-white px-2.5 py-1 rounded-xl border border-rose-200 shadow-xs dir-ltr shrink-0">
                {Math.round((settings.pronunciationVolume ?? 0.7) * 100)}%
              </span>
            </div>
          </div>

          {/* 2. Sound Effects Row */}
          <div className="pt-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-sky-100 text-sky-700 rounded-xl mt-0.5 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    ✨ صوت المؤثرات
                  </h4>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">
                    أصوات النقر والتفاعل والنجاح والخطأ (تتضمن أصوات التشجيع والتقييم Feedback).
                  </p>
                </div>
              </div>

              <ToggleSwitch
                id="sfx-toggle"
                ariaLabel="صوت المؤثرات"
                checked={settings.soundEffectsEnabled}
                onChange={(val) => handleToggle('soundEffectsEnabled', val)}
              />
            </div>

            {/* Slider */}
            <div className="flex items-center gap-3 bg-sky-50/80 p-3 rounded-2xl border border-sky-200">
              <span className="text-xs font-black text-sky-900 w-24 shrink-0 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-sky-600" />
                مستوى الصوت:
              </span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={Math.round((settings.soundEffectsVolume ?? 0.6) * 100)}
                onChange={(e) => handleVolumeChange('soundEffectsVolume', Number(e.target.value) / 100)}
                className="w-full h-3 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-sky-600 focus:outline-none"
              />
              <span className="text-xs font-black text-sky-900 w-12 text-center bg-white px-2.5 py-1 rounded-xl border border-sky-200 shadow-xs dir-ltr shrink-0">
                {Math.round((settings.soundEffectsVolume ?? 0.6) * 100)}%
              </span>
            </div>
          </div>

          {/* 3. Background Music Row */}
          <div className="pt-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl mt-0.5 shrink-0">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    🎵 صوت الخلفية
                  </h4>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">
                    تشغيل أو إيقاف موسيقى الخلفية (Starry Ukulele Parade).
                  </p>
                </div>
              </div>

              <ToggleSwitch
                id="bg-music-toggle"
                ariaLabel="صوت الخلفية"
                checked={settings.backgroundMusicEnabled}
                onChange={(val) => handleToggle('backgroundMusicEnabled', val)}
              />
            </div>

            {/* Slider */}
            <div className="flex items-center gap-3 bg-amber-50/80 p-3 rounded-2xl border border-amber-200">
              <span className="text-xs font-black text-amber-900 w-24 shrink-0 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-600" />
                مستوى الصوت:
              </span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={Math.round((settings.backgroundMusicVolume ?? 0.03) * 100)}
                onChange={(e) => handleVolumeChange('backgroundMusicVolume', Number(e.target.value) / 100)}
                className="w-full h-3 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none"
              />
              <span className="text-xs font-black text-amber-900 w-12 text-center bg-white px-2.5 py-1 rounded-xl border border-amber-200 shadow-xs dir-ltr shrink-0">
                {Math.round((settings.backgroundMusicVolume ?? 0.03) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: NOTIFICATIONS & BACKGROUND EXECUTION */}
      <div className="bg-white rounded-3xl p-6 border-4 border-indigo-200 shadow-md space-y-5">
        <div className="flex items-center gap-3 border-b border-indigo-100 pb-4">
          <div className="p-3 bg-indigo-500 text-white rounded-2xl shadow-xs">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">🔔 الإشعارات والتشغيل</h3>
            <p className="text-xs font-bold text-indigo-700">إدارة إشعارات التطبيق وإعدادات التشغيل في الخلفية</p>
          </div>
        </div>

        <div className="space-y-4 divide-y divide-slate-100">
          {/* 1. Notifications Toggle */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl mt-0.5 shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-black text-slate-900">🔔 تشغيل الإشعارات</h4>
                  {notificationPermission === 'granted' && (
                    <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      مسموح بالنظام
                    </span>
                  )}
                  {notificationPermission === 'denied' && (
                    <span className="text-[11px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      مرفوض من النظام
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-slate-500">
                  السماح للتطبيق بإرسال إشعارات التذكير بالتعلم.
                </p>
              </div>
            </div>

            <ToggleSwitch
              id="notifications-toggle"
              ariaLabel="تشغيل الإشعارات"
              checked={settings.notificationsEnabled && notificationPermission === 'granted'}
              onChange={(val) => handleToggle('notificationsEnabled', val)}
            />
          </div>

          {/* 2. Background Execution Toggle */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl mt-0.5 shrink-0">
                <PlayCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-black text-slate-900">▶️ التشغيل في الخلفية</h4>
                  {isNativeEnv ? (
                    <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                      بيئة تطبيق APK
                    </span>
                  ) : (
                    <span className="text-[11px] font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      متصفح الويب
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-slate-500">
                  السماح للتطبيق بالاستمرار في العمل عند الانتقال إلى تطبيق آخر أو إغلاق الشاشة، عندما يسمح نظام التشغيل بذلك.
                </p>
                {!isNativeEnv && (
                  <p className="text-[11px] font-bold text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200 mt-1">
                    ملاحظة: التشغيل الحقيقي في الخلفية يتطلب تطبيق الهواتف بصيغة (Native APK / Capacitor) حسب صلاحيات نظام التشغيل.
                  </p>
                )}
              </div>
            </div>

            <ToggleSwitch
              id="bg-execution-toggle"
              ariaLabel="التشغيل في الخلفية"
              checked={settings.backgroundExecutionEnabled}
              onChange={(val) => handleToggle('backgroundExecutionEnabled', val)}
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: PROGRESS & STARS RESET */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl font-black">
            <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <h4 className="font-black text-slate-900">رصيدك الحالي من النجوم</h4>
            <p className="text-xs font-bold text-slate-500">لديك الآن {starsCount} نجمة مكتسبة من الألعاب والأنشطة</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            playButtonClickSFX();
            onResetStars();
          }}
          className="bg-rose-100 text-rose-800 hover:bg-rose-200 px-5 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 border border-rose-200 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>إعادة ضبط النجوم إلى الصفر</span>
        </button>
      </div>
    </div>
  );
};
