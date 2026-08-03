import * as React from "react";
import { PackageSearch } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon = PackageSearch,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-sm border border-dashed border-line bg-paper-dim/60 px-6 py-16 text-center",
        className
      )}
    >
      <div className="tag-hole dashed-border flex h-14 w-14 items-center justify-center rounded-sm bg-paper">
        <Icon className="h-6 w-6 text-ink-soft" />
      </div>
      <h3 className="font-display text-lg text-ink">{title}</h3>
      <p className="max-w-sm text-sm text-ink-soft">{description}</p>
      {action}
    </div>
  );
}
