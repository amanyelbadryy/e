import { NUMBERS_DATA } from '../numbersData';

export interface NumberQuizQuestion {
  id: string;
  type: 'pick_group' | 'count_group' | 'listen' | 'next' | 'prev' | 'bigger' | 'smaller' | 'digit_to_word' | 'word_to_digit' | 'compare_two';
  prompt: string;
  subPrompt?: string;
  audio?: string;
  emojis?: string[];
  correctAnswer: string;
  options: string[];
}

// Utility to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const EMOJI_SETS = [
  ['🍎', 'تفاحة'],
  ['🐥', 'كتكوت'],
  ['⭐', 'نجمة'],
  ['🎈', 'بالونة'],
  ['🌸', 'زهرة'],
  ['🚗', 'سيارة'],
  ['🦋', 'فراشة'],
  ['🍇', 'عنبة'],
  ['🐟', 'سمكة'],
  ['🎁', 'هدية'],
];

export function generate100NumberQuizQuestions(): NumberQuizQuestion[] {
  const rawQuestions: NumberQuizQuestion[] = [];

  // ==========================================
  // TYPE 1: Count Emojis Group -> Select Digit (22 questions: numbers 0 to 10 with 2 emoji variations)
  // ==========================================
  for (let varIdx = 0; varIdx < 2; varIdx++) {
    for (let count = 0; count <= 10; count++) {
      const numData = NUMBERS_DATA.find((n) => n.number === count)!;
      const emoji = EMOJI_SETS[(count + varIdx * 3) % EMOJI_SETS.length][0];
      const emojiArray = Array(count).fill(emoji);

      const wrongNums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((c) => c !== count);
      const shuffledWrong = shuffleArray(wrongNums).slice(0, 3);
      const allOptions = shuffleArray([count, ...shuffledWrong]).map(
        (n) => NUMBERS_DATA.find((d) => d.number === n)?.digit || String(n)
      );

      rawQuestions.push({
        id: `n1_count_group_${count}_v${varIdx}`,
        type: 'count_group',
        prompt: `كم عدد العناصر في هذه المجموعة؟`,
        emojis: emojiArray,
        correctAnswer: numData.digit,
        options: allOptions,
      });
    }
  }

  // ==========================================
  // TYPE 2: Select Group of Pictures Corresponding to a Number Digit (10 questions)
  // ==========================================
  for (let num = 1; num <= 10; num++) {
    const numData = NUMBERS_DATA.find((n) => n.number === num)!;
    const emoji = EMOJI_SETS[(num - 1) % EMOJI_SETS.length][0];

    const wrongCounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((c) => c !== num);
    const shuffledWrong = shuffleArray(wrongCounts).slice(0, 3);
    const allCounts = shuffleArray([num, ...shuffledWrong]);

    const options = allCounts.map((c) => Array(c).fill(emoji).join(' '));
    const correctAnswer = Array(num).fill(emoji).join(' ');

    rawQuestions.push({
      id: `n2_pick_group_${num}`,
      type: 'pick_group',
      prompt: `اختر المجموعة التي تحتوي على (${numData.digit}) عناصر:`,
      correctAnswer,
      options,
    });
  }

  // ==========================================
  // TYPE 3: Pure Audio Listening (11 questions: numbers 0 to 10)
  // ==========================================
  for (let num = 0; num <= 10; num++) {
    const numData = NUMBERS_DATA.find((n) => n.number === num)!;

    const wrongNums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((c) => c !== num);
    const shuffledWrong = shuffleArray(wrongNums).slice(0, 3);
    const allOptions = shuffleArray([num, ...shuffledWrong]).map(
      (n) => NUMBERS_DATA.find((d) => d.number === n)?.digit || String(n)
    );

    rawQuestions.push({
      id: `n3_audio_listen_${num}`,
      type: 'listen',
      prompt: 'استمع جَيِّداً واَخْتَر الرقم الذي سَمِعْتَه:',
      subPrompt: 'اضغط على زر "🔊 اسمع الرقم" لسماع الصوت ثم اختر الرقم',
      audio: numData.audio,
      correctAnswer: numData.digit,
      options: allOptions,
    });
  }

  // ==========================================
  // TYPE 4: Next Number (10 questions: numbers 0 to 9)
  // ==========================================
  for (let num = 0; num <= 9; num++) {
    const currentData = NUMBERS_DATA.find((n) => n.number === num)!;
    const nextNum = num + 1;
    const nextData = NUMBERS_DATA.find((n) => n.number === nextNum)!;

    const wrongNums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((c) => c !== nextNum);
    const shuffledWrong = shuffleArray(wrongNums).slice(0, 3);
    const allOptions = shuffleArray([nextNum, ...shuffledWrong]).map(
      (n) => NUMBERS_DATA.find((d) => d.number === n)?.digit || String(n)
    );

    rawQuestions.push({
      id: `n4_next_from_${num}`,
      type: 'next',
      prompt: `الرقم (${currentData.digit}): ما هو الرقم التالي المباشر له؟`,
      correctAnswer: nextData.digit,
      options: allOptions,
    });
  }

  // ==========================================
  // TYPE 5: Previous Number (10 questions: numbers 1 to 10)
  // ==========================================
  for (let num = 1; num <= 10; num++) {
    const currentData = NUMBERS_DATA.find((n) => n.number === num)!;
    const prevNum = num - 1;
    const prevData = NUMBERS_DATA.find((n) => n.number === prevNum)!;

    const wrongNums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((c) => c !== prevNum);
    const shuffledWrong = shuffleArray(wrongNums).slice(0, 3);
    const allOptions = shuffleArray([prevNum, ...shuffledWrong]).map(
      (n) => NUMBERS_DATA.find((d) => d.number === n)?.digit || String(n)
    );

    rawQuestions.push({
      id: `n5_prev_from_${num}`,
      type: 'prev',
      prompt: `الرقم (${currentData.digit}): ما هو الرقم السابق المباشر له؟`,
      correctAnswer: prevData.digit,
      options: allOptions,
    });
  }

  // ==========================================
  // TYPE 6: Bigger Number (15 questions)
  // ==========================================
  const biggerSets = [
    [2, 7, 4, 1],
    [1, 9, 5, 3],
    [3, 8, 6, 2],
    [0, 5, 10, 4],
    [2, 6, 9, 7],
    [4, 8, 3, 0],
    [5, 1, 7, 2],
    [6, 10, 8, 5],
    [1, 4, 9, 6],
    [3, 7, 10, 2],
    [0, 8, 5, 1],
    [2, 9, 6, 4],
    [7, 3, 10, 5],
    [1, 6, 8, 2],
    [4, 10, 9, 3],
  ];

  biggerSets.forEach((set, idx) => {
    const maxVal = Math.max(...set);
    const maxData = NUMBERS_DATA.find((n) => n.number === maxVal)!;
    const allOptions = shuffleArray(set).map(
      (n) => NUMBERS_DATA.find((d) => d.number === n)?.digit || String(n)
    );

    rawQuestions.push({
      id: `n6_bigger_set_${idx}`,
      type: 'bigger',
      prompt: 'أَيُّ هذه الأرقام هو الأكْبَر؟',
      correctAnswer: maxData.digit,
      options: allOptions,
    });
  });

  // ==========================================
  // TYPE 7: Smaller Number (15 questions)
  // ==========================================
  const smallerSets = [
    [8, 3, 6, 9],
    [7, 1, 5, 4],
    [9, 4, 2, 8],
    [10, 8, 3, 6],
    [5, 2, 7, 9],
    [6, 1, 8, 4],
    [10, 5, 2, 7],
    [9, 3, 6, 1],
    [8, 4, 10, 2],
    [7, 0, 5, 3],
    [6, 2, 9, 5],
    [10, 6, 4, 1],
    [8, 5, 1, 9],
    [7, 2, 6, 4],
    [9, 3, 5, 8],
  ];

  smallerSets.forEach((set, idx) => {
    const minVal = Math.min(...set);
    const minData = NUMBERS_DATA.find((n) => n.number === minVal)!;
    const allOptions = shuffleArray(set).map(
      (n) => NUMBERS_DATA.find((d) => d.number === n)?.digit || String(n)
    );

    rawQuestions.push({
      id: `n7_smaller_set_${idx}`,
      type: 'smaller',
      prompt: 'أَيُّ هذه الأرقام هو الأصْغَر؟',
      correctAnswer: minData.digit,
      options: allOptions,
    });
  });

  // ==========================================
  // TYPE 8: Digit to Word Name (11 questions: numbers 0 to 10)
  // ==========================================
  for (let num = 0; num <= 10; num++) {
    const numData = NUMBERS_DATA.find((n) => n.number === num)!;
    const wrongWords = NUMBERS_DATA.filter((n) => n.number !== num).map((n) => n.word);
    const shuffledWrong = shuffleArray(wrongWords).slice(0, 3);
    const options = shuffleArray([numData.word, ...shuffledWrong]);

    rawQuestions.push({
      id: `n8_digit_to_word_${num}`,
      type: 'digit_to_word',
      prompt: `ما هو الاسم اللفظي للرقم (${numData.digit})؟`,
      correctAnswer: numData.word,
      options,
    });
  }

  // ==========================================
  // TYPE 9: Word Name to Digit (11 questions: numbers 0 to 10)
  // ==========================================
  for (let num = 0; num <= 10; num++) {
    const numData = NUMBERS_DATA.find((n) => n.number === num)!;
    const wrongDigits = NUMBERS_DATA.filter((n) => n.number !== num).map((n) => n.digit);
    const shuffledWrong = shuffleArray(wrongDigits).slice(0, 3);
    const options = shuffleArray([numData.digit, ...shuffledWrong]);

    rawQuestions.push({
      id: `n9_word_to_digit_${num}`,
      type: 'word_to_digit',
      prompt: `ما هو الرقم المطابق للكلمة ("${numData.word}")؟`,
      correctAnswer: numData.digit,
      options,
    });
  }

  // ==========================================
  // TYPE 10: Compare Two Quantities / Numbers (10 questions)
  // ==========================================
  const comparePairs = [
    [3, 7],
    [8, 2],
    [5, 9],
    [1, 6],
    [4, 10],
    [9, 0],
    [2, 5],
    [7, 4],
    [6, 8],
    [10, 3],
  ];

  comparePairs.forEach(([n1, n2], idx) => {
    const num1Data = NUMBERS_DATA.find((n) => n.number === n1)!;
    const num2Data = NUMBERS_DATA.find((n) => n.number === n2)!;
    const maxVal = Math.max(n1, n2);
    const maxData = NUMBERS_DATA.find((n) => n.number === maxVal)!;

    const wrong2 = NUMBERS_DATA.filter((n) => n.number !== n1 && n.number !== n2).map((n) => n.digit);
    const extraWrongs = shuffleArray(wrong2).slice(0, 2);
    const options = shuffleArray([num1Data.digit, num2Data.digit, ...extraWrongs]);

    rawQuestions.push({
      id: `n10_compare_${idx}_${n1}_${n2}`,
      type: 'compare_two',
      prompt: `أيهما يحتوي على عدد أكبر: (${num1Data.digit}) أم (${num2Data.digit})؟`,
      correctAnswer: maxData.digit,
      options,
    });
  });

  // ==========================================
  // Deduplicate by signature to guarantee strictly 100 unique questions
  // ==========================================
  const seenSignatures = new Set<string>();
  const uniqueQuestions: NumberQuizQuestion[] = [];

  for (const q of rawQuestions) {
    const emojiStr = q.emojis ? q.emojis.join('') : '';
    const sig = `${q.type}_${q.prompt}_${q.correctAnswer}_${q.audio || ''}_${emojiStr}`;
    if (!seenSignatures.has(sig)) {
      seenSignatures.add(sig);
      uniqueQuestions.push(q);
    }
  }

  // Return exactly 100 unique questions
  const final100 = uniqueQuestions.slice(0, 100);

  // Shuffle question order and options inside each question
  const shuffledQuestions = shuffleArray(final100);

  return shuffledQuestions.map((q) => ({
    ...q,
    options: shuffleArray(q.options),
  }));
}

// Keep legacy alias function for backward compatibility
export const generate50NumberQuizQuestions = generate100NumberQuizQuestions;
