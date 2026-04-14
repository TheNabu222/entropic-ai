export interface Script {
  value: string;
  label: string;
  description?: string;
  direction?: 'ltr' | 'rtl';
}

export const SUPPORTED_SCRIPTS: Script[] = [
  { value: 'English', label: 'English (Latin)', description: 'The modern English alphabet, a Latin-script alphabet consisting of 26 letters. It is the most widely used alphabet in the world.' },
  { value: 'Russian', label: 'Russian (Cyrillic)', description: 'The script of the Russian language, derived from the Cyrillic script. It was developed in the 9th-10th century for Slavic-speaking peoples.' },
  { value: 'Greek', label: 'Greek', description: 'The script used to write the Greek language since the late 9th or early 8th century BC. It is the ancestor of the Latin and Cyrillic scripts.' },
  { value: 'Arabic', label: 'Arabic', direction: 'rtl', description: 'The script used for writing Arabic and several other languages. It is written from right to left in a cursive style and is known for its beautiful calligraphy.' },
  { value: 'Hebrew', label: 'Hebrew', direction: 'rtl', description: 'An abjad script used for the Hebrew language. It was revived as a spoken language in the 19th and 20th centuries and is written from right to left.' },
  { value: 'Hindi', label: 'Hindi (Devanagari)', description: 'An abugida from the Brahmic family of scripts. It is used to write Hindi, Marathi, Nepali and several other languages of the Indian subcontinent.' },
  { value: 'Japanese', label: 'Japanese (Kana)', description: 'The Japanese writing system combines logographic kanji with syllabic kana (hiragana and katakana). This transliteration focuses on the phonetic kana representation.' },
  { value: 'Korean', label: 'Korean (Hangul)', description: 'The alphabet of the Korean language, created in the 15th century by King Sejong the Great. It is renowned for its scientific and featural design.' },
  { value: 'Chinese', label: 'Chinese (Pinyin)', description: 'Hanyu Pinyin is the official romanization system for Standard Chinese in mainland China. It is used to represent the sounds of characters, not to replace them.' },
  { value: 'Thai', label: 'Thai', description: 'The abugida used to write the Thai language and other minority languages in Thailand. It was created in 1283 by King Ramkhamhaeng the Great.' },
  { value: 'Burmese', label: 'Burmese', description: 'The script of the Burmese language, characterized by its circular letters. It is a member of the Brahmic family of scripts.' },
  { value: 'Tibetan', label: 'Tibetan', description: 'The script used to write the Tibetan languages. It is an abugida of Indic origin and is central to Tibetan Buddhism.' },
  { value: 'Sinhala', label: 'Sinhala', description: 'The writing system for the Sinhala language of Sri Lanka, known for its beautiful, rounded, and flowing characters. It is also a Brahmic script.' },
  {
    value: 'Vietnamese',
    label: 'Vietnamese (Quốc ngữ)',
    description: 'A Latin-based alphabet with a complex system of diacritics to represent tones and phonemes. It was developed by Portuguese missionaries in the 17th century.'
  },
  {
    value: 'Basque',
    label: 'Basque (Euskara)',
    description: 'The language of the Basque people, native to the Pyrenees. It is a language isolate, unrelated to any other known living language, making its echoes particularly unique.'
  },
  {
    value: 'Quechua',
    label: 'Quechua',
    description: 'A family of languages spoken by the Quechua peoples, primarily in the Andes of South America. It was the administrative language of the Inca Empire.'
  },
  {
    value: 'Igbo',
    label: 'Igbo',
    description: 'A major language of southeastern Nigeria, spoken by the Igbo people. It is a tonal language written with the Latin alphabet.'
  },
  {
    value: 'Ainu',
    label: 'Ainu',
    description: 'A language isolate spoken by the Ainu people of northern Japan and formerly Sakhalin and the Kuril Islands. It holds a unique linguistic and cultural position.'
  },
  {
    value: 'Zuni',
    label: 'Zuni',
    description: 'Another language isolate, spoken by the Zuni people of New Mexico. Its distinct phonology and grammar offer a deep well for resonance analysis.'
  },
  {
    value: 'Yolŋu Matha',
    label: 'Yolŋu Matha',
    description: 'A group of languages spoken by the Yolŋu people of Arnhem Land in northern Australia. It represents one of the many ancient linguistic traditions of the continent.'
  },
  {
    value: 'Sumerian Cuneiform',
    label: 'Sumerian Cuneiform',
    description: 'One of the earliest systems of writing, distinguished by its wedge-shaped marks on clay tablets. It was developed by the ancient Sumerians of Mesopotamia around 3500-3000 BCE.'
  },
  {
    value: 'Egyptian Hieroglyphs',
    label: 'Egyptian Hieroglyphs',
    description: 'A formal writing system used by ancient Egyptians that combined logographic, syllabic and alphabetic elements. It was used for monumental inscriptions and religious texts for over 3,000 years.'
  },
  {
    value: 'Phoenician',
    label: 'Phoenician',
    description: 'An ancient non-pictographic consonantal alphabet (abjad) that was used for the writing of Phoenician, a Northern Semitic language. It is the ancestor of most modern alphabets, including Arabic, Greek, Latin, Cyrillic, and Hebrew.',
    direction: 'rtl'
  },
  {
    value: 'Old Norse Runes',
    label: 'Old Norse (Elder Futhark)',
    description: 'The Elder Futhark is the oldest form of the runic alphabets. It was a writing system used by Germanic peoples for Northwest Germanic dialects in the Migration Period.'
  },
  {
    value: 'Linear B',
    label: 'Linear B',
    description: 'A syllabic script that was used for writing Mycenaean Greek, the earliest attested form of Greek. The script predates the Greek alphabet by several centuries and was deciphered in the mid-20th century.'
  },
  {
    value: 'Ogham',
    label: 'Ogham',
    description: 'An Early Medieval alphabet used primarily to write the early Irish language. It is sometimes called the "Celtic Tree Alphabet" and is read from bottom to top on monumental inscriptions.'
  },
  {
    value: 'Mayan Hieroglyphs',
    label: 'Mayan Hieroglyphs',
    description: 'The writing system of the Maya civilization of Mesoamerica, a complex system with logograms and syllabic glyphs. It was used from the 3rd century BCE to the 16th century CE.'
  },
  {
    value: 'Glagolitic',
    label: 'Glagolitic',
    description: 'The oldest known Slavic alphabet, created in the 9th century by Saints Cyril and Methodius in order to translate the Bible into Old Church Slavonic.'
  },
  {
    value: 'Nabataean',
    label: 'Nabataean',
    description: 'The Aramaic alphabet used by the Nabataeans around the 2nd century BCE, famous for the stone inscriptions at Petra. It is the direct precursor to the Arabic alphabet.',
    direction: 'rtl'
  },
  {
    value: 'Avestan',
    label: 'Avestan',
    description: 'The writing system developed during Iran\'s Sasanian era to write the Avestan language, the language of the Zoroastrian sacred hymns.',
    direction: 'rtl'
  },
  {
    value: 'Old Persian Cuneiform',
    label: 'Old Persian Cuneiform',
    description: 'A semi-alphabetic cuneiform script used for the Old Persian language. Inscriptions in this script were found at Persepolis and on the Behistun Inscription.'
  },
  {
    value: 'Syriac',
    label: 'Syriac',
    description: 'A script derived from the Aramaic alphabet, used to write the Syriac language. It is a foundational script for classical Christian literature throughout the Middle East.',
    direction: 'rtl'
  },
  {
    value: 'Meroitic',
    label: 'Meroitic',
    description: 'The script of the Kingdom of Kush (modern-day Sudan), derived from Egyptian writing systems but used for an unrelated language. It has both a hieroglyphic and a more common cursive form.',
    direction: 'rtl'
  },
  {
    value: 'Tifinagh',
    label: 'Tifinagh',
    description: 'The traditional script of the Berber languages of North Africa. Its ancient form (Lybico-Berber) dates back millennia, and modern versions are used today.'
  },
  {
    value: 'Gothic',
    label: 'Gothic',
    description: 'An alphabetic writing system created in the 4th century by Bishop Ulfilas for writing the Gothic language, a now-extinct East Germanic language. It is primarily based on the Greek alphabet.'
  },
  {
    value: 'Armenian',
    label: 'Armenian',
    description: 'The unique alphabet used to write the Armenian language. It was invented in 405 AD by Mesrop Mashtots and has been used continuously ever since.'
  },
  {
    value: 'Georgian',
    label: 'Georgian (Mkhedruli)',
    description: 'The modern script used to write the Georgian language and other Kartvelian languages. It is one of three writing systems for Georgian and is known for its elegant, curved letterforms.'
  },
  {
    value: 'Etruscan',
    label: 'Etruscan',
    description: 'An alphabet used by the Etruscans in ancient Italy. It was derived from a Greek alphabet and is the ancestor of the Latin alphabet.',
    direction: 'rtl'
  },
  {
    value: 'Lydian',
    label: 'Lydian',
    description: 'An alphabetic script used to write the Lydian language in ancient Anatolia (modern-day Turkey). Like Etruscan, it is related to the Greek alphabet.',
    direction: 'rtl'
  },
  {
    value: 'Lycian',
    label: 'Lycian',
    description: 'A script used to write the Lycian language in ancient Anatolia. It is also a derivative of the Greek alphabet with some unique characters.'
  },
  {
    value: 'Carian',
    label: 'Carian',
    description: 'An alphabet used by the Carians of ancient Anatolia. For a long time, it was undeciphered due to its mix of Greek-like and unique letterforms.',
    direction: 'rtl'
  },
  {
    value: 'Cherokee',
    label: 'Cherokee',
    description: 'A syllabary invented by Sequoyah in the early 19th century to write the Cherokee language. It is a unique case of an alphabet being created by an individual from a pre-literate society.'
  }
];