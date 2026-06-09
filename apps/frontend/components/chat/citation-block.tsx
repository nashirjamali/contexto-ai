import type { Citation } from "@/lib/types";

export function CitationBlock({ citations }: { citations: Citation[] }) {
  if (!citations.length) return null;

  return (
    <div className="mt-3 space-y-2 border-l-2 border-bronze pl-3">
      {citations.map((c, i) => (
        <div key={i} className="rounded-sm bg-surface-raised/60 p-3">
          <p className="text-xs uppercase tracking-wider text-bronze">Citation</p>
          <p className="mt-1 text-sm leading-relaxed text-paper-muted">
            &ldquo;{c.content}&rdquo;
          </p>
          <p className="mt-1 font-mono text-xs text-paper-muted/60">
            chunk {c.chunkIndex} · score {(c.score * 100).toFixed(0)}%
          </p>
        </div>
      ))}
    </div>
  );
}
