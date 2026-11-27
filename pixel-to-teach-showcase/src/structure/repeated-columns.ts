// Pixel to Teach — selected source excerpt
// Original revision: b31a4b7060b6
// Original location: src/lib/structural-engine.ts:12-16
// Documentation excerpt only; surrounding implementation omitted.

  let run: Block[] = [];
  function flush() {
    if (run.length >= 2) patterns.push({kind:"repeated-columns", members:run.map(b=>b.id), columns:run[0]!.atoms.filter(a=>a.kind==="cell").length, status:"candidate"});
    run = [];
  }
