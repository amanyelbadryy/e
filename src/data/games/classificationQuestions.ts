import { shuffleArray, getRandomItems } from './bankUtils';
import { getQuestionSignature } from './signatureUtils';

// 1. Classification (صنّف الأشياء)
export interface ClassificationQuestion {
  id: string;
  categoryTitle: string;
  options: { emoji: string; name: string; isCorrect: boolean }[];
}

const CATEGORIES_DATA = [
  {
    title: 'اخْتَرِ العُنْصُرَ الَّذِي يَنْتَمِي إِلَى الفَوَاكِهِ 🍎',
    corrects: [
      { emoji: '🍎', name: 'تفاحة' }, { emoji: '🍌', name: 'موزة' }, { emoji: '🍇', name: 'عنب' }, { emoji: '🍓', name: 'فراولة' }, { emoji: '🍊', name: 'برتقالة' },
    ],
    wrongs: [
      { emoji: '🚗', name: 'سيارة' }, { emoji: '👟', name: 'حذاء' }, { emoji: '⚽', name: 'كرة' }, { emoji: '📕', name: 'كتاب' }, { emoji: '✈️', name: 'طائرة' },
    ],
  },
  {
    title: 'اخْتَرِ العُنْصُرَ الَّذِي يَنْتَمِي إِلَى الحَيَوَانَاتِ 🦁',
    corrects: [
      { emoji: '🦁', name: 'أسد' }, { emoji: '🐘', name: 'فيل' }, { emoji: '🐱', name: 'قطة' }, { emoji: '🐶', name: 'كلب' }, { emoji: '🐰', name: 'أرنب' },
    ],
    wrongs: [
      { emoji: '✈️', name: 'طائرة' }, { emoji: '🎈', name: 'بالون' }, { emoji: '🍕', name: 'بيتزا' }, { emoji: '✏️', name: 'قلم' }, { emoji: '🚲', name: 'دراجة' },
    ],
  },
  {
    title: 'اخْتَرِ العُنْصُرَ الَّذِي يَنْتَمِي إِلَى المَوَاصَلاَتِ 🚗',
    corrects: [
      { emoji: '🚗', name: 'سيارة' }, { emoji: '✈️', name: 'طائرة' }, { emoji: '🚢', name: 'سفينة' }, { emoji: '🚂', name: 'قطار' }, { emoji: '🚲', name: 'دراجة' },
    ],
    wrongs: [
      { emoji: '🍌', name: 'موزة' }, { emoji: '🌸', name: 'وردة' }, { emoji: '🐟', name: 'سمكة' }, { emoji: '🍦', name: 'آيس كريم' }, { emoji: '🧸', name: 'دبدوب' },
    ],
  },
  {
    title: 'اخْتَرِ العُنْصُرَ الَّذِي يَنْتَمِي إِلَى الأَدَوَاتِ المَدْرَسِيَّةِ ✏️',
    corrects: [
      { emoji: '✏️', name: 'قلم' }, { emoji: '📕', name: 'كتاب' }, { emoji: '📏', name: 'مسطرة' }, { emoji: '✂️', name: 'مقص' }, { emoji: '🎒', name: 'حقيبة' },
    ],
    wrongs: [
      { emoji: '🍔', name: 'برجر' }, { emoji: '🐯', name: 'نمر' }, { emoji: '🚀', name: 'صاروخ' }, { emoji: '⚽', name: 'كرة' }, { emoji: '🍦', name: 'آيس كريم' },
    ],
  },
  {
    title: 'اخْتَرِ العُنْصُرَ الَّذِي يُعْتَبَرُ مِنَ الطُّيُورِ 🐥',
    corrects: [
      { emoji: '🐥', name: 'كتكوت' }, { emoji: '🦅', name: 'نسر' }, { emoji: '🦆', name: 'بطة' }, { emoji: '🕊️', name: 'حمامة' }, { emoji: '🦉', name: 'بومة' },
    ],
    wrongs: [
      { emoji: '🐘', name: 'فيل' }, { emoji: '🥦', name: 'بروكلي' }, { emoji: '🔑', name: 'مفتاح' }, { emoji: '🚗', name: 'سيارة' }, { emoji: '🐟', name: 'سمكة' },
    ],
  },
  {
    title: 'اخْتَرِ العُنْصُرَ الَّذِي يَنْتَمِي إِلَى الخَضْرَاوَاتِ 🥦',
    corrects: [
      { emoji: '🥦', name: 'بروكلي' }, { emoji: '🥕', name: 'جزرة' }, { emoji: '🌽', name: 'ذرة' }, { emoji: '🥒', name: 'خيار' }, { emoji: '🍅', name: 'طماطم' },
    ],
    wrongs: [
      { emoji: '⚽', name: 'كرة' }, { emoji: '🚀', name: 'صاروخ' }, { emoji: '👕', name: ' قميص' }, { emoji: '🐱', name: 'قطة' }, { emoji: '🚲', name: 'دراجة' },
    ],
  },
  {
    title: 'اخْتَرِ العُنْصُرَ الَّذِي يَنْتَمِي إِلَى المَلاَبِسِ 👕',
    corrects: [
      { emoji: '👕', name: 'قميص' }, { emoji: '👖', name: 'بنطال' }, { emoji: '🧥', name: 'معطف' }, { emoji: '🧢', name: 'قبعة' }, { emoji: '🧦', name: 'جوارب' },
    ],
    wrongs: [
      { emoji: '🍎', name: 'تفاحة' }, { emoji: '🦁', name: 'أسد' }, { emoji: '🚗', name: 'سيارة' }, { emoji: '⚽', name: 'كرة' }, { emoji: '📚', name: 'كتاب' },
    ],
  },
  {
    title: 'اخْتَرِ العُنْصُرَ الَّذِي يَنْتَمِي إِلَى الأَلْعَابِ ⚽',
    corrects: [
      { emoji: '⚽', name: 'كرة' }, { emoji: '🎈', name: 'بالون' }, { emoji: '🏀', name: 'كرة سلة' }, { emoji: '🧸', name: 'دبدوب' }, { emoji: '🧩', name: 'لغز' },
    ],
    wrongs: [
      { emoji: '🥦', name: 'بروكلي' }, { emoji: '👟', name: 'حذاء' }, { emoji: '📕', name: 'كتاب' }, { emoji: '🍕', name: 'بيتزا' }, { emoji: '✏️', name: 'قلم' },
    ],
  },
  {
    title: 'اخْتَرِ العُنْصُرَ الَّذِي يَنْتَمِي إِلَى الحَلَوِيَّاتِ 🍦',
    corrects: [
      { emoji: '🍦', name: 'آيس كريم' }, { emoji: '🎂', name: 'كعكة' }, { emoji: '🍩', name: 'دونات' }, { emoji: '🍪', name: 'بسكويت' }, { emoji: '🍬', name: 'حلوى' },
    ],
    wrongs: [
      { emoji: '🚗', name: 'سيارة' }, { emoji: '👟', name: 'حذاء' }, { emoji: '🔑', name: 'مفتاح' }, { emoji: '🎒', name: 'حقيبة' }, { emoji: '⚽', name: 'كرة' },
    ],
  },
  {
    title: 'اخْتَرِ العُنْصُرَ الَّذِي يَعِيشُ فِي البَحْرِ 🐟',
    corrects: [
      { emoji: '🐟', name: 'سمكة' }, { emoji: '🐬', name: 'دلفين' }, { emoji: '🐳', name: 'حوت' }, { emoji: '🐙', name: 'أخطبوط' }, { emoji: '🦀', name: 'سلطعون' },
    ],
    wrongs: [
      { emoji: '🦁', name: 'أسد' }, { emoji: '🦅', name: 'نسر' }, { emoji: '🚗', name: 'سيارة' }, { emoji: '🍎', name: 'تفاحة' }, { emoji: '✏️', name: 'قلم' },
    ],
  },
];

