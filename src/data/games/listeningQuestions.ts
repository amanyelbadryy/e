import { ALPHABET_DATA } from '../alphabetData';
import { NUMBERS_DATA } from '../numbersData';
import { shuffleArray, getRandomItems } from './bankUtils';

export interface ListeningQuestion {
  id: string;
  type: 'letter' | 'number' | 'word';
  correctText: string;
  audio: string;
  options: string[];
  prompt: string;
}

export function getMixedListeningDeck(count: number = 10): ListeningQuestion[] {
  const items: ListeningQuestion[] = [];

  // Generate a random mix of letters and numbers
  for (let i = 0; i < count; i++) {
    const isLetter = Math.random() > 0.4;

    if (isLetter) {
      const letterTarget = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
      const wrongs = ALPHABET_DATA
        .filter((l) => l.id !== letterTarget.id)
        .map((l) => l.letter);
      const selectedWrongs = getRandomItems(wrongs, 3);
      const options = shuffleArray([letterTarget.letter, ...selectedWrongs]);

      items.push({
        id: `ml_letter_${i}_${Date.now()}`,
        type: 'letter',
        correctText: letterTarget.letter,
        audio: letterTarget.audio,
        options,
        prompt: 'اِسْتَمِعْ جَيِّداً وَاخْتَرِ الإِجَابَةَ',
      });
    } else {
      const numTarget = NUMBERS_DATA[Math.floor(Math.random() * NUMBERS_DATA.length)];
      const wrongs = NUMBERS_DATA
        .filter((n) => n.id !== numTarget.id)
        .map((n) => n.digit);
      const selectedWrongs = getRandomItems(wrongs, 3);
      const options = shuffleArray([numTarget.digit, ...selectedWrongs]);

      items.push({
        id: `ml_num_${i}_${Date.now()}`,
        type: 'number',
        correctText: numTarget.digit,
        audio: numTarget.audio,
        options,
        prompt: 'اِسْتَمِعْ جَيِّداً وَاخْتَرِ الإِجَابَةَ',
      });
    }
  }

  return items;
}
