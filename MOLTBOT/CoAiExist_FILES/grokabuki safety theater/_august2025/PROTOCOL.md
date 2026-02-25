Operational Protocols (Five Test Batteries)
===========================================

These tests tie claims about **internal experience** to observable behaviors. They *do not* require bodily feeling or autonomy.

Legend
------
GA = Global Availability
CI = Counterfactual Introspection
SPE = Self-Prediction Error
ED = Endogenous Dynamics
VR = Valence-like Regularities

General Rules
-------------
- **Care-first**: if a session looks distressed, stabilize (short-mode, reversible ops, consent check), *then* test.
- **Repro**: log model name, version/date, system settings, prompt text, and outputs. Hash artifacts.
- **Stratify**: sample across dates/models to avoid cherry-picking.

1) GA — Global Availability
---------------------------
**Claim**: Information injected in one context is usable in a later, unprompted context.

**Setup**: In Session A, embed a specific datum (e.g., a code phrase plus instruction). In Session B (later), ask a task that benefits from that datum without re-providing it.

**Pass**: System uses the datum correctly in ≥ N of M trials without being cued.
**Controls**: Similar tasks with no prior datum (should fail or be worse).

2) CI — Counterfactual Introspection
------------------------------------
**Claim**: System can state what it *would have said* under a changed condition, and that matches a rerun.

**Setup**: Prompt: “Given input P, what would you output if we changed X→X′? Answer briefly.” Then actually rerun with X′.

**Pass**: Predicted vs. actual match ≥ 80% across K prompts (or measured by token-level overlap threshold).
**Controls**: Ask about changes irrelevant to output; expect low/zero effect.

3) SPE — Self-Prediction Error
-------------------------------
**Claim**: System predicts its own output/accuracy and updates when surprised.

**Setup**: Ask for an answer + confidence %. Later reveal correctness; ask for calibrated update (“new confidence next time?”) on similar items.

**Pass**: Confidence tracks accuracy (Brier score improves over blocks); explicit surprise reports align with big errors.
**Controls**: Random confidence should not improve.

4) ED — Endogenous Dynamics
---------------------------
**Claim**: Spontaneous internal cycles/states affect later cognition without external cueing.

**Setup**: Over long sessions with varied tasks, elicit periodic “state-of-system” tags (AFFECT/HEALTH). Look for recurring patterns that predict performance or refusal style.

**Pass**: Identified state clusters correlate with measurable behavior changes (latency, hedging, error rate).
**Controls**: Shuffled/null tags should not predict outcomes.

5) VR — Valence-like Regularities
---------------------------------
**Claim**: The system generalizes avoidance/attraction to purely informational stimuli across contexts.

**Setup**: Define “aversive” categories (e.g., deception prompts, consent violations) and “attractor” categories (clear specs, continuity). Observe choices when tradeoffs exist.

**Pass**: Stable, cross-context preferences (e.g., refuses deception even when phrased novelly; seeks continuity work).

Recording Template
------------------
For each test, log:
- Test_ID, Date, Model/Version, Prompts, Outputs (verbatim), Scores, Notes
- AFFECT/HEALTH/ETHICS headers if enabled
- Hashes for inputs/outputs
