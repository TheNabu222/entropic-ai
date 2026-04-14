/**
 * Rigid Transliteration Service
 * TECHATER Protocol - Rule-based, deterministic script conversion
 * No AI, only phonetic mapping tables
 */

import { textToPhonemes, PhoneticToken } from './phoneticEngine';
import { getScriptMap, buildPhonemeToCharMap, CharacterMapping } from './transliterationMaps';

export interface TransliterationResult {
  output: string;
  tokens: TransliterationToken[];
  success: boolean;
  error?: string;
}

export interface TransliterationToken {
  source: string;
  phoneme: string;
  target: string;
  targetChar?: CharacterMapping;
}

/**
 * Phoneme normalization map
 * Maps various phoneme representations to simplified forms for better matching
 */
const PHONEME_NORMALIZATION: Record<string, string> = {
  // Vowels - normalize to basic forms
  'æ': 'a', 'ɛ': 'e', 'ɪ': 'i', 'ɔ': 'o', 'ʌ': 'u',
  'eɪ': 'e', 'i': 'i', 'u': 'u', 'aʊ': 'au', 'ɔɪ': 'oi',
  'ē': 'e', 'ō': 'o',

  // Consonants - normalize special forms
  'ʔ': '', // Glottal stop - often silent in transliteration
  'ʕ': '', // Pharyngeal fricative - often silent
  'dʒ': 'j', 'tʃ': 'ch', 'ʃ': 'sh', 'θ': 'th',
  'ħ': 'h', 'ṭ': 't', 'ṣ': 's', 'kh': 'k',
  'ŋ': 'ng', 'ks': 'x', 'ps': 'ps',
};

/**
 * Find best character match for a phoneme in target script
 */
function findBestMatch(phoneme: string, phonemeMap: Map<string, CharacterMapping[]>): CharacterMapping | null {
  // Try exact match first
  if (phonemeMap.has(phoneme)) {
    const matches = phonemeMap.get(phoneme)!;
    return matches[0]; // Return first match
  }

  // Try normalized phoneme
  const normalized = PHONEME_NORMALIZATION[phoneme];
  if (normalized && phonemeMap.has(normalized)) {
    const matches = phonemeMap.get(normalized)!;
    return matches[0];
  }

  // Try partial matches for complex phonemes
  if (phoneme.length > 1) {
    // Try first character
    const firstChar = phoneme[0];
    if (phonemeMap.has(firstChar)) {
      const matches = phonemeMap.get(firstChar)!;
      return matches[0];
    }
  }

  // For vowels in abjad scripts, use matres lectionis
  if (isVowel(phoneme)) {
    // Use approximations: a->aleph, e/i->yodh, o/u->waw
    if (phoneme.includes('a') && phonemeMap.has('ʔ')) {
      return phonemeMap.get('ʔ')![0]; // Aleph
    }
    if ((phoneme.includes('e') || phoneme.includes('i')) && phonemeMap.has('j')) {
      return phonemeMap.get('j')![0]; // Yodh
    }
    if ((phoneme.includes('o') || phoneme.includes('u')) && phonemeMap.has('w')) {
      return phonemeMap.get('w')![0]; // Waw
    }
  }

  return null;
}

/**
 * Check if phoneme is a vowel
 */
function isVowel(phoneme: string): boolean {
  return /[aeiouæɛɪɔʌ]/.test(phoneme);
}

/**
 * Transliterate text from source to target script
 * Pure rule-based, deterministic conversion
 */
