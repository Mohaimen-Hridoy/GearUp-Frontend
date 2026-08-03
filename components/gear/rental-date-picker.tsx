"use client";

import * as React from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { differenceInCalendarDays, eachDayOfInterval, formatISO } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/lib/auth-store";
import { gearApi, rentalApi, showApiError } from "@/lib/api-service";

export function RentalDatePicker({ gearId, pricePerDay }: { gearId: string; pricePerDay: number }) {
  const [range, setRange] = React.useState<DateRange | undefined>();
  const [submitting, setSubmitting] = React.useState(false);
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: booked } = useQuery({
    queryKey: ["gear-booked-dates", gearId],
    queryFn: () => gearApi.getBookedDates(gearId),
  });

  // A calendar day is fully booked once as many active orders overlap it as
  // there are units in stock — mirrors the backend's overlap-count check in
  // rental.controller.ts, so the picker and the server never disagree.
  const fullyBookedDays = React.useMemo(() => {
    if (!booked) return new Set<string>();
    const counts = new Map<string, number>();
    for (const range of booked.bookedRanges) {
      const start = new Date(range.startDate);
      // Ranges are stored as [startDate, endDate) — the end date itself is
      // checkout day, not an occupied night, so we stop one day before it.
      const end = new Date(range.endDate);
      end.setDate(end.getDate() - 1);
      if (end < start) continue;
      for (const day of eachDayOfInterval({ start, end })) {
        const key = formatISO(day, { representation: "date" });
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
    const full = new Set<string>();
    counts.forEach((count, key) => {
      if (count >= booked.stock) full.add(key);
    });
    return full;
  }, [booked]);

  const days =
    range?.from && range?.to ? Math.max(1, differenceInCalendarDays(range.to, range.from)) : 0;
  const total = days * pricePerDay;

  async function handleRentNow() {
    if (!range?.from || !range?.to) {
      toast.error("Pick a start and end date first.");
      return;
    }
    if (!user) {
      router.push(`/auth/login?next=/gear/${gearId}`);
      return;
    }
    if (user.role !== "CUSTOMER") {
      toast.error("Only customer accounts can rent gear.");
      return;
    }
    setSubmitting(true);
    
    try {
      const rental = await rentalApi.createRental({
        gearId,
        startDate: range.from.toISOString(),
        endDate: range.to.toISOString(),
      });
      toast.success("Rental created successfully");
      router.push(`/dashboard/customer/orders/${rental.id}/pay`);
    } catch (error) {
      showApiError(error);
      setSubmitting(false);
    }
  }

  return (
    <div className="dashed-border rounded-sm bg-paper p-5">
      <h3 className="font-display text-lg text-ink">Rent this gear</h3>

      <div className="mt-4">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          disabled={[
            { before: new Date() },
            (day) => fullyBookedDays.has(formatISO(day, { representation: "date" })),
          ]}
          className="gearup-calendar"
        />
      </div>

      {fullyBookedDays.size > 0 && (
        <p className="mt-2 text-xs text-ink-soft">
          Greyed-out dates are already fully booked by other renters.
        </p>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
        <span className="text-sm text-ink-soft">
          {days > 0 ? `${days} day${days === 1 ? "" : "s"}` : "Select dates"}
        </span>
        <span className="font-tag text-lg text-brass-dark">{formatCurrency(total)}</span>
      </div>

      <Button className="mt-4 w-full" size="lg" loading={submitting} onClick={handleRentNow}>
        Rent now
      </Button>
    </div>
  );
}
