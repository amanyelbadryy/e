export interface AudioSettings {
  backgroundMusicEnabled: boolean;
  soundEffectsEnabled: boolean;
  pronunciationEnabled: boolean;
  backgroundMusicVolume: number;
  soundEffectsVolume: number;
  pronunciationVolume: number;
}

export interface AppSettings extends AudioSettings {
  notificationsEnabled: boolean;
  backgroundExecutionEnabled: boolean;
}

const STORAGE_KEYS = {
  bgMusic: 'alab_w_amrah_bg_music',
  sfx: 'alab_w_amrah_sfx',
  pronunciation: 'alab_w_amrah_pronunciation',
  bgMusicVol: 'alab_w_amrah_bg_music_vol',
  sfxVol: 'alab_w_amrah_sfx_vol',
  pronunciationVol: 'alab_w_amrah_pronunciation_vol',
  notifications: 'alab_w_amrah_notifications',
  bgExecution: 'alab_w_amrah_bg_execution',
};

// Safe LocalStorage helpers for iframe / restricted web contexts
function safeGetItem(key: string): string | null {
  try {
    return typeof window !== 'undefined' && window.localStorage ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function safeSetItem(key: string, val: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, val);
    }
  } catch {
    // Ignore storage quota/permission exceptions
  }
}

function safeRemoveItem(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
  } catch {
    // Ignore
  }
}

// In-memory session state for background music (resets to default on every fresh launch / reload)
let sessionBgMusicEnabled = true;
let sessionBgMusicVolume = 0.03;

/**
 * تحويل مسار الملف الصوتي إلى URL صالح ومُرمز للويب ومتوافق مع GitHub Pages والاستضافة الثابتة
 */
export function resolveAudioUrl(url: string): string {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return encodeURI(url);
  }

  // Get base URL from Vite (handles relative './', root '/', or custom subpath hosting like GitHub Pages)
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as { env?: { BASE_URL?: string } }).env : undefined;
  const baseUrl = metaEnv && metaEnv.BASE_URL ? metaEnv.BASE_URL : './';

  // Strip leading slash or relative prefix for clean joining
  const cleanPath = url.replace(/^(\.\/|\/)/, '');

  let fullPath = '';
  if (baseUrl === './' || baseUrl === '') {
    fullPath = `./${cleanPath}`;
  } else {
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    fullPath = `${normalizedBase}${cleanPath}`;
  }

  return encodeURI(fullPath);
}

/**
 * استرجاع إعدادات التطبيق الحالية
 */
export function getAppSettings(): AppSettings {
  // Clear any legacy localStorage values for background music to ensure fresh session defaults
  safeRemoveItem(STORAGE_KEYS.bgMusic);
  safeRemoveItem(STORAGE_KEYS.bgMusicVol);

  const sfx = safeGetItem(STORAGE_KEYS.sfx);
  const pronunciation = safeGetItem(STORAGE_KEYS.pronunciation);

  const sfxVol = safeGetItem(STORAGE_KEYS.sfxVol);
  const pronunciationVol = safeGetItem(STORAGE_KEYS.pronunciationVol);

  const notifications = safeGetItem(STORAGE_KEYS.notifications);
  const bgExecution = safeGetItem(STORAGE_KEYS.bgExecution);

  return {
    backgroundMusicEnabled: sessionBgMusicEnabled,
    soundEffectsEnabled: sfx === null ? true : sfx === 'true',
    pronunciationEnabled: pronunciation === null ? true : pronunciation === 'true',

    backgroundMusicVolume: sessionBgMusicVolume,
    soundEffectsVolume: sfxVol === null ? 0.60 : Math.max(0, Math.min(1, parseFloat(sfxVol))),
    pronunciationVolume: pronunciationVol === null ? 0.70 : Math.max(0, Math.min(1, parseFloat(pronunciationVol))),

    notificationsEnabled: notifications === null ? false : notifications === 'true',
    backgroundExecutionEnabled: bgExecution === null ? false : bgExecution === 'true',
  };
}

/**
 * حفظ الإعدادات وتحديث حالة الصوت
 */
