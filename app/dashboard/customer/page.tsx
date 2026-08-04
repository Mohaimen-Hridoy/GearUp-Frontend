"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { StatTile } from "@/components/ui/stat-tile";
import { StatusBadge, Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { rentalApi, paymentApi } from "@/lib/api-service";

export default function CustomerOverviewPage() {
  const { data: rentals = [], isLoading } = useQuery({
    queryKey: ["customer-rentals"],
    queryFn: () => rentalApi.getCustomerRentals(),
  });

  const { data: payments = [] } = useQuery({
    queryKey: ["customer-payments"],
    queryFn: () => paymentApi.getPayments(),
  });

  const recent = rentals.slice(0, 5);
  
  // Calculate stats
  const activeRentals = rentals.filter(r => 
    r.status === "CONFIRMED" || r.status === "PAID" || r.status === "PICKED_UP"
  ).length;
  
  const totalSpent = rentals
    .filter(r => r.status === "RETURNED" || r.status === "PAID")
    .reduce((sum, r) => sum + r.totalCents, 0);
    
  const pendingPayments = rentals.filter(r => r.status === "CONFIRMED").length;

  if (isLoading) {
    return (
      <div className="pb-10">
        <h1 className="font-display text-3xl text-ink">Your overview</h1>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-sm bg-paper-dim" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10 space-y-10">
      <div>
        <h1 className="font-display text-3xl text-ink">Your overview</h1>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatTile label="Active rentals" value={activeRentals} accent="moss" />
          <StatTile label="Total spent" value={formatCurrency(totalSpent)} accent="brass" />
          <StatTile label="Pending payments" value={pendingPayments} />
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl text-ink">Recent orders</h2>
          <Link href="/dashboard/customer/orders" className="text-sm font-medium text-moss-dark hover:text-moss">
            View all
          </Link>
        </div>

        <div className="overflow-x-auto rounded-sm border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper-dim text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-medium">Gear</th>
                <th className="px-4 py-3 font-medium">Dates</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-ink-soft">
                    No orders yet
                  </td>
                </tr>
              ) : (
                recent.map((o) => (
                  <tr key={o.id} className="border-t border-line">
                    <td className="px-4 py-3 text-ink">{o.gear.title}</td>
                    <td className="px-4 py-3 font-tag text-ink-soft">
                      {formatDate(o.startDate)} – {formatDate(o.endDate)}
                    </td>
                    <td className="px-4 py-3 font-tag text-brass-dark">{formatCurrency(o.totalCents)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-display text-xl text-ink">Payment history</h2>
        <div className="overflow-x-auto rounded-sm border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper-dim text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-medium">Gear</th>
                <th className="px-4 py-3 font-medium">Transaction ID</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ink-soft">
                    No payments recorded yet
                  </td>
                </tr>
              ) : (
                payments.slice(0, 5).map((p: any) => (
                  <tr key={p.id} className="border-t border-line">
                    <td className="px-4 py-3 text-ink">
                      {p.rentalOrder?.gearItem?.title ?? "Gear item"}
                    </td>
                    <td className="px-4 py-3 font-tag text-ink-soft">{p.transactionId}</td>
                    <td className="px-4 py-3 font-tag text-brass-dark">
                      {formatCurrency(Math.round(Number(p.amount) * 100))}
                    </td>
                    <td className="px-4 py-3 font-tag text-ink-soft">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={p.status === "COMPLETED" ? "moss" : p.status === "PENDING" ? "brass" : "rust"}>
                        {p.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
