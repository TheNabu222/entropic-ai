export interface CodexEntry {
  sourceText: string;
  sourceScript: string;
  transliterations: { [key: string]: string };
  analysis: {
    [key: string]: {
      phoneticGuide: string;
      definitions: string;
      historicalContext: string;
    }
  },
  resonance: {
    results: { language: string; result: string }[];
    thematicTags: string[];
  }
}

export const codexEntries: { [key: string]: CodexEntry } = {
  "Know Thyself": {
    sourceText: "Know Thyself",
    sourceScript: "English",
    transliterations: {
      "Greek": "Γνῶθι σεαυτόν",
      "Phoenician": "𐤃𐤏 𐤍𐤐𐤔𐤊",
      "Old Norse Runes": "ᚲᛖᚾᚾᚨ ᚦᛁᚲ ᛊᛖᛚᛒᛖᚱ",
    },
    analysis: {
      "Greek": {
        phoneticGuide: `
            * **Γνῶθι** - **Gno-thi** (like "gno" in gnostic, "thee")
            * **σεαυτόν** - **se-af-ton** (like "seh-off-tone")
        `,
        definitions: `
            * Γνῶθι (Gnōthi) - to know, to perceive (aorist active imperative 2nd person singular)
            * σεαυτόν (seauton) - thyself, yourself (accusative singular)
        `,
        historicalContext: `The phrase "Know thyself" is one of the Delphic maxims and was inscribed in the forecourt of the Temple of Apollo at Delphi. The maxim has been interpreted in various ways, from a warning against hubris to a call for self-reflection and understanding of one's place in the universe. Its etymology is straightforward Greek, but its philosophical impact has echoed through Western thought for millennia.`
      }
    },
    resonance: {
      results: [
        { language: "Sumerian Cuneiform", result: "* nu - no, not\n* uzu - flesh, body" },
        { language: "Basque", result: "* ezagutu - to know" },
        { language: "Zuni", result: "* son - self, own" },
      ],
      thematicTags: ["Introspection", "Mortality", "Wisdom"]
    }
  },
  "Auld Lang Syne": {
    sourceText: "Auld Lang Syne",
    sourceScript: "English",
    transliterations: {
        "Old Norse Runes": "ᚨᚢᛚᛞ ᛚᚨᛜ ᛊᚨᛁᚾ",
        "Ogham": "ᚐᚒᚂᚇ ᚂᚐᚅᚌ ᚄᚐᚔᚅ",
        "Greek": "Ολντ Λανγκ Σάιν",
    },
    analysis: {
        "Old Norse Runes": {
            phoneticGuide: "* **ᚨᚢᛚᛞ** - **awld** (like \"auld\")\n* **ᛚᚨᛜ** - **lang**\n* **ᛊᚨᛁᚾ** - **syn** (like \"sign\")",
            definitions: "* ᚨ (Ansuz) - God, divine wisdom\n* ᚢ (Uruz) - Strength, wild ox\n* ᛚ (Laguz) - Water, lake, flow\n* ᛞ (Dagaz) - Day, breakthrough",
            historicalContext: `The phrase "Auld Lang Syne" is Scots for "old long since," or more idiomatically, "long, long ago" or "days gone by." Its association with New Year's Eve globally is a relatively modern tradition. The original themes of remembering old friends and times past resonate with the Norse cultural emphasis on lineage, memory (minni), and the toasts made in mead halls to honor ancestors and bonds of kinship.`
        }
    },
    resonance: {
        results: [
            { language: "Basque", result: "* lan - work, task\n* zain - to wait, guard, bloodline" },
            { language: "Sumerian Cuneiform", result: "* alal - pipe, tube\n* an-za - unknown" },
            { language: "Quechua", result: "* ayni - reciprocity, mutual help" },
        ],
        thematicTags: ["Memory & Legacy", "Community & Kinship", "Passage of Time"]
    }
  },
  "Peace": {
    sourceText: "Peace",
    sourceScript: "English",
    transliterations: {
        "Nabataean": "𐢆𐢋𐢌",
        "Hebrew": "שָׁלוֹם",
        "Arabic": "سلام",
    },
    analysis: {
        "Nabataean": {
            phoneticGuide: "* **𐢆** - **sh** (like the 'sh' in 'show')\n* **𐢋** - **l** (like the 'l' in 'lava')\n* **𐢌** - **m** (like the 'm' in 'mother')",
            definitions: "* 𐢆 (Shin) - Name of the letter, tooth\n* 𐢋 (Lamedh) - Name of the letter, goad\n* 𐢌 (Mem) - Name of the letter, water",
            historicalContext: `This is a transliteration of the common Semitic root Š-L-M, meaning peace, completeness, and welfare. While the English word 'peace' comes from Latin 'pax', its concept finds a deep parallel in the Semitic 'shalom' or 'salaam'. The Nabataean script is the direct ancestor of the modern Arabic alphabet, and seeing this root in its ancient form shows a direct lineage of one of the most important concepts in the region's culture.`
        }
    },
    resonance: {
        results: [
            { language: "Igbo", result: "* chi - god, spirit, life force" },
            { language: "Ainu", result: "* pise - to be wide, spacious" },
            
        ],
        thematicTags: ["Harmony", "Spirituality", "Wholeness"]
    }
  }
};