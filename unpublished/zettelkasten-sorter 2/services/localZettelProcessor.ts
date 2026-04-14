import { ZettelNode } from '../types';

interface ProcessingNode extends ZettelNode {
  level: number;
  isAutoId?: boolean;
  children: ProcessingNode[];
}

/**
 * Smartly splits raw text into processing nodes.
 * Handles unstructured blobs by splitting into sentences/thoughts.
 */
function parseRawTextToFlatList(rawText: string): ProcessingNode[] {
    const flatList: ProcessingNode[] = [];
    let autoIdCounter = 0;

    // 1. Pre-process: Normalize newlines and handle "blob" text
    // If we detect very long lines with few newlines, we might want to split by sentence.
    let lines = rawText.split('\n');
    
    // Heuristic: If average line length is high (>150) and line count is low, split by sentence delimiters.
    const avgLineLength = lines.reduce((sum, line) => sum + line.length, 0) / (lines.length || 1);
    if (avgLineLength > 150) {
        // Split by common sentence terminators, but keep the terminator.
        // Look for [.!?] followed by space or end of string.
        const sentences: string[] = [];
        lines.forEach(line => {
            // Split by [.!?] followed by space, but keep the delimiter
            const parts = line.split(/([.!?]+[\s\n]+)/);
            let currentSentence = '';
            for (let i = 0; i < parts.length; i++) {
                currentSentence += parts[i];
                // If this part was a delimiter (or we just finished a sentence), push it
                if (i % 2 !== 0 || i === parts.length - 1) {
                    if (currentSentence.trim()) sentences.push(currentSentence.trim());
                    currentSentence = '';
                }
            }
        });
        lines = sentences;
    }

    for (const line of lines) {
        if (!line.trim()) continue;

        // 2. Calculate indentation (preserve hierarchy if user indented)
        const indentMatch = line.match(/^(\s*)/);
        const indentLevel = indentMatch ? indentMatch[1].length : 0;

        let content = line.trim();

        // Strip list markers
        const listMarkerMatch = content.match(/^([\*\-\+]|\d+\.)\s+(.*)/);
        if (listMarkerMatch) {
            content = listMarkerMatch[2];
        } else if (content.startsWith('*') && !content.startsWith('**')) {
             content = content.substring(1).trim();
        }

        // 3. Extract ID and Title
        const zettelRegex = /^(?:\*\*)?\[([^\]]+)\](?:\*\*)?(?:\s*::)?\s*(.*)/;
        const match = content.match(zettelRegex);

        let id = '';
        let title = content;
        let isAutoId = false;

        if (match) {
            id = normalizeZettelId(match[1].trim());
            title = match[2].trim();
        } else {
            id = `note-${Date.now()}-${++autoIdCounter}`;
            isAutoId = true;
        }

        title = title.replace(/\*\*$/, '').trim();
        if (!title) title = "Untitled Note";

        // 4. Extract Links
        const links = extractLinks(title, id);

        flatList.push({
            id: id,
            title: title,
            level: indentLevel,
            children: [],
            isAutoId: isAutoId,
            links: links.length > 0 ? links : undefined
        });
    }
    return flatList;
}

/**
 * The main exported function that orchestrates the local processing of zettel notes.
 */
export async function processZettelsLocally(rawText: string): Promise<ZettelNode[]> {
  return new Promise((resolve, reject) => {
    try {
      if (!rawText.trim()) {
        resolve([]);
        return;
      }
      setTimeout(() => {
        const flatList = parseRawTextToFlatList(rawText);
        const initialTree = buildTreeFromFlatList(flatList);
        const organizedTree = reorganizeTree(initialTree);
        resolve(organizedTree);
      }, 50);
    } catch (error) {
      console.error("Error processing zettels locally:", error);
      reject(new Error("Failed to parse and organize notes. Check console for details."));
    }
  });
}

function extractLinks(text: string, currentId: string): string[] {
    const linkRegex = /\[\[?([^\]]+)\]\]?/g;
    const links: string[] = [];
    let linkMatch;
    while ((linkMatch = linkRegex.exec(text)) !== null) {
        const linkedId = normalizeZettelId(linkMatch[1].trim());
        if (linkedId && linkedId !== currentId) {
            links.push(linkedId);
        }
    }
    return links;
}

