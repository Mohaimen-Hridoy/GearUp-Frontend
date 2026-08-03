"use client";

import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-28 text-center">
      <div className="tag-hole dashed-border flex h-16 w-16 items-center justify-center rounded-sm bg-paper-dim">
        <TriangleAlert className="h-7 w-7 text-rust" />
      </div>
      <h1 className="mt-6 font-display text-3xl text-ink">Something snagged</h1>
      <p className="mt-2 max-w-sm text-ink-soft">
        That didn&apos;t load right. It&apos;s usually temporary — try again.
      </p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
