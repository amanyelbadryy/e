export type TabType = 'home' | 'letters' | 'numbers' | 'games' | 'hero_journey' | 'coloring' | 'settings';

export interface HarakaDetail {
  symbol: string;      // e.g. "أَ"
  audio: string;       // e.g. "/audio/alphabet/fatha/alif_fatha.mp3"
  word: string;        // e.g. "أَسَد"
  wordAudio: string;   // e.g. "/audio/alphabet/words/alif_fatha_asad.mp3"
  emoji: string;       // e.g. "🦁"
}

export interface ArabicLetter {
  id: number;          // 1 to 28
  letter: string;      // "أ"
  name: string;        // "أَلِف"
  audio: string;       // "/audio/alphabet/letters/alif.mp3"
  color: string;       // vibrant card background color class
  basicWord: {
    word: string;      // "أَسَد"
    audio: string;     // "/audio/alphabet/basic_words/01_asad.mp3"
    emoji: string;     // "🦁"
    translation?: string;
  };
  harakat: {
    fatha: HarakaDetail;
    kasra: HarakaDetail;
    damma: HarakaDetail;
  };
}

export interface ArabicNumber {
  id: number;          // 0 to 10
  digit: string;       // "٠", "١", "٢"...
  number: number;      // 0, 1, 2...
  word: string;        // "صِفْر", "واحِد"...
  audio: string;       // "/audio/numbers/01_sifr.mp3"
  emoji: string;       // "🍎", "⭐"...
  countName: string;   // "تفاحة", "تفاحات"
  color: string;
}

export interface QuizQuestion {
  id: number;
  type: 'letter_sound' | 'letter_word' | 'count_number' | 'haraka_match';
  questionText: string;
  targetAudio?: string;
  targetSymbol?: string;
  targetEmoji?: string;
  itemCount?: number;
  options: {
    id: string;
    text: string;
    audio?: string;
    emoji?: string;
    isCorrect: boolean;
  }[];
}
