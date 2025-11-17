/**
 * Rigid Service - Main API for TECHATER Protocol
 * Rule-based, deterministic linguistic analysis
 * Replaces AI with phonetic algorithms and lookup tables
 */

import {
  transliterateText as rigidTransliterate,
  getPhoneticGuide as rigidPhoneticGuide,
  getDefinitions as rigidDefinitions,
} from './rigidTransliteration';

import {
  analyzeResonance,
  analyzeMultipleResonances,
  formatResonanceResults,
  ResonanceAnalysis,
} from './resonanceMatcher';

import { getAvailableLanguages } from './lexicons';

/**
 * Transliterate text between scripts (rigid, rule-based)
 */
export async function transliterateText(
  text: string,
  sourceScript: string,
  targetScript: string
): Promise<string> {
  const result = rigidTransliterate(text, sourceScript, targetScript);

  if (!result.success) {
    throw new Error(result.error || 'Transliteration failed');
  }

  return result.output;
}

/**
 * Get phonetic guide for transliterated text
 */
export async function getPhoneticGuide(
  text: string,
  targetScript: string
): Promise<string> {
  // First transliterate to get the token data
  const result = rigidTransliterate(text, 'English', targetScript);

  if (!result.success) {
    return 'Could not generate phonetic guide.';
  }

  return rigidPhoneticGuide(result);
}

/**
 * Get definitions for transliterated characters/words
 */
export async function getDefinitions(
  text: string,
  targetScript: string
): Promise<string> {
  // First transliterate to get the token data
  const result = rigidTransliterate(text, 'English', targetScript);

  if (!result.success) {
    return 'Could not retrieve definitions.';
  }

  return rigidDefinitions(result);
}

/**
 * Get historical/etymological context
 * This is still basic without AI, but provides script info
 */
export async function getHistoricalContext(
  text: string,
  sourceScript: string
): Promise<string> {
  // Provide basic etymological information
  const words = text.toLowerCase().split(/\s+/);

  const etymologies: string[] = [];

  // Basic etymology database (can be expanded)
  const ETYMOLOGIES: Record<string, string> = {
    'hello': 'from Old High German "halâ, holâ" (to fetch, used in hailing a ferryman), evolved into a greeting',
    'world': 'from Old English "weorold" (human existence, the world), compound of "wer" (man) + "ald" (age)',
    'peace': 'from Latin "pax" (compact, agreement, treaty), later "freedom from civil disorder"',
    'know': 'from Old English "cnāwan" (to know, perceive), from Proto-Germanic *knēaną',
    'thyself': 'from Middle English, compound of "thy" (your) + "self"',
    'auld': 'Scots form of "old", from Old English "eald"',
    'lang': 'Scots form of "long", from Old English "lang"',
    'syne': 'Scots "since", from Old English "sīþþan" (after, since)',
  };

  for (const word of words) {
    if (ETYMOLOGIES[word]) {
      etymologies.push(`**${word}**: ${ETYMOLOGIES[word]}`);
    }
  }

  if (etymologies.length === 0) {
    return `The phrase "${text}" represents sounds that have echoed through human language for millennia. ` +
           `Each phoneme carries traces of ancient tongues, transformed and transmitted across cultures and time.`;
  }

  return etymologies.join('\n\n');
}

/**
 * Get a random example phrase for a language
 */
export async function getExamplePhrase(script: string): Promise<string> {
  const examples: Record<string, string[]> = {
    'English': ['Hello world', 'Know thyself', 'Peace be with you', 'Auld lang syne'],
    'Greek': ['Know thyself', 'Nothing in excess', 'In the beginning'],
    'Hebrew': ['Peace', 'Life', 'Wisdom'],
    'Phoenician': ['Peace', 'King', 'House of God'],
    'Old Norse Runes': ['Hail', 'Journey well', 'Honor the ancestors'],
    'Ogham': ['Oak', 'Birch', 'Rowan tree'],
  };

  const phrases = examples[script] || examples['English'];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

/**
 * Analyze phonetic resonances in a target language (ALS-RP)
 */
export async function getResonanceAnalysis(
  text: string,
  targetLanguage: string
): Promise<string> {
  const analysis = analyzeResonance(text, targetLanguage);
  return formatResonanceResults(analysis.matches);
}

/**
 * Get thematic tags from resonance analysis
 */
export async function getThematicTags(
  analysisResults: string[]
): Promise<string[]> {
  // analysisResults are already formatted strings
  // We need to re-analyze to get tags
  // For now, return generic tags based on common patterns

  const allText = analysisResults.join(' ').toLowerCase();

  const tagMap: Record<string, string> = {
    'time': 'Memory & Legacy',
    'old': 'Memory & Legacy',
    'ancient': 'Memory & Legacy',
    'mother': 'Community & Kinship',
    'father': 'Community & Kinship',
    'family': 'Community & Kinship',
    'god': 'Divine & Sacred',
    'sacred': 'Divine & Sacred',
    'spirit': 'Spirit & Metaphysical',
    'body': 'Mortality & Body',
    'flesh': 'Mortality & Body',
    'know': 'Wisdom & Knowledge',
    'wisdom': 'Wisdom & Knowledge',
    'earth': 'Nature & Elements',
    'water': 'Nature & Elements',
    'fire': 'Nature & Elements',
  };

  const tags = new Set<string>();

  for (const [keyword, theme] of Object.entries(tagMap)) {
    if (allText.includes(keyword)) {
      tags.add(theme);
    }
  }

  // Default tags if none found
  if (tags.size === 0) {
    tags.add('Phonetic Resonance');
    tags.add('Linguistic Echoes');
  }

  return Array.from(tags);
}

/**
 * Auto-select languages for resonance analysis based on input
 */
export async function getIntelligentLanguageSelection(
  text: string,
  languageOptions: any[]
): Promise<string[]> {
  // Get all available languages with lexicons
  const availableLanguages = getAvailableLanguages();

  // Filter to only those in languageOptions
  const validLanguages = availableLanguages.filter(lang =>
    languageOptions.some(opt => opt.value === lang)
  );

  // Quick analysis: which languages have the most potential matches?
  const scores: { lang: string; score: number }[] = [];

  for (const lang of validLanguages) {
    const analysis = analyzeResonance(text, lang, 0.4); // Lower threshold for selection
    const score = analysis.matches.reduce((sum, m) => sum + m.similarity, 0);
    scores.push({ lang, score });
  }

  // Sort by score and take top languages
  scores.sort((a, b) => b.score - a.score);

  // Return top 5-10 languages, but at least 3
  const topCount = Math.min(Math.max(scores.filter(s => s.score > 0).length, 3), 10);
  return scores.slice(0, topCount).map(s => s.lang);
}

/**
 * Batch analyze resonances across multiple languages
 */
export async function analyzeMultipleLanguages(
  text: string,
  languages: string[]
): Promise<ResonanceAnalysis[]> {
  return analyzeMultipleResonances(text, languages);
}
