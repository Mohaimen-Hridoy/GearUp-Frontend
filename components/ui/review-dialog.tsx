"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";

// TODO(API_INTEGRATION.md): POST /reviews { rentalOrderId, rating, comment }
// on submit.

export function ReviewDialog({
  open,
  gearTitle,
  onSubmit,
  onCancel,
}: {
  open: boolean;
  gearTitle?: string;
  onSubmit: (rating: number, comment: string) => void;
  onCancel: () => void;
}) {
  const [rating, setRating] = React.useState(0);
  const [hovered, setHovered] = React.useState(0);
  const [comment, setComment] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setRating(0);
      setHovered(0);
      setComment("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/60 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-dialog-title"
    >
      <div className="dashed-border w-full max-w-sm rounded-sm bg-paper p-6">
        <h2 id="review-dialog-title" className="font-display text-lg text-ink">
          Leave a review
        </h2>
        {gearTitle && <p className="mt-1 text-sm text-ink-soft">{gearTitle}</p>}

        <div className="mt-4 flex items-center gap-1" role="radiogroup" aria-label="Rating">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1;
            const filled = value <= (hovered || rating);
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
                className="p-0.5"
                onMouseEnter={() => setHovered(value)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(value)}
              >
                <Star
                  className={cn(
                    "h-6 w-6 transition-colors",
                    filled ? "fill-brass text-brass" : "text-line"
                  )}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <Textarea
            aria-label="Review comment"
            placeholder="How was the gear? Anything future renters should know…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={rating === 0}
            onClick={() => onSubmit(rating, comment)}
          >
            Submit review
          </Button>
        </div>
      </div>
    </div>
  );
}
