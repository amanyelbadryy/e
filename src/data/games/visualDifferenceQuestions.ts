import { shuffleArray, getRandomItems } from './bankUtils';
import { getQuestionSignature } from './signatureUtils';

export interface VisualDifferenceQuestion {
  id: string;
  promptText: string;
  items: { emoji: string; name: string; isDifferent: boolean }[];
}

const RAW_50_VISUAL_DIFFS = [
  { prompt: 'اخْتَرِ الشَّكْلَ المُمَيَّزَ وَالمُخْتَلِفَ بَيْنَ التفاحات 🍎', same: { emoji: '🍎', name: 'تفاحة حمراء' }, diff: { emoji: '🍏', name: 'تفاحة خضراء' } },
  { prompt: 'اخْتَرِ السَّيَّارَةَ المُمَيَّزَةَ فِي اللَّوْنِ 🚗', same: { emoji: '🚗', name: 'سيارة حمراء' }, diff: { emoji: '🚙', name: 'سيارة زرقاء' } },
  { prompt: 'اخْتَرِ القِطَّةَ المُخْتَلِفَةَ بَيْنَ القِطَطِ 🐱', same: { emoji: '🐱', name: 'قطة صفراء' }, diff: { emoji: '🐶', name: 'كلب' } },
  { prompt: 'اخْتَرِ الكُرَةَ المُخْتَلِفَةَ بَيْنَ كُرَاتِ القَدَمِ ⚽', same: { emoji: '⚽', name: 'كرة قدم' }, diff: { emoji: '🏀', name: 'كرة سلة' } },
  { prompt: 'اخْتَرِ الفَاكِهَةَ المُخْتَلِفَةَ بَيْنَ المَوْزِ 🍌', same: { emoji: '🍌', name: 'موزة صفراء' }, diff: { emoji: '🍊', name: 'برتقالة' } },
  { prompt: 'اخْتَرِ الزَّهْرَةَ المُخْتَلِفَةَ بَيْنَ الزُّهُورِ 🌸', same: { emoji: '🌸', name: 'وردة وردية' }, diff: { emoji: '🌺', name: 'زهرة حمراء' } },
  { prompt: 'اخْتَرِ الطَّائِرَ المُخْتَلِفَ بَيْنَ الكَتَاكِيتِ 🐥', same: { emoji: '🐥', name: 'كتكوت أصغر' }, diff: { emoji: '🦆', name: 'بطة' } },
  { prompt: 'اخْتَرِ البَالُونَ المُخْتَلِفَ فِي المَجْمُوعَةِ 🎈', same: { emoji: '🎈', name: 'بالون أحمر' }, diff: { emoji: '🎆', name: 'ألعاب نارية' } },
  { prompt: 'اخْتَرِ الطَّعَامَ المُخْتَلِفَ بَيْنَ البِيتْزَا 🍕', same: { emoji: '🍕', name: 'شريحة بيتزا' }, diff: { emoji: '🍔', name: 'برجر' } },
  { prompt: 'اخْتَرِ المَلاَبِسَ المُخْتَلِفَةَ بَيْنَ الأحذية 👟', same: { emoji: '👟', name: 'حذاء رياضي' }, diff: { emoji: '🧦', name: 'جوارب' } },

  { prompt: 'اخْتَرِ الأدوات المُخْتَلِفَةَ بَيْنَ الأقلام ✏️', same: { emoji: '✏️', name: 'قلم رصاص' }, diff: { emoji: '📏', name: 'مسطرة' } },
  { prompt: 'اخْتَرِ الكِتَابَ المُخْتَلِفَ فِي اللَّوْنِ 📕', same: { emoji: '📕', name: 'كتاب أحمر' }, diff: { emoji: '📗', name: 'كتاب أخضر' } },
  { prompt: 'اخْتَرِ الحَيَوَانَ المُخْتَلِفَ بَيْنَ الأُسُودِ 🦁', same: { emoji: '🦁', name: 'أسد ملك' }, diff: { emoji: '🐯', name: 'نمر مخطط' } },
  { prompt: 'اخْتَرِ المَشْرُوبَ المُخْتَلِفَ بَيْنَ الحَلِيبِ 🥛', same: { emoji: '🥛', name: 'كوب حليب' }, diff: { emoji: '🧃', name: 'عصير علبة' } },
  { prompt: 'اخْتَرِ الحَلْوَى المُخْتَلِفَةَ بَيْنَ الآيْس كَرِيم 🍦', same: { emoji: '🍦', name: 'آيس كريم قمع' }, diff: { emoji: '🍧', name: 'آيس كريم وعاء' } },
  { prompt: 'اخْتَرِ الكَعْكَةَ المُخْتَلِفَةَ فِي الشكل 🍰', same: { emoji: '🍰', name: 'شريحة كعك' }, diff: { emoji: '🎂', name: 'كعكة كاملة' } },
  { prompt: 'اخْتَرِ المَرْكَبَةَ المُخْتَلِفَةَ بَيْنَ الدَّرَّاجَاتِ 🚲', same: { emoji: '🚲', name: 'دراجة هوائية' }, diff: { emoji: '🛵', name: 'دراجة نارية' } },
  { prompt: 'اخْتَرِ المَرْكَبَةَ المُخْتَلِفَةَ بَيْنَ الطَّائِرَاتِ ✈️', same: { emoji: '✈️', name: 'طائرة ركاب' }, diff: { emoji: '🚀', name: 'صاروخ' } },
  { prompt: 'اخْتَرِ السَّفِينَةَ المُخْتَلِفَةَ فِي المَاءِ 🚢', same: { emoji: '🚢', name: 'سفينة بضائع' }, diff: { emoji: '⛵', name: 'قارب شراعي' } },
  { prompt: 'اخْتَرِ الشَّيْءَ المُخْتَلِفَ بَيْنَ المَفَاتِيحِ 🔑', same: { emoji: '🔑', name: 'مفتاح ذهبي' }, diff: { emoji: '🔒', name: 'قفل مقفل' } },

  { prompt: 'اخْتَرِ الشَّكْلَ المُخْتَلِفَ بَيْنَ الأَقْمَارِ 🌙', same: { emoji: '🌙', name: 'قمر هلال' }, diff: { emoji: '☀️', name: 'شمس ساطعة' } },
  { prompt: 'اخْتَرِ النَّجْمَةَ المُخْتَلِفَةَ فِي الشكل ⭐', same: { emoji: '⭐', name: 'نجمة صفراء' }, diff: { emoji: '🌟', name: 'نجمة متألقة' } },
  { prompt: 'اخْتَرِ الفَاكِهَةَ المُخْتَلِفَةَ بَيْنَ العِنَبِ 🍇', same: { emoji: '🍇', name: 'عنقود عنب' }, diff: { emoji: '🍓', name: 'فراولة' } },
  { prompt: 'اخْتَرِ الخَضْرَاوَاتِ المُخْتَلِفَةَ بَيْنَ البروكلي 🥦', same: { emoji: '🥦', name: 'بروكلي أخضر' }, diff: { emoji: '🥕', name: 'جزرة' } },
  { prompt: 'اخْتَرِ الطَّعَامَ المُخْتَلِفَ بَيْنَ الذَّرَةِ 🌽', same: { emoji: '🌽', name: 'عرنوس ذرة' }, diff: { emoji: '🍞', name: 'خبز' } },
  { prompt: 'اخْتَرِ الحقيبة المُخْتَلِفَةَ بَيْنَ الحقائب 🎒', same: { emoji: '🎒', name: 'حقيبة ظهر' }, diff: { emoji: '👛', name: 'محفظة يد' } },
  { prompt: 'اخْتَرِ القُبَّعَةَ المُخْتَلِفَةَ فِي الشكل 🧢', same: { emoji: '🧢', name: 'قبعة رياضية' }, diff: { emoji: '🎩', name: 'قبعة رسمية' } },
  { prompt: 'اخْتَرِ المَلاَبِسَ المُخْتَلِفَةَ بَيْنَ البَنَاطِيلِ 👖', same: { emoji: '👖', name: 'بنطال طويل' }, diff: { emoji: '🩳', name: 'شورت قصير' } },
  { prompt: 'اخْتَرِ الأَدَاةَ المُخْتَلِفَةَ بَيْنَ الفرش 🪥', same: { emoji: '🪥', name: 'فرشاة أسنان' }, diff: { emoji: '🧴', name: 'زجاجة الشامبو' } },
  { prompt: 'اخْتَرِ الجِهَازَ المُخْتَلِفَ بَيْنَ الهَوَاتِفِ 📱', same: { emoji: '📱', name: 'هاتف ذكي' }, diff: { emoji: '💻', name: 'كمبيوتر محمول' } },

  { prompt: 'اخْتَرِ الأَدَاةَ المُخْتَلِفَةَ بَيْنَ السماعات 🎧', same: { emoji: '🎧', name: 'سماعة أذن' }, diff: { emoji: '📻', name: 'راديو قديم' } },
  { prompt: 'اخْتَرِ الكَامِيرَا المُخْتَلِفَةَ فِي الشكل 📷', same: { emoji: '📷', name: 'كاميرا صور' }, diff: { emoji: '📹', name: 'كاميرا فيديو' } },
  { prompt: 'اخْتَرِ السَّاعَةَ المُخْتَلِفَةَ فِي الشكل ⏰', same: { emoji: '⏰', name: 'ساعة منبه' }, diff: { emoji: '⌚', name: 'ساعة يد' } },
  { prompt: 'اخْتَرِ الهَدِيَّةَ المُخْتَلِفَةَ بَيْنَ الهَدَايَا 🎁', same: { emoji: '🎁', name: 'هدية مغلفة' }, diff: { emoji: '🎉', name: 'شريط احتفال' } },
  { prompt: 'اخْتَرِ الجَائِزَةَ المُخْتَلِفَةَ بَيْنَ الكُؤُوسِ 🏆', same: { emoji: '🏆', name: 'كأس ذهبي' }, diff: { emoji: '🥇', name: 'ميدالية ذهبية' } },
  { prompt: 'اخْتَرِ الأَدَاةَ المُخْتَلِفَةَ بَيْنَ الألوان 🎨', same: { emoji: '🎨', name: 'لوحة ألوان' }, diff: { emoji: '🖌️', name: 'فرشاة رسم' } },
  { prompt: 'اخْتَرِ اللُّعْبَةَ المُخْتَلِفَةَ بَيْنَ الألغاز 🧩', same: { emoji: '🧩', name: 'قطعة لغز' }, diff: { emoji: '🎲', name: 'حجر نرد' } },
  { prompt: 'اخْتَرِ الدَّبَّ المُخْتَلِفَ بَيْنَ الدِّبَبَةِ 🧸', same: { emoji: '🧸', name: 'دبدوب قماش' }, diff: { emoji: '🪆', name: 'دمية خشبية' } },
  { prompt: 'اخْتَرِ الحَلْوَى المُخْتَلِفَةَ بَيْنَ الدُّونَات 🍩', same: { emoji: '🍩', name: 'دونات مغطاة' }, diff: { emoji: '🍪', name: 'بسكويت كوكيز' } },
  { prompt: 'اخْتَرِ الشَّطِيرَةَ المُخْتَلِفَةَ بَيْنَ البرجر 🍔', same: { emoji: '🍔', name: 'برجر لحم' }, diff: { emoji: '🌭', name: 'هوت دوغ' } },

  { prompt: 'اخْتَرِ الطَّعَامَ المُخْتَلِفَ بَيْنَ البطاطس 🍟', same: { emoji: '🍟', name: 'بطاطس مقلية' }, diff: { emoji: '🍿', name: 'علبة فيشار' } },
  { prompt: 'اخْتَرِ الفَاكِهَةَ المُخْتَلِفَةَ بَيْنَ البِطِّيخِ 🍉', same: { emoji: '🍉', name: 'شريحة بطيخ' }, diff: { emoji: '🍍', name: 'أناناس' } },
  { prompt: 'اخْتَرِ الفَاكِهَةَ المُخْتَلِفَةَ بَيْنَ الخَوْخِ 🍑', same: { emoji: '🍑', name: 'خوخة ناعمة' }, diff: { emoji: '🍒', name: 'كرز أحمر' } },
  { prompt: 'اخْتَرِ الخَضْرَاوَاتِ المُخْتَلِفَةَ بَيْنَ الأفوكادو 🥑', same: { emoji: '🥑', name: 'أفوكادو طازج' }, diff: { emoji: '🥦', name: 'بروكلي' } },
  { prompt: 'اخْتَرِ الحَيَوَانَ المُخْتَلِفَ بَيْنَ الفِيَلَةِ 🐘', same: { emoji: '🐘', name: 'فيل ضخم' }, diff: { emoji: '🦏', name: 'وحيد القرن' } },
  { prompt: 'اخْتَرِ الحَيَوَانَ المُخْتَلِفَ بَيْنَ الزَّرَافَاتِ 🦒', same: { emoji: '🦒', name: 'زرافة طويلة' }, diff: { emoji: '🐪', name: 'جمل الصحراء' } },
  { prompt: 'اخْتَرِ الكَائِنَ المُخْتَلِفَ بَيْنَ الدَّلاَفِينِ 🐬', same: { emoji: '🐬', name: 'دلفين لطيف' }, diff: { emoji: '🐳', name: 'حوت ضخم' } },
  { prompt: 'اخْتَرِ الحَيَوَانَ المُخْتَلِفَ بَيْنَ الضَّفَادِعِ 🐸', same: { emoji: '🐸', name: 'ضفدع أخضر' }, diff: { emoji: '🦎', name: 'سحلية' } },
  { prompt: 'اخْتَرِ الحَشَرَةَ المُخْتَلِفَةَ بَيْنَ النَّحْلِ 🐝', same: { emoji: '🐝', name: 'نحلة نشيطة' }, diff: { emoji: '🦋', name: 'فراشة' } },
  { prompt: 'اخْتَرِ الطَّائِرَ المُخْتَلِفَ بَيْنَ البُومِ 🦉', same: { emoji: '🦉', name: 'بومة حكيمة' }, diff: { emoji: '🦅', name: 'نسر جارح' } },
];

