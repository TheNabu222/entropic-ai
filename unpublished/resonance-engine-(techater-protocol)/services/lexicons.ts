/**
 * Lexicon Databases - Word lists for phonetic resonance matching
 * ALS-RP (Auld Lang Syne Resonance Protocol) and LUM-Link data
 */

export interface LexiconEntry {
  word: string;           // Native spelling
  phonetic: string;       // Phonetic representation
  meaning: string;        // English translation
  category?: string;      // Semantic category
  tags?: string[];        // Thematic tags
}

/**
 * Basque (Euskara) - Language isolate
 */
export const BASQUE_LEXICON: LexiconEntry[] = [
  { word: 'lan', phonetic: 'lan', meaning: 'work, task', category: 'activity', tags: ['labor', 'effort'] },
  { word: 'zain', phonetic: 'sain', meaning: 'to wait, guard, bloodline', category: 'action', tags: ['time', 'protection', 'lineage'] },
  { word: 'ezagutu', phonetic: 'esagutu', meaning: 'to know', category: 'cognition', tags: ['knowledge', 'wisdom'] },
  { word: 'aur', phonetic: 'aur', meaning: 'old, ancient', category: 'time', tags: ['age', 'antiquity'] },
  { word: 'alaba', phonetic: 'alaba', meaning: 'daughter', category: 'family', tags: ['kinship', 'female'] },
  { word: 'ama', phonetic: 'ama', meaning: 'mother', category: 'family', tags: ['kinship', 'female', 'maternal'] },
  { word: 'su', phonetic: 'su', meaning: 'fire', category: 'element', tags: ['transformation', 'energy'] },
  { word: 'soin', phonetic: 'soin', meaning: 'sound', category: 'perception', tags: ['acoustic', 'resonance'] },
  { word: 'oihu', phonetic: 'oihu', meaning: 'cry, shout', category: 'vocalization', tags: ['voice', 'expression'] },
  { word: 'gain', phonetic: 'gain', meaning: 'summit, peak', category: 'place', tags: ['elevation', 'height'] },
  { word: 'nahi', phonetic: 'nahi', meaning: 'desire, want', category: 'emotion', tags: ['volition', 'wish'] },
  { word: 'naiz', phonetic: 'nais', meaning: 'I am', category: 'existence', tags: ['being', 'identity'] },
];

/**
 * Sumerian Cuneiform - Ancient Mesopotamian language
 */
export const SUMERIAN_LEXICON: LexiconEntry[] = [
  { word: 'nu', phonetic: 'nu', meaning: 'no, not', category: 'negation', tags: ['denial', 'absence'] },
  { word: 'uzu', phonetic: 'uzu', meaning: 'flesh, body', category: 'anatomy', tags: ['mortality', 'physical'] },
  { word: 'alal', phonetic: 'alal', meaning: 'pipe, tube', category: 'object', tags: ['conduit', 'channel'] },
  { word: 'an', phonetic: 'an', meaning: 'heaven, sky', category: 'cosmology', tags: ['divine', 'celestial'] },
  { word: 'ki', phoneme: 'ki', meaning: 'earth, ground', category: 'cosmology', tags: ['terrestrial', 'foundation'] },
  { word: 'dingir', phonetic: 'diŋir', meaning: 'god, deity', category: 'divinity', tags: ['sacred', 'divine'] },
  { word: 'lugal', phonetic: 'lugal', meaning: 'king, ruler', category: 'authority', tags: ['power', 'sovereignty'] },
  { word: 'nam', phonetic: 'nam', meaning: 'fate, destiny', category: 'metaphysical', tags: ['predestination', 'cosmic order'] },
  { word: 'me', phonetic: 'me', meaning: 'divine power, essence', category: 'metaphysical', tags: ['sacred', 'power'] },
  { word: 'ama', phonetic: 'ama', meaning: 'mother', category: 'family', tags: ['kinship', 'maternal'] },
  { word: 'ad', phonetic: 'ad', meaning: 'father', category: 'family', tags: ['kinship', 'paternal'] },
  { word: 'kur', phonetic: 'kur', meaning: 'mountain, underworld', category: 'place', tags: ['boundary', 'death'] },
  { word: 'nin', phonetic: 'nin', meaning: 'lady, queen', category: 'authority', tags: ['female', 'power'] },
  { word: 'sig', phonetic: 'sig', meaning: 'low, beneath', category: 'position', tags: ['inferior', 'depth'] },
  { word: 'sun', phonetic: 'sun', meaning: 'old', category: 'time', tags: ['age', 'antiquity'] },
  { word: 'al', phonetic: 'al', meaning: 'hoe, tool', category: 'object', tags: ['cultivation', 'work'] },
];

