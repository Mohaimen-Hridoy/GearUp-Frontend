import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-sm border border-line bg-paper p-5 shadow-card",
        className
      )}
      {...props}
    />
  );
}

/**
 * TagCard — the signature "equipment tag" motif: a punched rope-hole in the
 * top-left corner + a dashed, stitched-edge border. Use for gear cards and
 * other key content cards (never for plain utility surfaces like inputs).
 */
export function TagCard({
  className,
  dark,
  interactive,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { dark?: boolean; interactive?: boolean }) {
  return (
    <div
      className={cn(
        "tag-hole rounded-sm p-5 pl-6",
        dark
          ? "tag-hole-dark dashed-border-canvas bg-canvas-light text-ink"
          : "dashed-border bg-paper text-ink",
        interactive && "transition-shadow duration-150 hover:shadow-md",
        className
      )}
      {...props}
    />
  );
}
