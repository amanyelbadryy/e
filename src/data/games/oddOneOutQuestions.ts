import { shuffleArray, getRandomItems } from './bankUtils';

export interface OddOneOutQuestion {
  id: string;
  categoryTitle: string;
  items: { emoji: string; name: string; isOdd: boolean }[];
  oddItemName: string;
  explanation: string;
}

export const ODD_ONE_OUT_BANK: OddOneOutQuestion[] = Array.from({ length: 50 }, (_, i) => {
  const idx = i + 1;
  // Create 50 distinct odd-one-out scenarios across various categories
  const categoriesData = [
    {
      title: 'مَجْمُوعَةُ الفَوَاكِهِ 🍎',
      normal: [
        { emoji: '🍎', name: 'تفاحة' },
        { emoji: '🍌', name: 'موزة' },
        { emoji: '🍓', name: 'فراولة' },
        { emoji: '🍇', name: 'عنب' },
        { emoji: '🍊', name: 'برتقالة' },
      ],
      odds: [
        { emoji: '🚗', name: 'سيارة', exp: 'السيارة وسيلة مواصلات وليست فاكهة!' },
        { emoji: '🐱', name: 'قطة', exp: 'القطة حيوان وليست فاكهة!' },
        { emoji: '⚽', name: 'كرة', exp: 'الكرة لعبة وليست فاكهة!' },
        { emoji: '📕', name: 'كتاب', exp: 'الكتاب أدوات مدرسية وليس فاكهة!' },
        { emoji: '👟', name: 'حذاء', exp: 'الحذاء ملابس وليس فاكهة!' },
      ],
    },
    {
      title: 'مَجْمُوعَةُ الحَيَوَانَاتِ 🦁',
      normal: [
        { emoji: '🐱', name: 'قطة' },
        { emoji: '🐶', name: 'كلب' },
        { emoji: '🦁', name: 'أسد' },
        { emoji: '🐘', name: 'فيل' },
        { emoji: '🐰', name: 'أرنب' },
      ],
      odds: [
        { emoji: '✈️', name: 'طائرة', exp: 'الطائرة مركبة وليست حيواناً!' },
        { emoji: '🥦', name: 'بروكلي', exp: 'البروكلي خضار وليس حيواناً!' },
        { emoji: '🎈', name: 'بالون', exp: 'البالون لعبة وليس حيواناً!' },
        { emoji: '✏️', name: 'قلم', exp: 'القلم أدوات رسم وليس حيواناً!' },
        { emoji: '🍕', name: 'بيتزا', exp: 'البيتزا طعام وليست حيواناً!' },
      ],
    },
    {
      title: 'مَجْمُوعَةُ المَوَاصَلاَتِ 🚗',
      normal: [
        { emoji: '🚗', name: 'سيارة' },
        { emoji: '✈️', name: 'طائرة' },
        { emoji: '🚢', name: 'سفينة' },
        { emoji: '🚂', name: 'قطار' },
        { emoji: '🚲', name: 'دراجة' },
      ],
      odds: [
        { emoji: '🍌', name: 'موزة', exp: 'الموزة فاكهة وليست مركبة مواصلات!' },
        { emoji: '🌸', name: 'وردة', exp: 'الوردة نبات وليست مركبة!' },
        { emoji: '🐟', name: 'سمكة', exp: 'السمكة كائن حي وليست مركبة!' },
        { emoji: '🍦', name: 'آيس كريم', exp: 'الآيس كريم طعام وليس مركب!' },
        { emoji: '🧸', name: 'دبدوب', exp: 'الدبدوب لعبة وليس مركب!' },
      ],
    },
    {
      title: 'مَجْمُوعَةُ الأَدَوَاتِ المَدْرَسِيَّةِ ✏️',
      normal: [
        { emoji: '✏️', name: 'قلم' },
        { emoji: '📕', name: 'كتاب' },
        { emoji: '📏', name: 'مسطرة' },
        { emoji: '✂️', name: 'مقص' },
        { emoji: '🎒', name: 'حقيبة' },
      ],
      odds: [
        { emoji: '🍔', name: 'برجر', exp: 'البرجر طعام وليس أدوات مدرسية!' },
        { emoji: '🐯', name: 'نمر', exp: 'النمر حيوان وليس أدوات دراسة!' },
        { emoji: '🚀', name: 'صاروخ', exp: 'الصاروخ مركبة فضاء وليس أدوات صف!' },
        { emoji: '⚽', name: 'كرة', exp: 'الكرة لعبة وليست أدوات كتابة!' },
        { emoji: '🍦', name: 'آيس كريم', exp: 'الآيس كريم طعام ليس للحقيبة!' },
      ],
    },
    {
      title: 'مَجْمُوعَةُ الخَضْرَاوَاتِ 🥦',
      normal: [
        { emoji: '🥦', name: 'بروكلي' },
        { emoji: '🥕', name: 'جزرة' },
        { emoji: '🌽', name: 'ذرة' },
        { emoji: '🍅', name: 'طماطم' },
        { emoji: '🥒', name: 'خيار' },
      ],
      odds: [
        { emoji: '🍰', name: 'كعكة', exp: 'الكعكة حلوى وليست من الخضار!' },
        { emoji: '🐵', name: 'قرد', exp: 'القرد حيوان وليس خضار!' },
        { emoji: '🚗', name: 'سيارة', exp: 'السيارة مركبة وليست خضار!' },
        { emoji: '🎈', name: 'بالون', exp: 'البالون لعبة وليس خضار!' },
        { emoji: '🔑', name: 'مفتاح', exp: 'المفتاح أدوات وليس خضار!' },
      ],
    },
    {
      title: 'مَجْمُوعَةُ الأَلْعَابِ ⚽',
      normal: [
        { emoji: '⚽', name: 'كرة قدم' },
        { emoji: '🏀', name: 'كرة سلة' },
        { emoji: '🧸', name: 'دبدوب' },
        { emoji: '🧩', name: 'لغز' },
        { emoji: '🎈', name: 'بالون' },
      ],
      odds: [
        { emoji: '🧅', name: 'بصل', exp: 'البصل طعام وليس من الألعاب!' },
        { emoji: '🪥', name: 'فرشاة', exp: 'الفرشاة للنظافة وليست لعبة!' },
        { emoji: '👟', name: 'حذاء', exp: 'الحذاء ملابس وليس لعبة!' },
        { emoji: '🌧️', name: 'مطر', exp: 'المطر طقس وليس لعبة!' },
        { emoji: '📚', name: 'كتب', exp: 'الكتب للقراءة وليست العاباً!' },
      ],
    },
    {
      title: 'مَجْمُوعَةُ الطُّيُورِ 🐥',
      normal: [
        { emoji: '🐥', name: 'كتكوت' },
        { emoji: '🦅', name: 'نسر' },
        { emoji: '🦆', name: 'بطة' },
        { emoji: '🕊️', name: 'حمامة' },
        { emoji: '🦉', name: 'بومة' },
      ],
      odds: [
        { emoji: '🐟', name: 'سمكة', exp: 'السمكة تسبح في الماء ولا تطير!' },
        { emoji: '🐘', name: 'فيل', exp: 'الفيل حيوان ضخم يمشى ولا يطير!' },
        { emoji: '🍎', name: 'تفاحة', exp: 'التفاحة طعام وليست طيراً!' },
        { emoji: '🚗', name: 'سيارة', exp: 'السيارة مركبة وليست طيراً!' },
        { emoji: '🚲', name: 'دراجة', exp: 'الدراجة مركبة وليست طيراً!' },
      ],
    },
    {
      title: 'مَجْمُوعَةُ المَلابِسِ 👕',
      normal: [
        { emoji: '👕', name: 'قميص' },
        { emoji: '👖', name: 'بنطال' },
        { emoji: '🧥', name: 'معطف' },
        { emoji: '🧢', name: 'قبعة' },
        { emoji: '🧦', name: 'جوارب' },
      ],
      odds: [
        { emoji: '🍉', name: 'بطيخ', exp: 'البطيخ فاكهة ولا نرتديه!' },
        { emoji: '🚀', name: 'صاروخ', exp: 'الصاروخ للملاحة الفضائية وليس ملابس!' },
        { emoji: '🦁', name: 'أسد', exp: 'الأسد حيوان مفترس وليس ملابس!' },
        { emoji: '📱', name: 'هاتف', exp: 'الهاتف جهاز وليس ملابس!' },
        { emoji: '🍕', name: 'بيتزا', exp: 'البيتزا طعام وليست ملابس!' },
      ],
    },
    {
      title: 'مَجْمُوعَةُ المَأْكُولاتِ السَّرِيعَةِ 🍕',
      normal: [
        { emoji: '🍕', name: 'بيتزا' },
        { emoji: '🍔', name: 'برجر' },
        { emoji: '🍟', name: 'بطاطس' },
        { emoji: '🌭', name: 'هوت دوغ' },
        { emoji: '🥪', name: 'شطيرة' },
      ],
      odds: [
        { emoji: '🧼', name: 'صابون', exp: 'الصابون للنظافة ولا نأكله!' },
        { emoji: '👟', name: 'حذاء', exp: 'الحذاء للمشي ولا نأكله!' },
        { emoji: '🚗', name: 'سيارة', exp: 'السيارة وسيلة تنقل ولا نأكلها!' },
        { emoji: '🔑', name: 'مفتاح', exp: 'المفتاح للفتح ولا نأكله!' },
        { emoji: '⚽', name: 'كرة', exp: 'الكرة للرياضة ولا نأكلها!' },
      ],
    },
    {
      title: 'مَجْمُوعَةُ الأَشْكَالِ وَالأَلْوَانِ ⭐',
      normal: [
        { emoji: '⭐', name: 'نجمة' },
        { emoji: '🔴', name: 'دائرة' },
        { emoji: '🟦', name: 'مربع' },
        { emoji: '🔺', name: 'مثلث' },
        { emoji: '💎', name: 'ماس' },
      ],
      odds: [
        { emoji: '🐵', name: 'قرد', exp: 'القرد حيوان وليس شكلاً هندسياً!' },
        { emoji: '🚗', name: 'سيارة', exp: 'السيارة مركبة وليست شكلاً!' },
        { emoji: '🍎', name: 'تفاحة', exp: 'التفاحة فاكهة وليست رمزا رسميا!' },
        { emoji: '👟', name: 'حذاء', exp: 'الحذاء ملابس وليس رمز شكل!' },
        { emoji: '📕', name: 'كتاب', exp: 'الكتاب أدوات وليس شكلا!' },
      ],
    },
  ];

  const cat = categoriesData[i % categoriesData.length];
  const selectedNormals = getRandomItems(cat.normal, 3);
  const oddObj = cat.odds[Math.floor(i / categoriesData.length) % cat.odds.length];

  const items = [
    ...selectedNormals.map((n) => ({ emoji: n.emoji, name: n.name, isOdd: false })),
    { emoji: oddObj.emoji, name: oddObj.name, isOdd: true },
  ];

  return {
    id: `o_${idx}`,
    categoryTitle: cat.title,
    items: shuffleArray(items),
    oddItemName: oddObj.name,
    explanation: oddObj.exp,
  };
});

export function getOddOneOutQuestions(count: number = 10): OddOneOutQuestion[] {
  const selected = getRandomItems(ODD_ONE_OUT_BANK, count);
  return selected.map((q) => ({
    ...q,
    items: shuffleArray(q.items),
  }));
}