/**
 * Igbo - Niger-Congo language (Nigeria)
 */
export const IGBO_LEXICON: LexiconEntry[] = [
  { word: 'chi', phonetic: 'tʃi', meaning: 'god, spirit, life force', category: 'divinity', tags: ['sacred', 'destiny', 'personal deity'] },
  { word: 'nna', phonetic: 'nna', meaning: 'father', category: 'family', tags: ['kinship', 'paternal'] },
  { word: 'nne', phonetic: 'nne', meaning: 'mother', category: 'family', tags: ['kinship', 'maternal'] },
  { word: 'ala', phonetic: 'ala', meaning: 'earth, land, ground', category: 'cosmology', tags: ['terrestrial', 'foundation', 'deity'] },
  { word: 'mmụọ', phonetic: 'muo', meaning: 'spirit', category: 'metaphysical', tags: ['supernatural', 'sacred'] },
  { word: 'aka', phonetic: 'aka', meaning: 'hand', category: 'anatomy', tags: ['action', 'craft'] },
  { word: 'obi', phonetic: 'obi', meaning: 'heart, mind', category: 'anatomy', tags: ['emotion', 'cognition'] },
  { word: 'isi', phonetic: 'isi', meaning: 'head', category: 'anatomy', tags: ['thought', 'leadership'] },
  { word: 'uwa', phonetic: 'uwa', meaning: 'world', category: 'cosmology', tags: ['existence', 'realm'] },
  { word: 'ndu', phonetic: 'ndu', meaning: 'life', category: 'existence', tags: ['vitality', 'being'] },
];

/**
 * Ainu - Language isolate (Japan)
 */
export const AINU_LEXICON: LexiconEntry[] = [
  { word: 'pise', phonetic: 'pise', meaning: 'to be wide, spacious', category: 'quality', tags: ['space', 'openness'] },
  { word: 'kamuy', phonetic: 'kamuj', meaning: 'god, deity, spirit', category: 'divinity', tags: ['sacred', 'divine'] },
  { word: 'ainu', phonetic: 'ainu', meaning: 'human, person', category: 'humanity', tags: ['being', 'identity'] },
  { word: 'mosir', phonetic: 'mosir', meaning: 'land, world', category: 'cosmology', tags: ['earth', 'realm'] },
  { word: 'ape', phonetic: 'ape', meaning: 'fire', category: 'element', tags: ['transformation', 'energy'] },
  { word: 'wakka', phonetic: 'wakka', meaning: 'water', category: 'element', tags: ['flow', 'life'] },
  { word: 'mat', phonetic: 'mat', meaning: 'woman, wife', category: 'humanity', tags: ['female', 'kinship'] },
  { word: 'hapo', phonetic: 'hapo', meaning: 'mother', category: 'family', tags: ['kinship', 'maternal'] },
  { word: 'aca', phonetic: 'atʃa', meaning: 'father', category: 'family', tags: ['kinship', 'paternal'] },
];

/**
 * Zuni - Language isolate (New Mexico)
 */
export const ZUNI_LEXICON: LexiconEntry[] = [
  { word: 'son', phonetic: 'son', meaning: 'self, own', category: 'identity', tags: ['self', 'possession'] },
  { word: 'a:wan', phonetic: 'awan', meaning: 'person, being', category: 'humanity', tags: ['identity', 'being'] },
  { word: 'awona:wilona', phonetic: 'awonawilona', meaning: 'all-container, creator', category: 'divinity', tags: ['cosmic', 'creation'] },
  { word: 'hon', phonetic: 'hon', meaning: 'to speak', category: 'communication', tags: ['voice', 'language'] },
  { word: 'kya', phonetic: 'kja', meaning: 'house', category: 'place', tags: ['dwelling', 'home'] },
  { word: 'tsita', phonetic: 'tsita', meaning: 'grandmother', category: 'family', tags: ['kinship', 'elder', 'female'] },
  { word: 'tachchu', phonetic: 'tatʃtʃu', meaning: 'grandfather', category: 'family', tags: ['kinship', 'elder', 'male'] },
];

/**
 * Quechua - Andean language family
 */
