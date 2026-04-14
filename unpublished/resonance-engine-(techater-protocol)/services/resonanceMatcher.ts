/**
 * ALS-RP Resonance Matcher
 * Auld Lang Syne Resonance Protocol - Phonetic-first analysis
 *
 * Finds phonetic echoes across languages using rigid algorithms
 */

import { getPhoneticSignature, phoneticSimilarity, metaphone, soundex } from './phoneticEngine';
import { getLexicon, LexiconEntry } from './lexicons';

export interface ResonanceMatch {
  word: string;
  phonetic: string;
  meaning: string;
  similarity: number; // 0-1 score
  matchType: 'exact' | 'metaphone' | 'soundex' | 'phonetic' | 'fuzzy';
  tags?: string[];
}

export interface ResonanceAnalysis {
  language: string;
  matches: ResonanceMatch[];
  thematicTags: string[];
}

/**
 * Minimum similarity threshold for matches
 */
const SIMILARITY_THRESHOLD = 0.5;

/**
 * Analyze text for phonetic resonances in a target language
 * ALS-RP: Phonetic-first approach
 */
export function analyzeResonance(
  text: string,
  targetLanguage: string,
  threshold: number = SIMILARITY_THRESHOLD
): ResonanceAnalysis {
  const lexicon = getLexicon(targetLanguage);

  if (lexicon.length === 0) {
    return {
      language: targetLanguage,
      matches: [],
      thematicTags: [],
    };
  }

  // Get phonetic representations of input
  const inputPhonetic = getPhoneticSignature(text);
  const inputMetaphone = metaphone(text);
  const inputSoundex = soundex(text);

  // Also analyze individual words
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 2);

  const allMatches: ResonanceMatch[] = [];

  // Check full phrase
  allMatches.push(...findMatches(text, inputPhonetic, inputMetaphone, inputSoundex, lexicon, threshold));

  // Check individual words
  for (const word of words) {
    const wordPhonetic = getPhoneticSignature(word);
    const wordMetaphone = metaphone(word);
    const wordSoundex = soundex(word);

    allMatches.push(...findMatches(word, wordPhonetic, wordMetaphone, wordSoundex, lexicon, threshold));
  }

  // Deduplicate and sort by similarity
  const uniqueMatches = deduplicateMatches(allMatches);
  const sortedMatches = uniqueMatches.sort((a, b) => b.similarity - a.similarity);

  // Extract thematic tags
  const thematicTags = extractThemes(sortedMatches);

  return {
    language: targetLanguage,
    matches: sortedMatches.slice(0, 10), // Top 10 matches
    thematicTags,
  };
}

/**
 * Find matches for a single input against lexicon
 */
function findMatches(
  input: string,
  inputPhonetic: string,
  inputMetaphone: string,
  inputSoundex: string,
  lexicon: LexiconEntry[],
  threshold: number
): ResonanceMatch[] {
  const matches: ResonanceMatch[] = [];

  for (const entry of lexicon) {
    // Try multiple matching strategies
    const wordPhonetic = getPhoneticSignature(entry.word);
    const wordMetaphone = metaphone(entry.word);
    const wordSoundex = soundex(entry.word);

    // 1. Exact phonetic match
    if (inputPhonetic === wordPhonetic || input.toLowerCase() === entry.word.toLowerCase()) {
      matches.push({
        word: entry.word,
        phonetic: entry.phonetic,
        meaning: entry.meaning,
        similarity: 1.0,
        matchType: 'exact',
        tags: entry.tags,
      });
      continue;
    }

    // 2. Metaphone match (strong phonetic similarity)
    if (inputMetaphone === wordMetaphone && inputMetaphone.length > 0) {
      matches.push({
        word: entry.word,
        phonetic: entry.phonetic,
        meaning: entry.meaning,
        similarity: 0.9,
        matchType: 'metaphone',
        tags: entry.tags,
      });
      continue;
    }

    // 3. Soundex match (similar sound pattern)
    if (inputSoundex === wordSoundex && inputSoundex.length > 0) {
      matches.push({
        word: entry.word,
        phonetic: entry.phonetic,
        meaning: entry.meaning,
        similarity: 0.8,
        matchType: 'soundex',
        tags: entry.tags,
      });
      continue;
    }

    // 4. Phonetic similarity (Levenshtein-based)
    const similarity = phoneticSimilarity(input, entry.word);
    if (similarity >= threshold) {
      matches.push({
        word: entry.word,
        phonetic: entry.phonetic,
        meaning: entry.meaning,
        similarity,
        matchType: similarity >= 0.75 ? 'phonetic' : 'fuzzy',
        tags: entry.tags,
      });
    }

    // 5. Substring/containment match (for compound words)
    if (input.length > 3 && entry.word.length > 3) {
      if (input.toLowerCase().includes(entry.word.toLowerCase()) ||
          entry.word.toLowerCase().includes(input.toLowerCase())) {
        const containmentSimilarity = Math.min(input.length, entry.word.length) /
                                      Math.max(input.length, entry.word.length);
        if (containmentSimilarity >= threshold) {
          matches.push({
            word: entry.word,
            phonetic: entry.phonetic,
            meaning: entry.meaning,
            similarity: containmentSimilarity * 0.7, // Reduce score for containment
            matchType: 'fuzzy',
            tags: entry.tags,
          });
        }
      }
    }
  }

  return matches;
}

