"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { StatTile } from "@/components/ui/stat-tile";
import { StatusBadge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { gearApi, rentalApi } from "@/lib/api-service";

export default function ProviderOverviewPage() {
  const { data: myGear = [], isLoading: gearLoading } = useQuery({
    queryKey: ["provider-gear"],
    queryFn: () => gearApi.getProviderGear(),
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["provider-orders"],
    queryFn: () => rentalApi.getProviderOrders(),
  });

  const needsAttention = orders.filter((o) => o.status === "PLACED" || o.status === "CONFIRMED");
  const activeRentals = orders.filter((o) => ["PAID", "PICKED_UP"].includes(o.status));

  if (gearLoading || ordersLoading) {
    return (
      <div className="pb-10">
        <h1 className="font-display text-3xl text-ink">Provider overview</h1>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-sm bg-paper-dim" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <h1 className="font-display text-3xl text-ink">Provider overview</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Gear listed" value={myGear.length} accent="moss" />
        <StatTile label="Active rentals" value={activeRentals.length} accent="brass" />
        <StatTile label="Pending orders" value={needsAttention.length} />
      </div>

      <div className="mt-10">
        <h2 className="mb-3 font-display text-xl text-ink">Needs attention</h2>
        {needsAttention.length === 0 ? (
          <p className="text-sm text-ink-soft">Nothing waiting on you right now.</p>
        ) : (
          <div className="overflow-x-auto rounded-sm border border-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-paper-dim text-ink-soft">
                <tr>
                  <th className="px-4 py-3 font-medium">Gear</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {needsAttention.map((o) => (
                  <tr key={o.id} className="border-t border-line">
                    <td className="px-4 py-3 text-ink">{o.gear.title}</td>
                    <td className="px-4 py-3 text-ink-soft">{o.customerName}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href="/dashboard/provider/orders"
                        className={buttonVariants({ size: "sm", variant: "outline" })}
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
