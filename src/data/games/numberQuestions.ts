import { NUMBERS_DATA } from '../numbersData';
import { shuffleArray, getRandomItems } from './bankUtils';

export interface NumberQuestion {
  id: string;
  type: 'count' | 'listen';
  number: number;
  digit: string;
  word: string;
  emoji: string;
  countName: string;
  audio: string;
  options: string[]; // Digits
}

export function getNumberDeck(count: number = 10): NumberQuestion[] {
  // Filter numbers (e.g. 0 to 10)
  const numbersPool = NUMBERS_DATA;
  const questions: NumberQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const target = numbersPool[Math.floor(Math.random() * numbersPool.length)];
    const mode: 'count' | 'listen' = Math.random() > 0.5 ? 'count' : 'listen';

    const wrongDigits = numbersPool
      .filter((n) => n.id !== target.id)
      .map((n) => n.digit);
    const selectedWrongs = getRandomItems(wrongDigits, 3);
    const options = shuffleArray([target.digit, ...selectedWrongs]);

    questions.push({
      id: `num_deck_${i}_${Date.now()}`,
      type: mode,
      number: target.number,
      digit: target.digit,
      word: target.word,
      emoji: target.emoji,
      countName: target.countName,
      audio: target.audio,
      options,
    });
  }

  return questions;
}
