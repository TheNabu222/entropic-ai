/**
 * Test script for rigid transliteration and resonance system
 * Validates against existing codex entries
 */

import { transliterateText, getPhoneticGuide, getDefinitions } from './services/rigidTransliteration';
import { analyzeResonance, formatResonanceResults } from './services/resonanceMatcher';
import { codexEntries } from './codexData';

console.log('='.repeat(70));
console.log('TECHATER PROTOCOL - RIGID SYSTEM VALIDATION');
console.log('='.repeat(70));

// Test 1: "Know Thyself" -> Phoenician
console.log('\n📜 TEST 1: Know Thyself -> Phoenician');
console.log('-'.repeat(70));

const test1 = transliterateText('Know Thyself', 'English', 'Phoenician');
console.log('Input: "Know Thyself"');
console.log('Target Script: Phoenician');
console.log(`Success: ${test1.success}`);
console.log(`Output: ${test1.output}`);
console.log(`Expected: 𐤃𐤏 𐤍𐤐𐤔𐤊`);
console.log('\nPhonetic Guide:');
console.log(getPhoneticGuide(test1));
console.log('\nDefinitions:');
console.log(getDefinitions(test1));

// Test 2: "Know Thyself" -> Greek
console.log('\n\n📜 TEST 2: Know Thyself -> Greek');
console.log('-'.repeat(70));

const test2 = transliterateText('Know Thyself', 'English', 'Greek');
console.log('Input: "Know Thyself"');
console.log('Target Script: Greek');
console.log(`Success: ${test2.success}`);
console.log(`Output: ${test2.output}`);
console.log(`Expected: Γνῶθι σεαυτόν`);
console.log('\nTokens:', test2.tokens.map(t => `${t.source}->${t.target}(${t.phoneme})`).join(' '));

// Test 3: "Auld Lang Syne" -> Old Norse Runes
console.log('\n\n📜 TEST 3: Auld Lang Syne -> Old Norse Runes');
console.log('-'.repeat(70));

const test3 = transliterateText('Auld Lang Syne', 'English', 'Old Norse Runes');
console.log('Input: "Auld Lang Syne"');
console.log('Target Script: Old Norse Runes');
console.log(`Success: ${test3.success}`);
console.log(`Output: ${test3.output}`);
console.log(`Expected: ᚨᚢᛚᛞ ᛚᚨᛜ ᛊᚨᛁᚾ`);
console.log('\nPhonetic Guide:');
console.log(getPhoneticGuide(test3));

// Test 4: "Peace" -> Nabataean
console.log('\n\n📜 TEST 4: Peace -> Nabataean');
console.log('-'.repeat(70));

const test4 = transliterateText('Peace', 'English', 'Nabataean');
console.log('Input: "Peace"');
console.log('Target Script: Nabataean');
console.log(`Success: ${test4.success}`);
console.log(`Output: ${test4.output}`);
console.log(`Expected: 𐢆𐢋𐢌 (shalam)`);

// Test 5: Resonance Analysis - "Know Thyself" in Basque
console.log('\n\n🌊 TEST 5: Resonance Analysis - "Know Thyself" in Basque');
console.log('-'.repeat(70));

const resonance1 = analyzeResonance('Know Thyself', 'Basque');
console.log('Input: "Know Thyself"');
console.log('Target Language: Basque');
console.log(`Matches found: ${resonance1.matches.length}`);
console.log(`Thematic tags: ${resonance1.thematicTags.join(', ')}`);
console.log('\nTop matches:');
console.log(formatResonanceResults(resonance1.matches));
console.log('\nExpected: ezagutu (to know)');

// Test 6: Resonance Analysis - "Auld Lang Syne" in multiple languages
console.log('\n\n🌊 TEST 6: Resonance Analysis - "Auld Lang Syne"');
console.log('-'.repeat(70));

const testLanguages = ['Basque', 'Sumerian Cuneiform', 'Quechua'];
for (const lang of testLanguages) {
  const resonance = analyzeResonance('Auld Lang Syne', lang);
  console.log(`\n${lang}:`);
  console.log(formatResonanceResults(resonance.matches.slice(0, 3)));
}

console.log('\n\nExpected (from Codex):');
console.log('Basque: lan (work), zain (wait/guard)');
console.log('Sumerian: alal (pipe), an-za (unknown)');
console.log('Quechua: ayni (reciprocity)');

// Test 7: Individual word analysis
console.log('\n\n🔍 TEST 7: Individual Word Phonetic Matching');
console.log('-'.repeat(70));

const words = ['auld', 'lang', 'syne'];
for (const word of words) {
  console.log(`\nWord: "${word}"`);

  const basqueRes = analyzeResonance(word, 'Basque', 0.4);
  console.log(`  Basque matches: ${formatResonanceResults(basqueRes.matches.slice(0, 2))}`);

  const sumerianRes = analyzeResonance(word, 'Sumerian Cuneiform', 0.4);
  console.log(`  Sumerian matches: ${formatResonanceResults(sumerianRes.matches.slice(0, 2))}`);
}

console.log('\n' + '='.repeat(70));
console.log('VALIDATION COMPLETE');
console.log('='.repeat(70));