export function saveAppSettings(newSettings: Partial<AppSettings>): AppSettings {
  if (newSettings.backgroundMusicEnabled !== undefined) {
    sessionBgMusicEnabled = newSettings.backgroundMusicEnabled;
    if (!sessionBgMusicEnabled) {
      stopBackgroundMusic();
    } else {
      playBackgroundMusic();
    }
  }

  if (newSettings.soundEffectsEnabled !== undefined) {
    safeSetItem(STORAGE_KEYS.sfx, newSettings.soundEffectsEnabled.toString());
  }

  if (newSettings.pronunciationEnabled !== undefined) {
    safeSetItem(STORAGE_KEYS.pronunciation, newSettings.pronunciationEnabled.toString());
  }

  if (newSettings.backgroundMusicVolume !== undefined) {
    const vol = Math.max(0, Math.min(1, newSettings.backgroundMusicVolume));
    sessionBgMusicVolume = vol;
    if (bgAudioInstance) {
      bgAudioInstance.volume = vol;
    }
  }

  if (newSettings.soundEffectsVolume !== undefined) {
    const vol = Math.max(0, Math.min(1, newSettings.soundEffectsVolume));
    safeSetItem(STORAGE_KEYS.sfxVol, vol.toString());
  }

  if (newSettings.pronunciationVolume !== undefined) {
    const vol = Math.max(0, Math.min(1, newSettings.pronunciationVolume));
    safeSetItem(STORAGE_KEYS.pronunciationVol, vol.toString());
  }

  if (newSettings.notificationsEnabled !== undefined) {
    safeSetItem(STORAGE_KEYS.notifications, newSettings.notificationsEnabled.toString());
  }

  if (newSettings.backgroundExecutionEnabled !== undefined) {
    safeSetItem(STORAGE_KEYS.bgExecution, newSettings.backgroundExecutionEnabled.toString());
  }

  return getAppSettings();
}

// Background Music Audio Element Instance (Lazy-loaded on demand only)
let bgAudioInstance: HTMLAudioElement | null = null;
let autoplayListenerAttached = false;

export const DEFAULT_BG_MUSIC_URL = '/audio/background/Starry Ukulele Parade.mp3';

/**
 * إعداد الاستماع لأول تفاعل مستخدم لتشغيل الموسيقى بشكل كسلان (Lazy)
 * بدون إنشاء Audio object أو تحميل الملف من الشبكة عند بدء التشغيل
 */
export function initLazyBackgroundMusic(musicUrl: string = DEFAULT_BG_MUSIC_URL): void {
  const settings = getAppSettings();
  if (!settings.backgroundMusicEnabled) {
    return;
  }

  if (!autoplayListenerAttached && typeof window !== 'undefined') {
    autoplayListenerAttached = true;
    const handleUserInteraction = () => {
      const currentSettings = getAppSettings();
      if (currentSettings.backgroundMusicEnabled) {
        playBackgroundMusic(musicUrl);
      }
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('pointerdown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      autoplayListenerAttached = false;
    };

    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true, passive: true });
    window.addEventListener('pointerdown', handleUserInteraction, { once: true });
    window.addEventListener('keydown', handleUserInteraction, { once: true });
  }
}

/**
 * تشغيل موسيقى الخلفية (يتم إنشاء عنصر Audio وتحميل الملف عند الاستدعاء الفعلي فقط)
 */
export function playBackgroundMusic(musicUrl: string = DEFAULT_BG_MUSIC_URL): void {
  const settings = getAppSettings();
  if (!settings.backgroundMusicEnabled) {
    stopBackgroundMusic();
    return;
  }

  const resolvedUrl = resolveAudioUrl(musicUrl);

  if (!bgAudioInstance) {
    bgAudioInstance = new Audio(resolvedUrl);
    bgAudioInstance.loop = true;
    bgAudioInstance.preload = 'auto';
  } else if (bgAudioInstance.src !== resolvedUrl && !bgAudioInstance.src.endsWith(resolvedUrl)) {
    bgAudioInstance.src = resolvedUrl;
  }

  bgAudioInstance.volume = settings.backgroundMusicVolume;

  if (bgAudioInstance.paused) {
    const playPromise = bgAudioInstance.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('[MP3 Player] Background music autoplay waiting for interaction:', err?.message || err);
        // إذا منع المتصفح التشغيل التلقائي، ننتظر تفاعلاً حقيقياً
        initLazyBackgroundMusic(musicUrl);
      });
    }
  }
}

/**
 * إيقاف موسيقى الخلفية
 */
export function stopBackgroundMusic(): void {
  if (bgAudioInstance) {
    bgAudioInstance.pause();
  }
}

/**
 * مسارات المؤثرات الصوتية الرسمية للنظام
 */
export const SOUND_EFFECTS = {
  successLevelPassed: '/audio/effects/01_success_level_passed.mp3',
  buttonClick: '/audio/effects/02_button_click.mp3',
  levelUp: '/audio/effects/03_level_up.mp3',
  notification: '/audio/effects/04_notification.mp3',
  successKids: '/audio/effects/05_success_kids.mp3',
  gameLevelUp: '/audio/effects/06_game_level_up.mp3',
} as const;

