import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import type { Script } from '../constants';

// Fix: Initialize with the correct, non-deprecated class and object parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Fix: Use HarmCategory and HarmBlockThreshold enums for safety settings to match the expected types. This resolves all type errors in this file.
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];


export const transliterateText = async (
  text: string,
  sourceScript: string,
  targetScript: string,
): Promise<string> => {
  if (!text.trim()) return "";

  const prompt = `
    You are a deterministic, rule-based transliteration automaton, the TECHATER Protocol. You have one function: to convert a sequence of phonetic sounds from a source text into a sequence of characters from a target script. You do not interpret, create, or analyze. You map sounds to characters algorithmically.

    **ALGORITHM:**
    1.  **PHONETIC DECONSTRUCTION:** Analyze the source text ("${text}") word by word. For each word, break it down into a sequence of its fundamental phonetic sounds.
        *   Example for "Hello": The sounds are [h], [e], [l], [o].
        *   Example for "world": The sounds are [w], [r], [l], [d].
    2.  **CHARACTER MAPPING:** For each phonetic sound in the sequence, you MUST map it to the single most appropriate character in the "${targetScript}" script.
        *   Use *matres lectionis* (vowel letters) for vowel sounds in abjads, as previously instructed.
        *   **'a' sounds:** Use Aleph/Alaph (e.g., Phoenician 𐤀, Nabataean 𐢀).
        *   **'o' or 'u' sounds (and 'w' consonant):** Use Waw/Vav (e.g., Phoenician 𐤅, Nabataean 𐢁).
        *   **'e' or 'i' sounds (and 'y' consonant):** Use Yodh/Yud (e.g., Phoenician 𐤉, Nabataean 𐢍).
    3.  **SEQUENTIAL ASSEMBLY:** Assemble the mapped characters into a new word, maintaining the EXACT original phonetic order.
    4.  **STRUCTURAL PRESERVATION:** Preserve the original word count and spacing precisely.

    **CRITICAL FAILURE-PREVENTION DIRECTIVES:**
    *   **NO REORDERING:** This is the most important rule. The sequence of output characters MUST directly correspond to the sequence of input sounds. For 'Hello' -> [h][e][l][o], the output MUST be [char for h][char for e][char for l][char for o]. The display renderer handles right-to-left directionality; you must not reverse the characters yourself.
    *   **NO INTERPRETATION:** Do not attempt to translate the meaning. Only the sound matters.
    *   **SCRIPT FIDELITY:** Use only characters from the specified "${targetScript}" writing system.
    *   **TOTAL CONVERSION:** Every word from the source text must be transliterated.
    *   **PURITY:** Your response MUST contain ONLY the transliterated text. Nothing else.

    **NABATAEAN SPECIFIC EXAMPLE (FOR REFERENCE):**
    *   Source Word: "Shalam"
    *   Phonetic Deconstruction: [sh], [a], [l], [a], [m]
    *   Character Mapping: Shin (𐢆), Aleph (𐢀), Lamedh (𐢋), Aleph (𐢀), Mem (𐢌)
    *   Correct Output: 𐢆𐢀𐢋𐢀𐢌

    **CURRENT TASK:**
    *   Source Text: "${text}"
    *   Source Script: "${sourceScript}"
    *   Target Script: "${targetScript}"

    **Transliteration:**
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        safetySettings,
      },
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error during transliteration:", error);
    throw new Error("Failed to get transliteration from the AI model. Please try again later.");
  }
};

export const getPhoneticGuide = async (
  text: string,
  script: string,
): Promise<string> => {
  if (!text.trim()) return "";

  const prompt = `
    You are a linguistics expert. Your task is to create a detailed phonetic pronunciation guide for a given text written in the "${script}" writing system. You must analyze the text character-by-character or word-by-word.

    **CRITICAL INSTRUCTIONS:**
    1.  **Direct Mapping:** You MUST provide a phonetic breakdown for every single character or recognizable word group as it appears in the input text. Do not provide a generic alphabet guide. The guide must correspond directly to the provided text.
    2.  **Strict Order:** Your guide must follow the exact order of the characters in the text.
    3.  **Mandatory Formatting:** You MUST follow this format exactly for each entry. Each entry must be on a new line.
        *   **[Character from Text]** - **[Phonetic Sound]** (example of sound)

    **Example for Phoenician '𐤀𐤋𐤐 𐤁𐤉𐤕':**
    *   **𐤀** - **ah-lef** (like the "a" in "father")
    *   **𐤋** - **lah-med** (like "la" in "lava")
    *   **𐤐** - **peh** (like the "p" in "spy")
    *   **𐤁** - **bet** (like the "b" in "boat")
    *   **𐤉** - **yod** (like the "y" in "yes")
    *   **𐤕** - **taw** (like the "t" in "top")

    **Text to Analyze:** "${text}"

    **Phonetic Guide:**
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        safetySettings,
      },
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error fetching phonetic guide:", error);
    throw new Error("Failed to get phonetic guide from the AI model. Please try again later.");
  }
};

