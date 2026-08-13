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

// In-memory session state for background music (resets to default on every fresh launch / reload)
let sessionBgMusicEnabled = true;
let sessionBgMusicVolume = 0.03;

/**
 * استرجاع إعدادات التطبيق الحالية
 */
export function getAppSettings(): AppSettings {
  // Clear any legacy localStorage values for background music to ensure fresh session defaults
  try {
    localStorage.removeItem(STORAGE_KEYS.bgMusic);
    localStorage.removeItem(STORAGE_KEYS.bgMusicVol);
  } catch (e) {
    // Ignore storage exceptions if any
  }

  const sfx = localStorage.getItem(STORAGE_KEYS.sfx);
  const pronunciation = localStorage.getItem(STORAGE_KEYS.pronunciation);

  const sfxVol = localStorage.getItem(STORAGE_KEYS.sfxVol);
  const pronunciationVol = localStorage.getItem(STORAGE_KEYS.pronunciationVol);

  const notifications = localStorage.getItem(STORAGE_KEYS.notifications);
  const bgExecution = localStorage.getItem(STORAGE_KEYS.bgExecution);

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
    localStorage.setItem(STORAGE_KEYS.sfx, newSettings.soundEffectsEnabled.toString());
  }

  if (newSettings.pronunciationEnabled !== undefined) {
    localStorage.setItem(STORAGE_KEYS.pronunciation, newSettings.pronunciationEnabled.toString());
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
    localStorage.setItem(STORAGE_KEYS.sfxVol, vol.toString());
  }

  if (newSettings.pronunciationVolume !== undefined) {
    const vol = Math.max(0, Math.min(1, newSettings.pronunciationVolume));
    localStorage.setItem(STORAGE_KEYS.pronunciationVol, vol.toString());
  }

  if (newSettings.notificationsEnabled !== undefined) {
    localStorage.setItem(STORAGE_KEYS.notifications, newSettings.notificationsEnabled.toString());
  }

  if (newSettings.backgroundExecutionEnabled !== undefined) {
    localStorage.setItem(STORAGE_KEYS.bgExecution, newSettings.backgroundExecutionEnabled.toString());
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
      window.removeEventListener('keydown', handleUserInteraction);
      autoplayListenerAttached = false;
    };

    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });
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

  if (!bgAudioInstance) {
    bgAudioInstance = new Audio(musicUrl);
    bgAudioInstance.loop = true;
  }

  bgAudioInstance.volume = settings.backgroundMusicVolume;

  if (bgAudioInstance.paused) {
    bgAudioInstance.play().catch(() => {
      // إذا منع المتصفح التشغيل التلقائي حتى بعد الاستدعاء، ننتظر تفاعلاً إضافياً
      initLazyBackgroundMusic(musicUrl);
    });
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
 * Web Audio API synthesized fallback for sound effects if audio file playback fails
 */
function playSynthesizedSFX(url: string): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const lower = url.toLowerCase();
    if (lower.includes('click') || lower.includes('button')) {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (lower.includes('success') || lower.includes('level') || lower.includes('notification')) {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch {
    // Ignore audio context errors
  }
}

/**
 * تشغيل ملف MP3 محلي فقط (مسار -> HTMLAudioElement -> play)
 */
export function playMP3(url: string): HTMLAudioElement | null {
  if (!url) return null;

  const settings = getAppSettings();

  if (isFeedbackOrSFX(url)) {
    if (!settings.soundEffectsEnabled) return null;
  } else if (isPronunciationAudio(url)) {
    if (!settings.pronunciationEnabled) return null;
    // Stop any currently playing pronunciation audio to prevent overlap
    if (currentPronunciationAudio) {
      currentPronunciationAudio.pause();
      currentPronunciationAudio.currentTime = 0;
      currentPronunciationAudio = null;
    }
  } else if (!settings.soundEffectsEnabled && !settings.pronunciationEnabled) {
    return null;
  }

  try {
    const audio = new Audio(url);

    if (isFeedbackOrSFX(url)) {
      audio.volume = settings.soundEffectsVolume;
    } else if (isPronunciationAudio(url)) {
      audio.volume = settings.pronunciationVolume;
    } else {
      audio.volume = settings.soundEffectsVolume;
    }

    if (isPronunciationAudio(url)) {
      currentPronunciationAudio = audio;
      audio.onended = () => {
        if (currentPronunciationAudio === audio) {
          currentPronunciationAudio = null;
        }
      };
    }

    audio.onerror = (e) => {
      console.warn('[MP3 Player] Audio element loading error:', url, e);
      if (isFeedbackOrSFX(url)) {
        playSynthesizedSFX(url);
      }
    };

    audio.play().catch((err) => {
      console.warn('[MP3 Player] Playback prevented or failed:', url, err);
      if (isFeedbackOrSFX(url)) {
        playSynthesizedSFX(url);
      }
    });

    return audio;
  } catch (err) {
    console.warn('[MP3 Player] Audio initialization error:', url, err);
    if (isFeedbackOrSFX(url)) {
      playSynthesizedSFX(url);
    }
    return null;
  }
}

/**
 * إيقاف الصوت التعليمي الحالي فوراً
 */
export function stopPronunciationAudio(): void {
  if (currentPronunciationAudio) {
    currentPronunciationAudio.pause();
    currentPronunciationAudio.currentTime = 0;
    currentPronunciationAudio = null;
  }
}