function buildUniqueClassificationBank(): ClassificationQuestion[] {
  const seenSignatures = new Set<string>();
  const bank: ClassificationQuestion[] = [];
  let count = 0;

  for (const cat of CATEGORIES_DATA) {
    for (const correct of cat.corrects) {
      count++;
      const wrongObjs = getRandomItems(cat.wrongs, 3);
      const options = [
        { emoji: correct.emoji, name: correct.name, isCorrect: true },
        ...wrongObjs.map((w) => ({ emoji: w.emoji, name: w.name, isCorrect: false })),
      ];

      const q: ClassificationQuestion = {
        id: `c_${count}`,
        categoryTitle: cat.title,
        options: shuffleArray(options),
      };

      const sig = getQuestionSignature(q);
      if (!seenSignatures.has(sig)) {
        seenSignatures.add(sig);
        bank.push(q);
      }
    }
  }

  return bank;
}

export const CLASSIFICATION_BANK = buildUniqueClassificationBank();

export function getClassificationQuestions(count: number = 10): ClassificationQuestion[] {
  const selected = getRandomItems(CLASSIFICATION_BANK, count);
  return selected.map((q) => ({
    ...q,
    options: shuffleArray(q.options),
  }));
}

// 2. Group Matching (طابق العنصر مع المجموعة)
export interface GroupMatchingQuestion {
  id: string;
  groupName: string;
  groupEmoji: string;
  correctEmoji: string;
  correctItemName: string;
  options: { emoji: string; name: string }[];
}

