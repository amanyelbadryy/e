import { ALPHABET_DATA } from '../alphabetData';
import { shuffleArray, getRandomItems } from './bankUtils';

export interface HarakatQuestion {
  id: string;
  letter: string;
  harakaType: 'fatha' | 'kasra' | 'damma';
  targetSymbol: string;
  audio: string;
  word: string;
  emoji: string;
  options: Array<{
    type: 'fatha' | 'kasra' | 'damma';
    symbol: string;
  }>;
}

export function getHarakatDeck(count: number = 10): HarakatQuestion[] {
  const types: Array<'fatha' | 'kasra' | 'damma'> = ['fatha', 'kasra', 'damma'];
  
  // Create all possible combinations (28 letters x 3 harakat = 84 items)
  const allCombinations: Array<{ letter: typeof ALPHABET_DATA[0]; harakaType: 'fatha' | 'kasra' | 'damma' }> = [];
  ALPHABET_DATA.forEach((letter) => {
    types.forEach((type) => {
      allCombinations.push({ letter, harakaType: type });
    });
  });

  const selected = getRandomItems(allCombinations, count);

  return selected.map((item, idx) => {
    const { letter, harakaType } = item;
    const targetHaraka = letter.harakat[harakaType];

    const rawOptions = [
      { type: 'fatha' as const, symbol: letter.harakat.fatha.symbol },
      { type: 'kasra' as const, symbol: letter.harakat.kasra.symbol },
      { type: 'damma' as const, symbol: letter.harakat.damma.symbol },
    ];

    const options = shuffleArray(rawOptions);

    return {
      id: `haraka_deck_${idx}_${Date.now()}`,
      letter: letter.letter,
      harakaType,
      targetSymbol: targetHaraka.symbol,
      audio: targetHaraka.audio,
      word: targetHaraka.word,
      emoji: targetHaraka.emoji,
      options,
    };
  });
}
