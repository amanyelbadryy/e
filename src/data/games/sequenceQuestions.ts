import { shuffleArray, getRandomItems } from './bankUtils';
import { getQuestionSignature } from './signatureUtils';

export interface SequenceQuestion {
  id: string;
  title: string;
  stepsDisplay: string[]; // e.g. ["🥚", "🐣", "❓"]
  correctEmoji: string;
  correctName: string;
  options: { emoji: string; name: string }[];
}

const RAW_50_SEQUENCES = [
  { title: 'نُمُوُّ الكَتْكُوتِ الصَّغِيرِ', steps: ['🥚 بيضة', '🐣 يفقس', '❓'], correct: { emoji: '🐥', name: 'كتكوت جميل' }, dists: [{ emoji: '🐔', name: 'دجاجة' }, { emoji: '🐱', name: 'قطة' }, { emoji: '🍎', name: 'تفاحة' }] },
  { title: 'نُمُوُّ النَّبَاتِ وَالزَّهْرَةِ', steps: ['🌱 بذرة', '🌿 نبتة', '❓'], correct: { emoji: '🌸', name: 'وردة متفتحة' }, dists: [{ emoji: '🍎', name: 'تفاحة' }, { emoji: '🚗', name: 'سيارة' }, { emoji: '⚽', name: 'كرة' }] },
  { title: 'تَحْضِيرُ الشَّطِيرَةِ اللَّذِيذَةِ', steps: ['🥖 خبز', '🥪 شطيرة', '❓'], correct: { emoji: '😋', name: 'أكل لذيذ' }, dists: [{ emoji: '👟', name: 'حذاء' }, { emoji: '🚗', name: 'سيارة' }, { emoji: '📚', name: 'كتاب' }] },
  { title: 'الاسْتِعْدَادُ لِلنَّوْمِ', steps: ['🚿 الاستحمام', '🪥 تنظيف الأسنان', '❓'], correct: { emoji: '🛏️', name: 'النوم في السرير' }, dists: [{ emoji: '⚽', name: 'لعب الكرة' }, { emoji: '🚲', name: 'ركوب الدراجة' }, { emoji: '🍎', name: 'أكل التفاحة' }] },
  { title: 'شُرُوقُ الشَّمْسِ وَبِدَايَةُ النَّهَارِ', steps: ['🌙 ليل مظلم', '🌅 شروق الشمس', '❓'], correct: { emoji: '☀️', name: 'نهار مشرق' }, dists: [{ emoji: '🌧️', name: 'مطر غزير' }, { emoji: '🛏️', name: 'نوم دافئ' }, { emoji: '⚡', name: 'برق قوي' }] },
  { title: 'صُنْعُ عَصِيرِ البُرْتُقَالِ', steps: ['🍊 ثمرة برتقال', '🍹 عصر البرتقال', '❓'], correct: { emoji: '🥤', name: 'كوب عصير طازج' }, dists: [{ emoji: '🍕', name: 'بيتزا' }, { emoji: '🚗', name: 'سيارة' }, { emoji: '👟', name: 'حذاء' }] },
  { title: 'تَحْوِيلُ المَاءِ إِلَى ثَلْجٍ', steps: ['💧 ماء سائل', '❄️ في الثلاجة', '❓'], correct: { emoji: '🧊', name: 'مكعب ثلج' }, dists: [{ emoji: '🔥', name: 'نار مشتعلة' }, { emoji: '🌸', name: 'وردة' }, { emoji: '🎈', name: 'بالون' }] },
  { title: 'نُمُوُّ الفَرَاشَةِ المُلَوَّنَةِ', steps: ['🐛 دودة صغيرة', '📜 شرنقة', '❓'], correct: { emoji: '🦋', name: 'فراشة جميلة' }, dists: [{ emoji: '🐝', name: 'نحلة' }, { emoji: '🐜', name: 'نملة' }, { emoji: '🐟', name: 'سمكة' }] },
  { title: 'صُنْعُ كَعْكَةِ العِيدِ', steps: ['🌾 طحين وبيض', '🎂 خبز في الفرن', '❓'], correct: { emoji: '🎉', name: 'احتفال بالكعكة' }, dists: [{ emoji: '🧼', name: 'صابون' }, { emoji: '🔑', name: 'مفتاح' }, { emoji: '🚲', name: 'دراجة' }] },
  { title: 'بِنَاءُ المَنْزِلِ الجَدِيدِ', steps: ['🧱 طوب وبناء', '🏠 بيت مكتمل', '❓'], correct: { emoji: '👨‍👩‍👧‍👦', name: 'عائلة سعيدة' }, dists: [{ emoji: '✈️', name: 'طائرة' }, { emoji: '🚢', name: 'سفينة' }, { emoji: '🍎', name: 'تفاحة' }] },

  { title: 'ارْتِدَاءُ الحِذَاءِ', steps: ['🧦 لبس الجوارب', '👟 لبس الحذاء', '❓'], correct: { emoji: '🏃', name: 'الركض واللعب' }, dists: [{ emoji: '🛏️', name: 'النوم' }, { emoji: '🍎', name: 'أكل تفاحة' }, { emoji: '📚', name: 'قراءة كتاب' }] },
  { title: 'غَسْلُ اليَدَيْنِ', steps: ['🧼 صابون وماء', '🚿 فرك اليدين', '❓'], correct: { emoji: '✨', name: 'يدان نظيفتان' }, dists: [{ emoji: '🚗', name: 'قيادة سيارة' }, { emoji: '⚽', name: 'كرة القدم' }, { emoji: '🍕', name: 'بيتزا' }] },
  { title: 'رَسْمُ اللَّوْحَةِ', steps: ['🎨 تجهيز الألوان', '🖌️ الرسم بالفرشاة', '❓'], correct: { emoji: '🖼️', name: 'لوحة جميلة' }, dists: [{ emoji: '👟', name: 'حذاء' }, { emoji: '🔑', name: 'مفتاح' }, { emoji: '🍎', name: 'تفاحة' }] },
  { title: 'كِتَابَةُ الرِّسَالَةِ', steps: ['✏️ كتابة بالورقة', '✉️ وضع الظرف', '❓'], correct: { emoji: '📮', name: 'إرسال بالبريد' }, dists: [{ emoji: '⚽', name: 'لعب كرة' }, { emoji: '🍦', name: 'آيس كريم' }, { emoji: '🚗', name: 'سيارة' }] },
  { title: 'نُمُوُّ التُّفَّاحَةِ', steps: ['🌸 زهرة الشجرة', '🍏 تفاحة خضراء', '❓'], correct: { emoji: '🍎', name: 'تفاحة حمراء ناضجة' }, dists: [{ emoji: '🍌', name: 'موزة' }, { emoji: '🍉', name: 'بطيخ' }, { emoji: '🚗', name: 'سيارة' }] },
  { title: 'يَوْمٌ مُمْطِرٌ', steps: ['☁️ غيوم سوداء', '🌧️ تساقط المطر', '❓'], correct: { emoji: '🌈', name: 'ظهور قوس قزح' }, dists: [{ emoji: '🔥', name: 'نار' }, { emoji: '🚗', name: 'سيارة' }, { emoji: '🍕', name: 'بيتزا' }] },
  { title: 'صُنْعُ البِيتْزَا', steps: ['🍕 تجهيز العجين', '🧀 وضع الجبن', '❓'], correct: { emoji: '🍕', name: 'بيتزا ساخنة' }, dists: [{ emoji: '👟', name: 'حذاء' }, { emoji: '🔑', name: 'مفتاح' }, { emoji: '🚲', name: 'دراجة' }] },
  { title: 'تَحْضِيرُ الشَّاي', steps: ['🫖 غلي الماء', '☕ صب الشاي', '❓'], correct: { emoji: '😋', name: 'شرب الشاي الدافئ' }, dists: [{ emoji: '⚽', name: 'كرة' }, { emoji: '🚗', name: 'سيارة' }, { emoji: '🚀', name: 'صاروخ' }] },
  { title: 'بِنَاءُ بُرْجِ المَكَعَّبَاتِ', steps: ['🧱 مكعب أول', '🧱 وضع مكعب ثانٍ', '❓'], correct: { emoji: '🏰', name: 'برج مرتفع' }, dists: [{ emoji: '🍎', name: 'تفاحة' }, { emoji: '🐟', name: 'سمكة' }, { emoji: '👟', name: 'حذاء' }] },
  { title: 'مُبَارَاةُ كُرَةِ القَدَمِ', steps: ['⚽ ركل الكرة', '🥅 تسجيل الهدف', '❓'], correct: { emoji: '🏆', name: 'الفوز بالكأس' }, dists: [{ emoji: '🛏️', name: 'نوم' }, { emoji: '🍕', name: 'أكل' }, { emoji: '🚗', name: 'سيارة' }] },

  { title: 'التَّسَوُّقُ فِي المَتْجَرِ', steps: ['🛒 وضع البضائع', '💳 دفع الثمن', '❓'], correct: { emoji: '🛍️', name: 'أخذ أكياس الشراء' }, dists: [{ emoji: '⚽', name: 'كرة' }, { emoji: '🚗', name: 'سيارة' }, { emoji: '✈️', name: 'طائرة' }] },
  { title: 'قِرَاءَةُ الكِتَابِ', steps: ['📚 اختيار الكتاب', '📕 فتح الصفحات', '❓'], correct: { emoji: '🧠', name: 'تعلم قصة جديدة' }, dists: [{ emoji: '👟', name: 'حذاء' }, { emoji: '🍕', name: 'بيتزا' }, { emoji: '🔑', name: 'مفتاح' }] },
  { title: 'تَنْظِيفُ المَلاَبِسِ', steps: ['👕 ملابس متسخة', '🧺 الغسيل بالمغسلة', '❓'], correct: { emoji: '✨', name: 'ملابس نظيفة ومرتبة' }, dists: [{ emoji: '🚗', name: 'سيارة' }, { emoji: '🍎', name: 'تفاحة' }, { emoji: '⚽', name: 'كرة' }] },
  { title: 'صُنْعُ رَجُلِ الثَّلْجِ', steps: ['❄️ تساقط الثلج', '☃️ بناء رجل الثلج', '❓'], correct: { emoji: '🧣', name: 'وضع الوشاح والدفء' }, dists: [{ emoji: '🔥', name: 'نار' }, { emoji: '☀️', name: 'شمس حارقة' }, { emoji: '🍌', name: 'موزة' }] },
  { title: 'حَفْلَةُ عِيدِ المِيلاَدِ', steps: ['🎈 تعليق البالونات', '🎂 إشعال الشموع', '❓'], correct: { emoji: '🎁', name: 'فتح الهدايا' }, dists: [{ emoji: '👟', name: 'حذاء' }, { emoji: '🔑', name: 'مفتاح' }, { emoji: '🚗', name: 'سيارة' }] },
  { title: 'رُكُوبُ الدَّرَّاجَةِ', steps: ['🚲 تجهيز الدراجة', '🪖 ارتداء الخوذة', '❓'], correct: { emoji: '🚴', name: 'الانطلاق والدفع' }, dists: [{ emoji: '🛏️', name: 'النوم' }, { emoji: '🍎', name: 'أكل' }, { emoji: '📚', name: 'قراءة' }] },
  { title: 'أَكْلُ المَوْزَةِ', steps: ['🍌 موزة صفراء', '🍌 تقشير الموزة', '❓'], correct: { emoji: '😋', name: 'أكل الموز اللذيذ' }, dists: [{ emoji: '🚗', name: 'سيارة' }, { emoji: '⚽', name: 'كرة' }, { emoji: '👟', name: 'حذاء' }] },
  { title: 'الذَّهَابُ لِلْمَدْرَسَةِ', steps: ['🎒 تجهيز الحقيبة', '🚌 ركوب الحافلة', '❓'], correct: { emoji: '🏫', name: 'الوصول للمدرسة' }, dists: [{ emoji: '🛏️', name: 'سرير النوم' }, { emoji: '✈️', name: 'طائرة' }, { emoji: '🍕', name: 'بيتزا' }] },
  { title: 'صُنْعُ الفِيشَارِ', steps: ['🌽 حبوب الذرة', '🍿 التسخين بالحرارة', '❓'], correct: { emoji: '🍿', name: 'وعاء فيشار طازج' }, dists: [{ emoji: '👟', name: 'حذاء' }, { emoji: '🔑', name: 'مفتاح' }, { emoji: '🚗', name: 'سيارة' }] },
  { title: 'صَيْدُ الأَسْمَاكِ', steps: ['🎣 رمي الصنارة', '🐟 سحب السمكة', '❓'], correct: { emoji: '🪣', name: 'وضعها في الدلو' }, dists: [{ emoji: '🚀', name: 'صاروخ' }, { emoji: '⚽', name: 'كرة' }, { emoji: '🍎', name: 'تفاحة' }] },

  { title: 'تَطْيِيرُ الطَّائِرَةِ الوَرَقِيَّةِ', steps: ['🪁 طائرة ورقية', '💨 هبوب الرياح', '❓'], correct: { emoji: '🪁', name: 'تحليق مرتفع' }, dists: [{ emoji: '🚗', name: 'سيارة' }, { emoji: '🛏️', name: 'سرير' }, { emoji: '🍕', name: 'بيتزا' }] },
  { title: 'تَنَاوُلُ الآيْس كَرِيم', steps: ['🍦 آيس كريم', '🍨 وضع الكريمة', '❓'], correct: { emoji: '😋', name: 'التلذذ بالطعم' }, dists: [{ emoji: '🔥', name: 'نار' }, { emoji: '👟', name: 'حذاء' }, { emoji: '📚', name: 'كتاب' }] },
  { title: 'زِرَاعَةُ شَجَرَةٍ', steps: ['🪴 حفر التربة', '🌳 غرس الشتلة', '❓'], correct: { emoji: '🌳', name: 'شجرة كبيرة ومثمرة' }, dists: [{ emoji: '🚀', name: 'صاروخ' }, { emoji: '⚽', name: 'كرة' }, { emoji: '🍕', name: 'بيتزا' }] },
  { title: 'تَرْتِيبُ الغُرْفَةِ', steps: ['🧸 ألعاب مبعثرة', '📦 جمع الألعاب', '❓'], correct: { emoji: '🧹', name: 'غرفة نظيفة' }, dists: [{ emoji: '🚗', name: 'سيارة' }, { emoji: '🍎', name: 'تفاحة' }, { emoji: '✈️', name: 'طائرة' }] },
  { title: 'الاسْتِيقَاظُ صَبَاحاً', steps: ['⏰ رنين المنبه', '🌅 فتح العينين', '❓'], correct: { emoji: '🛏️', name: 'ترتيب السرير' }, dists: [{ emoji: '🌙', name: 'النوم ليلاً' }, { emoji: '🍕', name: 'بيتزا' }, { emoji: '⚽', name: 'كرة' }] },
  { title: 'سِقَايَةُ الحَدِيقَةِ', steps: ['🪴 تربة جافة', '🪣 رَشُّ الماء', '❓'], correct: { emoji: '🌺', name: 'تفتح الأزهار' }, dists: [{ emoji: '👟', name: 'حذاء' }, { emoji: '🚗', name: 'سيارة' }, { emoji: '🔑', name: 'مفتاح' }] },
  { title: 'إِطْلاَقُ الصَّارُوخِ', steps: ['🚀 تجهيز الصاروخ', '💨 العد التنازلي', '❓'], correct: { emoji: '🪐', name: 'الوصول للفضاء' }, dists: [{ emoji: '🐟', name: 'سمكة' }, { emoji: '🍎', name: 'تفاحة' }, { emoji: '⚽', name: 'كرة' }] },
  { title: 'الإِبْحَارُ بِالقَارِبِ', steps: ['⛵ قارب صغير', '💨 فتح الشراع', '❓'], correct: { emoji: '🌊', name: 'إبحار في البحر' }, dists: [{ emoji: '🚗', name: 'سيارة' }, { emoji: '🛏️', name: 'سرير' }, { emoji: '🍕', name: 'بيتزا' }] },
  { title: 'صُنْعُ العَسَلِ', steps: ['🌸 زهرة الحديقة', '🐝 امتصاص النحل', '❓'], correct: { emoji: '🍯', name: 'عسل لذيذ' }, dists: [{ emoji: '👟', name: 'حذاء' }, { emoji: '🔑', name: 'مفتاح' }, { emoji: '⚽', name: 'كرة' }] },
  { title: 'صُنْعُ الدُّونَات', steps: ['🍩 تجهيز العجين', '🍳 القلي بالزيت', '❓'], correct: { emoji: '🍩', name: 'دونات بالسكر' }, dists: [{ emoji: '🚗', name: 'سيارة' }, { emoji: '🎒', name: 'حقيبة' }, { emoji: '✈️', name: 'طائرة' }] },

  { title: 'عُشُّ العَصْفُورِ', steps: ['🪺 جمع القش', '🪺 بناء العش', '❓'], correct: { emoji: '🥚', name: 'وضع البيض' }, dists: [{ emoji: '🍕', name: 'بيتزا' }, { emoji: '🚗', name: 'سيارة' }, { emoji: '👟', name: 'حذاء' }] },
  { title: 'السِّبَاحَةُ فِي المَسْبَحِ', steps: ['🩳 لباس السباحة', '🏊 القفز بالماء', '❓'], correct: { emoji: '🌊', name: 'الاستمتاع بالسباحة' }, dists: [{ emoji: '🛏️', name: 'نوم' }, { emoji: '📚', name: 'كتاب' }, { emoji: '🔑', name: 'مفتاح' }] },
  { title: 'عَزْفُ المُوسِيقَى', steps: ['🎼 قراءة النوتة', '🎻 امساك الآلة', '❓'], correct: { emoji: '🎶', name: 'عزف لحن جميل' }, dists: [{ emoji: '🍎', name: 'تفاحة' }, { emoji: '🚗', name: 'سيارة' }, { emoji: '⚽', name: 'كرة' }] },
  { title: 'التَّصْوِيرُ الفُوتُوغْرَافِي', steps: ['📷 توجيه الكاميرا', '📸 الضغط على الزر', '❓'], correct: { emoji: '🖼️', name: 'صورة تذكارية' }, dists: [{ emoji: '👟', name: 'حذاء' }, { emoji: '🍕', name: 'بيتزا' }, { emoji: '🔑', name: 'مفتاح' }] },
  { title: 'التَّخْيِيمُ فِي الطَّبِيعَةِ', steps: ['⛺ نصب الخيمة', '🪵 إشعال النار', '❓'], correct: { emoji: '🌌', name: 'مشاهدة النجوم' }, dists: [{ emoji: '🚗', name: 'سيارة' }, { emoji: '⚽', name: 'كرة' }, { emoji: '🎒', name: 'حقيبة' }] },
  { title: 'غَسْلُ السَّيَّارَةِ', steps: ['🚗 سيارة مغبرة', '🧽 غسل بالصابون', '❓'], correct: { emoji: '✨', name: 'سيارة نظيفة وتلمع' }, dists: [{ emoji: '🍎', name: 'تفاحة' }, { emoji: '🛏️', name: 'سرير' }, { emoji: '🍕', name: 'بيتزا' }] },
  { title: 'قَصُّ الشَّعْرِ', steps: ['💇 شعر طويل', '✂️ استخدام المقص', '❓'], correct: { emoji: '💇‍♂️', name: 'شعر مرتب وجديد' }, dists: [{ emoji: '⚽', name: 'كرة' }, { emoji: '🚗', name: 'سيارة' }, { emoji: '🔑', name: 'مفتاح' }] },
  { title: 'نَفْخُ البَالُونِ', steps: ['🎈 بالون صغير', '💨 نفخ الهواء', '❓'], correct: { emoji: '🎈', name: 'بالون كبير طائر' }, dists: [{ emoji: '👟', name: 'حذاء' }, { emoji: '🍎', name: 'تفاحة' }, { emoji: '📚', name: 'كتاب' }] },
  { title: 'صُنْعُ الفَخَّارِ', steps: ['🏺 طين سائل', '🏺 تشكيل باليد', '❓'], correct: { emoji: '🏺', name: 'إناء إبريق جميل' }, dists: [{ emoji: '🚗', name: 'سيارة' }, { emoji: '⚽', name: 'كرة' }, { emoji: '🍕', name: 'بيتزا' }] },
  { title: 'إِطْعَامُ القِطَّةِ', steps: ['🐱 قطة جائعة', '🐟 وضع السمكة', '❓'], correct: { emoji: '😸', name: 'قطة شبعة وسعيدة' }, dists: [{ emoji: '🚀', name: 'صاروخ' }, { emoji: '👟', name: 'حذاء' }, { emoji: '🔑', name: 'مفتاح' }] },
];

function buildUniqueSequenceBank(): SequenceQuestion[] {
  const seenSignatures = new Set<string>();
  const bank: SequenceQuestion[] = [];

  RAW_50_SEQUENCES.forEach((seq, idx) => {
    const item = {
      id: `seq_${idx + 1}`,
      title: seq.title,
      stepsDisplay: seq.steps,
      correctEmoji: seq.correct.emoji,
      correctName: seq.correct.name,
      options: shuffleArray([seq.correct, ...seq.dists]),
    };

    const sig = getQuestionSignature(item);
    if (!seenSignatures.has(sig)) {
      seenSignatures.add(sig);
      bank.push(item);
    }
  });

  return bank;
}

export const SEQUENCE_BANK = buildUniqueSequenceBank();

export function getSequenceQuestions(count: number = 10): SequenceQuestion[] {
  const selected = getRandomItems(SEQUENCE_BANK, count);
  return selected.map((q) => ({
    ...q,
    options: shuffleArray(q.options),
  }));
}