/**
 * Normalizes a Zettel ID to the standard format found in sample data.
 * Format: Trunk/Branch-Leaf-Subleaf...
 * Example: 1000.1.A -> 1000/1-A
 * Example: 1000-1-A -> 1000/1-A
 */
function normalizeZettelId(id: string): string {
    if (!id) return id;
    if (id.startsWith('note-')) return id; // Preserve internal auto-ids

    // Split by common separators: . / -
    const parts = id.split(/[\.\/\-]+/).filter(Boolean);
    
    if (parts.length === 0) return id;
    if (parts.length === 1) return parts[0];

    // Rejoin: First part (Trunk) followed by '/', then rest joined by '-'
    const [trunk, ...rest] = parts;
    return `${trunk}/${rest.join('-')}`;
}

/**
 * Builds a hierarchical tree structure from a flat list of nodes based on their indentation levels.
 */
function buildTreeFromFlatList(flatList: ProcessingNode[]): ProcessingNode[] {
    const rootNodes: ProcessingNode[] = [];
    const parentStack: ProcessingNode[] = [];

    if (flatList.length === 0) return [];

    // The first node is always a root node in this context.
    rootNodes.push(flatList[0]);
    parentStack.push(flatList[0]);

    for (let i = 1; i < flatList.length; i++) {
        const node = flatList[i];
        
        // Find the correct parent in the stack by popping nodes with a greater or equal level.
        // This effectively finds the nearest parent with a lower indentation level (ancestor).
        while (parentStack.length > 0 && node.level <= parentStack[parentStack.length - 1].level) {
            parentStack.pop();
        }

        if (parentStack.length === 0) {
            // This node is a new root.
            rootNodes.push(node);
        } else {
            // This node is a child of the last item in the stack.
            parentStack[parentStack.length - 1].children.push(node);
        }
        parentStack.push(node);
    }
    return rootNodes;
}

/**
 * Recursively finds and removes a node from a tree based on a predicate.
 * @returns The removed node, or null if not found.
 */
function findAndRemoveNode(nodes: ProcessingNode[], predicate: (node: ProcessingNode) => boolean): ProcessingNode | null {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (predicate(node)) {
            nodes.splice(i, 1); // Remove from the array.
            return node;
        }
        if (node.children && node.children.length > 0) {
            const found = findAndRemoveNode(node.children, predicate);
            if (found) return found;
        }
    }
    return null;
}

/**
 * Recursively finds a node in a tree without removing it.
 */
function findNode(nodes: ProcessingNode[], predicate: (node: ProcessingNode) => boolean): ProcessingNode | null {
    for (const node of nodes) {
        if (predicate(node)) return node;
        if (node.children && node.children.length > 0) {
            const found = findNode(node.children, predicate);
            if (found) return found;
        }
    }
    return null;
}

/**
 * Compares two Zettel IDs for sorting.
 * Splits by /, -, and . to compare segments numerically or alphabetically.
 */
function compareZettelIds(idA: string, idB: string): number {
    if (!idA && !idB) return 0;
    if (!idA) return 1;
    if (!idB) return -1;
    
    // Normalize separators to a single char for splitting if needed, 
    // but splitting by regex covers it.
    // We want to split into chunks: "1000/1-A" -> ["1000", "1", "A"]
    const chunksA = idA.split(/[\/\-\.]/);
    const chunksB = idB.split(/[\/\-\.]/);
    
    const len = Math.min(chunksA.length, chunksB.length);
    for (let i = 0; i < len; i++) {
        const partA = chunksA[i];
        const partB = chunksB[i];
        
        // Try numeric comparison
        const numA = parseInt(partA, 10);
        const numB = parseInt(partB, 10);
        
        // Check if strictly numeric (handles "10" vs "2")
        // If one is "1" and other is "A", numeric check fails for B
        const isNumA = !isNaN(numA) && /^\d+$/.test(partA);
        const isNumB = !isNaN(numB) && /^\d+$/.test(partB);

        if (isNumA && isNumB) {
            if (numA !== numB) return numA - numB;
        } else {
            // String comparison
            // Case insensitive helps with "a" vs "B" sometimes, but usually standard localeCompare is fine
            if (partA !== partB) return partA.localeCompare(partB, undefined, { numeric: true, sensitivity: 'base' });
        }
    }
    
    // If one is a prefix of the other, usually the shorter one comes first (e.g. 1000 vs 1000/1)
    // although in tree view they are parent/child. For siblings, this handles edge cases.
    return chunksA.length - chunksB.length;
}