const GROUPS_DATA = [
  {
    name: 'مَجْمُوعَةُ الخَضْرَاوَاتِ 🥦',
    emoji: '🥦',
    corrects: [{ emoji: '🥕', name: 'جزرة' }, { emoji: '🌽', name: 'ذرة' }, { emoji: '🥒', name: 'خيار' }, { emoji: '🍅', name: 'طماطم' }, { emoji: '🥔', name: 'بطاطس' }],
    wrongs: [{ emoji: '⚽', name: 'كرة' }, { emoji: '🐱', name: 'قطة' }, { emoji: '✈️', name: 'طائرة' }, { emoji: '👟', name: 'حذاء' }],
  },
  {
    name: 'مَجْمُوعَةُ المَلابِسِ 👕',
    emoji: '👕',
    corrects: [{ emoji: '👖', name: 'بنطال' }, { emoji: '🧥', name: 'معطف' }, { emoji: '🧢', name: 'قبعة' }, { emoji: '🧦', name: 'جوارب' }, { emoji: '👗', name: 'فستان' }],
    wrongs: [{ emoji: '🍎', name: 'تفاحة' }, { emoji: '🦁', name: 'أسد' }, { emoji: '🚗', name: 'سيارة' }, { emoji: '⚽', name: 'كرة' }],
  },
  {
    name: 'مَجْمُوعَةُ الأَلْعَابِ ⚽',
    emoji: '⚽',
    corrects: [{ emoji: '🎈', name: 'بالون' }, { emoji: '🏀', name: 'كرة سلة' }, { emoji: '🧸', name: 'دبدوب' }, { emoji: '🧩', name: 'لغز' }, { emoji: '🪆', name: 'دمية' }],
    wrongs: [{ emoji: '🥦', name: 'بروكلي' }, { emoji: '👟', name: 'حذاء' }, { emoji: '📕', name: 'كتاب' }, { emoji: '🍕', name: 'بيتزا' }],
  },
  {
    name: 'مَجْمُوعَةُ الفَوَاهِ المُنْعِشَةِ 🍎',
    emoji: '🍎',
    corrects: [{ emoji: '🍌', name: 'موزة' }, { emoji: '🍇', name: 'عنب' }, { emoji: '🍓', name: 'فراولة' }, { emoji: '🍊', name: 'برتقالة' }, { emoji: '🍉', name: 'بطيخة' }],
    wrongs: [{ emoji: '🚗', name: 'سيارة' }, { emoji: '👟', name: 'حذاء' }, { emoji: '🔑', name: 'مفتاح' }, { emoji: '🎒', name: 'حقيبة' }],
  },
  {
    name: 'مَجْمُوعَةُ الحَيَوَانَاتِ الأَلِيفَةِ 🐶',
    emoji: '🐶',
    corrects: [{ emoji: '🐱', name: 'قطة' }, { emoji: '🐰', name: 'أرنب' }, { emoji: '🐥', name: 'كتكوت' }, { emoji: '🐹', name: 'هامستر' }, { emoji: '🦜', name: 'ببغاء' }],
    wrongs: [{ emoji: '✈️', name: 'طائرة' }, { emoji: '🍕', name: 'بيتزا' }, { emoji: '🚲', name: 'دراجة' }, { emoji: '📕', name: 'كتاب' }],
  },
  {
    name: 'مَجْمُوعَةُ المَوَاصَلاَتِ 🚗',
    emoji: '🚗',
    corrects: [{ emoji: '✈️', name: 'طائرة' }, { emoji: '🚢', name: 'سفينة' }, { emoji: '🚂', name: 'قطار' }, { emoji: '🚲', name: 'دراجة' }, { emoji: '🛵', name: 'دراجة نارية' }],
    wrongs: [{ emoji: '🍎', name: 'تفاحة' }, { emoji: '🌸', name: 'وردة' }, { emoji: '🐟', name: 'سمكة' }, { emoji: '🍦', name: 'آيس كريم' }],
  },
  {
    name: 'مَجْمُوعَةُ الأَدَوَاتِ المَدْرَسِيَّةِ ✏️',
    emoji: '✏️',
    corrects: [{ emoji: '📕', name: 'كتاب' }, { emoji: '📏', name: 'مسطرة' }, { emoji: '✂️', name: 'مقص' }, { emoji: '🎒', name: 'حقيبة' }, { emoji: '🖌️', name: 'فرشاة' }],
    wrongs: [{ emoji: '🍔', name: 'برجر' }, { emoji: '🐯', name: 'نمر' }, { emoji: '🚀', name: 'صاروخ' }, { emoji: '⚽', name: 'كرة' }],
  },
  {
    name: 'مَجْمُوعَةُ الحَلَوِيَّاتِ 🎂',
    emoji: '🎂',
    corrects: [{ emoji: '🍦', name: 'آيس كريم' }, { emoji: '🍩', name: 'دونات' }, { emoji: '🍪', name: 'بسكويت' }, { emoji: '🍬', name: 'حلوى' }, { emoji: '🍫', name: 'شوكولاتة' }],
    wrongs: [{ emoji: '👟', name: 'حذاء' }, { emoji: '🚗', name: 'سيارة' }, { emoji: '🔑', name: 'مفتاح' }, { emoji: '⚽', name: 'كرة' }],
  },
  {
    name: 'مَجْمُوعَةُ الطُّيُورِ 🦅',
    emoji: '🦅',
    corrects: [{ emoji: '🐥', name: 'كتكوت' }, { emoji: '🦆', name: 'بطة' }, { emoji: '🕊️', name: 'حمامة' }, { emoji: '🦉', name: 'بومة' }, { emoji: '🦚', name: 'طاووس' }],
    wrongs: [{ emoji: '🐘', name: 'فيل' }, { emoji: '🥦', name: 'بروكلي' }, { emoji: '🚗', name: 'سيارة' }, { emoji: '🐟', name: 'سمكة' }],
  },
  {
    name: 'مَجْمُوعَةُ المَأْكُولاتِ السَّرِيعَةِ 🍕',
    emoji: '🍕',
    corrects: [{ emoji: '🍔', name: 'برجر' }, { emoji: '🍟', name: 'بطاطس' }, { emoji: '🌭', name: 'هوت دوغ' }, { emoji: '🍿', name: 'فيشار' }, { emoji: '🥪', name: 'شطيرة' }],
    wrongs: [{ emoji: '👟', name: 'حذاء' }, { emoji: '✏️', name: 'قلم' }, { emoji: '🔑', name: 'مفتاح' }, { emoji: '🎒', name: 'حقيبة' }],
  },
];

