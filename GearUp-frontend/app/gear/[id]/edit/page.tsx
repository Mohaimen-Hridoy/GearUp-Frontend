"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormLoading } from "@/components/ui/form-loading";
import { GearForm } from "@/components/gear/gear-form";
import { gearApi } from "@/lib/api-service";
import { useAuthStore, dashboardRootFor } from "@/lib/auth-store";

// This route lives outside /dashboard, so the role-based redirect in
// middleware.ts doesn't cover it. We guard it here instead: only a logged-in
// PROVIDER who owns this specific gear item may see/use the edit form.
export default function EditGearPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: gear, isLoading, isError } = useQuery({
    queryKey: ["gear", id],
    queryFn: () => gearApi.getById(id),
    enabled: !!id,
  });

  const notOwner = !!(user && gear && gear.providerId !== user.id);

  React.useEffect(() => {
    if (!user) {
      router.replace(`/auth/login?next=/gear/${id}/edit`);
      return;
    }
    if (user.role !== "PROVIDER") {
      toast.error("Only provider accounts can edit gear listings.");
      router.replace(dashboardRootFor(user.role));
      return;
    }
    if (notOwner) {
      toast.error("You can only edit gear from your own inventory.");
      router.replace("/dashboard/provider/gear");
    }
  }, [user, notOwner, id, router]);

  if (!user || user.role !== "PROVIDER" || notOwner) {
    return <FormLoading />;
  }

  if (isLoading) {
    return <FormLoading />;
  }

  if (isError || !gear) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <p className="text-ink-soft">Gear not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 font-display text-3xl text-ink">Edit gear</h1>
      <GearForm mode="edit" initial={gear} />
    </div>
  );
}
