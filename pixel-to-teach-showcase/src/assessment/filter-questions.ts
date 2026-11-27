// Pixel to Teach — selected source excerpt
// Original revision: b31a4b7060b6
// Original location: src/lib/analysis-schema.ts:239-241
// Documentation excerpt only; surrounding implementation omitted.

  const structured = raw.quiz.filter(isStructurallyValidQuiz);
  const verified = structured.map(v).filter(q => q.source.verified);
  const quiz = verified.slice(0, 5);