function buildUniqueGroupMatchingBank(): GroupMatchingQuestion[] {
  const seenSignatures = new Set<string>();
  const bank: GroupMatchingQuestion[] = [];
  let count = 0;

  for (const grp of GROUPS_DATA) {
    for (const correctObj of grp.corrects) {
      count++;
      const wrongObjs = getRandomItems(grp.wrongs, 3);
      const options = shuffleArray([correctObj, ...wrongObjs]);

      const q: GroupMatchingQuestion = {
        id: `gm_${count}`,
        groupName: grp.name,
        groupEmoji: grp.emoji,
        correctEmoji: correctObj.emoji,
        correctItemName: correctObj.name,
        options,
      };

      const sig = getQuestionSignature(q);
      if (!seenSignatures.has(sig)) {
        seenSignatures.add(sig);
        bank.push(q);
      }
    }
  }

  return bank;
}

export const GROUP_MATCHING_BANK = buildUniqueGroupMatchingBank();

export function getGroupMatchingQuestions(count: number = 10): GroupMatchingQuestion[] {
  const selected = getRandomItems(GROUP_MATCHING_BANK, count);
  return selected.map((q) => ({
    ...q,
    options: shuffleArray(q.options),
  }));
}

// 3. Shape Sorting (صنّف حسب الشكل)
export interface ShapeSortingQuestion {
  id: string;
  targetShapeTitle: string;
  correctEmoji: string;
  correctName: string;
  options: { emoji: string; name: string }[];
}

