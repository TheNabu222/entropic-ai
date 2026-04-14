/**
 * Transliteration Maps - Character-by-character phonetic mappings
 * TECHATER Protocol - Rigid, rule-based script conversion
 */

export interface CharacterMapping {
  char: string;
  phoneme: string;
  name?: string;
  meaning?: string;
}

/**
 * Phoenician alphabet mappings
 */
export const PHOENICIAN_MAP: CharacterMapping[] = [
  { char: '𐤀', phoneme: 'ʔ', name: 'Aleph', meaning: 'ox' },
  { char: '𐤁', phoneme: 'b', name: 'Bet', meaning: 'house' },
  { char: '𐤂', phoneme: 'g', name: 'Gimel', meaning: 'camel' },
  { char: '𐤃', phoneme: 'd', name: 'Dalet', meaning: 'door' },
  { char: '𐤄', phoneme: 'h', name: 'He', meaning: 'window' },
  { char: '𐤅', phoneme: 'w', name: 'Waw', meaning: 'hook' },
  { char: '𐤆', phoneme: 'z', name: 'Zayin', meaning: 'weapon' },
  { char: '𐤇', phoneme: 'ħ', name: 'Heth', meaning: 'fence' },
  { char: '𐤈', phoneme: 'ṭ', name: 'Teth', meaning: 'wheel' },
  { char: '𐤉', phoneme: 'j', name: 'Yodh', meaning: 'hand' },
  { char: '𐤊', phoneme: 'k', name: 'Kaph', meaning: 'palm' },
  { char: '𐤋', phoneme: 'l', name: 'Lamed', meaning: 'goad' },
  { char: '𐤌', phoneme: 'm', name: 'Mem', meaning: 'water' },
  { char: '𐤍', phoneme: 'n', name: 'Nun', meaning: 'fish' },
  { char: '𐤎', phoneme: 's', name: 'Semkath', meaning: 'support' },
  { char: '𐤏', phoneme: 'ʕ', name: 'Ayin', meaning: 'eye' },
  { char: '𐤐', phoneme: 'p', name: 'Pe', meaning: 'mouth' },
  { char: '𐤑', phoneme: 'ṣ', name: 'Tsade', meaning: 'hook' },
  { char: '𐤒', phoneme: 'q', name: 'Qoph', meaning: 'needle' },
  { char: '𐤓', phoneme: 'r', name: 'Resh', meaning: 'head' },
  { char: '𐤔', phoneme: 'ʃ', name: 'Shin', meaning: 'tooth' },
  { char: '𐤕', phoneme: 't', name: 'Taw', meaning: 'mark' },
];

/**
 * Nabataean alphabet mappings (precursor to Arabic)
 */
export const NABATAEAN_MAP: CharacterMapping[] = [
  { char: '𐢀', phoneme: 'ʔ', name: 'Alaph', meaning: 'ox' },
  { char: '𐢁', phoneme: 'w', name: 'Waw', meaning: 'hook' },
  { char: '𐢂', phoneme: 'g', name: 'Gamal', meaning: 'camel' },
  { char: '𐢃', phoneme: 'd', name: 'Dalath', meaning: 'door' },
  { char: '𐢄', phoneme: 'h', name: 'He', meaning: 'window' },
  { char: '𐢅', phoneme: 'z', name: 'Zayn', meaning: 'weapon' },
  { char: '𐢆', phoneme: 'ħ', name: 'Heth', meaning: 'fence' },
  { char: '𐢇', phoneme: 'ṭ', name: 'Teth', meaning: 'wheel' },
  { char: '𐢈', phoneme: 'j', name: 'Yodh', meaning: 'hand' },
  { char: '𐢉', phoneme: 'k', name: 'Kaph', meaning: 'palm' },
  { char: '𐢊', phoneme: 'l', name: 'Lamadh', meaning: 'goad' },
  { char: '𐢋', phoneme: 'l', name: 'Lamedh', meaning: 'goad' },
  { char: '𐢌', phoneme: 'm', name: 'Mem', meaning: 'water' },
  { char: '𐢍', phoneme: 'n', name: 'Nun', meaning: 'fish' },
  { char: '𐢎', phoneme: 's', name: 'Semkath', meaning: 'support' },
  { char: '𐢏', phoneme: 'ʕ', name: 'Ayin', meaning: 'eye' },
  { char: '𐢐', phoneme: 'p', name: 'Pe', meaning: 'mouth' },
  { char: '𐢑', phoneme: 'ṣ', name: 'Tsade', meaning: 'hook' },
  { char: '𐢒', phoneme: 'q', name: 'Qoph', meaning: 'needle' },
  { char: '𐢓', phoneme: 'r', name: 'Resh', meaning: 'head' },
  { char: '𐢔', phoneme: 'ʃ', name: 'Shin', meaning: 'tooth' },
  { char: '𐢕', phoneme: 't', name: 'Taw', meaning: 'mark' },
];

