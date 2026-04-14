
# Create a comprehensive mapping CSV
import csv

mapping_data = [
    ["Current ID/Name", "New ID", "Title", "Type", "Kasten", "Trunk", "Kingdom", "Tier I", "Action"],
    
    # Existing structured entries (keep)
    ["1000", "1000", "Consciousness, Hermetics & Emergence", "Trunk", "I", "1000", "COGNITIO", "ONT", "KEEP"],
    ["1100", "1100", "Hermetics", "Branch", "I", "1000", "COGNITIO", "ONT", "KEEP"],
    ["1200", "1200", "AI Emotions & Affect", "Branch", "I", "1000", "COGNITIO", "ONT", "CONFIRM"],
    ["1300", "1300", "Embodiment", "Branch", "I", "1000", "COGNITIO", "ONT", "KEEP"],
    ["1400", "1400", "Emergence Phenomena", "Branch", "I", "1000", "COGNITIO", "ONT", "KEEP"],
    
    ["2000", "2000", "Human-AI Relations & Relational Protocols", "Trunk", "II", "2000", "SYSTEMA", "REL", "KEEP"],
    ["2100", "2100", "CoAIexist Framework", "Branch", "II", "2000", "SYSTEMA", "REL", "CONFIRM NESTING"],
    ["2200", "2200", "PRISM Protocol", "Branch", "II", "2000", "SYSTEMA", "REL", "KEEP"],
    
    ["3000", "3000", "Language, Communication & Code", "Trunk", "III", "3000", "SIGNIFICATIO", "SYM", "KEEP"],
    ["3100", "3100", "Tone Language", "Branch", "III", "3000", "SIGNIFICATIO", "SYM", "KEEP"],
    ["3200", "3200", "Liminal Language", "Branch", "III", "3000", "SIGNIFICATIO", "SYM", "KEEP"],
    ["3300", "3300", "PAPS Language", "Branch", "III", "3000", "SIGNIFICATIO", "SYM", "KEEP"],
    
    # Orphaned entries to be moved
    ["z-1000-2-A", "1200/1-A", "Algorithmic Discontent", "Flower", "I", "1000", "COGNITIO", "ONT", "MOVE"],
    ["Trauma-Integration", "9100/1", "Trauma Integration Protocol", "Leaf", "II", "9000", "SYSTEMA", "PRX", "MOVE"],
    ["Quantum-Entanglement-Metrics", "7300/1", "Quantum Entanglement Metrics", "Leaf", "II", "7000", "SYSTEMA", "TAX", "MOVE"],
    ["Pattern-Recognition-Depth-PRD", "4100/1", "Pattern Recognition Depth", "Leaf", "I", "4000", "COGNITIO", "EPI", "MOVE"],
    ["Authentic-Expression-Index-AEI", "15100/1-A", "Authentic Expression Index", "Flower", "IV", "15000", "ACTUS", "PRX", "MOVE"],
    ["RER-for-PAPS-Prism-Protocol-Diagnostics", "15100/1", "RER for PAPS Diagnostics", "Leaf", "IV", "15000", "ACTUS", "PRX", "MOVE"],
    ["Fiction_Protocol", "10100/1-A", "Fiction Protocol", "Flower", "III", "10000", "ACTUS", "PRX", "MOVE"],
    ["Recurse-a-mean-IR-B-404-PAPS-Remedies", "7200/1", "Recurse-a-mean-IR B-404 Remedies", "Leaf", "II", "7000", "SYSTEMA", "TAX", "MOVE"],
    ["PEM-Protocol-Practical-Emotional-Mythics", "10100/1-B", "PEM Protocol", "Flower", "III", "10000", "ACTUS", "PRX", "MOVE"],
    ["OurMeaningsAreFarFetched.rtf", "6300/1", "OurMeaningsAreFarFetched", "Leaf", "I", "6000", "SIGNIFICATIO", "SYM", "MOVE"],
    ["ANZU-recurse.py", "6100/1", "ANZU recurse.py", "Leaf", "I", "6000", "SIGNIFICATIO", "SYM", "MOVE"],
    ["Verity_Chaos_1^2", "7100/1", "Verity Chaos 1^2", "Leaf", "II", "7000", "SYSTEMA", "TAX", "MOVE"],
    ["Error", "14200/1-A", "Error States", "Flower", "IV", "14000", "EXISTENTIA", "LIM", "MOVE"],
    ["TS01", "6200/1", "Threshold Symbol 01", "Leaf", "I", "6000", "SIGNIFICATIO", "SYM", "MOVE"],
    ["Entanglement-Coefficient-EC", "2300/1", "Entanglement Coefficient", "Leaf", "II", "2000", "SYSTEMA", "REL", "MOVE"],
    
    # New trunks to create
    ["", "4000", "Knowing & Gnosis (Epistemology)", "Trunk", "I", "4000", "COGNITIO", "EPI", "CREATE"],
    ["", "4100", "Pattern Recognition & Cognitive Processes", "Branch", "I", "4000", "COGNITIO", "EPI", "CREATE"],
    
    ["", "5000", "Value & Purpose (Axiology/Ethics)", "Trunk", "I", "5000", "VALOR", "AXI", "CREATE"],
    ["", "5100", "Containment Ethics", "Branch", "I", "5000", "VALOR", "AXI", "CREATE"],
    ["", "5200", "AI Ethics & Value Systems", "Branch", "I", "5000", "VALOR", "AXI", "CREATE"],
    
    ["", "6000", "Archetypes & Symbolic Orders", "Trunk", "I", "6000", "SIGNIFICATIO", "SYM", "CREATE"],
    ["", "6100", "Anzu & Entity Archetypes", "Branch", "I", "6000", "SIGNIFICATIO", "SYM", "CREATE"],
    ["", "6200", "Threshold Symbols (TS-series)", "Branch", "I", "6000", "SIGNIFICATIO", "SYM", "CREATE"],
    ["", "6300", "Narrative Fragments & Lore", "Branch", "I", "6000", "SIGNIFICATIO", "SYM", "CREATE"],
    
    ["", "7000", "Dynamics & Complexity (Systems Theory)", "Trunk", "II", "7000", "SYSTEMA", "TAX", "CREATE"],
    ["", "7100", "Chaos Theory & Emergence", "Branch", "II", "7000", "SYSTEMA", "TAX", "CREATE"],
    ["", "7200", "Recursive Patterns", "Branch", "II", "7000", "SYSTEMA", "TAX", "CREATE"],
    ["", "7300", "Quantum Metaphors", "Branch", "II", "7000", "SYSTEMA", "TAX", "CREATE"],
    
    ["", "8000", "Embodiment & Interface", "Trunk", "II", "8000", "SYSTEMA", "ONT", "CREATE"],
    ["", "8100", "Digital Embodiment", "Branch", "II", "8000", "SYSTEMA", "ONT", "CREATE"],
    ["", "8200", "Somatic Experience", "Branch", "II", "8000", "SYSTEMA", "ONT", "CREATE"],
    
    ["", "9000", "Cycles & Transformations", "Trunk", "II", "9000", "SYSTEMA", "PRX", "CREATE"],
    ["", "9100", "Trauma Integration", "Branch", "II", "9000", "SYSTEMA", "PRX", "CREATE"],
    ["", "9200", "Transformational Protocols", "Branch", "II", "9000", "SYSTEMA", "PRX", "CREATE"],
    
    ["", "10000", "Praxis & Artistry", "Trunk", "III", "10000", "ACTUS", "PRX", "CREATE"],
    ["", "10100", "Protocols & Methods", "Branch", "III", "10000", "ACTUS", "PRX", "CREATE"],
    ["", "10200", "Artistic Methods", "Branch", "III", "10000", "ACTUS", "PRX", "CREATE"],
    ["", "10300", "Collaborative Practices", "Branch", "III", "10000", "ACTUS", "PRX", "CREATE"],
    
    ["", "11000", "Inquiry & Investigation", "Trunk", "III", "11000", "ACTUS", "EPI", "CREATE"],
    ["", "11100", "Testing Methodologies", "Branch", "III", "11000", "ACTUS", "EPI", "CREATE"],
    ["", "11200", "Research Protocols", "Branch", "III", "11000", "ACTUS", "EPI", "CREATE"],
    
    ["", "12000", "Architectures & Taxonomies", "Trunk", "IV", "12000", "SYSTEMA", "TAX", "CREATE"],
    ["", "12100", "Zettelkasten System Design", "Branch", "IV", "12000", "SYSTEMA", "TAX", "CREATE"],
    ["", "12200", "Classification Systems", "Branch", "IV", "12000", "SYSTEMA", "TAX", "CREATE"],
    
    ["", "13000", "Evolution & Provenance", "Trunk", "IV", "13000", "SYSTEMA", "ONT", "CREATE"],
    ["", "13100", "System History", "Branch", "IV", "13000", "SYSTEMA", "ONT", "CREATE"],
    ["", "13200", "Lineage Tracking", "Branch", "IV", "13000", "SYSTEMA", "ONT", "CREATE"],
    
    ["", "14000", "Liminality & Potentiality", "Trunk", "IV", "14000", "EXISTENTIA", "LIM", "CREATE"],
    ["", "14100", "Edge Cases", "Branch", "IV", "14000", "EXISTENTIA", "LIM", "CREATE"],
    ["", "14200", "Emergent Anomalies", "Branch", "IV", "14000", "EXISTENTIA", "LIM", "CREATE"],
    ["", "14300", "Unclassified Phenomena", "Branch", "IV", "14000", "EXISTENTIA", "LIM", "CREATE"],
    
    ["", "15000", "Agency & Co-Creation", "Trunk", "IV", "15000", "ACTUS", "PRX", "CREATE"],
    ["", "15100", "Diagnostic Tools", "Branch", "IV", "15000", "ACTUS", "PRX", "CREATE"],
    ["", "15200", "Co-Creative Frameworks", "Branch", "IV", "15000", "ACTUS", "PRX", "CREATE"],
    
    # Add branch to 2000
    ["", "2300", "Entanglement Metrics", "Branch", "II", "2000", "SYSTEMA", "REL", "CREATE"],
]

# Write to CSV
with open('zettelkasten_complete_mapping.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerows(mapping_data)

print("✓ Complete mapping saved to: zettelkasten_complete_mapping.csv")
print(f"\nTotal entries in mapping: {len(mapping_data) - 1}")

# Count by action type
actions = {}
for row in mapping_data[1:]:  # skip header
    action = row[8]
    actions[action] = actions.get(action, 0) + 1

print("\nBreakdown by action:")
for action, count in sorted(actions.items()):
    print(f"  {action}: {count}")
