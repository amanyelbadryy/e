import { ALPHABET_DATA } from '../alphabetData';
import { shuffleArray, getRandomItems } from './bankUtils';

export interface CompleteWordQuestion {
  id: string;
  displayWord: string;
  fullWord: string;
  missingLetter: string;
  emoji: string;
  audio: string;
  options: string[];
}

export function getCompleteWordDeck(count: number = 10): CompleteWordQuestion[] {
  // Collect all available words with emojis
  const pool: Array<{ fullWord: string; firstLetter: string; emoji: string; audio: string }> = [];

  ALPHABET_DATA.forEach((item) => {
    // Basic word
    if (item.basicWord) {
      pool.push({
        fullWord: item.basicWord.word,
        firstLetter: item.letter,
        emoji: item.basicWord.emoji,
        audio: item.basicWord.audio,
      });
    }
    // Harakat words
    if (item.harakat.fatha) {
      pool.push({
        fullWord: item.harakat.fatha.word,
        firstLetter: item.letter,
        emoji: item.harakat.fatha.emoji,
        audio: item.harakat.fatha.audio,
      });
    }
    if (item.harakat.kasra) {
      pool.push({
        fullWord: item.harakat.kasra.word,
        firstLetter: item.letter,
        emoji: item.harakat.kasra.emoji,
        audio: item.harakat.kasra.audio,
      });
    }
    if (item.harakat.damma) {
      pool.push({
        fullWord: item.harakat.damma.word,
        firstLetter: item.letter,
        emoji: item.harakat.damma.emoji,
        audio: item.harakat.damma.audio,
      });
    }
  });

  const selectedWords = getRandomItems(pool, count);

  return selectedWords.map((item, idx) => {
    // Mask the first letter or first character of the word
    const firstChar = item.fullWord.charAt(0);
    const displayWord = 'ـ' + item.fullWord.slice(1); // e.g. ـَسَد or _َسَد

    const wrongLetters = ALPHABET_DATA.filter((l) => l.letter !== item.firstLetter)
      .map((l) => l.letter);
    const selectedWrongs = getRandomItems(wrongLetters, 3);
    const options = shuffleArray([item.firstLetter, ...selectedWrongs]);

    return {
      id: `cw_deck_${idx}_${Date.now()}`,
      displayWord: `ـ${item.fullWord.slice(1)}`,
      fullWord: item.fullWord,
      missingLetter: item.firstLetter,
      emoji: item.emoji,
      audio: item.audio,
      options,
    };
  });
}