function buildUniqueVisualDiffBank(): VisualDifferenceQuestion[] {
  const seenSignatures = new Set<string>();
  const bank: VisualDifferenceQuestion[] = [];

  RAW_50_VISUAL_DIFFS.forEach((item, idx) => {
    const rawItems = [
      { emoji: item.same.emoji, name: item.same.name, isDifferent: false },
      { emoji: item.same.emoji, name: item.same.name, isDifferent: false },
      { emoji: item.same.emoji, name: item.same.name, isDifferent: false },
      { emoji: item.diff.emoji, name: item.diff.name, isDifferent: true },
    ];

    const q = {
      id: `vd_${idx + 1}`,
      promptText: item.prompt,
      items: shuffleArray(rawItems),
    };

    const sig = getQuestionSignature(q);
    if (!seenSignatures.has(sig)) {
      seenSignatures.add(sig);
      bank.push(q);
    }
  });

  return bank;
}

export const VISUAL_DIFF_BANK = buildUniqueVisualDiffBank();

export function getVisualDifferenceQuestions(count: number = 10): VisualDifferenceQuestion[] {
  const selected = getRandomItems(VISUAL_DIFF_BANK, count);
  return selected.map((q) => ({
    ...q,
    items: shuffleArray(q.items),
  }));
}
