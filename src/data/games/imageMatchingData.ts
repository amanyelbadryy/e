import { getRandomItems, shuffleArray } from './bankUtils';

export interface ImageMatchingItem {
  pairId: string;
  emoji: string;
  name: string;
}

export interface ImageMatchingCard {
  id: string;
  pairId: string;
  emoji: string;
  name: string;
  state: 'hidden' | 'revealed' | 'matched';
}

export const IMAGE_MATCHING_POOL: ImageMatchingItem[] = [
  { pairId: 'cat', emoji: '🐱', name: 'قطة' },
  { pairId: 'dog', emoji: '🐶', name: 'كلب' },
  { pairId: 'apple', emoji: '🍎', name: 'تفاحة' },
  { pairId: 'banana', emoji: '🍌', name: 'موزة' },
  { pairId: 'car', emoji: '🚗', name: 'سيارة' },
  { pairId: 'rocket', emoji: '🚀', name: 'صاروخ' },
  { pairId: 'flower', emoji: '🌸', name: 'وردة' },
  { pairId: 'lion', emoji: '🦁', name: 'أسد' },
  { pairId: 'elephant', emoji: '🐘', name: 'فيل' },
  { pairId: 'fish', emoji: '🐟', name: 'سمكة' },
  { pairId: 'ball', emoji: '⚽', name: 'كرة' },
  { pairId: 'grapes', emoji: '🍇', name: 'عنب' },
  { pairId: 'airplane', emoji: '✈️', name: 'طائرة' },
  { pairId: 'star', emoji: '⭐', name: 'نجمة' },
  { pairId: 'book', emoji: '📕', name: 'كتاب' },
  { pairId: 'pencil', emoji: '✏️', name: 'قلم' },
  { pairId: 'bicycle', emoji: '🚲', name: 'دراجة' },
  { pairId: 'bear', emoji: '🐻', name: 'دب' },
  { pairId: 'strawberry', emoji: '🍓', name: 'فراولة' },
  { pairId: 'moon', emoji: '🌙', name: 'قمر' },
  { pairId: 'sun', emoji: '☀️', name: 'شمس' },
  { pairId: 'bee', emoji: '🐝', name: 'نحلة' },
  { pairId: 'chick', emoji: '🐥', name: 'كتكوت' },
  { pairId: 'rabbit', emoji: '🐰', name: 'أرنب' },
  { pairId: 'cow', emoji: '🐮', name: 'بقرة' },
  { pairId: 'train', emoji: '🚂', name: 'قطار' },
  { pairId: 'orange', emoji: '🍊', name: 'برتقالة' },
  { pairId: 'balloon', emoji: '🎈', name: 'بالون' },
  { pairId: 'gift', emoji: '🎁', name: 'هدية' },
  { pairId: 'cake', emoji: '🎂', name: 'كعكة' },
  { pairId: 'icecream', emoji: '🍦', name: 'آيس كريم' },
  { pairId: 'watermelon', emoji: '🍉', name: 'بطيخ' },
  { pairId: 'pineapple', emoji: '🍍', name: 'أناناس' },
  { pairId: 'monkey', emoji: '🐵', name: 'قرد' },
  { pairId: 'ship', emoji: '🚢', name: 'سفينة' },
  { pairId: 'bus', emoji: '🚌', name: 'حافلة' },
  { pairId: 'shoe', emoji: '👟', name: 'حذاء' },
  { pairId: 'umbrella', emoji: '☂️', name: 'مظلة' },
  { pairId: 'key', emoji: '🔑', name: 'مفتاح' },
  { pairId: 'clock', emoji: '⏰', name: 'ساعة' },
  { pairId: 'ring', emoji: '💍', name: 'خاتم' },
  { pairId: 'crown', emoji: '👑', name: 'تاج' },
  { pairId: 'pizza', emoji: '🍕', name: 'بيتزا' },
  { pairId: 'burger', emoji: '🍔', name: 'برجر' },
  { pairId: 'cookie', emoji: '🍪', name: 'بسكويت' },
  { pairId: 'donut', emoji: '🍩', name: 'دونات' },
  { pairId: 'frog', emoji: '🐸', name: 'ضفدع' },
  { pairId: 'duck', emoji: '🦆', name: 'بطة' },
  { pairId: 'butterfly', emoji: '🦋', name: 'فراشة' },
  { pairId: 'dolphin', emoji: '🐬', name: 'دلفين' },
];

export function getImageMatchingDeck(pairsCount: number = 10): ImageMatchingCard[] {
  const selectedPool = getRandomItems(IMAGE_MATCHING_POOL, pairsCount);
  const deck: ImageMatchingCard[] = [];

  selectedPool.forEach((item) => {
    deck.push({
      id: `${item.pairId}-card-1`,
      pairId: item.pairId,
      emoji: item.emoji,
      name: item.name,
      state: 'hidden',
    });

    deck.push({
      id: `${item.pairId}-card-2`,
      pairId: item.pairId,
      emoji: item.emoji,
      name: item.name,
      state: 'hidden',
    });
  });

  return shuffleArray(deck);
}