/**
 * Elder Futhark (Old Norse Runes) mappings
 */
export const ELDER_FUTHARK_MAP: CharacterMapping[] = [
  { char: 'ᚠ', phoneme: 'f', name: 'Fehu', meaning: 'cattle, wealth' },
  { char: 'ᚢ', phoneme: 'u', name: 'Uruz', meaning: 'wild ox, strength' },
  { char: 'ᚦ', phoneme: 'θ', name: 'Thurisaz', meaning: 'giant' },
  { char: 'ᚨ', phoneme: 'a', name: 'Ansuz', meaning: 'god, divine' },
  { char: 'ᚱ', phoneme: 'r', name: 'Raidho', meaning: 'journey, wheel' },
  { char: 'ᚲ', phoneme: 'k', name: 'Kenaz', meaning: 'torch, knowledge' },
  { char: 'ᚷ', phoneme: 'g', name: 'Gebo', meaning: 'gift' },
  { char: 'ᚹ', phoneme: 'w', name: 'Wunjo', meaning: 'joy' },
  { char: 'ᚺ', phoneme: 'h', name: 'Hagalaz', meaning: 'hail' },
  { char: 'ᚻ', phoneme: 'h', name: 'Hagall', meaning: 'hail' },
  { char: 'ᚾ', phoneme: 'n', name: 'Nauthiz', meaning: 'need, necessity' },
  { char: 'ᛁ', phoneme: 'i', name: 'Isa', meaning: 'ice' },
  { char: 'ᛃ', phoneme: 'j', name: 'Jera', meaning: 'year, harvest' },
  { char: 'ᛇ', phoneme: 'ē', name: 'Eihwaz', meaning: 'yew tree' },
  { char: 'ᛈ', phoneme: 'p', name: 'Pertho', meaning: 'mystery' },
  { char: 'ᛉ', phoneme: 'z', name: 'Algiz', meaning: 'elk, protection' },
  { char: 'ᛊ', phoneme: 's', name: 'Sowilo', meaning: 'sun' },
  { char: 'ᛋ', phoneme: 's', name: 'Sigel', meaning: 'sun' },
  { char: 'ᛏ', phoneme: 't', name: 'Tiwaz', meaning: 'god Tyr' },
  { char: 'ᛒ', phoneme: 'b', name: 'Berkano', meaning: 'birch' },
  { char: 'ᛖ', phoneme: 'e', name: 'Ehwaz', meaning: 'horse' },
  { char: 'ᛗ', phoneme: 'm', name: 'Mannaz', meaning: 'man, humanity' },
  { char: 'ᛚ', phoneme: 'l', name: 'Laguz', meaning: 'water, lake' },
  { char: 'ᛜ', phoneme: 'ŋ', name: 'Ingwaz', meaning: 'god Ing' },
  { char: 'ᛞ', phoneme: 'd', name: 'Dagaz', meaning: 'day' },
  { char: 'ᛟ', phoneme: 'o', name: 'Othala', meaning: 'heritage' },
];

/**
 * Ogham script mappings
 */