const SHAPES_DATA = [
  {
    title: 'اخْتَرِ الشَّيْءَ الَّذِي لَهُ شَكْلٌ دَائِرِيٌّ 🔴',
    corrects: [
      { emoji: '⚽', name: 'كرة قدم دائرية' },
      { emoji: '🍊', name: 'برتقالة دائرية' },
      { emoji: '🍩', name: 'دونات دائرية' },
      { emoji: '🪙', name: 'عملة معدنية دائرية' },
      { emoji: '🌕', name: 'قمر مكتمل دائري' },
      { emoji: '🎯', name: 'هدف دائري' },
      { emoji: '🍉', name: 'شريحة بطيخ دائرية' },
      { emoji: '⏰', name: 'ساعة حائط دائرية' },
      { emoji: '💿', name: 'قرص دائري' },
      { emoji: '🔘', name: 'زر دائري' },
    ],
    wrongs: [
      { emoji: '📦', name: 'صندوق مربع' },
      { emoji: '📐', name: 'مسطرة مثلث' },
      { emoji: '🚪', name: 'باب مستطيل' },
      { emoji: '🔺', name: 'مثلث أحمر' },
    ],
  },
  {
    title: 'اخْتَرِ الشَّيْءَ الَّذِي لَهُ شَكْلٌ مُرَبَّعٌ 🟦',
    corrects: [
      { emoji: '📦', name: 'صندوق كرتون مربع' },
      { emoji: '🖼️', name: 'إطار صورة مربع' },
      { emoji: '🎲', name: 'حجر نرد مربع' },
      { emoji: '🧱', name: 'مكعب بناء مربع' },
      { emoji: '🟨', name: 'مربع أصفر' },
      { emoji: '🟧', name: 'مربع برتقالي' },
      { emoji: '🟩', name: 'مربع أخضر' },
      { emoji: '🟪', name: 'مربع بنفسجي' },
      { emoji: '⬛', name: 'مربع أسود' },
      { emoji: '⬜', name: 'مربع أبيض' },
    ],
    wrongs: [
      { emoji: '⚽', name: 'كرة دائرية' },
      { emoji: '📐', name: 'مثلث' },
      { emoji: '🍌', name: 'موزة منحنية' },
      { emoji: '🌙', name: 'قمر هلال' },
    ],
  },
  {
    title: 'اخْتَرِ الشَّيْءَ الَّذِي يَبْدُو المَثَلَّثَ 🔺',
    corrects: [
      { emoji: '🍕', name: 'شريحة بيتزا مثلثية' },
      { emoji: '📐', name: 'مسطرة مثلثية' },
      { emoji: '🔺', name: 'مثلث أحمر' },
      { emoji: '🔻', name: 'مثلث مقلوب' },
      { emoji: '⛰️', name: 'قمة جبل مثلثية' },
      { emoji: '🍉', name: 'شريحة بطيخ مثلثية' },
      { emoji: '🎪', name: 'خيمة خيمة مثلثية' },
      { emoji: '🚩', name: 'علم مثلث' },
      { emoji: '🥪', name: 'شطيرة مثلثية' },
      { emoji: '🧀', name: 'قطعة جبن مثلثية' },
    ],
    wrongs: [
      { emoji: '⚽', name: 'كرة دائرية' },
      { emoji: '📕', name: 'كتاب مستطيل' },
      { emoji: '📦', name: 'صندوق مربع' },
      { emoji: '🚗', name: 'سيارة' },
    ],
  },
  {
    title: 'اخْتَرِ الشَّيْءَ الَّذِي يَبْدُو الهِلاَلَ 🌙',
    corrects: [
      { emoji: '🌙', name: 'قمر هلالي' },
      { emoji: '🥐', name: 'كرواسون هلالي' },
      { emoji: '🍌', name: 'موزة هلالية' },
      { emoji: '🌛', name: 'وجه هلال' },
      { emoji: '🌜', name: 'هلال ليل' },
      { emoji: '☪️', name: 'رمز هلال' },
      { emoji: '🍉', name: 'قشرة بطيخ هلالية' },
      { emoji: '🍋', name: 'شريحة ليمون هلالية' },
      { emoji: '⛵', name: 'شراع قارب هلالي' },
      { emoji: '🪃', name: 'بومرانغ هلالي' },
    ],
    wrongs: [
      { emoji: '☀️', name: 'شمس دائرية' },
      { emoji: '📦', name: 'صندوق مربع' },
      { emoji: '⚽', name: 'كرة دائرية' },
      { emoji: '📐', name: 'مسطرة مثلث' },
    ],
  },
  {
    title: 'اخْتَرِ الشَّيْءَ الَّذِي يَبْدُو كَالنَّجْمَةِ ⭐',
    corrects: [
      { emoji: '⭐', name: 'نجمة صفراء خماسية' },
      { emoji: '🌟', name: 'نجمة متألقة' },
      { emoji: '✨', name: 'نجوم بريقة' },
      { emoji: '💫', name: 'نجمة دوارة' },
      { emoji: '✴️', name: 'نجمة ثمانية' },
      { emoji: '✳️', name: 'نجمة خضراء' },
      { emoji: '🌃', name: 'نجوم السماء' },
      { emoji: '🔯', name: 'نجمة سداسية' },
      { emoji: '🎆', name: 'شرارة نجمية' },
      { emoji: '🌠', name: 'شهاب نجمي' },
    ],
    wrongs: [
      { emoji: '🔴', name: 'دائرة حمراء' },
      { emoji: '🟦', name: 'مربع أزرق' },
      { emoji: '📐', name: 'مثلث' },
      { emoji: '🚗', name: 'سيارة' },
    ],
  },
];

function buildUniqueShapeSortingBank(): ShapeSortingQuestion[] {
  const seenSignatures = new Set<string>();
  const bank: ShapeSortingQuestion[] = [];
  let count = 0;

  for (const sh of SHAPES_DATA) {
    for (const correctObj of sh.corrects) {
      count++;
      const wrongObjs = getRandomItems(sh.wrongs, 3);
      const options = shuffleArray([correctObj, ...wrongObjs]);

      const q: ShapeSortingQuestion = {
        id: `sh_${count}`,
        targetShapeTitle: sh.title,
        correctEmoji: correctObj.emoji,
        correctName: correctObj.name,
        options,
      };

      const sig = getQuestionSignature(q);
      if (!seenSignatures.has(sig)) {
        seenSignatures.add(sig);
        bank.push(q);
      }
    }
  }

  return bank;
}

export const SHAPE_SORTING_BANK = buildUniqueShapeSortingBank();

export function getShapeSortingQuestions(count: number = 10): ShapeSortingQuestion[] {
  const selected = getRandomItems(SHAPE_SORTING_BANK, count);
  return selected.map((q) => ({
    ...q,
    options: shuffleArray(q.options),
  }));
}

// 4. Size Ordering (رتب من الأصغر إلى الأكبر)
export interface SizeOrderingQuestion {
  id: string;
  prompt: string;
  correctEmoji: string;
  correctName: string;
  options: { emoji: string; name: string }[];
}

