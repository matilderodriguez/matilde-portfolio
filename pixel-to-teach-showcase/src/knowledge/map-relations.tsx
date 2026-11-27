// Pixel to Teach — selected source excerpt
// Original revision: b31a4b7060b6
// Original location: src/components/KnowledgeMap.tsx:71-76
// Documentation excerpt only; surrounding implementation omitted.

          {a.relations.map((r, i) => {
            const p = pos.get(r.from), q = pos.get(r.to);
            if (!p || !q) return null;
            const dx = q.x - p.x, dy = q.y - p.y, len = Math.hypot(dx, dy) || 1;
            const ex = q.x - (dx / len) * 46, ey = q.y - (dy / len) * 22;
            return (
