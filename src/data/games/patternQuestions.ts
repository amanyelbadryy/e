import { shuffleArray, getRandomItems } from './bankUtils';

export interface PatternQuestion {
  id: string;
  patternDisplay: string[]; // e.g. ["⭐", "🔴", "⭐", "🔴", "❓"]
  correctEmoji: string;
  options: string[];
}

const RAW_PATTERNS = [
  { pattern: ['⭐', '🔵', '⭐', '🔵', '❓'], correct: '⭐', dists: ['🔵', '🔴', '🟢'] },
  { pattern: ['🍎', '🍌', '🍎', '🍌', '❓'], correct: '🍎', dists: ['🍌', '🍇', '🍊'] },
  { pattern: ['🚗', '🚀', '🚗', '🚀', '❓'], correct: '🚗', dists: ['🚀', '✈️', '🚲'] },
  { pattern: ['🐱', '🐶', '🐱', '🐶', '❓'], correct: '🐱', dists: ['🐶', '🦁', '🐻'] },
  { pattern: ['🔴', '🟡', '🔴', '🟡', '❓'], correct: '🔴', dists: ['🟡', '🟢', '🔵'] },
  { pattern: ['🌸', '🌸', '🍃', '🌸', '🌸', '❓'], correct: '🍃', dists: ['🌸', '🌻', '🌲'] },
  { pattern: ['⚽', '🏀', '⚽', '🏀', '❓'], correct: '⚽', dists: ['🏀', '🎾', '🏐'] },
  { pattern: ['☀️', '🌙', '☀️', '🌙', '❓'], correct: '☀️', dists: ['🌙', '⭐', '☁️'] },
  { pattern: ['🐥', '🐔', '🐥', '🐔', '❓'], correct: '🐥', dists: ['🐔', '🦆', '🦅'] },
  { pattern: ['🎈', '🎁', '🎈', '🎁', '❓'], correct: '🎈', dists: ['🎁', '🎂', '🎉'] },
  { pattern: ['🍓', '🍇', '🍓', '🍇', '❓'], correct: '🍓', dists: ['🍇', '🍍', '🥝'] },
  { pattern: ['🐟', '🐙', '🐟', '🐙', '❓'], correct: '🐟', dists: ['🐙', '🐬', '🦀'] },
  { pattern: ['✏️', '📕', '✏️', '📕', '❓'], correct: '✏️', dists: ['📕', '📐', '✂️'] },
  { pattern: ['🚗', '🚗', '🛵', '🚗', '🚗', '❓'], correct: '🛵', dists: ['🚗', '🚲', '🚚'] },
  { pattern: ['🍦', '🍩', '🍦', '🍩', '❓'], correct: '🍦', dists: ['🍩', '🍪', '🍰'] },
  { pattern: ['🔵', '🔴', '🟢', '🔵', '🔴', '❓'], correct: '🟢', dists: ['🔵', '🔴', '🟡'] },
  { pattern: ['🐝', '🌸', '🐝', '🌸', '❓'], correct: '🐝', dists: ['🌸', '🦋', '🐞'] },
  { pattern: ['🥕', '🥦', '🥕', '🥦', '❓'], correct: '🥕', dists: ['🥦', '🌽', '🍅'] },
  { pattern: ['👟', '🧦', '👟', '🧦', '❓'], correct: '👟', dists: ['🧦', '🧢', '👕'] },
  { pattern: ['👑', '💎', '👑', '💎', '❓'], correct: '👑', dists: ['💎', '💍', '🥇'] },
  { pattern: ['🍔', '🍟', '🍔', '🍟', '❓'], correct: '🍔', dists: ['🍟', '🍕', '🌭'] },
  { pattern: ['🐸', '🦆', '🐸', '🦆', '❓'], correct: '🐸', dists: ['🦆', '🐢', '🐊'] },
  { pattern: ['🍕', '🍕', '🥤', '🍕', '🍕', '❓'], correct: '🥤', dists: ['🍕', '🍔', '🍟'] },
  { pattern: ['✈️', '🚁', '✈️', '🚁', '❓'], correct: '✈️', dists: ['🚁', '🚀', '⛵'] },
  { pattern: ['🔔', '🎵', '🔔', '🎵', '❓'], correct: '🔔', dists: ['🎵', '🎸', '🥁'] },
  { pattern: ['🐰', '🦊', '🐰', '🦊', '❓'], correct: '🐰', dists: ['🦊', '🐻', '🐼'] },
  { pattern: ['🍊', '🍊', '🍍', '🍊', '🍊', '❓'], correct: '🍍', dists: ['🍊', '🍉', '🥭'] },
  { pattern: ['🚲', '🛵', '🚲', '🛵', '❓'], correct: '🚲', dists: ['🛵', '🚗', '🏎️'] },
  { pattern: ['🌙', '⭐', '⭐', '🌙', '⭐', '❓'], correct: '⭐', dists: ['🌙', '☀️', '☁️'] },
  { pattern: ['🎨', '🖌️', '🎨', '🖌️', '❓'], correct: '🎨', dists: ['🖌️', '✏️', '🖍️'] },
  { pattern: ['🍉', '🍉', '🍓', '🍉', '🍉', '❓'], correct: '🍓', dists: ['🍉', '🍌', '🍒'] },
  { pattern: ['🐘', '🦒', '🐘', '🦒', '❓'], correct: '🐘', dists: ['🦒', '🦁', '🦓'] },
  { pattern: ['❤️', '💙', '❤️', '💙', '❓'], correct: '❤️', dists: ['💙', '💚', '💛'] },
  { pattern: ['🚗', '🚙', '🚗', '🚙', '❓'], correct: '🚗', dists: ['🚙', '🏎️', '🚓'] },
  { pattern: ['🍿', '🥤', '🍿', '🥤', '❓'], correct: '🍿', dists: ['🥤', '🍫', '🍬'] },
  { pattern: ['🦋', '🌺', '🦋', '🌺', '❓'], correct: '🦋', dists: ['🌺', '🌸', '🐝'] },
  { pattern: ['🔑', '🔒', '🔑', '🔒', '❓'], correct: '🔑', dists: ['🔒', '🔓', '🏠'] },
  { pattern: ['🍞', '🧀', '🍞', '🧀', '❓'], correct: '🍞', dists: ['🧀', '🥚', '🥛'] },
  { pattern: ['🐵', '🍌', '🐵', '🍌', '❓'], correct: '🐵', dists: ['🍌', '🌴', '🦁'] },
  { pattern: ['🌧️', '☂️', '🌧️', '☂️', '❓'], correct: '🌧️', dists: ['☂️', '☀️', '⚡'] },
  { pattern: ['🍏', '🍏', '🍐', '🍏', '🍏', '❓'], correct: '🍐', dists: ['🍏', '🍋', '🥝'] },
  { pattern: ['🍪', '🥛', '🍪', '🥛', '❓'], correct: '🍪', dists: ['🥛', '🍩', '🍫'] },
  { pattern: ['🚗', '🚦', '🚗', '🚦', '❓'], correct: '🚗', dists: ['🚦', '🛑', '🚲'] },
  { pattern: ['🏠', '🌳', '🏠', '🌳', '❓'], correct: '🏠', dists: ['🌳', '🌸', '🚗'] },
  { pattern: ['🐼', '🎍', '🐼', '🎍', '❓'], correct: '🐼', dists: ['🎍', '🐻', '🐨'] },
  { pattern: ['🍦', '🍦', '🍧', '🍦', '🍦', '❓'], correct: '🍧', dists: ['🍦', '🍩', '🍰'] },
  { pattern: ['🎂', '🕯️', '🎂', '🕯️', '❓'], correct: '🎂', dists: ['🕯️', '🎈', '🎁'] },
  { pattern: ['🍇', '🍇', '🍒', '🍇', '🍇', '❓'], correct: '🍒', dists: ['🍇', '🍓', '🍎'] },
  { pattern: ['🚀', '🌟', '🚀', '🌟', '❓'], correct: '🚀', dists: ['🌟', '🌙', '🪐'] },
  { pattern: ['🦔', '🍄', '🦔', '🍄', '❓'], correct: '🦔', dists: ['🍄', '🌰', '🌲'] },
];

export const PATTERN_BANK: PatternQuestion[] = RAW_PATTERNS.map((item, idx) => ({
  id: `pt_${idx + 1}`,
  patternDisplay: item.pattern,
  correctEmoji: item.correct,
  options: shuffleArray([item.correct, ...item.dists]),
}));

export function getPatternQuestions(count: number = 10): PatternQuestion[] {
  const selected = getRandomItems(PATTERN_BANK, count);
  return selected.map((q) => ({
    ...q,
    options: shuffleArray(q.options),
  }));
}