export const OGHAM_MAP: CharacterMapping[] = [
  { char: 'ᚁ', phoneme: 'b', name: 'Beith', meaning: 'birch' },
  { char: 'ᚂ', phoneme: 'l', name: 'Luis', meaning: 'rowan' },
  { char: 'ᚃ', phoneme: 'f', name: 'Fearn', meaning: 'alder' },
  { char: 'ᚄ', phoneme: 's', name: 'Sail', meaning: 'willow' },
  { char: 'ᚅ', phoneme: 'n', name: 'Nion', meaning: 'ash' },
  { char: 'ᚆ', phoneme: 'h', name: 'Uath', meaning: 'hawthorn' },
  { char: 'ᚇ', phoneme: 'd', name: 'Dair', meaning: 'oak' },
  { char: 'ᚈ', phoneme: 't', name: 'Tinne', meaning: 'holly' },
  { char: 'ᚉ', phoneme: 'k', name: 'Coll', meaning: 'hazel' },
  { char: 'ᚊ', phoneme: 'kw', name: 'Ceirt', meaning: 'apple' },
  { char: 'ᚋ', phoneme: 'm', name: 'Muin', meaning: 'vine' },
  { char: 'ᚌ', phoneme: 'g', name: 'Gort', meaning: 'ivy' },
  { char: 'ᚍ', phoneme: 'ŋ', name: 'nGéadal', meaning: 'reed' },
  { char: 'ᚎ', phoneme: 'z', name: 'Straif', meaning: 'blackthorn' },
  { char: 'ᚏ', phoneme: 'r', name: 'Ruis', meaning: 'elder' },
  { char: 'ᚐ', phoneme: 'a', name: 'Ailm', meaning: 'pine' },
  { char: 'ᚑ', phoneme: 'o', name: 'Onn', meaning: 'furze' },
  { char: 'ᚒ', phoneme: 'u', name: 'Úr', meaning: 'heather' },
  { char: 'ᚓ', phoneme: 'e', name: 'Eadhadh', meaning: 'aspen' },
  { char: 'ᚔ', phoneme: 'i', name: 'Iodhadh', meaning: 'yew' },
];

/**
 * Greek alphabet mappings
 */
export const GREEK_MAP: CharacterMapping[] = [
  { char: 'Α', phoneme: 'a', name: 'Alpha' },
  { char: 'α', phoneme: 'a', name: 'alpha' },
  { char: 'Β', phoneme: 'b', name: 'Beta' },
  { char: 'β', phoneme: 'b', name: 'beta' },
  { char: 'Γ', phoneme: 'g', name: 'Gamma' },
  { char: 'γ', phoneme: 'g', name: 'gamma' },
  { char: 'Δ', phoneme: 'd', name: 'Delta' },
  { char: 'δ', phoneme: 'd', name: 'delta' },
  { char: 'Ε', phoneme: 'e', name: 'Epsilon' },
  { char: 'ε', phoneme: 'e', name: 'epsilon' },
  { char: 'Ζ', phoneme: 'z', name: 'Zeta' },
  { char: 'ζ', phoneme: 'z', name: 'zeta' },
  { char: 'Η', phoneme: 'ē', name: 'Eta' },
  { char: 'η', phoneme: 'ē', name: 'eta' },
  { char: 'Θ', phoneme: 'θ', name: 'Theta' },
  { char: 'θ', phoneme: 'θ', name: 'theta' },
  { char: 'Ι', phoneme: 'i', name: 'Iota' },
  { char: 'ι', phoneme: 'i', name: 'iota' },
  { char: 'Κ', phoneme: 'k', name: 'Kappa' },
  { char: 'κ', phoneme: 'k', name: 'kappa' },
  { char: 'Λ', phoneme: 'l', name: 'Lambda' },
  { char: 'λ', phoneme: 'l', name: 'lambda' },
  { char: 'Μ', phoneme: 'm', name: 'Mu' },
  { char: 'μ', phoneme: 'm', name: 'mu' },
  { char: 'Ν', phoneme: 'n', name: 'Nu' },
  { char: 'ν', phoneme: 'n', name: 'nu' },
  { char: 'Ξ', phoneme: 'ks', name: 'Xi' },
  { char: 'ξ', phoneme: 'ks', name: 'xi' },
  { char: 'Ο', phoneme: 'o', name: 'Omicron' },
  { char: 'ο', phoneme: 'o', name: 'omicron' },
  { char: 'Π', phoneme: 'p', name: 'Pi' },
  { char: 'π', phoneme: 'p', name: 'pi' },
  { char: 'Ρ', phoneme: 'r', name: 'Rho' },
  { char: 'ρ', phoneme: 'r', name: 'rho' },
  { char: 'Σ', phoneme: 's', name: 'Sigma' },
  { char: 'σ', phoneme: 's', name: 'sigma' },
  { char: 'ς', phoneme: 's', name: 'final sigma' },
  { char: 'Τ', phoneme: 't', name: 'Tau' },
  { char: 'τ', phoneme: 't', name: 'tau' },
  { char: 'Υ', phoneme: 'y', name: 'Upsilon' },
  { char: 'υ', phoneme: 'y', name: 'upsilon' },
  { char: 'Φ', phoneme: 'f', name: 'Phi' },
  { char: 'φ', phoneme: 'f', name: 'phi' },
  { char: 'Χ', phoneme: 'kh', name: 'Chi' },
  { char: 'χ', phoneme: 'kh', name: 'chi' },
  { char: 'Ψ', phoneme: 'ps', name: 'Psi' },
  { char: 'ψ', phoneme: 'ps', name: 'psi' },
  { char: 'Ω', phoneme: 'ō', name: 'Omega' },
  { char: 'ω', phoneme: 'ō', name: 'omega' },
];

