# Analysis design

This is a public description of the design, not the private engine prompt or a verbatim source excerpt.

The analysis instructions request document-specific structural observations and an inventory of evidence-linked knowledge units before generation of learning material. They distinguish observed facts from interpretations, and ask for objectives, worked explanations, activities and assessments that use the same source. The implementation uses checks for source matching and quiz structure, not a proof of semantic correctness or learning effectiveness.

The full prompt, AI gateway, runtime configuration and production integration are intentionally not included.

See [knowledge units](../src/knowledge/knowledge-units.ts), [evidence verification](../src/evidence/verify-source.ts), and [assessment filtering](../src/assessment/filter-questions.ts).
