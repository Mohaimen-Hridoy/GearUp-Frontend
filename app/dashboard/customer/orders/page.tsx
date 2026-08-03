"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { StatusBadge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ReviewDialog } from "@/components/ui/review-dialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import { rentalApi, reviewApi, showApiError } from "@/lib/api-service";
import type { RentalOrder } from "@/lib/types";

const TABS = ["All", "Active", "Completed", "Cancelled"];

export default function CustomerOrdersPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "All";
  const [reviewTarget, setReviewTarget] = React.useState<RentalOrder | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["customer-rentals"],
    queryFn: () => rentalApi.getCustomerRentals(),
  });

  const filteredOrders = React.useMemo(() => {
    switch (activeTab) {
      case "Active":
        return orders.filter(o => ["CONFIRMED", "PAID", "PICKED_UP"].includes(o.status));
      case "Completed":
        return orders.filter(o => o.status === "RETURNED");
      case "Cancelled":
        return orders.filter(o => o.status === "CANCELLED");
      default:
        return orders;
    }
  }, [orders, activeTab]);

  async function submitReview(rating: number, comment: string) {
    if (!reviewTarget) return;
    
    try {
      await reviewApi.createReview({
        gearItemId: reviewTarget.gear.id,
        rating,
        comment,
      });
      toast.success(`Thanks — you rated it ${rating} star${rating === 1 ? "" : "s"}.`);
      setReviewTarget(null);
    } catch (error) {
      showApiError(error);
    }
  }

  if (isLoading) {
    return (
      <div className="pb-10">
        <h1 className="font-display text-3xl text-ink">Order history</h1>
        <div className="mt-6 h-64 animate-pulse rounded-sm bg-paper-dim" />
      </div>
    );
  }

  return (
    <div className="pb-10">
      <h1 className="font-display text-3xl text-ink">Order history</h1>

      <div className="mt-6 flex gap-2 border-b border-line">
        {TABS.map((tab) => (
          <Link
            key={tab}
            href={`/dashboard/customer/orders?tab=${tab}`}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium ${
              activeTab === tab
                ? "border-moss text-moss-dark"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {tab}
          </Link>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="No orders yet"
          description="Once you rent gear, your orders will show up here."
        />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-sm border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper-dim text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-medium">Gear</th>
                <th className="px-4 py-3 font-medium">Dates</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.id} className="border-t border-line">
                  <td className="flex items-center gap-3 px-4 py-3 text-ink">
                    <div className="relative h-10 w-10 overflow-hidden rounded-sm bg-paper-dim">
                      <Image src={o.gear.imageUrl} alt="" fill className="object-cover" />
                    </div>
                    {o.gear.title}
                  </td>
                  <td className="px-4 py-3 font-tag text-ink-soft">
                    {formatDate(o.startDate)} – {formatDate(o.endDate)}
                  </td>
                  <td className="px-4 py-3 font-tag text-brass-dark">{formatCurrency(o.totalCents)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {o.status === "CONFIRMED" && (
                      <Link
                        href={`/dashboard/customer/orders/${o.id}/pay`}
                        className={buttonVariants({ size: "sm", variant: "outline" })}
                      >
                        Pay now
                      </Link>
                    )}
                    {o.status === "RETURNED" && (
                      <Button size="sm" variant="outline" onClick={() => setReviewTarget(o)}>
                        Leave review
                      </Button>
                    )}
                    {o.status !== "CONFIRMED" && o.status !== "RETURNED" && (
                      <Link
                        href={`/gear/${o.gear.id}`}
                        className={buttonVariants({ size: "sm", variant: "outline" })}
                      >
                        View
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ReviewDialog
        open={!!reviewTarget}
        gearTitle={reviewTarget?.gear.title}
        onSubmit={submitReview}
        onCancel={() => setReviewTarget(null)}
      />
    </div>
  );
}