const SIZE_SCENARIOS_DATA = [
  {
    prompt: 'أَيُّ هَذِهِ الحَيَوَانَاتِ هُوَ الأَصْغَرُ حَجْماً؟ 🐭',
    corrects: [
      { emoji: '🐭', name: 'فأر صغير' },
      { emoji: '🐜', name: 'نملة صغيرة' },
      { emoji: '🐝', name: 'نحلة صغيرة' },
      { emoji: '🐥', name: 'كتكوت صغير' },
      { emoji: '🐞', name: 'دعسوقة صغيرة' },
      { emoji: '🪲', name: 'خنفساء صغيرة' },
      { emoji: '🦋', name: 'فراشة صغيرة' },
      { emoji: '🐌', name: 'حلزون صغير' },
      { emoji: '🪱', name: 'دودة صغيرة' },
      { emoji: '🦟', name: 'بعوضة صغيرة' },
    ],
    wrongs: [
      { emoji: '🐱', name: 'قطة' },
      { emoji: '🦁', name: 'أسد' },
      { emoji: '🐘', name: 'فيل ضخم' },
      { emoji: '🐪', name: 'جمل' },
    ],
  },
  {
    prompt: 'أَيُّ هَذِهِ الحَيَوَانَاتِ هُوَ الأَكْبَرُ حَجْماً؟ 🐘',
    corrects: [
      { emoji: '🐘', name: 'فيل ضخم' },
      { emoji: '🐳', name: 'حوت أزرق ضخم' },
      { emoji: '🦒', name: 'زرافة طويلة ضخمة' },
      { emoji: '🦏', name: 'وحيد قرن ضخم' },
      { emoji: '🦛', name: 'فرس نهر ضخم' },
      { emoji: '🐪', name: 'جمل ضخم' },
      { emoji: '🐻', name: 'دب كبير' },
      { emoji: '🦁', name: 'أسد كبير' },
      { emoji: '🐊', name: 'تمساح كبير' },
      { emoji: '🦈', name: 'قرش كبير' },
    ],
    wrongs: [
      { emoji: '🐱', name: 'قطة صغيرة' },
      { emoji: '🐥', name: 'كتكوت صغير' },
      { emoji: '🐰', name: 'أرنب' },
      { emoji: '🐭', name: 'فأر' },
    ],
  },
  {
    prompt: 'أَيُّ مَرْكَبَةٍ هِيَ الأَكْبَرُ حَجْماً وَأَسْرَعُ؟ 🚀',
    corrects: [
      { emoji: '🚀', name: 'صاروخ عملاق' },
      { emoji: '✈️', name: 'طائرة ركاب ضخمة' },
      { emoji: '🚢', name: 'سفينة عملاقة' },
      { emoji: '🚂', name: 'قطار طويل' },
      { emoji: '🚌', name: 'حافلة كبيرة' },
      { emoji: '🚛', name: 'شاحنة ضخمة' },
      { emoji: '🚁', name: 'طائرة مروحية' },
      { emoji: '🚜', name: 'جرار كبير' },
      { emoji: '🚒', name: 'سيارة إطفاء' },
      { emoji: '🏎️', name: 'سيارة سباق' },
    ],
    wrongs: [
      { emoji: '🚗', name: 'سيارة صغيرة' },
      { emoji: '🚲', name: 'دراجة هوائية' },
      { emoji: '🛴', name: 'سكوتر صغير' },
      { emoji: '🛹', name: 'لوح تزلج' },
    ],
  },
  {
    prompt: 'أَيُّ طَائِرٍ هُوَ الأَصْغَرُ حَجْماً بَيْنَ هَؤُلاَءِ؟ 🐥',
    corrects: [
      { emoji: '🐥', name: 'كتكوت صغيّر' },
      { emoji: '🕊️', name: 'عصفور صغيّر' },
      { emoji: '🦜', name: 'ببغاء صغيّر' },
      { emoji: '🦆', name: 'بطة صغيرة' },
      { emoji: '🦉', name: 'بومة صغيرة' },
      { emoji: '🦩', name: 'فلامنغو صغيّر' },
      { emoji: '🐧', name: 'بطريق صغيّر' },
      { emoji: '🦚', name: 'طاووس صغيّر' },
      { emoji: '🦅', name: 'نسر صغيّر' },
      { emoji: '🐓', name: 'ديك صغيّر' },
    ],
    wrongs: [
      { emoji: '🦅', name: 'نسر عملاق' },
      { emoji: '🦩', name: 'فلامنغو كبير' },
      { emoji: '🦚', name: 'طاووس كبير' },
      { emoji: '🦤', name: 'نعامة ضخمة' },
    ],
  },
  {
    prompt: 'أَيُّ الحَشَرَاتِ هِيَ الأَصْغَرُ حَجْماً جِدّاً؟ 🐜',
    corrects: [
      { emoji: '🐜', name: 'نملة دقيقة' },
      { emoji: '🦟', name: 'بعوضة صغيّرة' },
      { emoji: '🪰', name: 'ذُبابة صغيّرة' },
      { emoji: '🪲', name: 'خنفساء صغيّرة' },
      { emoji: '🐞', name: 'دعسوقة صغيّرة' },
      { emoji: '🐝', name: 'نحلة صغيّرة' },
      { emoji: '🦋', name: 'فراشة صغيّرة' },
      { emoji: '🪱', name: 'دودة صغيّرة' },
      { emoji: '🦗', name: 'صرصور صغيّر' },
      { emoji: '🕷️', name: 'العنكبوت الصغيّر' },
    ],
    wrongs: [
      { emoji: '🐸', name: 'ضفدع كبير' },
      { emoji: '🐱', name: 'قطة' },
      { emoji: '🐰', name: 'أرنب' },
      { emoji: '🦅', name: 'نسر' },
    ],
  },
];

