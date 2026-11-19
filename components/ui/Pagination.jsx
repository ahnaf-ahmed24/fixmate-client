"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";


export default function Pagination({ page = 1, totalPages = 1, total = 0, onPage, busy = false }) {
  if (totalPages <= 1) return null;

  const nums = pagesToShow(page, totalPages);

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 mt-8" aria-label="Pagination">
      <button
        className="btn btn-sm btn-outline rounded-lg"
        disabled={page <= 1 || busy}
        onClick={() => onPage(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" /> Prev
      </button>

      {nums.map((n, i) =>
        n === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-base-content/40">
            …
          </span>
        ) : (
          <button
            key={n}
            onClick={() => onPage(n)}
            disabled={busy || n === page}
            aria-current={n === page ? "page" : undefined}
            className={`btn btn-sm rounded-lg min-w-9 ${n === page ? "btn-primary" : "btn-ghost"}`}
          >
            {n}
          </button>
        )
      )}

      <button
        className="btn btn-sm btn-outline rounded-lg"
        disabled={page >= totalPages || busy}
        onClick={() => onPage(page + 1)}
        aria-label="Next page"
      >
        Next <ChevronRight className="w-4 h-4" />
      </button>

      <span className="text-xs text-base-content/50 ml-2 w-full sm:w-auto text-center">
        Page {page} of {totalPages} · {total} result{total === 1 ? "" : "s"}
      </span>
    </nav>
  );
}


function pagesToShow(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out = new Set([1, 2, page - 1, page, page + 1, total - 1, total]);
  const list = [...out].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const withGaps = [];
  let prev = 0;
  for (const n of list) {
    if (n - prev > 1) withGaps.push("…");
    withGaps.push(n);
    prev = n;
  }
  return withGaps;
}
