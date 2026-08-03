"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/utils";
import { adminApi } from "@/lib/api-service";

export default function AdminGearPage() {
  const { data: gear = [], isLoading, error } = useQuery({
    queryKey: ["admin-gear"],
    queryFn: () => adminApi.getAllGear(),
  });

  if (isLoading) {
    return (
      <div className="pb-10">
        <h1 className="font-display text-3xl text-ink">Gear (all providers)</h1>
        <div className="mt-6 h-64 animate-pulse rounded-sm bg-paper-dim" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pb-10">
        <h1 className="font-display text-3xl text-ink">Gear (all providers)</h1>
        <EmptyState
          title="Failed to load gear"
          description="There was an error loading platform gear. Please try again later."
        />
      </div>
    );
  }

  return (
    <div className="pb-10">
      <h1 className="font-display text-3xl text-ink">Gear (all providers)</h1>

      {gear.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No gear listed yet" description="Once providers list gear, it'll show up here." />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-sm border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper-dim text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-medium">Gear</th>
                <th className="px-4 py-3 font-medium">Provider</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price/day</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {gear.map((g) => (
                <tr key={g.id} className="border-t border-line">
                  <td className="flex items-center gap-3 px-4 py-3 text-ink">
                    <div className="relative h-9 w-9 overflow-hidden rounded-sm bg-paper-dim">
                      <Image src={g.imageUrl} alt="" fill className="object-cover" />
                    </div>
                    {g.title}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{g.providerName}</td>
                  <td className="px-4 py-3">
                    <Badge variant="neutral">{g.categoryName}</Badge>
                  </td>
                  <td className="px-4 py-3 font-tag text-brass-dark">{formatCurrency(g.pricePerDay)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={g.available ? "moss" : "rust"}>
                      {g.available ? "Available" : "Unavailable"}
                    </Badge>
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