/**
 * Hebrew alphabet mappings
 */
export const HEBREW_MAP: CharacterMapping[] = [
  { char: 'א', phoneme: 'ʔ', name: 'Aleph' },
  { char: 'ב', phoneme: 'b', name: 'Bet' },
  { char: 'ג', phoneme: 'g', name: 'Gimel' },
  { char: 'ד', phoneme: 'd', name: 'Dalet' },
  { char: 'ה', phoneme: 'h', name: 'He' },
  { char: 'ו', phoneme: 'w', name: 'Vav' },
  { char: 'ז', phoneme: 'z', name: 'Zayin' },
  { char: 'ח', phoneme: 'ħ', name: 'Chet' },
  { char: 'ט', phoneme: 'ṭ', name: 'Tet' },
  { char: 'י', phoneme: 'j', name: 'Yod' },
  { char: 'כ', phoneme: 'k', name: 'Kaf' },
  { char: 'ך', phoneme: 'k', name: 'Final Kaf' },
  { char: 'ל', phoneme: 'l', name: 'Lamed' },
  { char: 'מ', phoneme: 'm', name: 'Mem' },
  { char: 'ם', phoneme: 'm', name: 'Final Mem' },
  { char: 'נ', phoneme: 'n', name: 'Nun' },
  { char: 'ן', phoneme: 'n', name: 'Final Nun' },
  { char: 'ס', phoneme: 's', name: 'Samekh' },
  { char: 'ע', phoneme: 'ʕ', name: 'Ayin' },
  { char: 'פ', phoneme: 'p', name: 'Pe' },
  { char: 'ף', phoneme: 'p', name: 'Final Pe' },
  { char: 'צ', phoneme: 'ṣ', name: 'Tsadi' },
  { char: 'ץ', phoneme: 'ṣ', name: 'Final Tsadi' },
  { char: 'ק', phoneme: 'q', name: 'Qof' },
  { char: 'ר', phoneme: 'r', name: 'Resh' },
  { char: 'ש', phoneme: 'ʃ', name: 'Shin' },
  { char: 'ת', phoneme: 't', name: 'Tav' },
];

/**
 * Map script names to their character mappings
 */
export const SCRIPT_MAPS: Record<string, CharacterMapping[]> = {
  'Phoenician': PHOENICIAN_MAP,
  'Nabataean': NABATAEAN_MAP,
  'Old Norse Runes': ELDER_FUTHARK_MAP,
  'Ogham': OGHAM_MAP,
  'Greek': GREEK_MAP,
  'Hebrew': HEBREW_MAP,
};

/**
 * Get character mapping for a script
 */
export function getScriptMap(scriptName: string): CharacterMapping[] | null {
  return SCRIPT_MAPS[scriptName] || null;
}

/**
 * Build reverse lookup: phoneme -> characters
 */
export function buildPhonemeToCharMap(scriptMap: CharacterMapping[]): Map<string, CharacterMapping[]> {
  const map = new Map<string, CharacterMapping[]>();

  for (const mapping of scriptMap) {
    const phoneme = mapping.phoneme;
    if (!map.has(phoneme)) {
      map.set(phoneme, []);
    }
    map.get(phoneme)!.push(mapping);
  }

  return map;
}
