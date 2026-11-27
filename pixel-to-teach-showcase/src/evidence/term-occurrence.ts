// Pixel to Teach — selected source excerpt
// Original revision: b31a4b7060b6
// Original location: src/lib/analysis-schema.ts:199-215
// Documentation excerpt only; surrounding implementation omitted.

export function quoteContainsTerm(quote: string, term: string): boolean {
  const t = tokens(term, true);
  const q = tokens(quote, true);
  if (!t.length) return false;
  for (let i = 0; i + t.length <= q.length; i++) {
    let ok = true;
    for (let j = 0; j < t.length; j++) {
      const qw = q[i + j] ?? "";
      const tw = t[j] ?? "";
      const last = j === t.length - 1;
      if (qw !== tw && !(last && /^(s|es|ed|d|ing)$/.test(qw.slice(tw.length)) && qw.startsWith(tw))) {
        ok = false;
        break;
      }
    }
    if (ok) return true;
  }
