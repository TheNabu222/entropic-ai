/**
 * Phonetic Engine - Converts text to phonetic representations
 * Used for ALS-RP (Auld Lang Syne Resonance Protocol)
 */

export interface PhoneticToken {
  grapheme: string;  // Original character(s)
  phoneme: string;   // Phonetic sound
  ipa?: string;      // IPA representation (optional)
}

/**
 * Simplified phonetic mapping for English
 * Maps graphemes to approximate phonemes
 */
const ENGLISH_PHONETIC_MAP: Record<string, string> = {
  // Vowels
  'a': 'æ', 'e': 'ɛ', 'i': 'ɪ', 'o': 'ɔ', 'u': 'ʌ',
  'ay': 'eɪ', 'ai': 'eɪ', 'ey': 'eɪ',
  'ee': 'i', 'ea': 'i', 'ie': 'i',
  'oo': 'u', 'ou': 'aʊ', 'ow': 'aʊ',
  'oi': 'ɔɪ', 'oy': 'ɔɪ',
  'au': 'ɔ', 'aw': 'ɔ',

  // Consonants
  'b': 'b', 'c': 'k', 'd': 'd', 'f': 'f', 'g': 'g',
  'h': 'h', 'j': 'dʒ', 'k': 'k', 'l': 'l', 'm': 'm',
  'n': 'n', 'p': 'p', 'q': 'k', 'r': 'r', 's': 's',
  't': 't', 'v': 'v', 'w': 'w', 'x': 'ks', 'y': 'j', 'z': 'z',

  // Digraphs
  'ch': 'tʃ', 'sh': 'ʃ', 'th': 'θ', 'ph': 'f',
  'gh': 'g', 'wh': 'w', 'ng': 'ŋ',

  // Silent letters (map to empty)
  'kn': 'n', 'gn': 'n', 'wr': 'r', 'mb': 'm',
};

/**
 * Convert English text to phonetic representation
 */
export function textToPhonemes(text: string, language: string = 'English'): PhoneticToken[] {
  const normalized = text.toLowerCase().trim();
  const tokens: PhoneticToken[] = [];

  if (language === 'English') {
    let i = 0;
    while (i < normalized.length) {
      // Skip spaces and punctuation
      if (!/[a-z]/.test(normalized[i])) {
        i++;
        continue;
      }

      // Try to match 2-character combinations first
      const twoChar = normalized.substring(i, i + 2);
      if (ENGLISH_PHONETIC_MAP[twoChar]) {
        tokens.push({
          grapheme: twoChar,
          phoneme: ENGLISH_PHONETIC_MAP[twoChar],
        });
        i += 2;
        continue;
      }

      // Match single character
      const oneChar = normalized[i];
      tokens.push({
        grapheme: oneChar,
        phoneme: ENGLISH_PHONETIC_MAP[oneChar] || oneChar,
      });
      i++;
    }
  }

  return tokens;
}

/**
 * Get simplified phonetic representation (for matching)
 * Reduces phonemes to basic sound categories
 */
export function getPhoneticSignature(text: string, language: string = 'English'): string {
  const tokens = textToPhonemes(text, language);
  return tokens.map(t => t.phoneme).join('');
}

/**
 * Metaphone-like algorithm for English
 * Simplifies words to phonetic codes for matching
 */
export function metaphone(text: string): string {
  let code = text.toLowerCase().replace(/[^a-z]/g, '');

  // Drop duplicate adjacent letters
  code = code.replace(/([a-z])\1+/g, '$1');

  // Initial letter handling
  if (code.startsWith('kn') || code.startsWith('gn') || code.startsWith('pn') || code.startsWith('wr')) {
    code = code.substring(1);
  }
  if (code.startsWith('x')) {
    code = 's' + code.substring(1);
  }
  if (code.startsWith('wh')) {
    code = 'w' + code.substring(2);
  }

  // Transform to phonetic code
  code = code.replace(/sch/g, 'X');
  code = code.replace(/ch/g, 'X');
  code = code.replace(/sh/g, 'X');
  code = code.replace(/th/g, 'T');
  code = code.replace(/ph/g, 'F');
  code = code.replace(/gh/g, 'G');

  code = code.replace(/c([iey])/g, 'S$1');
  code = code.replace(/c/g, 'K');
  code = code.replace(/g([iey])/g, 'J$1');

  code = code.replace(/[aeiouyw]/g, '');

  code = code.replace(/([a-z])\1+/g, '$1');

  return code.toUpperCase();
}

/**
 * Calculate phonetic similarity between two strings (0-1)
 * Uses Levenshtein distance on phonetic representations
 */
export function phoneticSimilarity(text1: string, text2: string): number {
  const sig1 = getPhoneticSignature(text1);
  const sig2 = getPhoneticSignature(text2);

  const distance = levenshteinDistance(sig1, sig2);
  const maxLen = Math.max(sig1.length, sig2.length);

  if (maxLen === 0) return 1;
  return 1 - (distance / maxLen);
}

/**
 * Levenshtein distance - minimum edit distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,    // deletion
          dp[i][j - 1] + 1,    // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Soundex algorithm - classic phonetic encoding
 */
export function soundex(text: string): string {
  const normalized = text.toUpperCase().replace(/[^A-Z]/g, '');
  if (normalized.length === 0) return '';

  const firstLetter = normalized[0];

  const codeMap: Record<string, string> = {
    'B': '1', 'F': '1', 'P': '1', 'V': '1',
    'C': '2', 'G': '2', 'J': '2', 'K': '2', 'Q': '2', 'S': '2', 'X': '2', 'Z': '2',
    'D': '3', 'T': '3',
    'L': '4',
    'M': '5', 'N': '5',
    'R': '6',
  };

  let code = firstLetter;
  let prevCode = codeMap[firstLetter] || '';

  for (let i = 1; i < normalized.length && code.length < 4; i++) {
    const char = normalized[i];
    const charCode = codeMap[char] || '';

    if (charCode && charCode !== prevCode) {
      code += charCode;
      prevCode = charCode;
    } else if (!codeMap[char]) {
      prevCode = '';
    }
  }

  return code.padEnd(4, '0');
}