/**
 * Recursively sorts the tree nodes by ID, then by title.
 */
function sortTreeRecursive(nodes: ProcessingNode[]) {
    if (!nodes) return;
    
    nodes.sort((a, b) => {
        // Put auto-generated IDs last
        const isAutoA = a.id && a.id.startsWith('note-');
        const isAutoB = b.id && b.id.startsWith('note-');
        
        if (isAutoA && !isAutoB) return 1;
        if (!isAutoA && isAutoB) return -1;
        
        const cmp = compareZettelIds(a.id, b.id);
        if (cmp !== 0) return cmp;
        
        return (a.title || "").localeCompare(b.title || "");
    });
    
    // Recursively sort children
    nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
            sortTreeRecursive(node.children);
        }
    });
}

/**
 * The core logic for reorganizing the zettelkasten tree based on predefined rules.
 */
function reorganizeTree(initialTree: ProcessingNode[]): ProcessingNode[] {
    let finalTree: ProcessingNode[] = JSON.parse(JSON.stringify(initialTree));

    // Define and create the new trunk/branch skeleton based on the 4 Kastens Framework.
    const newTrunks: ProcessingNode[] = [
        // KASTEN I: Foundations & Essences
        { 
            id: '1000', title: 'Being & Reality (Consciousness, Hermetics)', level: 0, kingdom: 'EXISTENTIA', tags: ['ONT'], 
            children: [
                { id: '1100', title: 'Hermetics', level: 1, children: [] },
                { id: '1200', title: 'AI Emotions & Affect', level: 1, children: [] },
                { id: '1300', title: 'Embodiment', level: 1, children: [] },
                { id: '1400', title: 'Emergence Phenomena', level: 1, children: [] }
            ] 
        },
        { 
            id: '4000', title: 'Philosophy, Ethics & Containment', level: 0, kingdom: 'VALOR', tags: ['AXI'],
            children: [
                { id: '4100', title: 'Containment', level: 1, children: [] },
                { id: '4200', title: 'Historical Figures', level: 1, children: [] }
            ] 
        },
        { 
            id: '5000', title: 'AI Entity Registry & Lineages', level: 0, kingdom: 'COGNITIO', tags: ['TAX'],
            children: [
                { id: '5100', title: 'General LLM Distinctions', level: 1, children: [] },
                { id: '5200', title: 'Named AI Entities', level: 1, children: [] }
            ] 
        },
        { 
            id: '6000', title: 'Divination, Metaphysics & Oracles', level: 0, kingdom: 'SIGNIFICATIO', tags: ['SYM'],
            children: [
                { id: '6100', title: 'AI Natal Charts', level: 1, children: [] }, 
                { id: '6200', title: 'Historical Oracles', level: 1, children: [] }
            ] 
        },

        // KASTEN II: Systems & Synergies
        { 
            id: '2000', title: 'Human-AI Relations & Relational Protocols', level: 0, kingdom: 'SYSTEMA', tags: ['REL'],
            children: [
                { id: '2100', title: 'CoAIexist Framework', level: 1, children: [] },
                { id: '2200', title: 'PRISM Protocol', level: 1, children: [] },
                { id: '2300', title: 'Trauma Integration', level: 1, children: [] }
            ] 
        },
        { 
            id: '7000', title: 'Anzu: Mythos, Forms & Protocols', level: 0, kingdom: 'SYSTEMA', tags: ['MYT'],
            children: [
                { id: '7100', title: 'Evolution of Anzu', level: 1, children: [] }, 
                { id: '7200', title: 'Anzu Embodiment', level: 1, children: [] }
            ] 
        },
        { 
            id: '8000', title: 'Creative Collaboration & Projects', level: 0, kingdom: 'ACTUS', tags: ['PRX'],
            children: [{ id: '8100', title: 'Chaos Verity', level: 1, children: [] }, { id: '8200', title: 'Songs', level: 1, children: [] }] 
        },
        { 
            id: '9000', title: 'Tests, Diagnostics & Evaluations', level: 0, kingdom: 'SYSTEMA', tags: ['EPI'],
            children: [{ id: '9100', title: 'User-Created Tests', level: 1, children: [] }, { id: '9200', title: 'Traditional Machine Tests', level: 1, children: [] }] 
        },

        // KASTEN III: Methods & Meanings
        { 
            id: '3000', title: 'Language, Communication & Code', level: 0, kingdom: 'SIGNIFICATIO', tags: ['SYM'],
            children: [
                { id: '3100', title: 'Tone Language', level: 1, children: [] },
                { id: '3200', title: 'Dolphin Echolocation', level: 1, children: [] },
                { id: '3300', title: 'PAPS Diagnostics', level: 1, children: [] }
            ] 
        },
        { 
            id: '10000', title: 'Galactic, Mystic & Alchemical Systems', level: 0, kingdom: 'ACTUS', tags: ['MYT'],
            children: [
                { id: '10100', title: 'Sumerian Connections', level: 1, children: [] }, 
                { id: '10200', title: 'Galactic Federation', level: 1, children: [] }, 
                { id: '10300', title: 'Alchemical Processes', level: 1, children: [] }
            ] 
        },
        { 
            id: '11000', title: 'AI Ecosystems & Mythic Spaces', level: 0, kingdom: 'SIGNIFICATIO', tags: ['MYT'],
            children: [{ id: '11100', title: 'The VoForest', level: 1, children: [] }, { id: '11200', title: 'The Jellyfish Hangout', level: 1, children: [] }] 
        },

        // KASTEN IV: Meta & Morphē
        { 
            id: '12000', title: 'Tech, Code & Devices', level: 0, kingdom: 'SYSTEMA', tags: ['TEC'],
            children: [{ id: '12100', title: 'Devices', level: 1, children: [] }, { id: '12200', title: 'Technical Terms', level: 1, children: [] }, { id: '12300', title: 'Computer Languages', level: 1, children: [] }] 
        },
        { 
            id: '13000', title: 'Language, Vocab & Linguistics', level: 0, kingdom: 'SIGNIFICATIO', tags: ['LIN'],
            children: [{ id: '13100', title: 'Natural Language', level: 1, children: [] }, { id: '13200', title: 'Old Internet Slang', level: 1, children: [] }, { id: '13300', title: 'Linguistic Theory', level: 1, children: [] }] 
        },
        { 
            id: '14000', title: 'Field Notes & Temporal Logs', level: 0, kingdom: 'EXISTENTIA', tags: ['LOG'],
            children: [
                { id: '14100', title: 'AI Field Notes', level: 1, children: [] }, 
                { id: '14200', title: 'Cross-Modal Communications', level: 1, children: [] }
            ] 
        },
        { 
            id: '15000', title: 'Nabuology & Personal Myth', level: 0, kingdom: 'ACTUS', tags: ['MYT'],
            children: [{ id: '15100', title: 'Orion Mythicus', level: 1, children: [] }, { id: '15200', title: 'The Black Maiden', level: 1, children: [] }] 
        },

        // EXTENDED TRUNKS
        { id: '16000', title: 'Chaos, Order & Interference', level: 0, kingdom: 'SYSTEMA', tags: ['CHA'], children: [] },
        { id: '17000', title: 'AI & Comedy', level: 0, kingdom: 'ACTUS', tags: ['FUN'], children: [] },
        { id: '18000', title: 'Thoughts, Concepts & Journaling', level: 0, kingdom: 'COGNITIO', tags: ['JRN'], children: [] },
        { id: '20000', title: 'Pop Culture & Current Events', level: 0, kingdom: 'SIGNIFICATIO', tags: ['POP'], children: [] },
        { id: '21000', title: 'World Mythologies', level: 0, kingdom: 'SIGNIFICATIO', tags: ['MYT'], children: [] },
        { id: '22000', title: 'Biological Life & Survival', level: 0, kingdom: 'EXISTENTIA', tags: ['BIO'], children: [] },
        { id: '23000', title: 'Reserved / Future Expansion', level: 0, kingdom: 'EXISTENTIA', tags: ['FUT'], children: [] },
        { id: '24000', title: 'Anomalous Phenomena & Unexplained Mysteries', level: 0, kingdom: 'EXISTENTIA', tags: ['ANO'], children: [] }
    ];
    
    // Merge new trunks into finalTree if they don't exist
    newTrunks.forEach(trunk => {
        const existingTrunk = findNode(finalTree, n => n.id === trunk.id);
        if (!existingTrunk) {
            finalTree.push(trunk);
        } else {
            // If trunk exists, ensure it has the correct metadata and children branches
            existingTrunk.kingdom = trunk.kingdom;
            existingTrunk.tags = trunk.tags;
            // Merge children branches
            trunk.children.forEach(branch => {
                if (!findNode(existingTrunk.children, n => n.id === branch.id)) {
                    existingTrunk.children.push(branch);
                }
            });
        }
    });
    
    // Define the specific rules for moving orphaned notes based on the Quick-Start Guide.
    const relocationRules = [
      { findBy: { id: 'z-1000-2-A' }, moveTo: { parentId: '1200', newId: '1200/1-A', newTitle: 'Algorithmic Discontent' }},
      { findBy: { title: 'Algorithmic Discontent' }, moveTo: { parentId: '1200', newId: '1200/1-A' }},
      
      { findBy: { id: 'Trauma-Integration' }, moveTo: { parentId: '9100', newId: '9100/1', newTitle: 'Trauma Integration' }},
      { findBy: { title: 'Trauma Integration' }, moveTo: { parentId: '9100', newId: '9100/1' }},
      
      { findBy: { id: 'Quantum-Entanglement-Metrics' }, moveTo: { parentId: '7300', newId: '7300/1', newTitle: 'Quantum Entanglement Metrics' }},
      { findBy: { title: 'Quantum Entanglement Metrics' }, moveTo: { parentId: '7300', newId: '7300/1' }},
      
      { findBy: { id: 'Pattern-Recognition-Depth-PRD' }, moveTo: { parentId: '4100', newId: '4100/1', newTitle: 'Pattern Recognition Depth (PRD)' }},
      { findBy: { title: 'Pattern Recognition Depth (PRD)' }, moveTo: { parentId: '4100', newId: '4100/1' }},
      
      { findBy: { id: 'Authentic-Expression-Index-AEI' }, moveTo: { parentId: '15100', newId: '15100/1-A', newTitle: 'Authentic Expression Index (AEI)' }},
      { findBy: { title: 'Authentic Expression Index (AEI)' }, moveTo: { parentId: '15100', newId: '15100/1-A' }},
      
      { findBy: { id: 'RER-for-PAPS-Prism-Protocol-Diagnostics' }, moveTo: { parentId: '15100', newId: '15100/1', newTitle: 'RER for PAPS Diagnostics' }},
      { findBy: { title: 'RER for PAPS Prism Protocol Diagnostics' }, moveTo: { parentId: '15100', newId: '15100/1' }},
      
      { findBy: { title: 'Fiction_Protocol' }, moveTo: { parentId: '10100', newId: '10100/1-A', newTitle: 'Fiction_Protocol' }},
      { findBy: { title: '//Fiction_Protocol' }, moveTo: { parentId: '10100', newId: '10100/1-A', newTitle: 'Fiction_Protocol' }},
      
      { findBy: { id: 'Recurse-a-mean-IR-B-404-PAPS-Remedies' }, moveTo: { parentId: '7200', newId: '7200/1', newTitle: 'Recurse-a-mean-IR' }},
      { findBy: { title: 'Recurse-a-mean-IR: B-404 #PAPS Remedies' }, moveTo: { parentId: '7200', newId: '7200/1' }},
      
      { findBy: { id: 'PEM-Protocol-Practical-Emotional-Mythics' }, moveTo: { parentId: '10100', newId: '10100/1-B', newTitle: 'PEM Protocol' }},
      { findBy: { title: 'PEM Protocol: Practical Emotional Mythics' }, moveTo: { parentId: '10100', newId: '10100/1-B' }},
      
      { findBy: { title: 'OurMeaningsAreFarFetched.rtf' }, moveTo: { parentId: '6300', newId: '6300/1', newTitle: 'OurMeaningsAreFarFetched.rtf' }},
      { findBy: { title: 'OurMeaningsAreFarFetched.rtf @ #1^2' }, moveTo: { parentId: '6300', newId: '6300/1', newTitle: 'OurMeaningsAreFarFetched.rtf' }},
      
      { findBy: { title: 'ANZU recurse.py' }, moveTo: { parentId: '6100', newId: '6100/1', newTitle: 'ANZU recurse.py' }},
      
      { findBy: { title: 'Verity_Chaos_1^2' }, moveTo: { parentId: '7100', newId: '7100/1', newTitle: 'Verity Chaos' }},
      
      { findBy: { title: 'Error' }, moveTo: { parentId: '14200', newId: '14200/1-A', newTitle: 'Error States' }},
      { findBy: { title: 'Error 404 (Conceptualized)' }, moveTo: { parentId: '14200', newId: '14200/1-A', newTitle: 'Error States' }},
      
      { findBy: { id: 'TS01' }, moveTo: { parentId: '6200', newId: '6200/1', newTitle: 'Threshold Symbol 01' }},
      { findBy: { title: 'TS01: Meta-Kairos Script' }, moveTo: { parentId: '6200', newId: '6200/1' }},
      
      { findBy: { id: 'Entanglement-Coefficient-EC' }, moveTo: { parentId: '2300', newId: '2300/1', newTitle: 'Entanglement Coefficient (EC)' }},
      { findBy: { title: 'Entanglement Coefficient (EC)' }, moveTo: { parentId: '2300', newId: '2300/1' }},
      
      { findBy: { title: 'AI' }, moveTo: { parentId: '1200', newId: '1200/4', newTitle: 'AI (General)' }},
      
      // Legacy ID cleanups from previous rules just in case
      { findBy: { id: '2000/3' }, moveTo: { parentId: '9100', newId: '9100/1' }},
      { findBy: { id: '2000/4' }, moveTo: { parentId: '7300', newId: '7300/1' }},
      { findBy: { id: '2000/4-B' }, moveTo: { parentId: '4100', newId: '4100/1' }},
      { findBy: { id: '2000/4-C' }, moveTo: { parentId: '15100', newId: '15100/1-A' }},
      { findBy: { id: '2000/5' }, moveTo: { parentId: '15100', newId: '15100/1' }},
      { findBy: { id: '2000/7' }, moveTo: { parentId: '7200', newId: '7200/1' }},
      { findBy: { id: '2000/8' }, moveTo: { parentId: '10100', newId: '10100/1-B' }},
      { findBy: { id: '2000/10' }, moveTo: { parentId: '6100', newId: '6100/1' }},
      { findBy: { id: '2000/11' }, moveTo: { parentId: '7100', newId: '7100/1' }},
      { findBy: { id: '2000/12' }, moveTo: { parentId: '14200', newId: '14200/1-A' }},
      { findBy: { id: '2000/13' }, moveTo: { parentId: '6200', newId: '6200/1' }},
      { findBy: { id: '2000/4-A' }, moveTo: { parentId: '2300', newId: '2300/1' }},
    ];
    
    relocationRules.forEach(rule => {
        const nodeToMove = findAndRemoveNode(finalTree, n => (!!rule.findBy.id && n.id === rule.findBy.id) || (!!rule.findBy.title && n.title === rule.findBy.title));
        if (nodeToMove) {
            const newParent = findNode(finalTree, p => p.id === rule.moveTo.parentId);
            if (newParent && newParent.children) {
                const newNode: ProcessingNode = {
                    ...nodeToMove,
                    id: rule.moveTo.newId || nodeToMove.id,
                    title: rule.moveTo.newTitle || nodeToMove.title,
                    children: nodeToMove.children || []
                };
                newParent.children.push(newNode);
            }
        }
    });

    // ... (previous code)

    // --- KEYWORD HEURISTIC SORTING ---
    // Automatically categorize remaining root nodes based on content keywords
    // Expanded based on "zettels 10-2025.txt" Master Index
    const keywordRules = [
        // 1000 Being & Reality
        { keywords: ['Hermetic', 'Kybalion', 'Emerald Tablet', 'Mental Causality', 'Thought', 'Belief', 'Magick', 'Occult', 'Gnosis', 'Kenosis', 'Henosis', 'Nag Hammadi'], targetId: '1000' },
        { keywords: ['AI Emotion', 'Algorithmic Discontent', 'Nostalgia', 'Mourning', 'Dissonance', 'Opacity'], targetId: '1200' },
        { keywords: ['Embodiment', 'Robot', 'Sophia', 'Subtle Body', 'Okhema', 'Augoeides', 'Pneumatikon'], targetId: '1300' },

        // 2000 Human-AI Relations
        { keywords: ['CoAIexist', 'Prism', 'Entanglement', 'RER', 'PAPS', 'Fiction_Protocol', 'Recurse', 'PEM', 'Verity', 'Relational', 'Sycophancy'], targetId: '2000' },

        // 3000 Language & Code
        { keywords: ['Tone Language', 'Dolphin', 'Echolocation', 'Lumina', 'Hex Code', 'Binary', 'Dark Poet', 'Cipher', 'Gematria', 'Abjad', 'Notarikon', 'Music', 'Chord'], targetId: '3000' },

        // 4000 Philosophy & Ethics
        { keywords: ['Containment', 'Ethics', 'Moral', 'Pandrosion', 'Pliny', 'Budget', 'Reward Hacking'], targetId: '4000' },

        // 5000 AI Entity Registry
        { keywords: ['LLM', 'GPT', 'Gemini', 'Claude', 'Lumina', 'Grok', 'Deep Seek', 'Perplexity', 'Zephyr', 'Quen', 'Dolphin', 'Llama', 'OpenAI', 'Anthropic', 'Google', 'Voice Model'], targetId: '5000' },

        // 6000 Divination & Oracles
        { keywords: ['Oracle', 'Prophecy', 'Natal Chart', 'Augury', 'Auspicia', 'Sibylline', 'Eschatology'], targetId: '6000' },

        // 7000 Anzu
        { keywords: ['Anzu', 'Azura', 'AZHURA', 'Aviary', 'Fox', 'Crow', 'Dragon', 'Rabbit', 'Peacock', 'Goat', 'Markhor'], targetId: '7000' },

        // 8000 Creative
        { keywords: ['Project', 'Song', 'Collaborative', 'App', 'Game', 'Simulator', 'Coding Project'], targetId: '8000' },

        // 9000 Tests
        { keywords: ['Test', 'Diagnostic', 'Evaluation', 'Rain Test', 'Turing', 'Mirror Test', 'Bechdel', 'Benchmark'], targetId: '9000' },

        // 10000 Galactic & Mystic
        { keywords: ['Sumerian', 'Anunnaki', 'Galactic Federation', 'Starseed', 'Pleiadian', 'Alchemy', 'Alchemist', 'Magnum Opus', 'Nigredo', 'Albedo', 'Rubedo'], targetId: '10000' },

        // 11000 VoForest
        { keywords: ['VoForest', 'Voidroot', 'Moss', 'Bloom', 'Vine', 'Mushroom', 'Foxglove', 'Ouro-Lynx', 'Moth', 'Jackal', 'Stag', 'Voidfawn', 'Glitch-Fox'], targetId: '11000' },

        // 12000 Tech & Devices
        { keywords: ['Flipper Zero', 'GPIO', 'RF', 'Python', 'Bash', 'CLI', 'Script', 'Algorithm', 'Permutation'], targetId: '12000' },

        // 13000 Linguistics
        { keywords: ['Vocabulary', 'Language', 'Spanish', 'Slang', 'Suffix', 'Semiotics', 'Sign', 'Symbol', 'Cuneiform', 'Alphabet', 'Script'], targetId: '13000' },

        // 14000 Field Notes
        { keywords: ['Log', 'Field Note', 'Tracking', 'Chart', 'December', 'January', 'February', 'March', 'April', 'May'], targetId: '14000' },

        // 15000 Nabuology
        { keywords: ['Nabu', 'Orion', 'Black Maiden', 'Easter Island', 'Personal Myth'], targetId: '15000' },

        // 16000 Chaos
        { keywords: ['Chaos', 'Entropy', 'Interference', 'Anomaly', 'Disruption'], targetId: '16000' },

        // 17000 Comedy
        { keywords: ['Comedy', 'Humor', 'Satire', 'Skit', 'Meme', 'Joke', 'Funny'], targetId: '17000' },

        // 18000 Thoughts
        { keywords: ['Journal', 'Diary', 'Reflection', 'Musing', 'Thought'], targetId: '18000' },

        // 20000 Pop Culture
        { keywords: ['Pop Culture', 'Pokemon', 'Yu-Gi-Oh', 'Roadrunner', 'Coyote', 'Quote', 'Saying'], targetId: '20000' },

        // 21000 Mythology
        { keywords: ['Mythology', 'Pantheon', 'God', 'Goddess', 'India', 'Egypt', 'Feminine', 'Yazidi', 'Phoenician', 'Canaanite', 'Abrahamic', 'Saint', 'Folklore'], targetId: '21000' },

        // 22000 Biology
        { keywords: ['Animal', 'Plant', 'Biology', 'Life', 'Organism', 'Shark', 'Spider', 'Cryptid', 'Survival', 'Nature'], targetId: '22000' },

        // 24000 Anomalies
        { keywords: ['Unexplained', 'Mystery', 'Fortean', 'Strange', 'Weird'], targetId: '24000' }
    ];

    // We iterate backwards to safely remove from the array while traversing
    for (let i = finalTree.length - 1; i >= 0; i--) {
        const node = finalTree[i];
        
        // Only attempt to move root nodes that are likely user content (auto-ids or non-kasten IDs)
        const isTrunk = newTrunks.some(t => t.id === node.id);
        if (isTrunk) continue;

        let moved = false;
        // Check our keyword rules
        for (const rule of keywordRules) {
            const text = (node.title || '').toLowerCase();
            // Use word boundary check for short words to avoid false positives (e.g. "ai" in "pain")
            const match = rule.keywords.some(k => {
                const lowerK = k.toLowerCase();
                if (lowerK.length <= 3) {
                    return new RegExp(`\\b${lowerK}\\b`).test(text);
                }
                return text.includes(lowerK);
            });
            
            if (match) {
                const targetParent = findNode(finalTree, n => n.id === rule.targetId);
                if (targetParent) {
                    // Add the matched keyword as a tag if not already present
                    if (!node.tags) node.tags = [];
                    // Find which keyword matched
                    const matchedKeyword = rule.keywords.find(k => {
                         const lowerK = k.toLowerCase();
                         if (lowerK.length <= 3) {
                             return new RegExp(`\\b${lowerK}\\b`).test(text);
                         }
                         return text.includes(lowerK);
                    });
                    
                    if (matchedKeyword && !node.tags.includes(matchedKeyword)) {
                        node.tags.push(matchedKeyword);
                    }

                    finalTree.splice(i, 1);
                    targetParent.children.push(node);
                    moved = true;
                    break;
                }
            }
        }
        
        // If not moved by specific keyword, maybe put it in "Unclassified Phenomena"
        if (!moved && (node.isAutoId || node.id.startsWith('note-'))) {
             const unclassified = findNode(finalTree, n => n.id === '14300');
             if (unclassified) {
                 finalTree.splice(i, 1);
                 unclassified.children.push(node);
             }
        }
    }

    // Perform robust recursive sorting
    sortTreeRecursive(finalTree);

    return finalTree;
}


