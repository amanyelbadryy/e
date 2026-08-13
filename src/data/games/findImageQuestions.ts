import { shuffleArray, getRandomItems } from './bankUtils';

export interface FindImageQuestion {
  id: string;
  targetEmoji: string;
  targetName: string;
  gridEmojis: { emoji: string; isTarget: boolean }[];
}

const ITEMS_POOL = [
  { emoji: '🐱', name: 'القطة' },
  { emoji: '🐶', name: 'الكلب' },
  { emoji: '🍎', name: 'التفاحة' },
  { emoji: '🍌', name: 'الموزة' },
  { emoji: '🚗', name: 'السيارة' },
  { emoji: '🚀', name: 'الصاروخ' },
  { emoji: '🌸', name: 'الوردة' },
  { emoji: '🦁', name: 'الأسد' },
  { emoji: '🐘', name: 'الفيل' },
  { emoji: '🐟', name: 'السمكة' },
  { emoji: '⚽', name: 'الكرة' },
  { emoji: '🍇', name: 'العنب' },
  { emoji: '✈️', name: 'الطائرة' },
  { emoji: '⭐', name: 'النجمة' },
  { emoji: '📕', name: 'الكتاب' },
  { emoji: '🐝', name: 'النحلة' },
  { emoji: '🐣', name: 'الكتكوت' },
  { emoji: '🍓', name: 'الفراولة' },
  { emoji: '🐰', name: 'الأرنب' },
  { emoji: '🐮', name: 'البقرة' },
  { emoji: '🚂', name: 'القطار' },
  { emoji: '🍊', name: 'البرتقالة' },
  { emoji: '🎈', name: 'البالون' },
  { emoji: '🎁', name: 'الهدية' },
  { emoji: '🎂', name: 'الكعكة' },
  { emoji: '🍦', name: 'الآيس كريم' },
  { emoji: '🍉', name: 'البطيخ' },
  { emoji: '🍍', name: 'الأناناس' },
  { emoji: '🐵', name: 'القرد' },
  { emoji: '🚢', name: 'السفينة' },
  { emoji: '🚌', name: 'الحافلة' },
  { emoji: '👟', name: 'الحذاء' },
  { emoji: '☂️', name: 'المظلة' },
  { emoji: '🔑', name: 'المفتاح' },
  { emoji: '⏰', name: 'الساعة' },
  { emoji: '💍', name: 'الخاتم' },
  { emoji: '👑', name: 'التاج' },
  { emoji: '🍕', name: 'البيتزا' },
  { emoji: '🍔', name: 'البرجر' },
  { emoji: '🍪', name: 'البسكويت' },
  { emoji: '🍩', name: 'الدونات' },
  { emoji: '🐸', name: 'الضفدع' },
  { emoji: '🦆', name: 'البطة' },
  { emoji: '🦋', name: 'الفراشة' },
  { emoji: '🐬', name: 'الدلفين' },
  { emoji: '🌙', name: 'القمر' },
  { emoji: '☀️', name: 'الشمس' },
  { emoji: '🐻', name: 'الدب' },
  { emoji: '🚲', name: 'الدراجة' },
  { emoji: '✏️', name: 'القلم' },
];

export function getFindImageQuestions(count: number = 10): FindImageQuestion[] {
  const questions: FindImageQuestion[] = [];
  const selectedTargets = getRandomItems(ITEMS_POOL, count);

  for (let i = 0; i < selectedTargets.length; i++) {
    const target = selectedTargets[i];

    // Pick 7 distinct distractor items
    const distractorsPool = ITEMS_POOL.filter((item) => item.emoji !== target.emoji);
    const selectedDistractors = getRandomItems(distractorsPool, 7);

    // Combine into 8 total grid items
    const grid = [
      { emoji: target.emoji, isTarget: true },
      ...selectedDistractors.map((d) => ({ emoji: d.emoji, isTarget: false })),
    ];

    questions.push({
      id: `find_${i}_${Date.now()}`,
      targetEmoji: target.emoji,
      targetName: target.name,
      gridEmojis: shuffleArray(grid),
    });
  }

  return questions;
}
