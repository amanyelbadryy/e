import { ALPHABET_DATA } from '../alphabetData';
import { ArabicLetter } from '../../types';

export interface LetterQuizQuestion {
  id: string;
  type: 'listen_letter' | 'word_start' | 'listen_word' | 'find_word' | 'haraka' | 'similar_letter';
  prompt: string;
  subPrompt?: string;
  audio?: string;
  emoji?: string;
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

export function generate100LetterQuizQuestions(): LetterQuizQuestion[] {
  const rawQuestions: LetterQuizQuestion[] = [];

  // ==========================================
  // TYPE 1: Listen to Letter Audio -> Select Letter (28 questions)
  // ==========================================
  ALPHABET_DATA.forEach((letterItem) => {
    const wrongLetters = ALPHABET_DATA.filter((l) => l.id !== letterItem.id).map((l) => l.letter);
    const shuffledWrong = shuffleArray(wrongLetters).slice(0, 3);
    const options = shuffleArray([letterItem.letter, ...shuffledWrong]);

    rawQuestions.push({
      id: `l1_listen_${letterItem.id}_${letterItem.letter}`,
      type: 'listen_letter',
      prompt: 'استمع إلى صوت الحرف واختبر معرفتك به:',
      subPrompt: 'اضغط على زر "🔊 اسمع الحرف" لسماع الصوت ثم اختر الحرف الصحيح',
      audio: letterItem.audio,
      correctAnswer: letterItem.letter,
      options,
    });
  });

  // ==========================================
  // TYPE 2: Basic Word Image/Emoji -> Select Starting Letter (28 questions)
  // ==========================================
  ALPHABET_DATA.forEach((letterItem) => {
    const wrongLetters = ALPHABET_DATA.filter((l) => l.id !== letterItem.id).map((l) => l.letter);
    const shuffledWrong = shuffleArray(wrongLetters).slice(0, 3);
    const options = shuffleArray([letterItem.letter, ...shuffledWrong]);

    rawQuestions.push({
      id: `l2_word_start_${letterItem.id}_${letterItem.basicWord.word}`,
      type: 'word_start',
      prompt: `ما الحرف الذي تبدأ به كلمة (${letterItem.basicWord.word}) ${letterItem.basicWord.emoji}؟`,
      emoji: letterItem.basicWord.emoji,
      audio: letterItem.basicWord.audio,
      correctAnswer: letterItem.letter,
      options,
    });
  });

  // ==========================================
  // TYPE 3: Listen to Word Audio -> Select Starting Letter (28 questions)
  // ==========================================
  ALPHABET_DATA.forEach((letterItem) => {
    const wrongLetters = ALPHABET_DATA.filter((l) => l.id !== letterItem.id).map((l) => l.letter);
    const shuffledWrong = shuffleArray(wrongLetters).slice(0, 3);
    const options = shuffleArray([letterItem.letter, ...shuffledWrong]);

    rawQuestions.push({
      id: `l3_listen_word_${letterItem.id}_${letterItem.basicWord.word}`,
      type: 'listen_word',
      prompt: 'استمع لنطق الكلمة جيداً ثم اختر الحرف الأول لها:',
      subPrompt: 'اضغط على زر "🔊 اسمع الكلمة" ثم حدد الحرف الصحيح',
      audio: letterItem.basicWord.audio,
      correctAnswer: letterItem.letter,
      options,
    });
  });

  // ==========================================
  // TYPE 4: Choose Image/Word that Starts with Target Letter (28 questions)
  // ==========================================
  ALPHABET_DATA.forEach((letterItem) => {
    const wrongWords = ALPHABET_DATA.filter((l) => l.id !== letterItem.id).map(
      (l) => `${l.basicWord.emoji} ${l.basicWord.word}`
    );
    const shuffledWrong = shuffleArray(wrongWords).slice(0, 3);
    const correctAnswer = `${letterItem.basicWord.emoji} ${letterItem.basicWord.word}`;
    const options = shuffleArray([correctAnswer, ...shuffledWrong]);

    rawQuestions.push({
      id: `l4_find_word_${letterItem.id}_${letterItem.letter}`,
      type: 'find_word',
      prompt: `أيّ من الكلمات التالية تبدأ بحرف (${letterItem.letter})؟`,
      audio: letterItem.audio,
      correctAnswer,
      options,
    });
  });

  // ==========================================
  // TYPE 5: Harakat Sound / Symbol Questions (28 questions)
  // ==========================================
  ALPHABET_DATA.forEach((letterItem, index) => {
    // Pick haraka based on index for variety
    const harakaKey = index % 3 === 0 ? 'fatha' : index % 3 === 1 ? 'kasra' : 'damma';
    const harakaItem = letterItem.harakat[harakaKey];
    const harakaName = harakaKey === 'fatha' ? 'الفتحة' : harakaKey === 'kasra' ? 'الكسرة' : 'الضمة';

    const otherSymbols = [
      letterItem.harakat.fatha.symbol,
      letterItem.harakat.kasra.symbol,
      letterItem.harakat.damma.symbol,
    ];
    // Add 1 wrong symbol from another letter if needed to make 4 options
    const anotherLetter = ALPHABET_DATA[(index + 5) % ALPHABET_DATA.length];
    otherSymbols.push(anotherLetter.harakat[harakaKey].symbol);

    const options = shuffleArray(Array.from(new Set(otherSymbols)));

    rawQuestions.push({
      id: `l5_haraka_${letterItem.id}_${harakaKey}`,
      type: 'haraka',
      prompt: `استمع لصوت حركة ${harakaName} واختر الشَّكْل الصحيح لحرف (${letterItem.letter}):`,
      audio: harakaItem.audio,
      correctAnswer: harakaItem.symbol,
      options,
    });
  });

  // ==========================================
  // TYPE 6: Visually Similar Letter Discrimination (14 questions)
  // ==========================================
  const similarGroups = [
    ['ب', 'ت', 'ث'],
    ['ج', 'ح', 'خ'],
    ['د', 'ذ'],
    ['ر', 'ز'],
    ['س', 'ش'],
    ['ص', 'ض'],
    ['ط', 'ظ'],
    ['ع', 'غ'],
    ['ف', 'ق'],
    ['ك', 'ل'],
    ['ن', 'هـ', 'ي'],
    ['أ', 'إ'],
    ['ذ', 'ز'],
    ['ث', 'س'],
  ];

  similarGroups.forEach((group, idx) => {
    const targetLetter = group[0];
    const letterObj = ALPHABET_DATA.find((l) => l.letter === targetLetter);
    const wrongs = group.slice(1);
    // Fill up to 4 options with random letters if group is smaller than 4
    const filler = ALPHABET_DATA.filter((l) => !group.includes(l.letter)).map((l) => l.letter);
    const needed = 4 - group.length;
    const extraWrongs = shuffleArray(filler).slice(0, needed);

    const options = shuffleArray([...group, ...extraWrongs]);

    rawQuestions.push({
      id: `l6_similar_${idx}_${targetLetter}`,
      type: 'similar_letter',
      prompt: `اختر حرف (${targetLetter}) من بين الحروف المتشابهة التالية:`,
      audio: letterObj?.audio,
      correctAnswer: targetLetter,
      options,
    });
  });

  // ==========================================
  // Deduplicate by signature to guarantee strictly 100 unique questions
  // ==========================================
  const seenSignatures = new Set<string>();
  const uniqueQuestions: LetterQuizQuestion[] = [];

  for (const q of rawQuestions) {
    // Signature includes prompt, correct answer, audio, emoji, and question concept
    const sig = `${q.type}_${q.prompt}_${q.correctAnswer}_${q.audio || ''}_${q.emoji || ''}`;
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
