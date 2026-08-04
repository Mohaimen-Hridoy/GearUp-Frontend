"use client";

import { useQuery } from "@tanstack/react-query";
import { StatTile } from "@/components/ui/stat-tile";
import { adminApi } from "@/lib/api-service";

export default function AdminOverviewPage() {
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => adminApi.getUsers(),
  });

  const { data: gear = [], isLoading: gearLoading } = useQuery({
    queryKey: ["admin-gear"],
    queryFn: () => adminApi.getAllGear(),
  });

  const { data: rentals = [], isLoading: rentalsLoading } = useQuery({
    queryKey: ["admin-rentals"],
    queryFn: () => adminApi.getAllRentals(),
  });

  if (usersLoading || gearLoading || rentalsLoading) {
    return (
      <div className="pb-10">
        <h1 className="font-display text-3xl text-ink">Platform overview</h1>
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
      <h1 className="font-display text-3xl text-ink">Platform overview</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Total users" value={users.length} accent="moss" />
        <StatTile label="Active gear" value={gear.filter((g) => g.available).length} accent="brass" />
        <StatTile label="Total rentals" value={rentals.length} />
      </div>
    </div>
  );
}
