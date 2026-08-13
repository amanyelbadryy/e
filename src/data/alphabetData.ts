import { ArabicLetter } from '../types';

export const ALPHABET_DATA: ArabicLetter[] = [
  {
    "id": 1,
    "letter": "أ",
    "name": "أَلِف",
    "audio": "/audio/alphabet/letters/alif.mp3",
    "color": "bg-rose-500 hover:bg-rose-600 text-white",
    "basicWord": {
      "word": "أَسَد",
      "audio": "/audio/alphabet/basic_words/01_asad.mp3",
      "emoji": "🦁",
      "translation": "أسد شجاع"
    },
    "harakat": {
      "fatha": {
        "symbol": "أَ",
        "audio": "/audio/alphabet/fatha/alif_fatha.mp3",
        "word": "أَسَد",
        "wordAudio": "/audio/alphabet/words/01_asad.mp3",
        "emoji": "🦁"
      },
      "kasra": {
        "symbol": "إِ",
        "audio": "/audio/alphabet/kasra/alif_kasra.mp3",
        "word": "إِبْرِيق",
        "wordAudio": "/audio/alphabet/words/03_ibreeq.mp3",
        "emoji": "🫖"
      },
      "damma": {
        "symbol": "أُ",
        "audio": "/audio/alphabet/damma/alif_damma.mp3",
        "word": "أُذُن",
        "wordAudio": "/audio/alphabet/words/02_othon.mp3",
        "emoji": "👂"
      }
    }
  },
  {
    "id": 2,
    "letter": "ب",
    "name": "بَاء",
    "audio": "/audio/alphabet/letters/baa.mp3",
    "color": "bg-sky-500 hover:bg-sky-600 text-white",
    "basicWord": {
      "word": "بَطَّة",
      "audio": "/audio/alphabet/basic_words/02_batta.mp3",
      "emoji": "🦆",
      "translation": "بطة لطيفة"
    },
    "harakat": {
      "fatha": {
        "symbol": "بَ",
        "audio": "/audio/alphabet/fatha/baa_fatha.mp3",
        "word": "بَطَّة",
        "wordAudio": "/audio/alphabet/basic_words/02_batta.mp3",
        "emoji": "🦆"
      },
      "kasra": {
        "symbol": "بِ",
        "audio": "/audio/alphabet/kasra/baa_kasra.mp3",
        "word": "بِنْت",
        "wordAudio": "/audio/alphabet/words/06_bent.mp3",
        "emoji": "👧"
      },
      "damma": {
        "symbol": "بُ",
        "audio": "/audio/alphabet/damma/baa_damma.mp3",
        "word": "بُرْتُقَال",
        "wordAudio": "/audio/alphabet/words/05_bortoqal.mp3",
        "emoji": "🍊"
      }
    }
  },
  {
    "id": 3,
    "letter": "ت",
    "name": "تَاء",
    "audio": "/audio/alphabet/letters/taa.mp3",
    "color": "bg-amber-500 hover:bg-amber-600 text-white",
    "basicWord": {
      "word": "تُفَّاحَة",
      "audio": "/audio/alphabet/basic_words/03_toffaha.mp3",
      "emoji": "🍎",
      "translation": "تفاحة حمراء"
    },
    "harakat": {
      "fatha": {
        "symbol": "تَ",
        "audio": "/audio/alphabet/fatha/taa_fatha.mp3",
        "word": "تَمْر",
        "wordAudio": "/audio/alphabet/words/07_tamr.mp3",
        "emoji": "🌴"
      },
      "kasra": {
        "symbol": "تِ",
        "audio": "/audio/alphabet/kasra/taa_kasra.mp3",
        "word": "تِمْسَاح",
        "wordAudio": "/audio/alphabet/words/09_timsah.mp3",
        "emoji": "🐊"
      },
      "damma": {
        "symbol": "تُ",
        "audio": "/audio/alphabet/damma/taa_damma.mp3",
        "word": "تُفَّاح",
        "wordAudio": "/audio/alphabet/words/08_toffah.mp3",
        "emoji": "🍎"
      }
    }
  },
  {
    "id": 4,
    "letter": "ث",
    "name": "ثَاء",
    "audio": "/audio/alphabet/letters/thaa.mp3",
    "color": "bg-emerald-500 hover:bg-emerald-600 text-white",
    "basicWord": {
      "word": "ثَعْلَب",
      "audio": "/audio/alphabet/basic_words/04_thaalab.mp3",
      "emoji": "🦊",
      "translation": "ثعلب مَكَّار"
    },
    "harakat": {
      "fatha": {
        "symbol": "ثَ",
        "audio": "/audio/alphabet/fatha/thaa_fatha.mp3",
        "word": "ثَوْب",
        "wordAudio": "/audio/alphabet/words/10_thawb.mp3",
        "emoji": "👔"
      },
      "kasra": {
        "symbol": "ثِ",
        "audio": "/audio/alphabet/kasra/thaa_kasra.mp3",
        "word": "ثِمَار",
        "wordAudio": "/audio/alphabet/words/12_thimar.mp3",
        "emoji": "🍎"
      },
      "damma": {
        "symbol": "ثُ",
        "audio": "/audio/alphabet/damma/thaa_damma.mp3",
        "word": "ثُعْبَان",
        "wordAudio": "/audio/alphabet/words/11_thoban.mp3",
        "emoji": "🐍"
      }
    }
  },
  {
    "id": 5,
    "letter": "ج",
    "name": "جِيم",
    "audio": "/audio/alphabet/letters/jeem.mp3",
    "color": "bg-purple-500 hover:bg-purple-600 text-white",
    "basicWord": {
      "word": "جَمَل",
      "audio": "/audio/alphabet/basic_words/05_jamal.mp3",
      "emoji": "🐪",
      "translation": "جمل صبور"
    },
    "harakat": {
      "fatha": {
        "symbol": "جَ",
        "audio": "/audio/alphabet/fatha/jeem_fatha.mp3",
        "word": "جَمَل",
        "wordAudio": "/audio/alphabet/words/13_jamal.mp3",
        "emoji": "🐪"
      },
      "kasra": {
        "symbol": "جِ",
        "audio": "/audio/alphabet/kasra/jeem_kasra.mp3",
        "word": "جِدَار",
        "wordAudio": "/audio/alphabet/words/15_jidar.mp3",
        "emoji": "🧱"
      },
      "damma": {
        "symbol": "جُ",
        "audio": "/audio/alphabet/damma/jeem_damma.mp3",
        "word": "جُبْن",
        "wordAudio": "/audio/alphabet/words/14_jubn.mp3",
        "emoji": "🧀"
      }
    }
  },
  {
    "id": 6,
    "letter": "ح",
    "name": "حَاء",
    "audio": "/audio/alphabet/letters/haa.mp3",
    "color": "bg-teal-500 hover:bg-teal-600 text-white",
    "basicWord": {
      "word": "حِصَان",
      "audio": "/audio/alphabet/basic_words/06_hisan.mp3",
      "emoji": "🐴",
      "translation": "حصان سريع"
    },
    "harakat": {
      "fatha": {
        "symbol": "حَ",
        "audio": "/audio/alphabet/fatha/haa_fatha.mp3",
        "word": "حَمَامَة",
        "wordAudio": "/audio/alphabet/words/16_hamama.mp3",
        "emoji": "🕊️"
      },
      "kasra": {
        "symbol": "حِ",
        "audio": "/audio/alphabet/kasra/haa_kasra.mp3",
        "word": "حِصَان",
        "wordAudio": "/audio/alphabet/words/18_hisan.mp3",
        "emoji": "🐴"
      },
      "damma": {
        "symbol": "حُ",
        "audio": "/audio/alphabet/damma/haa_damma.mp3",
        "word": "حُوت",
        "wordAudio": "/audio/alphabet/words/17_hoot.mp3",
        "emoji": "🐳"
      }
    }
  },
  {
    "id": 7,
    "letter": "خ",
    "name": "خَاء",
    "audio": "/audio/alphabet/letters/khaa.mp3",
    "color": "bg-orange-500 hover:bg-orange-600 text-white",
    "basicWord": {
      "word": "خَرُوف",
      "audio": "/audio/alphabet/basic_words/07_kharouf.mp3",
      "emoji": "🐑",
      "translation": "خروف جميل"
    },
    "harakat": {
      "fatha": {
        "symbol": "خَ",
        "audio": "/audio/alphabet/fatha/khaa_fatha.mp3",
        "word": "خَرُوف",
        "wordAudio": "/audio/alphabet/words/19_kharouf.mp3",
        "emoji": "🐑"
      },
      "kasra": {
        "symbol": "خِ",
        "audio": "/audio/alphabet/kasra/khaa_kasra.mp3",
        "word": "خِيَار",
        "wordAudio": "/audio/alphabet/words/21_khiyar.mp3",
        "emoji": "🥒"
      },
      "damma": {
        "symbol": "خُ",
        "audio": "/audio/alphabet/damma/khaa_damma.mp3",
        "word": "خُبْز",
        "wordAudio": "/audio/alphabet/words/20_khubz.mp3",
        "emoji": "🍞"
      }
    }
  },
  {
    "id": 8,
    "letter": "د",
    "name": "دَال",
    "audio": "/audio/alphabet/letters/daal.mp3",
    "color": "bg-indigo-500 hover:bg-indigo-600 text-white",
    "basicWord": {
      "word": "دُبّ",
      "audio": "/audio/alphabet/basic_words/08_dubb.mp3",
      "emoji": "🐻",
      "translation": "دب لطيف"
    },
    "harakat": {
      "fatha": {
        "symbol": "دَ",
        "audio": "/audio/alphabet/fatha/daal_fatha.mp3",
        "word": "دَرَّاجَة",
        "wordAudio": "/audio/alphabet/words/22_darraja.mp3",
        "emoji": "🚲"
      },
      "kasra": {
        "symbol": "دِ",
        "audio": "/audio/alphabet/kasra/daal_kasra.mp3",
        "word": "دِيك",
        "wordAudio": "/audio/alphabet/words/24_deek.mp3",
        "emoji": "🐓"
      },
      "damma": {
        "symbol": "دُ",
        "audio": "/audio/alphabet/damma/daal_damma.mp3",
        "word": "دُبّ",
        "wordAudio": "/audio/alphabet/words/23_dubb.mp3",
        "emoji": "🐻"
      }
    }
  },
  {
    "id": 9,
    "letter": "ذ",
    "name": "ذَال",
    "audio": "/audio/alphabet/letters/dhaal.mp3",
    "color": "bg-pink-500 hover:bg-pink-600 text-white",
    "basicWord": {
      "word": "ذُرَة",
      "audio": "/audio/alphabet/basic_words/09_dhurra.mp3",
      "emoji": "🌽",
      "translation": "ذرة لديدة"
    },
    "harakat": {
      "fatha": {
        "symbol": "ذَ",
        "audio": "/audio/alphabet/fatha/dhaal_fatha.mp3",
        "word": "ذَهَب",
        "wordAudio": "/audio/alphabet/words/25_dhahab.mp3",
        "emoji": "🪙"
      },
      "kasra": {
        "symbol": "ذِ",
        "audio": "/audio/alphabet/kasra/dhaal_kasra.mp3",
        "word": "ذِئْب",
        "wordAudio": "/audio/alphabet/words/27_dhib.mp3",
        "emoji": "🐺"
      },
      "damma": {
        "symbol": "ذُ",
        "audio": "/audio/alphabet/damma/dhaal_damma.mp3",
        "word": "ذُرَة",
        "wordAudio": "/audio/alphabet/words/26_dhurra.mp3",
        "emoji": "🌽"
      }
    }
  },
  {
    "id": 10,
    "letter": "ر",
    "name": "رَاء",
    "audio": "/audio/alphabet/letters/raa.mp3",
    "color": "bg-lime-500 hover:bg-lime-600 text-white",
    "basicWord": {
      "word": "رُمَّان",
      "audio": "/audio/alphabet/basic_words/10_rumman.mp3",
      "emoji": "🫐",
      "translation": "رمان حلو"
    },
    "harakat": {
      "fatha": {
        "symbol": "رَ",
        "audio": "/audio/alphabet/fatha/raa_fatha.mp3",
        "word": "رَجُل",
        "wordAudio": "/audio/alphabet/words/28_rajul.mp3",
        "emoji": "👨"
      },
      "kasra": {
        "symbol": "رِ",
        "audio": "/audio/alphabet/kasra/raa_kasra.mp3",
        "word": "رِيشَة",
        "wordAudio": "/audio/alphabet/words/30_risha.mp3",
        "emoji": "🪶"
      },
      "damma": {
        "symbol": "رُ",
        "audio": "/audio/alphabet/damma/raa_damma.mp3",
        "word": "رُمَّان",
        "wordAudio": "/audio/alphabet/words/29_rumman.mp3",
        "emoji": "🪸"
      }
    }
  },
  {
    "id": 11,
    "letter": "ز",
    "name": "زَاي",
    "audio": "/audio/alphabet/letters/zaay.mp3",
    "color": "bg-yellow-500 hover:bg-yellow-600 text-white",
    "basicWord": {
      "word": "زَرَافَة",
      "audio": "/audio/alphabet/basic_words/11_zarafa.mp3",
      "emoji": "🦒",
      "translation": "زرافة طويلة"
    },
    "harakat": {
      "fatha": {
        "symbol": "زَ",
        "audio": "/audio/alphabet/fatha/zaay_fatha.mp3",
        "word": "زَرَافَة",
        "wordAudio": "/audio/alphabet/words/31_zarafa.mp3",
        "emoji": "🦒"
      },
      "kasra": {
        "symbol": "زِ",
        "audio": "/audio/alphabet/kasra/zaay_kasra.mp3",
        "word": "زِير",
        "wordAudio": "/audio/alphabet/words/33_zeer.mp3",
        "emoji": "🏺"
      },
      "damma": {
        "symbol": "زُ",
        "audio": "/audio/alphabet/damma/zaay_damma.mp3",
        "word": "زُهُور",
        "wordAudio": "/audio/alphabet/words/32_zuhour.mp3",
        "emoji": "💐"
      }
    }
  },
  {
    "id": 12,
    "letter": "س",
    "name": "سِين",
    "audio": "/audio/alphabet/letters/seen.mp3",
    "color": "bg-cyan-500 hover:bg-cyan-600 text-white",
    "basicWord": {
      "word": "سَمَكَة",
      "audio": "/audio/alphabet/basic_words/12_samaka.mp3",
      "emoji": "🐟",
      "translation": "سمكة ملونة"
    },
    "harakat": {
      "fatha": {
        "symbol": "سَ",
        "audio": "/audio/alphabet/fatha/seen_fatha.mp3",
        "word": "سَمَكَة",
        "wordAudio": "/audio/alphabet/words/34_samaka.mp3",
        "emoji": "🐟"
      },
      "kasra": {
        "symbol": "سِ",
        "audio": "/audio/alphabet/kasra/seen_kasra.mp3",
        "word": "سِجَّادَة",
        "wordAudio": "/replacement_audio/01_sijada.mp3",
        "emoji": "🕌"
      },
      "damma": {
        "symbol": "سُ",
        "audio": "/audio/alphabet/damma/seen_damma.mp3",
        "word": "سُلَحْفَاة",
        "wordAudio": "/audio/alphabet/words/35_sulhufat.mp3",
        "emoji": "🐢"
      }
    }
  },
  {
    "id": 13,
    "letter": "ش",
    "name": "شِين",
    "audio": "/audio/alphabet/letters/sheen.mp3",
    "color": "bg-amber-600 hover:bg-amber-700 text-white",
    "basicWord": {
      "word": "شَمْس",
      "audio": "/audio/alphabet/basic_words/13_shams.mp3",
      "emoji": "☀️",
      "translation": "شمس مشرقة"
    },
    "harakat": {
      "fatha": {
        "symbol": "شَ",
        "audio": "/audio/alphabet/fatha/sheen_fatha.mp3",
        "word": "شَمْس",
        "wordAudio": "/audio/alphabet/words/37_shams.mp3",
        "emoji": "☀️"
      },
      "kasra": {
        "symbol": "شِ",
        "audio": "/audio/alphabet/kasra/sheen_kasra.mp3",
        "word": "شِتَاء",
        "wordAudio": "/audio/alphabet/words/39_shitaa.mp3",
        "emoji": "🌧️"
      },
      "damma": {
        "symbol": "شُ",
        "audio": "/audio/alphabet/damma/sheen_damma.mp3",
        "word": "شُرْطِيّ",
        "wordAudio": "/audio/alphabet/words/38_shurti.mp3",
        "emoji": "👮"
      }
    }
  },
  {
    "id": 14,
    "letter": "ص",
    "name": "صَاد",
    "audio": "/audio/alphabet/letters/saad.mp3",
    "color": "bg-orange-600 hover:bg-orange-700 text-white",
    "basicWord": {
      "word": "صَقْر",
      "audio": "/audio/alphabet/basic_words/14_saqr.mp3",
      "emoji": "🦅",
      "translation": "صقر قوي"
    },
    "harakat": {
      "fatha": {
        "symbol": "صَ",
        "audio": "/audio/alphabet/fatha/saad_fatha.mp3",
        "word": "صَقْر",
        "wordAudio": "/audio/alphabet/words/40_saqr.mp3",
        "emoji": "🦅"
      },
      "kasra": {
        "symbol": "صِ",
        "audio": "/audio/alphabet/kasra/saad_kasra.mp3",
        "word": "صِينِيَّة",
        "wordAudio": "/audio/alphabet/words/42_siniyya.mp3",
        "emoji": "🍽️"
      },
      "damma": {
        "symbol": "صُ",
        "audio": "/audio/alphabet/damma/saad_damma.mp3",
        "word": "صُنْدُوق",
        "wordAudio": "/audio/alphabet/words/41_sundooq.mp3",
        "emoji": "📦"
      }
    }
  },
  {
    "id": 15,
    "letter": "ض",
    "name": "ضَاد",
    "audio": "/audio/alphabet/letters/daad.mp3",
    "color": "bg-emerald-600 hover:bg-emerald-700 text-white",
    "basicWord": {
      "word": "ضَفْدَع",
      "audio": "/audio/alphabet/basic_words/15_difda.mp3",
      "emoji": "🐸",
      "translation": "ضفدع أخضر"
    },
    "harakat": {
      "fatha": {
        "symbol": "ضَ",
        "audio": "/audio/alphabet/fatha/daad_fatha.mp3",
        "word": "ضَوْء",
        "wordAudio": "/audio/alphabet/words/43_daw.mp3",
        "emoji": "💡"
      },
      "kasra": {
        "symbol": "ضِ",
        "audio": "/audio/alphabet/kasra/daad_kasra.mp3",
        "word": "ضِفْدَع",
        "wordAudio": "/audio/alphabet/words/45_difda.mp3",
        "emoji": "🐸"
      },
      "damma": {
        "symbol": "ضُ",
        "audio": "/audio/alphabet/damma/daad_damma.mp3",
        "word": "ضُبَّاط",
        "wordAudio": "/audio/alphabet/words/44_dubbat.mp3",
        "emoji": "👮"
      }
    }
  },
  {
    "id": 16,
    "letter": "ط",
    "name": "طَاء",
    "audio": "/audio/alphabet/letters/taa_emphatic.mp3",
    "color": "bg-blue-600 hover:bg-blue-700 text-white",
    "basicWord": {
      "word": "طَائِرَة",
      "audio": "/replacement_audio/03_taaera.mp3",
      "emoji": "✈️",
      "translation": "طائرة سريعة"
    },
    "harakat": {
      "fatha": {
        "symbol": "طَ",
        "audio": "/audio/alphabet/fatha/taa_emphatic_fatha.mp3",
        "word": "طَائِرَة",
        "wordAudio": "/replacement_audio/03_taaera.mp3",
        "emoji": "✈️"
      },
      "kasra": {
        "symbol": "طِ",
        "audio": "/audio/alphabet/kasra/taa_emphatic_kasra.mp3",
        "word": "طِفْل",
        "wordAudio": "/audio/alphabet/words/48_tifl.mp3",
        "emoji": "👶"
      },
      "damma": {
        "symbol": "طُ",
        "audio": "/audio/alphabet/damma/taa_emphatic_damma.mp3",
        "word": "طُيُور",
        "wordAudio": "/replacement_audio/05_tuyour.mp3",
        "emoji": "🐦"
      }
    }
  },
  {
    "id": 17,
    "letter": "ظ",
    "name": "ظَاء",
    "audio": "/audio/alphabet/letters/thaa_emphatic.mp3",
    "color": "bg-indigo-600 hover:bg-indigo-700 text-white",
    "basicWord": {
      "word": "ظَبْي",
      "audio": "/audio/alphabet/basic_words/17_zaby.mp3",
      "emoji": "🦌",
      "translation": "ظبي جميل"
    },
    "harakat": {
      "fatha": {
        "symbol": "ظَ",
        "audio": "/audio/alphabet/fatha/thaa_emphatic_fatha.mp3",
        "word": "ظَبْي",
        "wordAudio": "/audio/alphabet/words/49_zabyi.mp3",
        "emoji": "🦌"
      },
      "kasra": {
        "symbol": "ظِ",
        "audio": "/audio/alphabet/kasra/thaa_emphatic_kasra.mp3",
        "word": "ظِلّ",
        "wordAudio": "/audio/alphabet/words/51_zill.mp3",
        "emoji": "👤"
      },
      "damma": {
        "symbol": "ظُ",
        "audio": "/audio/alphabet/damma/thaa_emphatic_damma.mp3",
        "word": "ظُرُوف",
        "wordAudio": "/audio/alphabet/words/50_zurouf.mp3",
        "emoji": "✉️"
      }
    }
  },
  {
    "id": 18,
    "letter": "ع",
    "name": "عَيْن",
    "audio": "/audio/alphabet/letters/ayn.mp3",
    "color": "bg-purple-600 hover:bg-purple-700 text-white",
    "basicWord": {
      "word": "عِنَب",
      "audio": "/audio/alphabet/basic_words/18_inab.mp3",
      "emoji": "🍇",
      "translation": "عنب لديد"
    },
    "harakat": {
      "fatha": {
        "symbol": "عَ",
        "audio": "/audio/alphabet/fatha/ayn_fatha.mp3",
        "word": "عَلَم",
        "wordAudio": "/audio/alphabet/words/52_alam.mp3",
        "emoji": "🚩"
      },
      "kasra": {
        "symbol": "عِ",
        "audio": "/audio/alphabet/kasra/ayn_kasra.mp3",
        "word": "عِنَب",
        "wordAudio": "/audio/alphabet/words/54_inab.mp3",
        "emoji": "🍇"
      },
      "damma": {
        "symbol": "عُ",
        "audio": "/audio/alphabet/damma/ayn_damma.mp3",
        "word": "عُصْفُور",
        "wordAudio": "/audio/alphabet/words/53_usfour.mp3",
        "emoji": "🐦"
      }
    }
  },
  {
    "id": 19,
    "letter": "غ",
    "name": "غَيْن",
    "audio": "/audio/alphabet/letters/ghayn.mp3",
    "color": "bg-fuchsia-600 hover:bg-fuchsia-700 text-white",
    "basicWord": {
      "word": "غَزَال",
      "audio": "/audio/alphabet/basic_words/19_ghazal.mp3",
      "emoji": "🦌",
      "translation": "غزال سريع"
    },
    "harakat": {
      "fatha": {
        "symbol": "غَ",
        "audio": "/audio/alphabet/fatha/ghayn_fatha.mp3",
        "word": "غَزَال",
        "wordAudio": "/audio/alphabet/words/55_ghazal.mp3",
        "emoji": "🦌"
      },
      "kasra": {
        "symbol": "غِ",
        "audio": "/audio/alphabet/kasra/ghayn_kasra.mp3",
        "word": "غِلَاف",
        "wordAudio": "/audio/alphabet/words/57_ghilaf.mp3",
        "emoji": "📔"
      },
      "damma": {
        "symbol": "غُ",
        "audio": "/audio/alphabet/damma/ghayn_damma.mp3",
        "word": "غُرَاب",
        "wordAudio": "/audio/alphabet/words/56_ghurab.mp3",
        "emoji": "🦅"
      }
    }
  },
  {
    "id": 20,
    "letter": "ف",
    "name": "فَاء",
    "audio": "/audio/alphabet/letters/faa.mp3",
    "color": "bg-teal-600 hover:bg-teal-700 text-white",
    "basicWord": {
      "word": "فِيل",
      "audio": "/audio/alphabet/basic_words/20_feel.mp3",
      "emoji": "🐘",
      "translation": "فيل ضخم"
    },
    "harakat": {
      "fatha": {
        "symbol": "فَ",
        "audio": "/audio/alphabet/fatha/faa_fatha.mp3",
        "word": "فَرَاشَة",
        "wordAudio": "/audio/alphabet/words/58_farasha.mp3",
        "emoji": "🦋"
      },
      "kasra": {
        "symbol": "فِ",
        "audio": "/audio/alphabet/kasra/faa_kasra.mp3",
        "word": "فِيل",
        "wordAudio": "/audio/alphabet/words/60_feel.mp3",
        "emoji": "🐘"
      },
      "damma": {
        "symbol": "فُ",
        "audio": "/audio/alphabet/damma/faa_damma.mp3",
        "word": "فُلّ",
        "wordAudio": "/audio/alphabet/words/59_full.mp3",
        "emoji": "🌸"
      }
    }
  },
  {
    "id": 21,
    "letter": "ق",
    "name": "قَاف",
    "audio": "/audio/alphabet/letters/qaaf.mp3",
    "color": "bg-rose-600 hover:bg-rose-700 text-white",
    "basicWord": {
      "word": "قِطَّة",
      "audio": "/audio/alphabet/basic_words/21_qitta.mp3",
      "emoji": "🐱",
      "translation": "قطة لطيفة"
    },
    "harakat": {
      "fatha": {
        "symbol": "قَ",
        "audio": "/audio/alphabet/fatha/qaaf_fatha.mp3",
        "word": "قَلَم",
        "wordAudio": "/audio/alphabet/words/61_qalam.mp3",
        "emoji": "✏️"
      },
      "kasra": {
        "symbol": "قِ",
        "audio": "/audio/alphabet/kasra/qaaf_kasra.mp3",
        "word": "قِطَّة",
        "wordAudio": "/audio/alphabet/words/63_qitta.mp3",
        "emoji": "🐱"
      },
      "damma": {
        "symbol": "قُ",
        "audio": "/audio/alphabet/damma/qaaf_damma.mp3",
        "word": "قُبَّعَة",
        "wordAudio": "/audio/alphabet/words/62_qubbaa.mp3",
        "emoji": "🧢"
      }
    }
  },
  {
    "id": 22,
    "letter": "ك",
    "name": "كَاف",
    "audio": "/audio/alphabet/letters/kaaf.mp3",
    "color": "bg-violet-600 hover:bg-violet-700 text-white",
    "basicWord": {
      "word": "كَلْب",
      "audio": "/audio/alphabet/basic_words/22_kalb.mp3",
      "emoji": "🐶",
      "translation": "كلب وفيّ"
    },
    "harakat": {
      "fatha": {
        "symbol": "كَ",
        "audio": "/audio/alphabet/fatha/kaaf_fatha.mp3",
        "word": "كَلْب",
        "wordAudio": "/audio/alphabet/words/64_kalb.mp3",
        "emoji": "🐕"
      },
      "kasra": {
        "symbol": "كِ",
        "audio": "/audio/alphabet/kasra/kaaf_kasra.mp3",
        "word": "كِتَاب",
        "wordAudio": "/audio/alphabet/words/66_kitab.mp3",
        "emoji": "📚"
      },
      "damma": {
        "symbol": "كُ",
        "audio": "/audio/alphabet/damma/kaaf_damma.mp3",
        "word": "كُرَة",
        "wordAudio": "/audio/alphabet/words/65_kora.mp3",
        "emoji": "⚽"
      }
    }
  },
  {
    "id": 23,
    "letter": "ل",
    "name": "لاَم",
    "audio": "/audio/alphabet/letters/laam.mp3",
    "color": "bg-emerald-500 hover:bg-emerald-600 text-white",
    "basicWord": {
      "word": "لَيْمُون",
      "audio": "/audio/alphabet/basic_words/23_laymoun.mp3",
      "emoji": "🍋",
      "translation": "ليمون حامض"
    },
    "harakat": {
      "fatha": {
        "symbol": "لَ",
        "audio": "/audio/alphabet/fatha/laam_fatha.mp3",
        "word": "لَيْمُون",
        "wordAudio": "/audio/alphabet/words/67_laymoun.mp3",
        "emoji": "🍋"
      },
      "kasra": {
        "symbol": "لِ",
        "audio": "/audio/alphabet/kasra/laam_kasra.mp3",
        "word": "لِسَان",
        "wordAudio": "/audio/alphabet/words/69_lisan.mp3",
        "emoji": "👅"
      },
      "damma": {
        "symbol": "لُ",
        "audio": "/audio/alphabet/damma/laam_damma.mp3",
        "word": "لُعْبَة",
        "wordAudio": "/replacement_audio/04_louba.mp3",
        "emoji": "🧸"
      }
    }
  },
  {
    "id": 24,
    "letter": "م",
    "name": "مِيم",
    "audio": "/audio/alphabet/letters/meem.mp3",
    "color": "bg-sky-600 hover:bg-sky-700 text-white",
    "basicWord": {
      "word": "مَوْز",
      "audio": "/audio/alphabet/basic_words/24_mawz.mp3",
      "emoji": "🍌",
      "translation": "موز لديد"
    },
    "harakat": {
      "fatha": {
        "symbol": "مَ",
        "audio": "/audio/alphabet/fatha/meem_fatha.mp3",
        "word": "مَوْز",
        "wordAudio": "/audio/alphabet/words/70_mawz.mp3",
        "emoji": "🍌"
      },
      "kasra": {
        "symbol": "مِ",
        "audio": "/audio/alphabet/kasra/meem_kasra.mp3",
        "word": "مِقَصّ",
        "wordAudio": "/audio/alphabet/words/72_miqass.mp3",
        "emoji": "✂️"
      },
      "damma": {
        "symbol": "مُ",
        "audio": "/audio/alphabet/damma/meem_damma.mp3",
        "word": "مُعَلِّم",
        "wordAudio": "/audio/alphabet/words/71_mu3allim.mp3",
        "emoji": "👨‍🏫"
      }
    }
  },
  {
    "id": 25,
    "letter": "ن",
    "name": "نُون",
    "audio": "/audio/alphabet/letters/noon.mp3",
    "color": "bg-amber-500 hover:bg-amber-600 text-white",
    "basicWord": {
      "word": "نَجْمَة",
      "audio": "/audio/alphabet/basic_words/25_najma.mp3",
      "emoji": "⭐",
      "translation": "نجمة ساطعة"
    },
    "harakat": {
      "fatha": {
        "symbol": "نَ",
        "audio": "/audio/alphabet/fatha/noon_fatha.mp3",
        "word": "نَجْمَة",
        "wordAudio": "/audio/alphabet/words/73_najma.mp3",
        "emoji": "⭐"
      },
      "kasra": {
        "symbol": "نِ",
        "audio": "/audio/alphabet/kasra/noon_kasra.mp3",
        "word": "نِمْر",
        "wordAudio": "/audio/alphabet/words/75_nimr.mp3",
        "emoji": "🐅"
      },
      "damma": {
        "symbol": "نُ",
        "audio": "/audio/alphabet/damma/noon_damma.mp3",
        "word": "نُسُور",
        "wordAudio": "/audio/alphabet/words/74_nusoor.mp3",
        "emoji": "🦅"
      }
    }
  },
  {
    "id": 26,
    "letter": "هـ",
    "name": "هَاء",
    "audio": "/audio/alphabet/letters/haa_letter.mp3",
    "color": "bg-pink-600 hover:bg-pink-700 text-white",
    "basicWord": {
      "word": "هَدِيَّة",
      "audio": "/audio/alphabet/basic_words/26_hadiyya.mp3",
      "emoji": "🎁",
      "translation": "هدية جميلة"
    },
    "harakat": {
      "fatha": {
        "symbol": "هَ",
        "audio": "/audio/alphabet/fatha/haa_letter_fatha.mp3",
        "word": "هَدِيَّة",
        "wordAudio": "/audio/alphabet/words/76_hadiyya.mp3",
        "emoji": "🎁"
      },
      "kasra": {
        "symbol": "هِ",
        "audio": "/audio/alphabet/kasra/haa_letter_kasra.mp3",
        "word": "هِلاَل",
        "wordAudio": "/audio/alphabet/words/78_hilal.mp3",
        "emoji": "🌙"
      },
      "damma": {
        "symbol": "هُ",
        "audio": "/audio/alphabet/damma/haa_letter_damma.mp3",
        "word": "هُدْهُد",
        "wordAudio": "/audio/alphabet/words/77_hudhud.mp3",
        "emoji": "🐦"
      }
    }
  },
  {
    "id": 27,
    "letter": "و",
    "name": "وَاو",
    "audio": "/audio/alphabet/letters/waaw.mp3",
    "color": "bg-cyan-600 hover:bg-cyan-700 text-white",
    "basicWord": {
      "word": "وَرْدَة",
      "audio": "/audio/alphabet/basic_words/27_warda.mp3",
      "emoji": "🌹",
      "translation": "وردة عطرة"
    },
    "harakat": {
      "fatha": {
        "symbol": "وَ",
        "audio": "/audio/alphabet/fatha/waaw_fatha.mp3",
        "word": "وَرْدَة",
        "wordAudio": "/audio/alphabet/words/79_warda.mp3",
        "emoji": "🌹"
      },
      "kasra": {
        "symbol": "وِ",
        "audio": "/audio/alphabet/kasra/waaw_kasra.mp3",
        "word": "وِسَادَة",
        "wordAudio": "/audio/alphabet/words/81_wisada.mp3",
        "emoji": "🛏️"
      },
      "damma": {
        "symbol": "وُ",
        "audio": "/audio/alphabet/damma/waaw_damma.mp3",
        "word": "وُجُوه",
        "wordAudio": "/audio/alphabet/words/80_wujooh.mp3",
        "emoji": "😀"
      }
    }
  },
  {
    "id": 28,
    "letter": "ي",
    "name": "يَاء",
    "audio": "/audio/alphabet/letters/yaa.mp3",
    "color": "bg-purple-600 hover:bg-purple-700 text-white",
    "basicWord": {
      "word": "يَد",
      "audio": "/audio/alphabet/basic_words/28_yad.mp3",
      "emoji": "✋",
      "translation": "يد نظيفة"
    },
    "harakat": {
      "fatha": {
        "symbol": "يَ",
        "audio": "/audio/alphabet/fatha/yaa_fatha.mp3",
        "word": "يَد",
        "wordAudio": "/audio/alphabet/words/82_yad.mp3",
        "emoji": "✋"
      },
      "kasra": {
        "symbol": "يِ",
        "audio": "/audio/alphabet/kasra/yaa_kasra.mp3",
        "word": "تِيِن",
        "wordAudio": "/replacement_audio/02_teen.mp3",
        "emoji": "🫒"
      },
      "damma": {
        "symbol": "يُ",
        "audio": "/audio/alphabet/damma/yaa_damma.mp3",
        "word": "يُوسُفِي",
        "wordAudio": "/audio/alphabet/words/83_yousufy.mp3",
        "emoji": "🍊"
      }
    }
  }
];