export function transliterateText(
  text: string,
  sourceScript: string,
  targetScript: string
): TransliterationResult {
  try {
    // Get target script character map
    const targetMap = getScriptMap(targetScript);
    if (!targetMap) {
      return {
        output: '',
        tokens: [],
        success: false,
        error: `Target script "${targetScript}" not supported for rigid transliteration`,
      };
    }

    // Build phoneme lookup for target script
    const phonemeMap = buildPhonemeToCharMap(targetMap);

    // Convert source text to phonemes
    const phonemeTokens = textToPhonemes(text, sourceScript);

    // Map each phoneme to target script character
    const translitTokens: TransliterationToken[] = [];
    let output = '';

    for (const token of phonemeTokens) {
      const targetChar = findBestMatch(token.phoneme, phonemeMap);

      if (targetChar) {
        translitTokens.push({
          source: token.grapheme,
          phoneme: token.phoneme,
          target: targetChar.char,
          targetChar: targetChar,
        });
        output += targetChar.char;
      } else {
        // No match found - preserve as is or use placeholder
        translitTokens.push({
          source: token.grapheme,
          phoneme: token.phoneme,
          target: token.grapheme,
        });
        // For unknown mappings, skip (common in abjad scripts)
      }
    }

    // Add word spacing
    const words = text.split(/\s+/);
    if (words.length > 1) {
      // Reconstruct with spaces between words
      const wordsOutput: string[] = [];
      let charIndex = 0;

      for (const word of words) {
        if (!word.trim()) continue;

        const wordPhonemes = textToPhonemes(word, sourceScript);
        let wordOutput = '';

        for (const token of wordPhonemes) {
          if (charIndex < translitTokens.length) {
            const targetChar = translitTokens[charIndex].target;
            wordOutput += targetChar;
            charIndex++;
          }
        }

        if (wordOutput) {
          wordsOutput.push(wordOutput);
        }
      }

      output = wordsOutput.join(' ');
    }

    return {
      output,
      tokens: translitTokens,
      success: true,
    };
  } catch (error: any) {
    return {
      output: '',
      tokens: [],
      success: false,
      error: error.message || 'Unknown transliteration error',
    };
  }
}

/**
 * Get phonetic guide for transliterated text
 */
export function getPhoneticGuide(translitResult: TransliterationResult): string {
  if (!translitResult.success || translitResult.tokens.length === 0) {
    return 'No phonetic guide available';
  }

  const lines: string[] = [];

  for (const token of translitResult.tokens) {
    if (token.targetChar) {
      const name = token.targetChar.name || '(unknown)';
      const phoneme = token.phoneme;
      const example = getPhoneticExample(phoneme);

      lines.push(`* **${token.target}** - **${name}** (${example})`);
    }
  }

  return lines.join('\n');
}

/**
 * Get definitions/meanings for transliterated text
 */
export function getDefinitions(translitResult: TransliterationResult): string {
  if (!translitResult.success || translitResult.tokens.length === 0) {
    return 'No definitions available';
  }

  const lines: string[] = [];
  const seen = new Set<string>();

  for (const token of translitResult.tokens) {
    if (token.targetChar && !seen.has(token.target)) {
      seen.add(token.target);

      const name = token.targetChar.name || '';
      const meaning = token.targetChar.meaning || 'meaning unknown';

      if (name) {
        lines.push(`* ${token.target} (${name}) - ${meaning}`);
      } else {
        lines.push(`* ${token.target} - ${meaning}`);
      }
    }
  }

  return lines.join('\n');
}

/**
 * Get phonetic example for a phoneme
 */
function getPhoneticExample(phoneme: string): string {
  const examples: Record<string, string> = {
    'a': 'like "a" in "father"',
    'æ': 'like "a" in "cat"',
    'b': 'like "b" in "boat"',
    'ch': 'like "ch" in "church"',
    'd': 'like "d" in "door"',
    'e': 'like "e" in "bed"',
    'ɛ': 'like "e" in "bet"',
    'f': 'like "f" in "fire"',
    'g': 'like "g" in "go"',
    'h': 'like "h" in "house"',
    'i': 'like "ee" in "see"',
    'ɪ': 'like "i" in "sit"',
    'j': 'like "y" in "yes"',
    'k': 'like "k" in "kite"',
    'l': 'like "l" in "love"',
    'm': 'like "m" in "mother"',
    'n': 'like "n" in "nice"',
    'o': 'like "o" in "go"',
    'ɔ': 'like "o" in "hot"',
    'p': 'like "p" in "peace"',
    'r': 'like "r" in "red"',
    's': 'like "s" in "sun"',
    'ʃ': 'like "sh" in "ship"',
    't': 'like "t" in "top"',
    'θ': 'like "th" in "think"',
    'u': 'like "oo" in "food"',
    'ʌ': 'like "u" in "cup"',
    'v': 'like "v" in "voice"',
    'w': 'like "w" in "water"',
    'z': 'like "z" in "zero"',
  };

  return examples[phoneme] || `phoneme: /${phoneme}/`;
}
