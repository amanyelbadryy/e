/**
 * Unified Question Signature generator to prevent duplicate or commutative questions.
 */
export function getQuestionSignature(question: any): string {
  if (!question) return 'unknown';

  // 1. Math Addition / Subtraction
  if (question.num1 !== undefined && question.num2 !== undefined && question.operator) {
    if (question.operator === '+' || question.type === 'add') {
      const minVal = Math.min(question.num1, question.num2);
      const maxVal = Math.max(question.num1, question.num2);
      return `add_${minVal}_${maxVal}`;
    }
    if (question.operator === '-' || question.type === 'subtract') {
      return `sub_${question.num1}_${question.num2}`;
    }
  }

  // Reverse Math Operation question (e.g. "أي عملية نتيجتها 5؟")
  if (question.type === 'reverse_op' && question.targetResult !== undefined) {
    return `rev_op_${question.targetResult}`;
  }

  // Word problem math question
  if (question.type === 'word_problem' && question.num1 !== undefined && question.num2 !== undefined) {
    const op = question.operator || '+';
    if (op === '+') {
      const minVal = Math.min(question.num1, question.num2);
      const maxVal = Math.max(question.num1, question.num2);
      return `wp_add_${minVal}_${maxVal}`;
    } else {
      return `wp_sub_${question.num1}_${question.num2}`;
    }
  }

  // 2. Riddle / Puzzle
  if (question.riddle || question.correctName) {
    if (question.riddle) {
      return `puzzle_${question.correctEmoji || ''}_${question.correctName || question.riddle.slice(0, 15)}`;
    }
  }

  // 3. Odd One Out
  if (question.oddItemName) {
    const cat = (question.categoryTitle || '').replace(/\s*\(\d+\)$/, '');
    return `odd_${cat}_${question.oddItemName}`;
  }

  // 4. Pattern
  if (question.patternDisplay && Array.isArray(question.patternDisplay)) {
    const patternStr = question.patternDisplay.filter((x: string) => x !== '❓').join('_');
    return `pattern_${patternStr}`;
  }

  // 5. Sequence
  if (question.stepsDisplay && Array.isArray(question.stepsDisplay)) {
    const cleanTitle = (question.title || '').replace(/\s*\(\d+\)$/, '');
    return `seq_${cleanTitle}_${question.correctEmoji || ''}`;
  }

  // 6. Logic
  if (question.situation) {
    return `logic_${question.situation.trim()}`;
  }

  // 7. Find Image
  if (question.targetEmoji && question.targetName) {
    return `find_img_${question.targetEmoji}`;
  }

  // 8. Visual Difference
  if (question.promptText && question.items) {
    const cleanPrompt = question.promptText.replace(/\s*\(\d+\)$/, '');
    return `visdiff_${cleanPrompt}`;
  }

  // 9. Listen Letter
  if (question.targetLetter) {
    return `listen_letter_${question.targetLetter}`;
  }

  // 10. Harakat
  if (question.harakaType && question.letter) {
    return `haraka_${question.letter}_${question.harakaType}`;
  }

  // 11. Letter Picture
  if (question.correctLetter && question.word) {
    return `letpic_${question.correctLetter}_${question.word}`;
  }

  // 12. Complete Word
  if (question.missingLetter && question.fullWord) {
    return `compword_${question.fullWord}_${question.missingLetter}`;
  }

  // 13. Classification
  if (question.categoryTitle && question.options) {
    const cleanCat = question.categoryTitle.replace(/\s*\(\d+\)$/, '');
    const correctOpt = question.options.find((o: any) => o.isCorrect);
    return `class_${cleanCat}_${correctOpt ? correctOpt.name : ''}`;
  }

  // 14. Group Matching
  if (question.groupName && question.correctItemName) {
    const cleanGrp = question.groupName.replace(/\s*\(\d+\)$/, '');
    return `grp_${cleanGrp}_${question.correctItemName}`;
  }

  // 15. Shape Sorting
  if (question.targetShapeTitle && question.correctName) {
    const cleanShape = question.targetShapeTitle.replace(/\s*\(\d+\)$/, '');
    return `shape_${cleanShape}_${question.correctName}`;
  }

  // 16. Size Ordering
  if (question.prompt && question.correctName) {
    const cleanPrompt = question.prompt.replace(/\s*\(\d+\)$/, '');
    return `size_${cleanPrompt}_${question.correctName}`;
  }

  // 17. Similar Matching Pairs
  if (question.item1Emoji && question.item2Emoji) {
    const pair = [question.item1Emoji, question.item2Emoji].sort().join('_');
    return `pair_${pair}`;
  }

  // 18. Number Choice / Listening
  if (question.correctDigit) {
    if (question.sequenceDisplay) {
      return `num_order_${question.sequenceDisplay.join('_')}`;
    }
    if (question.emoji && question.count) {
      return `count_${question.emoji}_${question.count}`;
    }
    return `num_digit_${question.correctDigit}_${question.prompt || ''}`;
  }

  // 19. Bigger / Smaller
  if (question.num1 && question.num2 && question.type) {
    const minVal = Math.min(question.num1.val, question.num2.val);
    const maxVal = Math.max(question.num1.val, question.num2.val);
    return `compare_${question.type}_${minVal}_${maxVal}`;
  }

  // Fallback to id
  return question.id || JSON.stringify(question);
}

/**
 * Filter an array of questions to keep only those with unique signatures.
 */
export function deduplicateQuestions<T>(questions: T[]): { uniqueQuestions: T[]; removedCount: number } {
  const seenSignatures = new Set<string>();
  const uniqueQuestions: T[] = [];
  let removedCount = 0;

  for (const q of questions) {
    const sig = getQuestionSignature(q);
    if (!seenSignatures.has(sig)) {
      seenSignatures.add(sig);
      uniqueQuestions.push(q);
    } else {
      removedCount++;
    }
  }

  return { uniqueQuestions, removedCount };
}