/**
 * Deduplicate matches - keep highest similarity for each word
 */
function deduplicateMatches(matches: ResonanceMatch[]): ResonanceMatch[] {
  const map = new Map<string, ResonanceMatch>();

  for (const match of matches) {
    const key = match.word;
    const existing = map.get(key);

    if (!existing || match.similarity > existing.similarity) {
      map.set(key, match);
    }
  }

  return Array.from(map.values());
}

/**
 * Extract thematic tags from matches
 * Groups semantic categories into archetypal themes
 */
function extractThemes(matches: ResonanceMatch[]): string[] {
  const tagCounts = new Map<string, number>();

  // Count tag occurrences
  for (const match of matches) {
    if (match.tags) {
      for (const tag of match.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    }
  }

  // Sort by frequency and take top themes
  const sortedTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);

  // Map to archetypal themes
  const themes = mapToArchetypalThemes(sortedTags);

  return themes.slice(0, 5); // Top 5 themes
}

/**
 * Map specific tags to broader archetypal themes
 */
function mapToArchetypalThemes(tags: string[]): string[] {
  const themeMap: Record<string, string[]> = {
    'Memory & Legacy': ['time', 'antiquity', 'age', 'temporal', 'lineage'],
    'Community & Kinship': ['kinship', 'family', 'maternal', 'paternal', 'community', 'exchange'],
    'Divine & Sacred': ['sacred', 'divine', 'divinity', 'deity', 'cosmic', 'creation'],
    'Mortality & Body': ['mortality', 'physical', 'body', 'anatomy', 'flesh', 'death'],
    'Wisdom & Knowledge': ['knowledge', 'wisdom', 'cognition', 'learning'],
    'Nature & Elements': ['element', 'nature', 'earth', 'terrestrial', 'celestial', 'water', 'fire'],
    'Voice & Expression': ['voice', 'vocalization', 'expression', 'communication', 'language'],
    'Power & Authority': ['power', 'authority', 'sovereignty', 'leadership'],
    'Spirit & Metaphysical': ['spirit', 'metaphysical', 'supernatural', 'destiny', 'vitality'],
    'Place & Journey': ['place', 'journey', 'dwelling', 'realm', 'boundary'],
  };

  const themes = new Set<string>();

  for (const tag of tags) {
    for (const [theme, keywords] of Object.entries(themeMap)) {
      if (keywords.includes(tag)) {
        themes.add(theme);
        break;
      }
    }
  }

  return Array.from(themes);
}

/**
 * Analyze resonance across multiple languages
 */
export function analyzeMultipleResonances(
  text: string,
  languages: string[],
  threshold: number = SIMILARITY_THRESHOLD
): ResonanceAnalysis[] {
  return languages.map(lang => analyzeResonance(text, lang, threshold));
}

/**
 * Format resonance results for display
 */
export function formatResonanceResults(matches: ResonanceMatch[]): string {
  if (matches.length === 0) {
    return 'No significant resonance found in the echoes.';
  }

  return matches.map(match => {
    return `* ${match.word} - ${match.meaning}`;
  }).join('\n');
}

/**
 * Get resonance analysis summary
 */
export function getResonanceSummary(analysis: ResonanceAnalysis): string {
  const matchCount = analysis.matches.length;
  const avgSimilarity = analysis.matches.reduce((sum, m) => sum + m.similarity, 0) / matchCount;

  const exactMatches = analysis.matches.filter(m => m.matchType === 'exact').length;
  const strongMatches = analysis.matches.filter(m => m.similarity >= 0.75).length;

  return `Found ${matchCount} phonetic resonances in ${analysis.language} ` +
         `(avg similarity: ${(avgSimilarity * 100).toFixed(1)}%). ` +
         `${exactMatches} exact, ${strongMatches} strong matches.`;
}
