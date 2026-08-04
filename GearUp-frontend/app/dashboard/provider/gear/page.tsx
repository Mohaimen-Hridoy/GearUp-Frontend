"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import { gearApi, showApiError } from "@/lib/api-service";
import type { Gear } from "@/lib/types";

export default function ProviderGearPage() {
  const queryClient = useQueryClient();
  const { data: myGear = [], isLoading } = useQuery({
    queryKey: ["provider-gear"],
    queryFn: () => gearApi.getProviderGear(),
  });
  const [deleteTarget, setDeleteTarget] = React.useState<Gear | null>(null);

  const deleteMutation = useMutation({
    mutationFn: gearApi.deleteGear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-gear"] });
      toast.success(`${deleteTarget?.title} removed from your listings`);
      setDeleteTarget(null);
    },
    onError: (error) => {
      showApiError(error);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, available }: { id: string; available: boolean }) =>
      gearApi.updateGear(id, { available }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["provider-gear"] });
      toast.success(
        variables.available 
          ? `Gear marked available` 
          : `Gear marked unavailable`
      );
    },
    onError: (error) => {
      showApiError(error);
    },
  });

  function toggleAvailability(id: string) {
    const gear = myGear.find((g) => g.id === id);
    if (gear) {
      toggleMutation.mutate({ id, available: !gear.available });
    }
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id);
  }

  if (isLoading) {
    return (
      <div className="pb-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-3xl text-ink">Your gear</h1>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-sm bg-paper-dim" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Your gear</h1>
        <Link href="/dashboard/provider/gear/new" className={buttonVariants()}>
          <Plus className="h-4 w-4" /> Add gear
        </Link>
      </div>

      {myGear.length === 0 ? (
        <EmptyState
          title="No gear listed yet"
          description="List your first item to start renting it out."
          action={
            <Link href="/dashboard/provider/gear/new" className={buttonVariants({ className: "mt-2" })}>
              Add gear
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-sm border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper-dim text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-medium">Gear</th>
                <th className="px-4 py-3 font-medium">Price/day</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {myGear.map((g) => (
                <tr key={g.id} className="border-t border-line">
                  <td className="flex items-center gap-3 px-4 py-3 text-ink">
                    <div className="relative h-10 w-10 overflow-hidden rounded-sm bg-paper-dim">
                      <Image src={g.imageUrl} alt="" fill className="object-cover" />
                    </div>
                    {g.title}
                  </td>
                  <td className="px-4 py-3 font-tag text-brass-dark">{formatCurrency(g.pricePerDay)}</td>
                  <td className="px-4 py-3 text-ink-soft">{g.stock}</td>
                  <td className="px-4 py-3">
                    <Badge variant={g.available ? "moss" : "rust"}>
                      {g.available ? "Available" : "Unavailable"}
                    </Badge>
                  </td>
                  <td className="space-x-2 px-4 py-3 text-right">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      loading={toggleMutation.isPending}
                      onClick={() => toggleAvailability(g.id)}
                    >
                      {g.available ? "Mark unavailable" : "Mark available"}
                    </Button>
                    <Link
                      href={`/gear/${g.id}/edit`}
                      className={buttonVariants({ size: "sm", variant: "outline" })}
                    >
                      Edit
                    </Link>
                    <button
                      className={buttonVariants({ size: "sm", variant: "ghost", className: "text-rust hover:bg-rust/10" })}
                      onClick={() => setDeleteTarget(g)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove this listing?"
        description={`"${deleteTarget?.title}" will be unlisted and no longer bookable. This can't be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