function buildUniqueSizeOrderingBank(): SizeOrderingQuestion[] {
  const seenSignatures = new Set<string>();
  const bank: SizeOrderingQuestion[] = [];
  let count = 0;

  for (const sz of SIZE_SCENARIOS_DATA) {
    for (const correctObj of sz.corrects) {
      count++;
      const wrongObjs = getRandomItems(sz.wrongs, 3);
      const options = shuffleArray([correctObj, ...wrongObjs]);

      const q: SizeOrderingQuestion = {
        id: `sz_${count}`,
        prompt: sz.prompt,
        correctEmoji: correctObj.emoji,
        correctName: correctObj.name,
        options,
      };

      const sig = getQuestionSignature(q);
      if (!seenSignatures.has(sig)) {
        seenSignatures.add(sig);
        bank.push(q);
      }
    }
  }

  return bank;
}

export const SIZE_ORDERING_BANK = buildUniqueSizeOrderingBank();

export function getSizeOrderingQuestions(count: number = 10): SizeOrderingQuestion[] {
  const selected = getRandomItems(SIZE_ORDERING_BANK, count);
  return selected.map((q) => ({
    ...q,
    options: shuffleArray(q.options),
  }));
}

// 5. Similar Matching (وصل المتشابه)
export interface SimilarMatchingPair {
  id: string;
  item1Emoji: string;
  item1Name: string;
  item2Emoji: string;
  item2Name: string;
}

