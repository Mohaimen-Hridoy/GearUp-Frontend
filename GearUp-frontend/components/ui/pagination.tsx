"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        className="flex h-9 w-9 items-center justify-center rounded-sm border border-line text-ink-soft disabled:opacity-40"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-sm border font-tag text-sm",
            p === page
              ? "border-moss bg-moss text-ink"
              : "border-line text-ink-soft hover:bg-paper-dim"
          )}
        >
          {p}
        </button>
      ))}

      <button
        className="flex h-9 w-9 items-center justify-center rounded-sm border border-line text-ink-soft disabled:opacity-40"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
