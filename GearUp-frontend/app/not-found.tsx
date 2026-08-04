import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-28 text-center">
      <div className="tag-hole dashed-border flex h-16 w-16 items-center justify-center rounded-sm bg-paper-dim">
        <Compass className="h-7 w-7 text-ink-soft" />
      </div>
      <h1 className="mt-6 font-display text-3xl text-ink">Off the trail</h1>
      <p className="mt-2 max-w-sm text-ink-soft">
        This page doesn&apos;t exist — the link may be old, or the gear may
        have been unlisted.
      </p>
      <Link href="/" className={buttonVariants({ className: "mt-6" })}>
        Back to base camp
      </Link>
    </div>
  );
}