export const SIMILAR_PAIRS_BANK: SimilarMatchingPair[] = [
  { id: 'sm1', item1Emoji: '🐮', item1Name: 'بقرة', item2Emoji: '🥛', item2Name: 'حليب' },
  { id: 'sm2', item1Emoji: '🐔', item1Name: 'دجاجة', item2Emoji: '🥚', item2Name: 'بيضة' },
  { id: 'sm3', item1Emoji: '🐝', item1Name: 'نحلة', item2Emoji: '🍯', item2Name: 'عسل' },
  { id: 'sm4', item1Emoji: '✏️', item1Name: 'قلم', item2Emoji: '📓', item2Name: 'دفتر' },
  { id: 'sm5', item1Emoji: '🔑', item1Name: 'مفتاح', item2Emoji: '🔒', item2Name: 'قفل' },
  { id: 'sm6', item1Emoji: '🐵', item1Name: 'قرد', item2Emoji: '🍌', item2Name: 'موزة' },
  { id: 'sm7', item1Emoji: '🐰', item1Name: 'أرنب', item2Emoji: '🥕', item2Name: 'جزرة' },
  { id: 'sm8', item1Emoji: '🌧️', item1Name: 'مطر', item2Emoji: '☂️', item2Name: 'مظلة' },
  { id: 'sm9', item1Emoji: '🚗', item1Name: 'سيارة', item2Emoji: '⛽', item2Name: 'وقود' },
  { id: 'sm10', item1Emoji: '🪥', item1Name: 'فرشاة', item2Emoji: '🦷', item2Name: 'أسنان' },
  { id: 'sm11', item1Emoji: '🐟', item1Name: 'سمكة', item2Emoji: '🌊', item2Name: 'ماء البحر' },
  { id: 'sm12', item1Emoji: '👶', item1Name: 'طفل', item2Emoji: '🍼', item2Name: 'رضاعة' },
  { id: 'sm13', item1Emoji: '🎨', item1Name: 'ألوان', item2Emoji: '🖌️', item2Name: 'فرشاة رسم' },
  { id: 'sm14', item1Emoji: '☀️', item1Name: 'شمس', item2Emoji: '🕶️', item2Name: 'نظارة' },
  { id: 'sm15', item1Emoji: '⚽', item1Name: 'كرة', item2Emoji: '🥅', item2Name: 'مرمى' },
  { id: 'sm16', item1Emoji: '🐦', item1Name: 'عصفور', item2Emoji: '🪺', item2Name: 'عش' },
  { id: 'sm17', item1Emoji: '👨‍🍳', item1Name: 'طباخ', item2Emoji: '🍳', item2Name: 'مقلاة' },
  { id: 'sm18', item1Emoji: '👨‍🎓', item1Name: 'طالب', item2Emoji: '🎒', item2Name: 'حقيبة' },
  { id: 'sm19', item1Emoji: '🌧️', item1Name: 'سحابة', item2Emoji: '🌈', item2Name: 'قوس قزح' },
  { id: 'sm20', item1Emoji: '🛌', item1Name: 'سرير', item2Emoji: '🌙', item2Name: 'نوم في الليل' },
  { id: 'sm21', item1Emoji: '🚀', item1Name: 'صاروخ', item2Emoji: '🪐', item2Name: 'كوكب الفضاء' },
  { id: 'sm22', item1Emoji: '🐱', item1Name: 'قطة', item2Emoji: '🐟', item2Name: 'سمكة' },
  { id: 'sm23', item1Emoji: '🐶', item1Name: 'كلب', item2Emoji: '🦴', item2Name: 'عظمة' },
  { id: 'sm24', item1Emoji: '🍇', item1Name: 'عنب', item2Emoji: '🧃', item2Name: 'عصير' },
  { id: 'sm25', item1Emoji: '🌾', item1Name: 'قُمح', item2Emoji: '🍞', item2Name: 'خبز' },
  { id: 'sm26', item1Emoji: '🐭', item1Name: 'فأر', item2Emoji: '🧀', item2Name: 'جبنة' },
  { id: 'sm27', item1Emoji: '🐸', item1Name: 'ضفدع', item2Emoji: '🍃', item2Name: 'ورق ماء' },
  { id: 'sm28', item1Emoji: '👑', item1Name: 'ملِك', item2Emoji: '🏰', item2Name: 'قصر' },
  { id: 'sm29', item1Emoji: '🚲', item1Name: 'دراجة', item2Emoji: '🪖', item2Name: 'خوذة أمان' },
  { id: 'sm30', item1Emoji: '🎂', item1Name: 'كعكة', item2Emoji: '🕯️', item2Name: 'شمعة' },
  { id: 'sm31', item1Emoji: '🎁', item1Name: 'هدية', item2Emoji: '🎉', item2Name: 'زينة' },
  { id: 'sm32', item1Emoji: '🍕', item1Name: 'بيتزا', item2Emoji: '🥤', item2Name: 'مشروب' },
  { id: 'sm33', item1Emoji: '🍔', item1Name: 'برجر', item2Emoji: '🍟', item2Name: 'بطاطس' },
  { id: 'sm34', item1Emoji: '☕', item1Name: 'قهوة', item2Emoji: '🍩', item2Name: 'دونات' },
  { id: 'sm35', item1Emoji: '🌳', item1Name: 'شجرة', item2Emoji: '🍏', item2Name: 'تفاحة' },
  { id: 'sm36', item1Emoji: '🌴', item1Name: 'نخلة', item2Emoji: '🥥', item2Name: 'جوز هند' },
  { id: 'sm37', item1Emoji: '🌵', item1Name: 'صبار', item2Emoji: '🏜️', item2Name: 'صحراء' },
  { id: 'sm38', item1Emoji: '❄️', item1Name: 'ثلج', item2Emoji: '☃️', item2Name: 'رجل ثلجي' },
  { id: 'sm39', item1Emoji: '🔥', item1Name: 'نار', item2Emoji: '🪵', item2Name: 'حطب' },
  { id: 'sm40', item1Emoji: '⚓', item1Name: 'مرساة', item2Emoji: '🚢', item2Name: 'سفينة' },
  { id: 'sm41', item1Emoji: '✈️', item1Name: 'طائرة', item2Emoji: '☁️', item2Name: 'سحاب' },
  { id: 'sm42', item1Emoji: '🎨', item1Name: 'رسام', item2Emoji: '🖼️', item2Name: 'لوحة فنية' },
  { id: 'sm43', item1Emoji: '👨‍⚕️', item1Name: 'طبيب', item2Emoji: '🩺', item2Name: 'سماعة' },
  { id: 'sm44', item1Emoji: '👮', item1Name: 'شرطي', item2Emoji: '🚓', item2Name: 'سيارة دورية' },
  { id: 'sm45', item1Emoji: '👨‍طفل', item1Name: 'إطفائي', item2Emoji: '🚒', item2Name: 'سيارة إطفاء' },
  { id: 'sm46', item1Emoji: '⚡', item1Name: 'كهرباء', item2Emoji: '💡', item2Name: 'مصباح' },
  { id: 'sm47', item1Emoji: '📱', item1Name: 'هاتف', item2Emoji: '🎧', item2Name: 'سماعة' },
  { id: 'sm48', item1Emoji: '📷', item1Name: 'كاميرا', item2Emoji: '🖼️', item2Name: 'صورة' },
  { id: 'sm49', item1Emoji: '⏰', item1Name: 'منبه', item2Emoji: '🌅', item2Name: 'استيقاظ' },
  { id: 'sm50', item1Emoji: '🎈', item1Name: 'بالون', item2Emoji: '🪡', item2Name: 'خيط' },
];

export function getSimilarMatchingPairs(count: number = 5): SimilarMatchingPair[] {
  return getRandomItems(SIMILAR_PAIRS_BANK, count);
}
