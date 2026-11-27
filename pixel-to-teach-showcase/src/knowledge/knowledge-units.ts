// Pixel to Teach — selected source excerpt
// Original revision: b31a4b7060b6
// Original location: src/lib/analysis-schema.ts:69-72
// Documentation excerpt only; surrounding implementation omitted.

export const generationSchema = analysisSchema.extend({
  knowledge_units: z.array(z.object({ id:z.string(), pattern:z.string(), interpretation:z.string(), evidence_ids:z.array(z.string()) })),
  summary: z.array(analysisSchema.shape.summary.element.extend({source:evidenceSource})),
  glossary: z.array(analysisSchema.shape.glossary.element.extend({source:evidenceSource})),
