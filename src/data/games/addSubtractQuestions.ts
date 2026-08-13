import { shuffleArray, getRandomItems } from './bankUtils';
import { getQuestionSignature } from './signatureUtils';

export interface AddSubtractQuestion {
  id: string;
  type: 'add' | 'subtract' | 'word_problem' | 'reverse_op';
  num1?: number;
  num2?: number;
  operator?: '+' | '-';
  targetResult?: number;
  correctAnswer: number | string;
  numPrompt: string; // e.g. "2 + 3 = ؟" or word problem text
  visualPrompt?: string; // e.g. "🍎🍎 + 🍎🍎🍎 = ؟"
  options: (number | string)[]; // 4 options
}

const RAW_ADD_SUBTRACT_BANK: Omit<AddSubtractQuestion, 'options'>[] = [
  // Direct Addition (Commutative unique pairs: min <= max)
  { id: 'as1', type: 'add', num1: 1, num2: 1, operator: '+', correctAnswer: 2, numPrompt: '1 + 1 = ؟', visualPrompt: '🍎 + 🍎 = ؟' },
  { id: 'as2', type: 'add', num1: 1, num2: 2, operator: '+', correctAnswer: 3, numPrompt: '1 + 2 = ؟', visualPrompt: '🍎 + 🍎🍎 = ؟' },
  { id: 'as3', type: 'add', num1: 2, num2: 2, operator: '+', correctAnswer: 4, numPrompt: '2 + 2 = ؟', visualPrompt: '🍎🍎 + 🍎🍎 = ؟' },
  { id: 'as4', type: 'add', num1: 1, num2: 3, operator: '+', correctAnswer: 4, numPrompt: '1 + 3 = ؟', visualPrompt: '🎈 + 🎈🎈🎈 = ؟' },
  { id: 'as5', type: 'add', num1: 2, num2: 3, operator: '+', correctAnswer: 5, numPrompt: '2 + 3 = ؟', visualPrompt: '🎈🎈 + 🎈🎈🎈 = ؟' },
  { id: 'as6', type: 'add', num1: 3, num2: 3, operator: '+', correctAnswer: 6, numPrompt: '3 + 3 = ؟', visualPrompt: '⭐⭐⭐ + ⭐⭐⭐ = ؟' },
  { id: 'as7', type: 'add', num1: 1, num2: 4, operator: '+', correctAnswer: 5, numPrompt: '1 + 4 = ؟', visualPrompt: '⭐⭐⭐⭐ + ⭐ = ؟' },
  { id: 'as8', type: 'add', num1: 2, num2: 4, operator: '+', correctAnswer: 6, numPrompt: '2 + 4 = ؟', visualPrompt: '🚗🚗 + 🚗🚗🚗🚗 = ؟' },
  { id: 'as9', type: 'add', num1: 3, num2: 4, operator: '+', correctAnswer: 7, numPrompt: '3 + 4 = ؟', visualPrompt: '🚗🚗🚗 + 🚗🚗🚗🚗 = ؟' },
  { id: 'as10', type: 'add', num1: 1, num2: 5, operator: '+', correctAnswer: 6, numPrompt: '1 + 5 = ؟', visualPrompt: '🌸 + 🌸🌸🌸🌸🌸 = ؟' },
  { id: 'as11', type: 'add', num1: 2, num2: 5, operator: '+', correctAnswer: 7, numPrompt: '2 + 5 = ؟', visualPrompt: '🌸🌸 + 🌸🌸🌸🌸🌸 = ؟' },
  { id: 'as12', type: 'add', num1: 3, num2: 5, operator: '+', correctAnswer: 8, numPrompt: '3 + 5 = ؟', visualPrompt: '🐥🐥🐥 + 🐥🐥🐥🐥🐥 = ؟' },
  { id: 'as13', type: 'add', num1: 4, num2: 5, operator: '+', correctAnswer: 9, numPrompt: '4 + 5 = ؟', visualPrompt: '🐥🐥🐥🐥 + 🐥🐥🐥🐥🐥 = ؟' },
  { id: 'as14', type: 'add', num1: 5, num2: 5, operator: '+', correctAnswer: 10, numPrompt: '5 + 5 = ؟', visualPrompt: '🎁🎁🎁🎁🎁 + 🎁🎁🎁🎁🎁 = ؟' },
  { id: 'as15', type: 'add', num1: 1, num2: 6, operator: '+', correctAnswer: 7, numPrompt: '1 + 6 = ؟', visualPrompt: '🍌 + 🍌🍌🍌🍌🍌🍌 = ؟' },
  { id: 'as16', type: 'add', num1: 2, num2: 6, operator: '+', correctAnswer: 8, numPrompt: '2 + 6 = ؟', visualPrompt: '🍌🍌 + 🍌🍌🍌🍌🍌🍌 = ؟' },
  { id: 'as17', type: 'add', num1: 3, num2: 6, operator: '+', correctAnswer: 9, numPrompt: '3 + 6 = ؟', visualPrompt: '⚽⚽⚽ + ⚽⚽⚽⚽⚽⚽ = ؟' },
  { id: 'as18', type: 'add', num1: 1, num2: 7, operator: '+', correctAnswer: 8, numPrompt: '1 + 7 = ؟', visualPrompt: '⚽ + ⚽⚽⚽⚽⚽⚽⚽ = ؟' },
  { id: 'as19', type: 'add', num1: 2, num2: 7, operator: '+', correctAnswer: 9, numPrompt: '2 + 7 = ؟', visualPrompt: '🍊🍊 + 🍊🍊🍊🍊🍊🍊🍊 = ؟' },
  { id: 'as20', type: 'add', num1: 3, num2: 7, operator: '+', correctAnswer: 10, numPrompt: '3 + 7 = ؟', visualPrompt: '🍊🍊🍊 + 🍊🍊🍊🍊🍊🍊🍊 = ؟' },

  // Direct Subtraction (Distinct a - b)
  { id: 'as21', type: 'subtract', num1: 2, num2: 1, operator: '-', correctAnswer: 1, numPrompt: '2 - 1 = ؟', visualPrompt: '🍎🍎 - 🍎 = ؟' },
  { id: 'as22', type: 'subtract', num1: 3, num2: 1, operator: '-', correctAnswer: 2, numPrompt: '3 - 1 = ؟', visualPrompt: '🍎🍎🍎 - 🍎 = ؟' },
  { id: 'as23', type: 'subtract', num1: 3, num2: 2, operator: '-', correctAnswer: 1, numPrompt: '3 - 2 = ؟', visualPrompt: '🎈🎈🎈 - 🎈🎈 = ؟' },
  { id: 'as24', type: 'subtract', num1: 4, num2: 1, operator: '-', correctAnswer: 3, numPrompt: '4 - 1 = ؟', visualPrompt: '🎈🎈🎈🎈 - 🎈 = ؟' },
  { id: 'as25', type: 'subtract', num1: 4, num2: 2, operator: '-', correctAnswer: 2, numPrompt: '4 - 2 = ؟', visualPrompt: '⭐⭐⭐⭐ - ⭐⭐ = ؟' },
  { id: 'as26', type: 'subtract', num1: 4, num2: 3, operator: '-', correctAnswer: 1, numPrompt: '4 - 3 = ؟', visualPrompt: '⭐⭐⭐⭐ - ⭐⭐⭐ = ؟' },
  { id: 'as27', type: 'subtract', num1: 5, num2: 1, operator: '-', correctAnswer: 4, numPrompt: '5 - 1 = ؟', visualPrompt: '🚗🚗🚗🚗🚗 - 🚗 = ؟' },
  { id: 'as28', type: 'subtract', num1: 5, num2: 2, operator: '-', correctAnswer: 3, numPrompt: '5 - 2 = ؟', visualPrompt: '🚗🚗🚗🚗🚗 - 🚗🚗 = ؟' },
  { id: 'as29', type: 'subtract', num1: 5, num2: 3, operator: '-', correctAnswer: 2, numPrompt: '5 - 3 = ؟', visualPrompt: '🌸🌸🌸🌸🌸 - 🌸🌸🌸 = ؟' },
  { id: 'as30', type: 'subtract', num1: 5, num2: 4, operator: '-', correctAnswer: 1, numPrompt: '5 - 4 = ؟', visualPrompt: '🌸🌸🌸🌸🌸 - 🌸🌸🌸🌸 = ؟' },
  { id: 'as31', type: 'subtract', num1: 6, num2: 1, operator: '-', correctAnswer: 5, numPrompt: '6 - 1 = ؟', visualPrompt: '🐥🐥🐥🐥🐥🐥 - 🐥 = ؟' },
  { id: 'as32', type: 'subtract', num1: 6, num2: 2, operator: '-', correctAnswer: 4, numPrompt: '6 - 2 = ؟', visualPrompt: '🐥🐥🐥🐥🐥🐥 - 🐥🐥 = ؟' },
  { id: 'as33', type: 'subtract', num1: 6, num2: 3, operator: '-', correctAnswer: 3, numPrompt: '6 - 3 = ؟', visualPrompt: '🎁🎁🎁🎁🎁🎁 - 🎁🎁🎁 = ؟' },
  { id: 'as34', type: 'subtract', num1: 7, num2: 2, operator: '-', correctAnswer: 5, numPrompt: '7 - 2 = ؟', visualPrompt: '🍌🍌🍌🍌🍌🍌🍌 - 🍌🍌 = ؟' },
  { id: 'as35', type: 'subtract', num1: 7, num2: 3, operator: '-', correctAnswer: 4, numPrompt: '7 - 3 = ؟', visualPrompt: '🍌🍌🍌🍌🍌🍌🍌 - 🍌🍌🍌 = ؟' },
  { id: 'as36', type: 'subtract', num1: 8, num2: 3, operator: '-', correctAnswer: 5, numPrompt: '8 - 3 = ؟', visualPrompt: '🍊🍊🍊🍊🍊🍊🍊🍊 - 🍊🍊🍊 = ؟' },
  { id: 'as37', type: 'subtract', num1: 9, num2: 4, operator: '-', correctAnswer: 5, numPrompt: '9 - 4 = ؟', visualPrompt: '🍇🍇🍇🍇🍇🍇🍇🍇🍇 - 🍇🍇🍇🍇 = ؟' },
  { id: 'as38', type: 'subtract', num1: 10, num2: 5, operator: '-', correctAnswer: 5, numPrompt: '10 - 5 = ؟', visualPrompt: '⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ - ⭐⭐⭐⭐⭐ = ؟' },

  // Word Problems (مسائل لفظية)
  {
    id: 'as39',
    type: 'word_problem',
    num1: 3,
    num2: 2,
    operator: '+',
    correctAnswer: 5,
    numPrompt: 'لَدَيْكَ ٣ تُفَّاحَاتٍ وَأَضَفْتَ تُفَّاحَتَيْنِ، كَمْ أَصْبَحَ لَدَيْكَ؟',
    visualPrompt: '🍎🍎🍎 + 🍎🍎',
  },
  {
    id: 'as40',
    type: 'word_problem',
    num1: 4,
    num2: 1,
    operator: '-',
    correctAnswer: 3,
    numPrompt: 'كَانَ مَعَ أَحْمَدَ ٤ بَالُونَاتٍ وَطَارَ مِنْهَا بَالُونٌ وَاحِدٌ، كَمْ بَقِيَ؟',
    visualPrompt: '🎈🎈🎈🎈 - 🎈',
  },
  {
    id: 'as41',
    type: 'word_problem',
    num1: 2,
    num2: 2,
    operator: '+',
    correctAnswer: 4,
    numPrompt: 'فِي المَلْعَبِ ٢ لاَعِبِينَ، انْضَمَّ إِلَيْهِمَا ٢ لاَعِبَانِ آخَرَانِ، كَمْ لاَعِباً فِي المَلْعَبِ؟',
    visualPrompt: '⚽⚽ + ⚽⚽',
  },
  {
    id: 'as42',
    type: 'word_problem',
    num1: 5,
    num2: 2,
    operator: '-',
    correctAnswer: 3,
    numPrompt: 'كَانَتْ ٥ سَيَّارَاتٍ فِي المَوْقِفِ وَغَادَرَتْ سَيَّارَتَانِ، كَمْ سَيَّارَةً بَقِيَتْ؟',
    visualPrompt: '🚗🚗🚗🚗🚗 - 🚗🚗',
  },

  // Reverse Op Match (أي عملية نتيجتها X؟)
  {
    id: 'as43',
    type: 'reverse_op',
    targetResult: 5,
    correctAnswer: '2 + 3',
    numPrompt: 'أَيُّ عَمَلِيَّةٍ نَتِيجَتُهَا ٥ ؟',
    visualPrompt: '🎯 النَّاتِجُ = ٥',
  },
  {
    id: 'as44',
    type: 'reverse_op',
    targetResult: 4,
    correctAnswer: '2 + 2',
    numPrompt: 'أَيُّ عَمَلِيَّةٍ نَتِيجَتُهَا ٤ ؟',
    visualPrompt: '🎯 النَّاتِجُ = ٤',
  },
  {
    id: 'as45',
    type: 'reverse_op',
    targetResult: 6,
    correctAnswer: '3 + 3',
    numPrompt: 'أَيُّ عَمَلِيَّةٍ نَتِيجَتُهَا ٦ ؟',
    visualPrompt: '🎯 النَّاتِجُ = ٦',
  },
  {
    id: 'as46',
    type: 'reverse_op',
    targetResult: 3,
    correctAnswer: '5 - 2',
    numPrompt: 'أَيُّ عَمَلِيَّةٍ نَتِيجَتُهَا ٣ ؟',
    visualPrompt: '🎯 النَّاتِجُ = ٣',
  },
  {
    id: 'as47',
    type: 'reverse_op',
    targetResult: 2,
    correctAnswer: '4 - 2',
    numPrompt: 'أَيُّ عَمَلِيَّةٍ نَتِيجَتُهَا ٢ ؟',
    visualPrompt: '🎯 النَّاتِجُ = ٢',
  },
  {
    id: 'as48',
    type: 'reverse_op',
    targetResult: 7,
    correctAnswer: '3 + 4',
    numPrompt: 'أَيُّ عَمَلِيَّةٍ نَتِيجَتُهَا ٧ ؟',
    visualPrompt: '🎯 النَّاتِجُ = ٧',
  },
  {
    id: 'as49',
    type: 'reverse_op',
    targetResult: 8,
    correctAnswer: '4 + 4',
    numPrompt: 'أَيُّ عَمَلِيَّةٍ نَتِيجَتُهَا ٨ ؟',
    visualPrompt: '🎯 النَّاتِجُ = ٨',
  },
  {
    id: 'as50',
    type: 'reverse_op',
    targetResult: 1,
    correctAnswer: '3 - 2',
    numPrompt: 'أَيُّ عَمَلِيَّةٍ نَتِيجَتُهَا ١ ؟',
    visualPrompt: '🎯 النَّاتِجُ = ١',
  },
];

