import { ArabicNumber } from '../types';

export const NUMBERS_DATA: ArabicNumber[] = [
  {
    id: 0,
    number: 0,
    digit: '٠',
    word: 'صِفْر',
    audio: '/audio/numbers/01_sifr.mp3',
    emoji: '⚪',
    countName: 'لا شيء',
    color: 'bg-slate-500 hover:bg-slate-600 text-white'
  },
  {
    id: 1,
    number: 1,
    digit: '١',
    word: 'واحِد',
    audio: '/audio/numbers/02_wahid.mp3',
    emoji: '🍎',
    countName: 'تفاحة واحدة',
    color: 'bg-rose-500 hover:bg-rose-600 text-white'
  },
  {
    id: 2,
    number: 2,
    digit: '٢',
    word: 'اثْنان',
    audio: '/audio/numbers/03_ithnan.mp3',
    emoji: '🐥',
    countName: 'كتكوتان',
    color: 'bg-amber-500 hover:bg-amber-600 text-white'
  },
  {
    id: 3,
    number: 3,
    digit: '٣',
    word: 'ثَلاثَة',
    audio: '/audio/numbers/04_thalatha.mp3',
    emoji: '⭐',
    countName: 'ثلاث نجوم',
    color: 'bg-emerald-500 hover:bg-emerald-600 text-white'
  },
  {
    id: 4,
    number: 4,
    digit: '٤',
    word: 'أَرْبَعَة',
    audio: '/audio/numbers/05_arbaa.mp3',
    emoji: '🎈',
    countName: 'أربع بالونات',
    color: 'bg-sky-500 hover:bg-sky-600 text-white'
  },
  {
    id: 5,
    number: 5,
    digit: '٥',
    word: 'خَمْسَة',
    audio: '/audio/numbers/06_khamsa.mp3',
    emoji: '🌸',
    countName: 'خمس أزهار',
    color: 'bg-pink-500 hover:bg-pink-600 text-white'
  },
  {
    id: 6,
    number: 6,
    digit: '٦',
    word: 'سِتَّة',
    audio: '/audio/numbers/07_sitta.mp3',
    emoji: '🚗',
    countName: 'ست سيارات',
    color: 'bg-indigo-500 hover:bg-indigo-600 text-white'
  },
  {
    id: 7,
    number: 7,
    digit: '٧',
    word: 'سَبْعَة',
    audio: '/audio/numbers/08_sabaa.mp3',
    emoji: '🦋',
    countName: 'سبع فراشات',
    color: 'bg-teal-500 hover:bg-teal-600 text-white'
  },
  {
    id: 8,
    number: 8,
    digit: '٨',
    word: 'ثَمانِيَة',
    audio: '/audio/numbers/09_thamaniya.mp3',
    emoji: '🍇',
    countName: 'ثماني حبات عنب',
    color: 'bg-purple-500 hover:bg-purple-600 text-white'
  },
  {
    id: 9,
    number: 9,
    digit: '٩',
    word: 'تِسْعَة',
    audio: '/audio/numbers/10_tisaa.mp3',
    emoji: '🐟',
    countName: 'تسع أسماك',
    color: 'bg-cyan-500 hover:bg-cyan-600 text-white'
  },
  {
    id: 10,
    number: 10,
    digit: '١٠',
    word: 'عَشَرَة',
    audio: '/audio/numbers/11_ashara.mp3',
    emoji: '🎁',
    countName: 'عشر هدايا',
    color: 'bg-orange-500 hover:bg-orange-600 text-white'
  }
];

export const FEEDBACK_AUDIO = {
  raea: '/audio/feedback/01_raea.mp3',
  momtaz: '/audio/feedback/02_momtaz.mp3',
  hawelMarraOkhra: '/audio/feedback/03_hawel_marra_okhra.mp3',
  hawelMarraOkhraFelSoalEltaly: '/audio/feedback/04_hawel_marra_okhra_fel_soal_eltaly.mp3',
  elmarhalaEltalya: '/audio/feedback/05_elmarhala_eltalya.mp3',
  microphoneUnclear: '/audio/feedback/06_microphone_unclear.mp3',
};
