
# Create a comprehensive organizational plan based on the guide's framework
# Using the 4 Kastens framework and mapping existing content

kasten_framework = {
    "KASTEN I: Foundations & Essences": {
        "1. Being & Reality (Ontology/Metaphysics)": {
            "existing_trunks": ["1000 - Consciousness, Hermetics & Emergence"],
            "needs_placement": ["Quantum-Entanglement-Metrics", "Error"],
            "new_ids_suggested": "1000-1999 range"
        },
        "2. Knowing & Gnosis (Epistemology)": {
            "existing_trunks": [],
            "needs_placement": ["Pattern-Recognition-Depth-PRD"],
            "new_ids_suggested": "Create 4000 trunk for Epistemology"
        },
        "3. Value & Purpose (Axiology/Ethics)": {
            "existing_trunks": [],
            "needs_placement": [],
            "new_ids_suggested": "Create 5000 trunk for Ethics/Axiology"
        },
        "4. Archetypes & Symbolic Orders": {
            "existing_trunks": [],
            "needs_placement": ["ANZU", "TS01", "OurMeaningsAreFarFetched.rtf"],
            "new_ids_suggested": "Create 6000 trunk for Mythology/Symbols"
        }
    },
    "KASTEN II: Systems & Synergies": {
        "1. Dynamics & Complexity": {
            "existing_trunks": [],
            "needs_placement": ["Verity_Chaos_1^2", "Recurse-a-mean-IR"],
            "new_ids_suggested": "Create 7000 trunk for Systems Theory"
        },
        "2. Ecologies & Relations": {
            "existing_trunks": ["2000 - Human-AI Relations"],
            "needs_placement": ["CoAI Exist", "Entanglement-Coefficient-EC"],
            "new_ids_suggested": "2000-2999 range"
        },
        "3. Embodiment & Interface": {
            "existing_trunks": ["1300 - under Consciousness"],
            "needs_placement": ["AI Emotions"],
            "new_ids_suggested": "Keep under 1000 or move to new 8000"
        },
        "4. Cycles & Transformations": {
            "existing_trunks": [],
            "needs_placement": ["Trauma-Integration"],
            "new_ids_suggested": "Create 9000 trunk"
        }
    },
    "KASTEN III: Methods & Meanings": {
        "1. Praxis & Artistry": {
            "existing_trunks": [],
            "needs_placement": ["PEM-Protocol", "Fiction_Protocol"],
            "new_ids_suggested": "Create 10000 trunk for Praxis"
        },
        "2. Interpretation & Sense-Making": {
            "existing_trunks": ["3000 - Language & Communication"],
            "needs_placement": [],
            "new_ids_suggested": "3000-3999 range"
        },
        "3. Inquiry & Investigation": {
            "existing_trunks": [],
            "needs_placement": [],
            "new_ids_suggested": "Create 11000 trunk"
        },
        "4. Communication & Transmission": {
            "existing_trunks": ["3000 - Language & Communication"],
            "needs_placement": [],
            "new_ids_suggested": "3000-3999 range"
        }
    },
    "KASTEN IV: Meta & Morphē": {
        "1. Architectures & Taxonomies": {
            "existing_trunks": [],
            "needs_placement": [],
            "new_ids_suggested": "Create 12000 trunk for Meta-structure"
        },
        "2. Evolution & Provenance": {
            "existing_trunks": [],
            "needs_placement": [],
            "new_ids_suggested": "Create 13000 trunk"
        },
        "3. Liminality & Potentiality": {
            "existing_trunks": [],
            "needs_placement": ["z-1000-2-A"],
            "new_ids_suggested": "Create 14000 trunk for Liminal/Edge"
        },
        "4. Agency & Co-Creation": {
            "existing_trunks": [],
            "needs_placement": ["RER-for-PAPS", "Authentic-Expression-Index"],
            "new_ids_suggested": "Create 15000 trunk"
        }
    }
}

# Create a summary report
print("=" * 80)
print("ZETTELKASTEN REORGANIZATION PLAN".center(80))
print("=" * 80)
print("\n")

for kasten_name, branches in kasten_framework.items():
    print(f"\n{'='*80}")
    print(f"{kasten_name}")
    print(f"{'='*80}")
    
    for branch_name, details in branches.items():
        print(f"\n  {branch_name}")
        print(f"  {'-'*76}")
        
        if details['existing_trunks']:
            print(f"  ✓ EXISTING: {', '.join(details['existing_trunks'])}")
        
        if details['needs_placement']:
            print(f"  ⚠ NEEDS PLACEMENT: {', '.join(details['needs_placement'])}")
        
        print(f"  💡 SUGGESTION: {details['new_ids_suggested']}")

print("\n" + "=" * 80)
print("SUMMARY")
print("=" * 80)
