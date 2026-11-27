// Pixel to Teach — selected source excerpt
// Original revision: b31a4b7060b6
// Original location: src/routes/index.tsx:343-349
// Documentation excerpt only; surrounding implementation omitted.

                {ALL_SECTIONS.map((k) => <TabsTrigger key={k} value={k}>{LABELS[k]}</TabsTrigger>)}
              </TabsList>
              {ALL_SECTIONS.map((k) => (
                <TabsContent key={k} value={k} className="mt-4 rounded border border-border bg-card p-4 sm:p-6">
                  <div className="mb-4 flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => copy(sectionMarkdown(result, k))}>copy</Button>
                    <Button variant="ghost" size="sm" onClick={() => download(`${k}.md`, sectionMarkdown(result, k))}>download</Button>
