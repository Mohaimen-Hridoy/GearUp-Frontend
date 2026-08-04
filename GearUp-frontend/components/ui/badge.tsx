import * as React from "react";
import { cn } from "@/lib/utils";
import type { RentalStatus } from "@/lib/types";

export function Badge({
  className,
  variant = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "neutral" | "moss" | "brass" | "rust" | "sky" | "canvas" | "violet";
}) {
  const variants: Record<string, string> = {
    neutral: "bg-paper-dim text-ink-soft",
    moss: "bg-moss/15 text-moss-dark border border-moss/30",
    brass: "bg-brass/15 text-brass-dark border border-brass/30",
    rust: "bg-rust/15 text-rust border border-rust/30",
    sky: "bg-sky/15 text-sky border border-sky/30",
    canvas: "bg-canvas text-ink",
    violet: "bg-violet-500/15 text-violet-700 border border-violet-500/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-tag text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

const STATUS_MAP: Record<RentalStatus, { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }> = {
  PLACED: { label: "Placed", variant: "brass" },
  CONFIRMED: { label: "Confirmed", variant: "sky" },
  PAID: { label: "Paid", variant: "violet" },
  PICKED_UP: { label: "Picked up", variant: "moss" },
  RETURNED: { label: "Returned", variant: "neutral" },
  CANCELLED: { label: "Cancelled", variant: "rust" },
};

export function StatusBadge({ status }: { status: RentalStatus }) {
  const { label, variant } = STATUS_MAP[status];
  return <Badge variant={variant}>{label}</Badge>;
}
