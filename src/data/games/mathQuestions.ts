import { NUMBERS_DATA } from '../numbersData';
import { shuffleArray, getRandomItems } from './bankUtils';
import { getQuestionSignature } from './signatureUtils';

// 1. Number Choice Questions
export interface NumberChoiceQuestion {
  id: string;
  prompt: string;
  correctDigit: string;
  options: string[];
}

export function getNumberChoiceQuestions(count: number = 10): NumberChoiceQuestion[] {
  const selectedTargets = getRandomItems(NUMBERS_DATA, count);
  return selectedTargets.map((target, i) => {
    const wrongs = NUMBERS_DATA.filter((n) => n.id !== target.id).map((n) => n.digit);
    const selectedWrongs = getRandomItems(wrongs, 3);
    const options = shuffleArray([target.digit, ...selectedWrongs]);

    return {
      id: `num_choice_${i}_${Date.now()}`,
      prompt: `اخْتَرِ الرَّقَمَ (${target.digit}) المُنَاسِبَ!`,
      correctDigit: target.digit,
      options,
    };
  });
}

// 2. Number Listening Questions (Sound only! NO target digit shown)
export interface NumberListeningQuestion {
  id: string;
  audio: string;
  correctDigit: string;
  options: string[];
}

export function getNumberListeningQuestions(count: number = 10): NumberListeningQuestion[] {
  const selectedTargets = getRandomItems(NUMBERS_DATA, count);
  return selectedTargets.map((target, i) => {
    const wrongs = NUMBERS_DATA.filter((n) => n.id !== target.id).map((n) => n.digit);
    const selectedWrongs = getRandomItems(wrongs, 3);
    const options = shuffleArray([target.digit, ...selectedWrongs]);

    return {
      id: `num_listen_${i}_${Date.now()}`,
      audio: target.audio,
      correctDigit: target.digit,
      options,
    };
  });
}

// 3. Counting Questions
export interface CountingQuestion {
  id: string;
  emoji: string;
  count: number; // e.g. 4
  correctDigit: string;
  options: string[];
}

export function getCountingQuestions(count: number = 10): CountingQuestion[] {
  const questions: CountingQuestion[] = [];
  const emojis = shuffleArray(['🍎', '🎈', '⭐', '🐥', '🚗', '🌸', '🍇', '🐟', '🎁', '⚽']);
  const numberPool = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  for (let i = 0; i < count; i++) {
    const targetNumber = numberPool[i % numberPool.length];
    const targetData = NUMBERS_DATA.find((n) => n.number === targetNumber) || NUMBERS_DATA[1];
    const emoji = emojis[i % emojis.length];

    const wrongs = NUMBERS_DATA.filter((n) => n.number !== targetNumber && n.number > 0).map((n) => n.digit);
    const selectedWrongs = getRandomItems(wrongs, 3);
    const options = shuffleArray([targetData.digit, ...selectedWrongs]);

    questions.push({
      id: `count_${i}_${Date.now()}`,
      emoji,
      count: targetNumber,
      correctDigit: targetData.digit,
      options,
    });
  }
  return questions;
}

// 4. Bigger / Smaller Questions
export interface BiggerSmallerQuestion {
  id: string;
  num1: { digit: string; val: number; emoji: string };
  num2: { digit: string; val: number; emoji: string };
  type: 'bigger' | 'smaller';
  correctDigit: string;
}

export function getBiggerSmallerQuestions(count: number = 10): BiggerSmallerQuestion[] {
  const questions: BiggerSmallerQuestion[] = [];
  const pool = NUMBERS_DATA.filter((n) => n.number > 0);
  const seenSignatures = new Set<string>();

  let attempts = 0;
  while (questions.length < count && attempts < 100) {
    attempts++;
    const n1Index = Math.floor(Math.random() * pool.length);
    let n2Index = Math.floor(Math.random() * pool.length);
    while (n2Index === n1Index) {
      n2Index = Math.floor(Math.random() * pool.length);
    }

    const n1 = pool[n1Index];
    const n2 = pool[n2Index];
    const type: 'bigger' | 'smaller' = Math.random() > 0.5 ? 'bigger' : 'smaller';

    let correctDigit = '';
    if (type === 'bigger') {
      correctDigit = n1.number > n2.number ? n1.digit : n2.digit;
    } else {
      correctDigit = n1.number < n2.number ? n1.digit : n2.digit;
    }

    const qItem: BiggerSmallerQuestion = {
      id: `big_small_${questions.length}_${Date.now()}`,
      num1: { digit: n1.digit, val: n1.number, emoji: n1.emoji },
      num2: { digit: n2.digit, val: n2.number, emoji: n2.emoji },
      type,
      correctDigit,
    };

    const sig = getQuestionSignature(qItem);
    if (!seenSignatures.has(sig)) {
      seenSignatures.add(sig);
      questions.push(qItem);
    }
  }

  return questions;
}

// 5. Number Ordering Questions
export interface NumberOrderingQuestion {
  id: string;
  sequenceDisplay: string[]; // e.g. ["١", "٢", "❓", "٤"]
  correctDigit: string;
  options: string[];
}

export function getNumberOrderingQuestions(count: number = 10): NumberOrderingQuestion[] {
  const questions: NumberOrderingQuestion[] = [];
  const seenSignatures = new Set<string>();

  let attempts = 0;
  while (questions.length < count && attempts < 100) {
    attempts++;
    const start = Math.floor(Math.random() * 7); // 0 to 6
    const seq = [start, start + 1, start + 2, start + 3]; // 4 numbers in sequence
    const missingIndex = Math.floor(Math.random() * 4); // missing position

    const missingVal = seq[missingIndex];
    const missingData = NUMBERS_DATA.find((n) => n.number === missingVal) || NUMBERS_DATA[0];

    const sequenceDisplay = seq.map((val, idx) => {
      if (idx === missingIndex) return '❓';
      const item = NUMBERS_DATA.find((n) => n.number === val);
      return item ? item.digit : val.toString();
    });

    const wrongs = NUMBERS_DATA.filter((n) => n.number !== missingVal).map((n) => n.digit);
    const selectedWrongs = getRandomItems(wrongs, 3);
    const options = shuffleArray([missingData.digit, ...selectedWrongs]);

    const qItem: NumberOrderingQuestion = {
      id: `ordering_${questions.length}_${Date.now()}`,
      sequenceDisplay,
      correctDigit: missingData.digit,
      options,
    };

    const sig = getQuestionSignature(qItem);
    if (!seenSignatures.has(sig)) {
      seenSignatures.add(sig);
      questions.push(qItem);
    }
  }

  return questions;
}
