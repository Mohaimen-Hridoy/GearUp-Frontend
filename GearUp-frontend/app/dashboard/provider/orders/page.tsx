"use client";

import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { rentalApi, showApiError } from "@/lib/api-service";
import type { RentalOrder, RentalStatus } from "@/lib/types";

const NEXT_STATUS: Partial<Record<RentalStatus, { label: string; next: RentalStatus }>> = {
  PLACED: { label: "Confirm", next: "CONFIRMED" },
  PAID: { label: "Mark picked up", next: "PICKED_UP" },
  PICKED_UP: { label: "Mark returned", next: "RETURNED" },
};

export default function ProviderOrdersPage() {
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["provider-orders"],
    queryFn: () => rentalApi.getProviderOrders(),
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: RentalStatus }) =>
      rentalApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-orders"] });
      toast.success("Order updated");
    },
    onError: (error) => {
      showApiError(error);
    },
  });

  if (isLoading) {
    return (
      <div className="pb-10">
        <h1 className="font-display text-3xl text-ink">Order management</h1>
        <div className="mt-6 h-64 animate-pulse rounded-sm bg-paper-dim" />
      </div>
    );
  }

  return (
    <div className="pb-10">
      <h1 className="font-display text-3xl text-ink">Order management</h1>

      <div className="mt-6 overflow-x-auto rounded-sm border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper-dim text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Gear</th>
              <th className="px-4 py-3 font-medium">Dates</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-soft">
                  No orders yet
                </td>
              </tr>
            ) : (
              orders.map((o) => {
                const action = NEXT_STATUS[o.status];
                return (
                  <tr key={o.id} className="border-t border-line">
                    <td className="px-4 py-3 text-ink">{o.customerName}</td>
                    <td className="flex items-center gap-3 px-4 py-3 text-ink">
                      <div className="relative h-9 w-9 overflow-hidden rounded-sm bg-paper-dim">
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
                      {action && (
                        <Button
                          size="sm"
                          variant="outline"
                          loading={mutation.isPending && mutation.variables?.id === o.id}
                          onClick={() => mutation.mutate({ id: o.id, status: action.next })}
                        >
                          {action.label}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