/**
 * Clean duplicate bank ensuring 100% unique signatures.
 */
function buildUniqueAddSubtractBank(): AddSubtractQuestion[] {
  const seenSignatures = new Set<string>();
  const bank: AddSubtractQuestion[] = [];

  for (const item of RAW_ADD_SUBTRACT_BANK) {
    const sig = getQuestionSignature(item);
    if (!seenSignatures.has(sig)) {
      seenSignatures.add(sig);

      let options: (number | string)[] = [];
      if (item.type === 'reverse_op') {
        const correct = String(item.correctAnswer);
        const dists = ['1 + 1', '4 + 2', '7 - 1', '8 - 2', '6 - 1', '2 + 5', '1 + 4'].filter((d) => d !== correct);
        options = shuffleArray([correct, ...dists.slice(0, 3)]);
      } else {
        const numericAnswer = Number(item.correctAnswer);
        options = generateNumericOptions(numericAnswer);
      }

      bank.push({
        ...item,
        options,
      });
    }
  }

  return bank;
}

function generateNumericOptions(correctAnswer: number): number[] {
  const optionsSet = new Set<number>([correctAnswer]);
  const possibleDistractors = [
    correctAnswer + 1,
    correctAnswer - 1,
    correctAnswer + 2,
    correctAnswer - 2,
    correctAnswer + 3,
    correctAnswer - 3,
  ].filter((num) => num >= 0 && num <= 12 && num !== correctAnswer);

  const shuffledDistractors = shuffleArray(possibleDistractors);
  for (const d of shuffledDistractors) {
    if (optionsSet.size >= 4) break;
    optionsSet.add(d);
  }

  let candidate = 0;
  while (optionsSet.size < 4) {
    if (!optionsSet.has(candidate)) {
      optionsSet.add(candidate);
    }
    candidate++;
  }

  return shuffleArray(Array.from(optionsSet));
}

export const ADD_SUBTRACT_BANK = buildUniqueAddSubtractBank();

export function getAddSubtractQuestions(count: number = 10): AddSubtractQuestion[] {
  const selected = getRandomItems(ADD_SUBTRACT_BANK, count);
  return selected.map((q) => ({
    ...q,
    options: shuffleArray(q.options),
  }));
}