export const getDefinitions = async (
  text: string,
  script: string,
): Promise<string> => {
  if (!text.trim()) return "";

  const prompt = `
    You are a master linguistic expert and lexicographer, specializing in ancient scripts. Your task is to provide a lexicon for the provided text, which is in the '${script}' writing system. Adhere to the following non-negotiable rules.

    **Core Task:**
    For each recognizable character or word in the provided text, you must:
    1.  Identify the original character/word.
    2.  Provide its common transliterated name (e.g., Aleph, Beta, Lugal). This is the name of the letter or word as spoken.
    3.  Provide its English definition(s) or known meaning.

    **CRITICAL: FORMATTING RULE**
    This is the most important rule. You MUST present the result as a list, with each item on a new line. Each line MUST follow this exact format:
    \`* [Original Character/Word] ([Transliterated Name]) - [Definition]\`

    **Example for Phoenician:**
    *   𐤀 (Aleph) - Ox, strength, leader
    *   𐤁 (Bet) - House, family

    **Example for Sumerian Cuneiform:**
    *   𒈗 (Lugal) - King, ruler

    If no definitions can be found for a character or the entire text, you must explicitly state that. Do not invent meanings. If you cannot find a transliterated name, leave the parentheses empty, but you must still attempt to provide a definition if one is known.

    **Text to Analyze:** "${text}"

    **Lexicon:**
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        safetySettings,
      },
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error fetching definitions:", error);
    throw new Error("Failed to get definitions from the AI model. Please try again later.");
  }
};

export const getHistoricalContext = async (
  text: string,
  sourceScript: string,
): Promise<string> => {
  if (!text.trim()) return "";

  const prompt = `
    You are a historian, etymologist, and cultural expert. Your task is to provide a rich, multi-faceted analysis of the provided phrase.

    **Phrase to Analyze:** "${text}"
    **Original Language/Culture:** "${sourceScript}"

    **Your analysis is CRITICAL and MUST include two parts in a single, cohesive response:**
    1.  **PART 1: Etymology:** This part is mandatory. You MUST provide a brief etymology for the key words in the original English phrase ("${text}"). Explain their origins and how their meanings have evolved.
    2.  **PART 2: Historical/Cultural Context:** Provide interesting historical or cultural context related to the phrase's meaning. If the phrase itself is modern, connect its themes to the historical context of the "${sourceScript}" culture or writing system.

    **Final Output:** Combine these two parts into an engaging and informative paragraph. Do not separate them with headers in the final output.

    **Example (for phrase "Hello world"):**
    The word "Hello" is a relatively modern greeting, evolving from "hail" in the Middle Ages. "World" originates from Old English 'weorold', meaning 'age of man.' While the combined phrase is a programming cliché, the concept of greeting the world reflects the universal human desire for connection, a sentiment echoed in ancient cuneiform tablets which often began with formal greetings to the gods or kings.

    **Scholar's Notes:**
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        safetySettings,
      },
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error fetching historical context:", error);
    return "The historical records on this matter are currently sealed.";
  }
};

