import { ALPHABET_DATA } from '../alphabetData';
import { shuffleArray, getRandomItems } from './bankUtils';

export interface LetterPictureQuestion {
  id: string;
  emoji: string;
  word: string;
  correctLetter: string;
  audio: string;
  options: string[];
}

export function getLetterPictureDeck(count: number = 10): LetterPictureQuestion[] {
  const selectedAlphabet = getRandomItems(ALPHABET_DATA, count);

  return selectedAlphabet.map((item, idx) => {
    const wrongPool = ALPHABET_DATA.filter((l) => l.id !== item.id).map((l) => l.letter);
    const selectedWrongs = getRandomItems(wrongPool, 3);
    const options = shuffleArray([item.letter, ...selectedWrongs]);

    return {
      id: `lp_deck_${idx}_${Date.now()}`,
      emoji: item.basicWord.emoji,
      word: item.basicWord.word,
      correctLetter: item.letter,
      audio: item.basicWord.audio,
      options,
    };
  });
}
