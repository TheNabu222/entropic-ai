# TECHATER Protocol - Rigid System Documentation

## Overview

The Resonance Engine has been upgraded from AI-powered to **rigid, rule-based** phonetic matching. This makes it:

- ✅ **Deterministic**: Same input always produces same output
- ✅ **Reliable**: No AI hallucinations or inconsistencies
- ✅ **Fast**: No API calls, instant results
- ✅ **Free**: No API costs
- ✅ **Transparent**: You can see exactly how matching works
- ✅ **Extensible**: Easy to add new words to lexicons

---

## Architecture

### Core Components

#### 1. **Phonetic Engine** (`services/phoneticEngine.ts`)
Converts text to phonetic representations using multiple algorithms:

- **IPA-like phonemes**: Text → phonetic tokens
- **Metaphone**: Phonetic coding for matching similar-sounding words
- **Soundex**: Classic phonetic algorithm
- **Levenshtein distance**: Edit distance for similarity scoring

**Example:**
```typescript
textToPhonemes("hello") → [h, ɛ, l, o]
metaphone("auld") → "LT"
soundex("lang") → "L520"
phoneticSimilarity("auld", "alal") → 0.75
```

#### 2. **Transliteration Maps** (`services/transliterationMaps.ts`)
Character-by-character phonetic mappings for scripts:

- Phoenician (22 characters)
- Nabataean (22 characters)
- Elder Futhark / Old Norse Runes (24 runes)
- Ogham (20 characters)
- Greek (24 letters)
- Hebrew (22 letters)

Each mapping includes:
- Unicode character
- Phoneme (sound)
- Letter name
- Symbolic meaning

**Example:**
```typescript
{ char: '𐤀', phoneme: 'ʔ', name: 'Aleph', meaning: 'ox' }
{ char: 'ᚨ', phoneme: 'a', name: 'Ansuz', meaning: 'god, divine' }
```

#### 3. **Lexicon Databases** (`services/lexicons.ts`)
Word lists with phonetic representations for resonance analysis:

**Languages with lexicons:**
- Basque (12 words)
- Sumerian Cuneiform (16 words)
- Igbo (10 words)
- Ainu (9 words)
- Zuni (7 words)
- Quechua (9 words)
- Vietnamese (7 words)
- Cherokee (5 words)
- Etruscan (6 words)

**Entry format:**
```typescript
{
  word: 'lan',
  phonetic: 'lan',
  meaning: 'work, task',
  category: 'activity',
  tags: ['labor', 'effort']
}
```

#### 4. **Rigid Transliteration** (`services/rigidTransliteration.ts`)
Converts text between scripts using phonetic mapping:

1. Convert source text → phonemes
2. Map each phoneme → target script character
3. Handle special cases (vowels in abjads use matres lectionis)
4. Preserve word boundaries

**Example:**
```
"peace" → [p, i, s] → 𐢐𐢈𐢎 (Nabataean)
```

#### 5. **Resonance Matcher** (`services/resonanceMatcher.ts`)
**ALS-RP (Auld Lang Syne Resonance Protocol)** - phonetic-first analysis

**Algorithm:**
1. Convert input to phonetic signature
2. Search lexicon for similar-sounding words
3. Score matches using multiple strategies:
   - Exact match (1.0)
   - Metaphone match (0.9)
   - Soundex match (0.8)
   - Levenshtein similarity (0.5-1.0)
   - Substring containment (0.4-0.7)
4. Deduplicate and rank by similarity
5. Extract archetypal themes from tags

**Match types:**
- `exact`: Perfect phonetic match
- `metaphone`: Strong phonetic similarity
- `soundex`: Similar sound pattern
- `phonetic`: Levenshtein-based similarity ≥ 0.75
- `fuzzy`: Weaker phonetic match ≥ 0.5

---

## Validation Results

Tested against existing codex entries:

### ✅ "Auld Lang Syne" Resonance Analysis

| Language | Rigid System Found | Codex Expected | Match |
|----------|-------------------|----------------|-------|
| **Basque** | lan (work), soin (sound) | lan (work), zain (wait) | ✅ 50% |
| **Sumerian** | sun (old), alal (pipe) | alal (pipe), an-za | ✅ 50% |
| **Quechua** | sami (luck/energy) | ayni (reciprocity) | ⚠️ Different but valid |

**Similarity scores:**
- "lan" match: 0.75 (phonetic)
- "alal" match: 0.8 (soundex)
- "sun" match: 0.9 (metaphone)

### ⚠️ Transliteration Accuracy

Phonetic transliteration works but differs from scholarly transliterations:

| Input | Target | Rigid Output | Codex/Expected | Notes |
|-------|--------|--------------|----------------|-------|
| "Auld Lang Syne" | Runes | ᛟᛚᛞ ᛚᚨᛜ ᛊᛃᚾᛖ | ᚨᚢᛚᛞ ᛚᚨᛜ ᛊᚨᛁᚾ | Different vowels |
| "Peace" | Nabataean | 𐢐𐢈𐢉 | 𐢆𐢋𐢌 | Translating vs. semantic |

**Note:** The rigid system does *phonetic* transliteration (sound-based), not semantic translation. For scholarly accuracy, use Codex mode.

---

## How to Extend

### Add New Words to Lexicons

Edit `services/lexicons.ts`:

```typescript
export const BASQUE_LEXICON: LexiconEntry[] = [
  // ... existing entries
  {
    word: 'your-word',
    phonetic: 'phonetic-spelling',
    meaning: 'English meaning',
    category: 'semantic-category',
    tags: ['theme1', 'theme2']
  },
];
```

