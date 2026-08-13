import { shuffleArray, getRandomItems } from './bankUtils';
import { getQuestionSignature } from './signatureUtils';

export interface LogicQuestion {
  id: string;
  situation: string;
  correctEmoji: string;
  correctName: string;
  options: { emoji: string; name: string }[];
}

const RAW_50_LOGIC = [
  { situation: 'السَّمَاءُ تُمْطِرُ فِي الخَارِجِ، مَاذَا تَسْتَخْدِمُ؟', correct: { emoji: '☂️', name: 'مظلة المطر' }, dists: [{ emoji: '🕶️', name: 'نظارة شمسية' }, { emoji: '⚽', name: 'كرة' }, { emoji: '🍦', name: 'آيس كريم' }] },
  { situation: 'تَشْعُرُ بِالجُوعِ الشَّدِيدِ، مَاذَا تَفْعَلُ؟', correct: { emoji: '🍎', name: 'أكل تفاحة لذيذة' }, dists: [{ emoji: '👟', name: 'لبس حذاء' }, { emoji: '🔑', name: 'فتح الباب' }, { emoji: '✏️', name: 'كتابة بالحبر' }] },
  { situation: 'تَشْعُرُ بِالنَّعَاسِ فِي اللَّيْلِ، أَيْنَ تَذْهَبُ؟', correct: { emoji: '🛏️', name: 'السرير للنوم' }, dists: [{ emoji: '🚗', name: 'ركوب السيارة' }, { emoji: '⚽', name: 'لعب كرة' }, { emoji: '🍕', name: 'أكل بيتزا' }] },
  { situation: 'يَدَاكَ مُتَّسِخَتَانِ بَعْدَ اللَّعِبِ، بِمَاذَا تَغْسِلُهُمَا؟', correct: { emoji: '🧼', name: 'الماء والصابون' }, dists: [{ emoji: '📕', name: 'الكتاب' }, { emoji: '🔑', name: 'المفتاح' }, { emoji: '🚲', name: 'الدراجة' }] },
  { situation: 'تُرِيدُ تَنْظِيفَ أَسْنَانِكَ بَعْدَ الأَكْلِ، مَاذَا تَسْتَخْدِمُ؟', correct: { emoji: '🪥', name: 'فرشاة الأسنان' }, dists: [{ emoji: '✂️', name: 'مقص الورق' }, { emoji: '👟', name: 'الحذاء' }, { emoji: '🚗', name: 'السيارة' }] },
  { situation: 'تُرِيدُ كِتَابَةَ اسْمِكَ عَلَى الوَرَقَةِ، مَا الأَدَاةُ المُنَاسِبَةُ؟', correct: { emoji: '✏️', name: 'قلم الرصاص' }, dists: [{ emoji: '🥄', name: 'ملعقة' }, { emoji: '🔑', name: 'مفتاح' }, { emoji: '⚽', name: 'كرة' }] },
  { situation: 'تُرِيدُ قَصَّ وَرَقَةٍ لِصُنْعِ شَكْلٍ، مَاذَا تَسْتَخْدِمُ؟', correct: { emoji: '✂️', name: 'المقص' }, dists: [{ emoji: '🪥', name: 'فرشاة' }, { emoji: '🍎', name: 'تفاحة' }, { emoji: '👟', name: 'حذاء' }] },
  { situation: 'المَكَانُ مُظْلِمٌ فِي اللَّيْلِ، كَيْفَ تُنِيرُ الغُرْفَةَ؟', correct: { emoji: '💡', name: 'المصباح المضيء' }, dists: [{ emoji: '🕶️', name: 'نظارة' }, { emoji: '☂️', name: 'مظلة' }, { emoji: '🚗', name: 'سيارة' }] },
  { situation: 'الْجَوُّ بَارِدٌ جِدّاً فِي الشِّتَاءِ، مَاذَا تَرْتَدِي؟', correct: { emoji: '🧥', name: 'معطف دافئ' }, dists: [{ emoji: '🩳', name: 'شورت صيفي' }, { emoji: '🕶️', name: 'نظارة شمس' }, { emoji: '🍦', name: 'آيس كريم' }] },
  { situation: 'تُرِيدُ قِيَاسَ طُولِ خَطٍّ مُسْتَقِيمٍ، مَاذَا تَسْتَخْدِمُ؟', correct: { emoji: '📏', name: 'المسطرة' }, dists: [{ emoji: '⚽', name: 'كرة' }, { emoji: '🪥', name: 'فرشاة' }, { emoji: '🍎', name: 'تفاحة' }] },

  { situation: 'تُوجَدُ أَوْرَاقٌ شَجَرٍ مَبْعَثَرَةٌ عَلَى الأَرْضِ، كَيْفَ تُنَظِّفُهَا؟', correct: { emoji: '🧹', name: 'المكنسة' }, dists: [{ emoji: '✏️', name: 'قلم' }, { emoji: '🔑', name: 'مفتاح' }, { emoji: '🚗', name: 'سيارة' }] },
  { situation: 'تُرِيدُ الخُرُوجَ لِلْمَشْيِ فِي الشَّارِعِ، مَاذَا تَضَعُ فِي قَدَمَيْكَ؟', correct: { emoji: '👟', name: 'الحذاء الرياضي' }, dists: [{ emoji: '🧢', name: 'قبعة الراس' }, { emoji: '🕶️', name: 'نظارة' }, { emoji: '🎒', name: 'حقيبة' }] },
  { situation: 'تَشْعُرُ بِالعَطَشِ الشَّدِيدِ بَعْدَ الرَّكْضِ، مَاذَا تَشْرَبُ؟', correct: { emoji: '💧', name: 'ماء عذب' }, dists: [{ emoji: '🍕', name: 'بيتزا' }, { emoji: '👟', name: 'حذاء' }, { emoji: '📚', name: 'كتاب' }] },
  { situation: 'السَّيَّارَةُ تَوَقَّفَتْ لأَنَّ الوَقُودَ انْتَهَى، أَيْنَ تَذْهَبُ؟', correct: { emoji: '⛽', name: 'محطة الوقود' }, dists: [{ emoji: '🛏️', name: 'السرير' }, { emoji: '🏫', name: 'المدرسة' }, { emoji: '🍎', name: 'المطبخ' }] },
  { situation: 'البَابُ مُغْلَقٌ بِالقُفْلِ، بِمَاذَا تَفْتَحُهُ؟', correct: { emoji: '🔑', name: 'المفتاح' }, dists: [{ emoji: '✏️', name: 'القلم' }, { emoji: '🍎', name: 'التفاحة' }, { emoji: '⚽', name: 'الكرة' }] },
  { situation: 'الشَّمْسُ قَوِيَّةٌ جِدّاً وَتُؤْذِي عَيْنَيْكَ، مَاذَا تَلْبَسُ؟', correct: { emoji: '🕶️', name: 'نظارة شمسية' }, dists: [{ emoji: '🧥', name: 'معطف ثقيل' }, { emoji: '☂️', name: 'مظلة مطر' }, { emoji: '👟', name: 'حذاء' }] },
  { situation: 'اليَوْمُ حَفْلَةُ عِيدِ مِيلاَدِ صَدِيقِكَ، مَاذَا تُحْضِرُ مَعَكَ؟', correct: { emoji: '🎁', name: 'هدية مغلفة' }, dists: [{ emoji: '🧹', name: 'مكنسة' }, { emoji: '🔑', name: 'مفتاح' }, { emoji: '🪥', name: 'فرشاة' }] },
  { situation: 'شَعْرُكَ مُبَعْثَرٌ بَعْدَ الاسْتِيقَاظِ، كَيْفَ تُرَتِّبُهُ؟', correct: { emoji: '🪮', name: 'المشط' }, dists: [{ emoji: '✏️', name: 'القلم' }, { emoji: '👟', name: 'الحذاء' }, { emoji: '🍎', name: 'التفاحة' }] },
  { situation: 'انْسَكَبَ المَاءُ عَلَى الطَّاوِلَةِ، كَيْفَ تُجَفِّفُهُ؟', correct: { emoji: '🧽', name: 'الإسفنجة' }, dists: [{ emoji: '🔑', name: 'المفتاح' }, { emoji: '⚽', name: 'الكرة' }, { emoji: '📚', name: 'الكتاب' }] },
  { situation: 'تُرِيدُ حَمْلَ كُتُبِكَ إِلَى المَدْرَسَةِ، أَيْنَ تَضَعُهَا؟', correct: { emoji: '🎒', name: 'الحقيبة المدرسية' }, dists: [{ emoji: '👟', name: 'الحذاء' }, { emoji: '🕶️', name: 'النظارة' }, { emoji: '🍕', name: 'البيتزا' }] },

  { situation: 'تُرِيدُ سِقَايَةَ زَهْرَةِ الحَدِيقَةِ العَطْشَى، مَاذَا تَسْتَخْدِمُ؟', correct: { emoji: '🪣', name: 'مرشة الماء' }, dists: [{ emoji: '🧹', name: 'المكنسة' }, { emoji: '✏️', name: 'القلم' }, { emoji: '👟', name: 'الحذاء' }] },
  { situation: 'تُرِيدُ التَّقَاطَ صُورَةٍ تِذْكَارِيَّةٍ جَمِيلَةٍ، مَاذَا تَسْتَخْدِمُ؟', correct: { emoji: '📷', name: 'الكاميرا' }, dists: [{ emoji: '🔑', name: 'المفتاح' }, { emoji: '🍎', name: 'التفاحة' }, { emoji: '⚽', name: 'الكرة' }] },
  { situation: 'القِطَّةُ الصَّغِيرَةُ جَائِعَةٌ، مَا الطَّعَامُ المُنَاسِبُ لَهَا؟', correct: { emoji: '🐟', name: 'سمكة لَذِيذَة' }, dists: [{ emoji: '🍌', name: 'موزة' }, { emoji: '🧀', name: 'جبنة' }, { emoji: '🌾', name: 'قمح' }] },
  { situation: 'الكَلْبُ الصَّغِيرُ يَبْحَثُ عَنْ طَعَامِهِ المُفَضَّلِ، مَاذَا تُعْطِيهِ؟', correct: { emoji: '🦴', name: 'عظمة' }, dists: [{ emoji: '🍌', name: 'موزة' }, { emoji: '🍎', name: 'تفاحة' }, { emoji: '🥕', name: 'جزرة' }] },
  { situation: 'الأَرْنَبُ الجَمِيلُ يَبْحَثُ عَنْ غَذَائِهِ، مَاذَا يُحِبُّ؟', correct: { emoji: '🥕', name: 'جزرة برتقالية' }, dists: [{ emoji: '🐟', name: 'سمكة' }, { emoji: '🦴', name: 'عظمة' }, { emoji: '🍕', name: 'بيتزا' }] },
  { situation: 'القِرْدُ المَرِحُ يَقْفِزُ عَلَى الشَّجَرَةِ وَيَجُوعُ، مَاذَا يَقْطِفُ؟', correct: { emoji: '🍌', name: 'موزة صفراء' }, dists: [{ emoji: '🦴', name: 'عظمة' }, { emoji: '🐟', name: 'سمكة' }, { emoji: '🧀', name: 'جبنة' }] },
  { situation: 'العَصْفُورُ يُرِيدُ بِنَاءَ بَيْتٍ لِبَيْضِهِ، مَاذَا يَبْنِي؟', correct: { emoji: '🪺', name: 'العش' }, dists: [{ emoji: '🏠', name: 'البيت' }, { emoji: '🚗', name: 'السيارة' }, { emoji: '🚀', name: 'الصاروخ' }] },
  { situation: 'تُرِيدُ الاسْتِمَاعَ إِلَى القِصَّةِ الصَّوْتِيَّةِ بِهُدُوءٍ، مَاذَا تَضَعُ؟', correct: { emoji: '🎧', name: 'سماعة الأذن' }, dists: [{ emoji: '🕶️', name: 'النظارة' }, { emoji: '🧢', name: 'القبعة' }, { emoji: '👟', name: 'الحذاء' }] },
  { situation: 'تُرِيدُ مَعْرِفَةَ الوَقْتِ وَالسَّاعَةِ الانَ، مَاذَا تَنْظُرُ؟', correct: { emoji: '⏰', name: 'ساعة الحائط' }, dists: [{ emoji: '📏', name: 'المسطرة' }, { emoji: '✏️', name: 'القلم' }, { emoji: '🔑', name: 'المفتاح' }] },
  { situation: 'تَشْعُرُ بِالبَرْدِ أَثْنَاءَ النَّوْمِ، مَاذَا تَضَعُ عَلَيْكَ؟', correct: { emoji: '🛋️', name: 'الغطاء والبطانية' }, dists: [{ emoji: '☂️', name: 'المظلة' }, { emoji: '🕶️', name: 'النظارة' }, { emoji: '👟', name: 'الحذاء' }] },

  { situation: 'تُرِيدُ لَعِبَ مُمْتِعٍ مَعَ أَقْرَانِكَ فِي المَلْعَبِ، مَاذَا تَأْخُذُ؟', correct: { emoji: '⚽', name: 'كرة القدم' }, dists: [{ emoji: '🪥', name: 'فرشاة' }, { emoji: '🔑', name: 'مفتاح' }, { emoji: '🧹', name: 'مكنسة' }] },
  { situation: 'المَلاَبِسُ مُتَّسِخَةٌ وَتَحْتَاجُ لِلتَّنْظِيفِ، أَيْنَ تَضَعُهَا؟', correct: { emoji: '🧺', name: 'الغسالة' }, dists: [{ emoji: '🚗', name: 'السيارة' }, { emoji: '🛏️', name: 'السرير' }, { emoji: '🏫', name: 'المدرسة' }] },
  { situation: 'تُرِيدُ شِرَاءَ الخَضْرَاوَاتِ فِي المَارْكِت، مَاذَا تَسْتَخْدِمُ؟', correct: { emoji: '🛒', name: 'عربة التسوق' }, dists: [{ emoji: '🚀', name: 'الصاروخ' }, { emoji: '🚲', name: 'الدراجة' }, { emoji: '🛏️', name: 'السرير' }] },
  { situation: 'تُرِيدُ القَفْزَ فِي المَسْبَحِ لِلرَّاحَةِ، مَاذَا تَرْتَدِي؟', correct: { emoji: '🩳', name: 'لباس السباحة' }, dists: [{ emoji: '🧥', name: 'معطف الصوف' }, { emoji: '👟', name: 'حذاء الجري' }, { emoji: '🎓', name: 'قبعة التخرج' }] },
  { situation: 'تُرِيدُ تَلْوِينَ رَسْمَةٍ جَمِيلَةٍ، مَاذَا تَسْتَخْدِمُ؟', correct: { emoji: '🎨', name: 'علبة الألوان' }, dists: [{ emoji: '🔑', name: 'المفتاح' }, { emoji: '🍎', name: 'التفاحة' }, { emoji: '⚽', name: 'الكرة' }] },
  { situation: 'تُرِيدُ إِشْعَالَ الشَّمْعَةِ فِي الظَّلاَمِ، مَاذَا تَسْتَخْدِمُ؟', correct: { emoji: '🪵', name: 'عود الثقاب' }, dists: [{ emoji: '💧', name: 'الماء' }, { emoji: '🧽', name: 'الإسفنجة' }, { emoji: '🍦', name: 'الآيس كريم' }] },
  { situation: 'الزَّهْرَةُ تَحْتَاجُ لِلضَّوْءِ لِتَنْمُوَ، مَاذَا تُسَاعِدُهَا؟', correct: { emoji: '☀️', name: 'أشعة الشمس' }, dists: [{ emoji: '🌙', name: 'القمر ليلاً' }, { emoji: '☂️', name: 'المظلة' }, { emoji: '🕶️', name: 'النظارة' }] },
  { situation: 'تُرِيدُ العُبُورَ فَوْقَ النَّهْرِ إِلَى الضَّفَّةِ الأُخْرَى، مَاذَا تَعْبُرُ؟', correct: { emoji: '🌉', name: 'الجسر' }, dists: [{ emoji: '🚗', name: 'السيارة' }, { emoji: '🛏️', name: 'السرير' }, { emoji: '🎒', name: 'الحقيبة' }] },
  { situation: 'الطِّفْلُ الرَّضِيعُ يَبْكِي مِنَ الجُوعِ، مَاذَا تُعْطِيهِ؟', correct: { emoji: '🍼', name: 'زجاجة الحليب' }, dists: [{ emoji: '🍕', name: 'بيتزا' }, { emoji: '👟', name: 'حذاء' }, { emoji: '🔑', name: 'مفتاح' }] },
  { situation: 'تُرِيدُ الصُّعُودَ لِلطَّابَقِ العَاشِرِ بِسُرْعَةٍ، مَاذَا تَرْكَبُ؟', correct: { emoji: '🛗', name: 'المصعد الكهربائي' }, dists: [{ emoji: '🚲', name: 'الدراجة' }, { emoji: '🛹', name: 'اللوح' }, { emoji: '🚗', name: 'السيارة' }] },

  { situation: 'تُرِيدُ إِرْسَالَ رِسَالَةٍ وَرَقِيَّةٍ لِجَدِّكَ، أَيْنَ تَضَعُهَا؟', correct: { emoji: '📮', name: 'صندوق البريد' }, dists: [{ emoji: '⚽', name: 'الكرة' }, { emoji: '🍕', name: 'البيتزا' }, { emoji: '👟', name: 'الحذاء' }] },
  { situation: 'تُرِيدُ بِنَاءَ بُرْجٍ مُلَوَّنٍ، مَاذَا تَسْتَخْدِمُ؟', correct: { emoji: '🧱', name: 'المكعبات' }, dists: [{ emoji: '🍎', name: 'التفاحة' }, { emoji: '🔑', name: 'المفتاح' }, { emoji: '🪥', name: 'الفرشاة' }] },
  { situation: 'تُرِيدُ تَطْيِيرَ الطَّائِرَةِ الوَرَقِيَّةِ، مَاذَا تَحْتَاجُ؟', correct: { emoji: '💨', name: 'الرياح القوية' }, dists: [{ emoji: '💧', name: 'الماء' }, { emoji: '🛏️', name: 'السرير' }, { emoji: '🍕', name: 'البيتزا' }] },
  { situation: 'الآيْس كَرِيم بَدَأَ يَنِصَهْرُ فِي الحَرِّ، أَيْنَ تَضَعُهُ؟', correct: { emoji: '🧊', name: 'المجمد (الفريزر)' }, dists: [{ emoji: '🔥', name: 'النار' }, { emoji: '☀️', name: 'الشمس' }, { emoji: '🧥', name: 'المعطف' }] },
  { situation: 'اللُّعْبَةُ الخَشَبِيَّةُ انْكَسَرَتْ، بِمَاذَا تُصْلِحُهَا؟', correct: { emoji: '🔨', name: 'أدوات التصليح' }, dists: [{ emoji: '🍎', name: 'التفاحة' }, { emoji: '👟', name: 'الحذاء' }, { emoji: '📚', name: 'الكتاب' }] },
  { situation: 'تُرِيدُ السَّفَرَ عَبْرَ البَحْرِ العَمِيقِ، مَا المَرْكَبَةُ المُنَاسِبَةُ؟', correct: { emoji: '🚢', name: 'السفينة الكبيرة' }, dists: [{ emoji: '🚗', name: 'السيارة' }, { emoji: '🚲', name: 'الدراجة' }, { emoji: '🛴', name: 'السكوتر' }] },
  { situation: 'تُرِيدُ السَّفَرَ إِلَى القَمَرِ فِي الفَضَاءِ، مَاذَا تَرْكَبُ؟', correct: { emoji: '🚀', name: 'الصاروخ الفضائي' }, dists: [{ emoji: '🚌', name: 'الحافلة' }, { emoji: '🚲', name: 'الدراجة' }, { emoji: '⛵', name: 'القارب' }] },
  { situation: 'تُرِيدُ مَسْحَ الغُبَارِ عَنِ الطَّاوِلَةِ، مَاذَا تَسْتَخْدِمُ؟', correct: { emoji: '🧽', name: 'قماش التنظيف' }, dists: [{ emoji: '✏️', name: 'القلم' }, { emoji: '⚽', name: 'الكرة' }, { emoji: '🔑', name: 'المفتاح' }] },
  { situation: 'تُرِيدُ أَنْ تَحْمِيَ رَأْسَكَ عِنْدَ رُكُوبِ الدَّرَّاجَةِ، مَاذَا تَلْبَسُ؟', correct: { emoji: '🪖', name: 'خوذة الأمان' }, dists: [{ emoji: '🕶️', name: 'النظارة' }, { emoji: '🧦', name: 'الجوارب' }, { emoji: '🎒', name: 'الحقيبة' }] },
  { situation: 'الفَأْرُ الصَّغِيرُ يَبْحَثُ عَنْ طَعَامِهِ المُفَضَّلِ، مَاذَا يُحِبُّ؟', correct: { emoji: '🧀', name: 'قطعة الجبن' }, dists: [{ emoji: '🐟', name: 'السمكة' }, { emoji: '🍌', name: 'الموزة' }, { emoji: '🦴', name: 'العظمة' }] },
];

function buildUniqueLogicBank(): LogicQuestion[] {
  const seenSignatures = new Set<string>();
  const bank: LogicQuestion[] = [];

  RAW_50_LOGIC.forEach((item, idx) => {
    const q = {
      id: `l_${idx + 1}`,
      situation: item.situation,
      correctEmoji: item.correct.emoji,
      correctName: item.correct.name,
      options: shuffleArray([item.correct, ...item.dists]),
    };

    const sig = getQuestionSignature(q);
    if (!seenSignatures.has(sig)) {
      seenSignatures.add(sig);
      bank.push(q);
    }
  });

  return bank;

}

export const LOGIC_BANK = buildUniqueLogicBank();

export function getLogicQuestions(count: number = 10): LogicQuestion[] {
  const selected = getRandomItems(LOGIC_BANK, count);
  return selected.map((q) => ({
    ...q,
    options: shuffleArray(q.options),
  }));
}
