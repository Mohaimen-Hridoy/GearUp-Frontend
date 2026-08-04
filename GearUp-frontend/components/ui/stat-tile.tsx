import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: "moss" | "brass" | "rust";
}) {
  return (
    <Card className="relative overflow-hidden transition-shadow hover:shadow-md">
      <span
        className={cn(
          "absolute inset-x-0 top-0 h-0.5",
          accent === "moss" && "bg-moss",
          accent === "brass" && "bg-brass",
          accent === "rust" && "bg-rust",
          !accent && "bg-line"
        )}
      />
      <p className="font-tag text-xs uppercase tracking-wider text-ink-soft">{label}</p>
      <p
        className={cn(
          "mt-2 font-display text-3xl",
          accent === "moss" && "text-moss-dark",
          accent === "brass" && "text-brass-dark",
          accent === "rust" && "text-rust",
          !accent && "text-ink"
        )}
      >
        {value}
      </p>
    </Card>
  );
}