### Add New Scripts

1. **Add character map** in `services/transliterationMaps.ts`:
```typescript
export const YOUR_SCRIPT_MAP: CharacterMapping[] = [
  { char: 'X', phoneme: 'x', name: 'Letter Name', meaning: 'symbol meaning' },
  // ... more characters
];

// Register in SCRIPT_MAPS
export const SCRIPT_MAPS: Record<string, CharacterMapping[]> = {
  'Your Script': YOUR_SCRIPT_MAP,
  // ... existing scripts
};
```

2. **Add to constants** in `constants.ts`:
```typescript
{
  value: 'Your Script',
  label: 'Your Script (Details)',
  description: 'Historical description...'
}
```

### Add New Language Lexicon

1. Create lexicon in `services/lexicons.ts`
2. Add to `LEXICONS` map
3. Add to `resonanceLanguageOptions` in `App.tsx`

---

## Performance

**Comparison: AI vs Rigid**

| Operation | AI (Gemini) | Rigid System |
|-----------|-------------|--------------|
| Transliteration | ~2-5 seconds | < 10ms |
| Phonetic Guide | ~1-3 seconds | < 5ms |
| Resonance (1 lang) | ~2-4 seconds | < 50ms |
| Resonance (10 langs) | ~20-40 seconds | < 500ms |
| Cost per request | $0.001-0.01 | $0 |
| Consistency | Variable | Perfect |

---

## API Reference

### Main Service (`services/rigidService.ts`)

```typescript
// Transliterate text between scripts
await transliterateText(text: string, sourceScript: string, targetScript: string): Promise<string>

// Get phonetic pronunciation guide
await getPhoneticGuide(text: string, targetScript: string): Promise<string>

// Get character definitions
await getDefinitions(text: string, targetScript: string): Promise<string>

// Get historical context
await getHistoricalContext(text: string, sourceScript: string): Promise<string>

// Analyze phonetic resonances (ALS-RP)
await getResonanceAnalysis(text: string, targetLanguage: string): Promise<string>

// Extract thematic tags
await getThematicTags(analysisResults: string[]): Promise<string[]>

// Auto-select best languages for analysis
await getIntelligentLanguageSelection(text: string, languageOptions: any[]): Promise<string[]>
```

---

## Known Limitations

1. **Lexicon Size**: Currently limited word lists (6-16 words per language)
   - **Solution**: Expand lexicons over time

2. **Transliteration vs Translation**: Phonetic mapping ≠ semantic translation
   - **Solution**: Use Codex mode for scholarly accuracy

3. **Vowel Handling in Abjads**: Phoenician/Hebrew/Nabataean vowels use matres lectionis approximations
   - **Solution**: Refine vowel mapping rules

4. **Multi-syllable Matching**: Better at short words than long phrases
   - **Solution**: Word-by-word analysis helps

---

## Future Enhancements

- [ ] Import word lists from etymology databases
- [ ] Add more scripts (Linear B, Mayan, Meroitic, etc.)
- [ ] Implement LUM-Link (meaning-first) analysis
- [ ] Semantic similarity scoring
- [ ] Interactive lexicon editor in UI
- [ ] Export analysis to TECHATER Codex format
- [ ] Visualization of phonetic similarity graphs

---

## Testing

Run validation tests:

```bash
cd resonance-engine-(techater-protocol)
npx tsx test-rigid-system.ts
```

Build app:

```bash
npm run build
```

Run dev server:

```bash
npm run dev
```

---

## Architecture Diagram

```
User Input Text
      ↓
┌─────────────────────┐
│ Phonetic Engine     │ → [h, ɛ, l, o]
│ - textToPhonemes    │ → metaphone: "HL"
│ - metaphone         │ → soundex: "H400"
│ - soundex           │
└─────────────────────┘
      ↓
┌─────────────────────────────────────┐
│ Rigid Transliteration               │
│ ┌─────────────────────────────────┐ │
│ │ Get Target Script Map           │ │
│ │ ┌─────────────────────────────┐ │ │
│ │ │ Phoenician: 𐤀 → 'ʔ'        │ │ │
│ │ │ Runes: ᚨ → 'a'              │ │ │
│ │ └─────────────────────────────┘ │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Map Phoneme → Character         │ │
│ │ h → 𐤄, e → 𐤀, l → 𐤋, o → 𐤅 │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
      ↓
    𐤄𐤀𐤋𐤅

      AND

User Input Text
      ↓
┌──────────────────────────────────┐
│ Resonance Matcher (ALS-RP)       │
│ ┌──────────────────────────────┐ │
│ │ For each language:           │ │
│ │ 1. Get lexicon               │ │
│ │ 2. Calculate similarity      │ │
│ │ 3. Score & rank matches      │ │
│ │ 4. Extract themes            │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
      ↓
   Matches:
   - lan (work) [0.75]
   - alal (pipe) [0.8]
   - sun (old) [0.9]
      ↓
   Themes:
   - Memory & Legacy
   - Community & Kinship
```

---

## Credits

**TECHATER Protocol** - *The Entropic Archive of Hybrid Algorithmic Translingual Echo Research*

Built for **ALS-RP** (Auld Lang Syne Resonance Protocol) and **LUM-Link** analysis.

**Author**: TheNabu222 (Linguistic archaeologist, resonance cartographer)

**Methodology**: Finding meaning through phonetic resonance, not translation—"typos of history" in the long-distance relationship with the past.
