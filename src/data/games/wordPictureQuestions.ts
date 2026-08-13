import { ALPHABET_DATA } from '../alphabetData';
import { shuffleArray, getRandomItems } from './bankUtils';

export interface WordPictureQuestion {
  id: string;
  emoji: string;
  correctWord: string;
  audio: string;
  options: string[];
}

export function getWordPictureDeck(count: number = 10): WordPictureQuestion[] {
  // Extract all words across ALPHABET_DATA
  const allWordsPool: Array<{ word: string; emoji: string; audio: string }> = [];

  ALPHABET_DATA.forEach((item) => {
    allWordsPool.push({
      word: item.basicWord.word,
      emoji: item.basicWord.emoji,
      audio: item.basicWord.audio,
    });
    if (item.harakat.fatha) {
      allWordsPool.push({
        word: item.harakat.fatha.word,
        emoji: item.harakat.fatha.emoji,
        audio: item.harakat.fatha.audio,
      });
    }
  });

  const selectedTargets = getRandomItems(allWordsPool, count);

  return selectedTargets.map((item, idx) => {
    const wrongWords = allWordsPool
      .filter((w) => w.word !== item.word)
      .map((w) => w.word);
    const selectedWrongs = getRandomItems(wrongWords, 3);
    const options = shuffleArray([item.word, ...selectedWrongs]);

    return {
      id: `wp_deck_${idx}_${Date.now()}`,
      emoji: item.emoji,
      correctWord: item.word,
      audio: item.audio,
      options,
    };
  });
}
