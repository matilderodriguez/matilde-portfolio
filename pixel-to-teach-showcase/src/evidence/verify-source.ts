// Pixel to Teach — selected source excerpt
// Original revision: b31a4b7060b6
// Original location: src/lib/analysis-schema.ts:194-196
// Documentation excerpt only; surrounding implementation omitted.

export function verifySource(doc: string, quote: string | null): VerifiedSource {
  return verifyIndexed([docTokens(doc, true), docTokens(doc, false)], quote, doc);
}