export const getExamplePhrase = async (script: string): Promise<string> => {
  const prompt = `
    You are a linguist. Provide one simple, common, short phrase (2-3 words is ideal) that would be appropriate for the "${script}" language and culture.
    Examples could be "Hello", "Thank you", "What is your name?", or "Safe travels".
    Return ONLY the phrase itself, with no quotation marks or explanations.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        safetySettings,
      },
    });
    return response.text.trim().replace(/"/g, ''); // Remove quotes just in case
  } catch (error) {
    console.error("Error fetching example phrase:", error);
    return "Hello world"; // Return a safe default
  }
};


export const getResonanceAnalysis = async (text: string, targetLanguage: string): Promise<string> => {
  if (!text.trim()) return "";

  const prompt = `
    You are an expert in linguistic resonance, operating under the "Linguistic Decoding Resonances (LDR)" method. Your task is to analyze the following English phrase for phonetic echoes in another language. This is a speculative but creative and insightful process.

    **Methodology:**
    1.  **Analyze Phonetics:** Consider the sounds of the English input phrase: "${text}".
    2.  **Search Lexicon:** Search the lexicon of the **${targetLanguage}** language.
    3.  **Find Similar-Sounding Words:** Identify actual, meaningful words or short, common phrases native to ${targetLanguage} that have a notable phonetic similarity to the sounds of the English phrase or its parts. Be flexible and creative; consider sound substitutions and the overall sound profile.
    4.  **Translate Found Words:** Provide the English translation for the native words/phrases you find.
    5.  **Format:** Return a bulleted list of your findings. For each finding, use the format: \`* [Native Word/Phrase] - [English Meaning]\`. If no plausible echoes are found, return "No significant resonance found in the echoes."

    **Example Input:** text="Auld Lang Syne", targetLanguage="Basque"
    **Example Output:**
    *   lan - work
    *   zain - to wait, guard, bloodline

    ---

    **Input English Phrase:** "${text}"
    **Target Language for Resonance:** "${targetLanguage}"

    **Resonance Findings:**
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        safetySettings,
      },
    });
    return response.text.trim();
  } catch (error) {
    console.error(`Error fetching resonance analysis for ${targetLanguage}:`, error);
    return `Analysis failed for ${targetLanguage}.`;
  }
};

export const getThematicTags = async (analysisResults: string[]): Promise<string[]> => {
  if (analysisResults.length === 0) return [];

  const prompt = `
    You are a mythopoetic analyst. Given the following list of words and their meanings, extracted from various languages through a process of phonetic resonance, your task is to identify the core, recurring archetypal themes.

    **Source Data:**
    ${analysisResults.join('\n')}

    **Instructions:**
    Synthesize these findings into a list of 2-5 primary thematic tags. These tags should be broad, archetypal concepts (e.g., "Memory & Legacy", "Community & Kinship", "Ritual Action", "Loss & Passage").
    
    **CRITICAL:** Your response MUST be a valid JSON array of strings. For example: ["Theme 1", "Theme 2", "Theme 3"]
    Do not add any other text, explanation, or markdown formatting.
    
    **Thematic Tags (JSON Array):**
  `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                safetySettings,
                responseMimeType: "application/json",
            },
        });

        const text = response.text.trim();
        // The model might return markdown ```json ... ```, let's strip that.
        const jsonText = text.replace(/^```json\s*|```\s*$/g, '');
        const tags = JSON.parse(jsonText);
        return Array.isArray(tags) ? tags : [];

    } catch (error) {
        console.error("Error fetching thematic tags:", error);
        return []; // Return empty array on failure
    }
};

export const getIntelligentLanguageSelection = async (text: string, languageOptions: Script[]): Promise<string[]> => {
  if (!text.trim()) return [];
  const availableLanguages = languageOptions.map(l => l.value).join(', ');

  const prompt = `
    You are a linguistic oracle. Your task is to analyze an English phrase and determine which languages would provide the most interesting phonetic or thematic resonances for it.

    **Input Phrase:** "${text}"

    **Available Languages for Analysis:**
    ${availableLanguages}

    **Instructions:**
    1.  Consider the phonetics, origins, and cultural context of the input phrase.
    2.  From the list of available languages, select up to 10 languages that you believe will yield the most fruitful and surprising "phonetic echoes" or thematic connections.
    3.  Prioritize linguistic diversity and languages known for unique phonetic inventories or deep mythological roots.

    **CRITICAL:** Your response MUST be a valid JSON array of strings, where each string is one of the language values from the provided list. For example: ["Basque", "Sumerian Cuneiform", "Ainu"].
    Do not add any other text, explanation, or markdown formatting.

    **Selected Languages (JSON Array):**
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        safetySettings,
        responseMimeType: "application/json",
      },
    });

    const text = response.text.trim();
    const jsonText = text.replace(/^```json\s*|```\s*$/g, '');
    const selectedLangs = JSON.parse(jsonText);

    // Filter to ensure the AI only returns valid languages from our list
    const validLangs = languageOptions.map(l => l.value);
    return Array.isArray(selectedLangs) ? selectedLangs.filter((lang): lang is string => typeof lang === 'string' && validLangs.includes(lang)) : [];
  } catch (error) {
    console.error("Error fetching intelligent language selection:", error);
    return []; // Return empty array on failure
  }
};
