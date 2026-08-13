import { ALPHABET_DATA } from '../alphabetData';
import { shuffleArray, getRandomItems } from './bankUtils';

export interface ListenLetterQuestion {
  id: string;
  targetLetter: string;
  targetName: string;
  audio: string;
  options: string[];
  prompt: string;
}

export function getListenLetterDeck(count: number = 10): ListenLetterQuestion[] {
  const selectedLetters = getRandomItems(ALPHABET_DATA, count);
  return selectedLetters.map((letterItem, idx) => {
    const wrongPool = ALPHABET_DATA.filter((l) => l.id !== letterItem.id);
    const randomWrongs = shuffleArray(wrongPool).slice(0, 3).map((l) => l.letter);
    const options = shuffleArray([letterItem.letter, ...randomWrongs]);
    return {
      id: `ll_deck_${idx}_${Date.now()}`,
      targetLetter: letterItem.letter,
      targetName: letterItem.name,
      audio: letterItem.audio,
      options,
      prompt: 'اِسْتَمِعْ جَيِّداً وَاخْتَرِ الإِجَابَةَ',
    };
  });
}
