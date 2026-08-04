"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatDate } from "@/lib/utils";
import { adminApi } from "@/lib/api-service";

export default function AdminRentalsPage() {
  const { data: rentals = [], isLoading, error } = useQuery({
    queryKey: ["admin-rentals"],
    queryFn: () => adminApi.getAllRentals(),
  });

  if (isLoading) {
    return (
      <div className="pb-10">
        <h1 className="font-display text-3xl text-ink">All rentals</h1>
        <div className="mt-6 h-64 animate-pulse rounded-sm bg-paper-dim" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pb-10">
        <h1 className="font-display text-3xl text-ink">All rentals</h1>
        <EmptyState
          title="Failed to load rentals"
          description="There was an error loading platform rentals. Please try again later."
        />
      </div>
    );
  }

  return (
    <div className="pb-10">
      <h1 className="font-display text-3xl text-ink">All rentals</h1>

      {rentals.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No rentals yet" description="Once customers place orders, they'll show up here." />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-sm border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper-dim text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-medium">Gear</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Dates</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((o) => (
                <tr key={o.id} className="border-t border-line">
                  <td className="flex items-center gap-3 px-4 py-3 text-ink">
                    <div className="relative h-9 w-9 overflow-hidden rounded-sm bg-paper-dim">
                      <Image src={o.gear.imageUrl} alt="" fill className="object-cover" />
                    </div>
                    {o.gear.title}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{o.customerName}</td>
                  <td className="px-4 py-3 font-tag text-ink-soft">
                    {formatDate(o.startDate)} – {formatDate(o.endDate)}
                  </td>
                  <td className="px-4 py-3 font-tag text-brass-dark">{formatCurrency(o.totalCents)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