export const QUECHUA_LEXICON: LexiconEntry[] = [
  { word: 'ayni', phonetic: 'ajni', meaning: 'reciprocity, mutual help', category: 'ethics', tags: ['community', 'exchange', 'kinship'] },
  { word: 'pacha', phonetic: 'patʃa', meaning: 'earth, time, world, cosmos', category: 'cosmology', tags: ['temporal', 'spatial', 'sacred'] },
  { word: 'mama', phonetic: 'mama', meaning: 'mother', category: 'family', tags: ['kinship', 'maternal'] },
  { word: 'tayta', phonetic: 'tajta', meaning: 'father', category: 'family', tags: ['kinship', 'paternal'] },
  { word: 'inti', phonetic: 'inti', meaning: 'sun', category: 'cosmology', tags: ['celestial', 'divine', 'light'] },
  { word: 'quilla', phonetic: 'kiʎa', meaning: 'moon', category: 'cosmology', tags: ['celestial', 'time'] },
  { word: 'sami', phonetic: 'sami', meaning: 'luck, fortune, vital energy', category: 'metaphysical', tags: ['blessing', 'vitality'] },
  { word: 'munay', phonetic: 'munaj', meaning: 'to love, to want', category: 'emotion', tags: ['desire', 'affection'] },
  { word: 'yachay', phonetic: 'jatʃaj', meaning: 'to know, knowledge', category: 'cognition', tags: ['wisdom', 'learning'] },
];

/**
 * Vietnamese - Austroasiatic language
 */
export const VIETNAMESE_LEXICON: LexiconEntry[] = [
  { word: 'lâm', phonetic: 'ləm', meaning: 'forest', category: 'nature', tags: ['wilderness', 'wood'] },
  { word: 'lung', phonetic: 'luŋ', meaning: 'back, spine', category: 'anatomy', tags: ['body', 'support'] },
  { word: 'sơn', phonetic: 'sən', meaning: 'mountain', category: 'place', tags: ['elevation', 'nature'] },
  { word: 'lan', phonetic: 'lan', meaning: 'orchid', category: 'nature', tags: ['beauty', 'flower'] },
  { word: 'lâu', phonetic: 'ləu', meaning: 'long time, tower', category: 'time', tags: ['duration', 'structure'] },
  { word: 'sâu', phonetic: 'səu', meaning: 'deep', category: 'quality', tags: ['depth', 'profundity'] },
  { word: 'sầu', phonetic: 'səu', meaning: 'sorrow, sadness', category: 'emotion', tags: ['melancholy', 'grief'] },
];

/**
 * Cherokee - Iroquoian language
 */
export const CHEROKEE_LEXICON: LexiconEntry[] = [
  { word: 'elohino', phonetic: 'elohino', meaning: 'earth, land', category: 'cosmology', tags: ['terrestrial', 'foundation'] },
  { word: 'ageyutsa', phonetic: 'aɡejutsa', meaning: 'to love', category: 'emotion', tags: ['affection', 'care'] },
  { word: 'edoda', phonetic: 'edoda', meaning: 'father', category: 'family', tags: ['kinship', 'paternal'] },
  { word: 'etsi', phonetic: 'etsi', meaning: 'mother', category: 'family', tags: ['kinship', 'maternal'] },
  { word: 'nvwoti', phonetic: 'nəwoti', meaning: 'medicine, power', category: 'metaphysical', tags: ['healing', 'sacred'] },
];

/**
 * Etruscan - Ancient italic language
 */
export const ETRUSCAN_LEXICON: LexiconEntry[] = [
  { word: 'ais', phonetic: 'ais', meaning: 'god', category: 'divinity', tags: ['sacred', 'divine'] },
  { word: 'clan', phonetic: 'klan', meaning: 'son', category: 'family', tags: ['kinship', 'male'] },
  { word: 'apa', phonetic: 'apa', meaning: 'father', category: 'family', tags: ['kinship', 'paternal'] },
  { word: 'ati', phonetic: 'ati', meaning: 'mother', category: 'family', tags: ['kinship', 'maternal'] },
  { word: 'sec', phonetic: 'sek', meaning: 'daughter', category: 'family', tags: ['kinship', 'female'] },
  { word: 'avil', phonetic: 'avil', meaning: 'year', category: 'time', tags: ['temporal', 'cycle'] },
];

/**
 * Map language names to their lexicons
 */
export const LEXICONS: Record<string, LexiconEntry[]> = {
  'Basque': BASQUE_LEXICON,
  'Sumerian Cuneiform': SUMERIAN_LEXICON,
  'Igbo': IGBO_LEXICON,
  'Ainu': AINU_LEXICON,
  'Zuni': ZUNI_LEXICON,
  'Quechua': QUECHUA_LEXICON,
  'Vietnamese': VIETNAMESE_LEXICON,
  'Cherokee': CHEROKEE_LEXICON,
  'Etruscan': ETRUSCAN_LEXICON,
};

/**
 * Get lexicon for a language
 */
export function getLexicon(language: string): LexiconEntry[] {
  return LEXICONS[language] || [];
}

/**
 * Get all available languages with lexicons
 */
export function getAvailableLanguages(): string[] {
  return Object.keys(LEXICONS);
}