/**
 * تشغيل مؤثر صوتی محدد حسب المسار أو النوع
 */
export function playSoundEffect(effectPath: string): HTMLAudioElement | null {
  return playMP3(effectPath);
}

export function playButtonClickSFX(): HTMLAudioElement | null {
  return playMP3(SOUND_EFFECTS.buttonClick);
}

export function playLevelUpSFX(): HTMLAudioElement | null {
  return playMP3(SOUND_EFFECTS.levelUp);
}

export function playSuccessLevelPassedSFX(): HTMLAudioElement | null {
  return playMP3(SOUND_EFFECTS.successLevelPassed);
}

export function playNotificationSFX(): HTMLAudioElement | null {
  return playMP3(SOUND_EFFECTS.notification);
}

export function playSuccessKidsSFX(): HTMLAudioElement | null {
  return playMP3(SOUND_EFFECTS.successKids);
}

export function playGameLevelUpSFX(): HTMLAudioElement | null {
  return playMP3(SOUND_EFFECTS.gameLevelUp);
}

/**
 * فحص ما إذا كان الرابط يتبع للمؤثرات الصوتية والتقييم
 */
export function isFeedbackOrSFX(url: string): boolean {
  const lower = url.toLowerCase();
  return (
    lower.includes('/audio/feedback/') ||
    lower.includes('/audio/effects/') ||
    lower.includes('/sfx/') ||
    lower.includes('feedback') ||
    lower.includes('click') ||
    lower.includes('level') ||
    lower.includes('notification')
  );
}

/**
 * فحص ما إذا كان الرابط يتبع لأصوات النطق التعليمية
 */
export function isPronunciationAudio(url: string): boolean {
  const lower = url.toLowerCase();
  return (
    lower.includes('/audio/alphabet/') ||
    lower.includes('/audio/numbers/') ||
    lower.includes('/replacement_audio/') ||
    lower.includes('/pronunciation/') ||
    lower.includes('letter') ||
    lower.includes('fatha') ||
    lower.includes('kasra') ||
    lower.includes('damma') ||
    lower.includes('word') ||
    lower.includes('number')
  );
}

// Current playing pronunciation audio instance to prevent overlap
let currentPronunciationAudio: HTMLAudioElement | null = null;

/**
 * تشغيل ملف MP3 محلي فقط (مسار -> HTMLAudioElement -> play)
 */
export function playMP3(rawUrl: string): HTMLAudioElement | null {
  if (!rawUrl) return null;

  const url = resolveAudioUrl(rawUrl);
  const settings = getAppSettings();

  if (isFeedbackOrSFX(rawUrl)) {
    if (!settings.soundEffectsEnabled) return null;
  } else if (isPronunciationAudio(rawUrl)) {
    if (!settings.pronunciationEnabled) return null;
    // Stop any currently playing pronunciation audio to prevent overlap
    if (currentPronunciationAudio) {
      try {
        currentPronunciationAudio.pause();
        currentPronunciationAudio.currentTime = 0;
      } catch {
        // Ignore
      }
      currentPronunciationAudio = null;
    }
  } else if (!settings.soundEffectsEnabled && !settings.pronunciationEnabled) {
    return null;
  }

  try {
    const audio = new Audio(url);
    audio.preload = 'auto';

    if (isFeedbackOrSFX(rawUrl)) {
      audio.volume = settings.soundEffectsVolume;
    } else if (isPronunciationAudio(rawUrl)) {
      audio.volume = settings.pronunciationVolume;
    } else {
      audio.volume = settings.soundEffectsVolume;
    }

    if (isPronunciationAudio(rawUrl)) {
      currentPronunciationAudio = audio;
      audio.onended = () => {
        if (currentPronunciationAudio === audio) {
          currentPronunciationAudio = null;
        }
      };
    }

    audio.onerror = (e) => {
      console.warn('[MP3 Player] Audio file load error for:', url, e);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('[MP3 Player] Playback prevented or failed:', url, err);
      });
    }

    return audio;
  } catch (err) {
    console.warn('[MP3 Player] Audio initialization error:', url, err);
    return null;
  }
}

/**
 * إيقاف الصوت التعليمي الحالي فوراً
 */
export function stopPronunciationAudio(): void {
  if (currentPronunciationAudio) {
    try {
      currentPronunciationAudio.pause();
      currentPronunciationAudio.currentTime = 0;
    } catch {
      // Ignore
    }
    currentPronunciationAudio = null;
  }
}


