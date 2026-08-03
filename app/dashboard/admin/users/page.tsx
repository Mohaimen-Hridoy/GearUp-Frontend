"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/dialog";
import { toast } from "sonner";
import { adminApi, showApiError } from "@/lib/api-service";
import type { User } from "@/lib/types";

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => adminApi.getUsers(),
  });
  const [target, setTarget] = React.useState<User | null>(null);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);

  const filteredUsers = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
  }, [users, search]);

  // Reset to page 1 whenever the search term changes so we don't land on
  // an out-of-range page with zero rows.
  React.useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const pageUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "SUSPENDED" }) =>
      adminApi.updateUserStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(`User ${variables.status === "ACTIVE" ? "activated" : "suspended"}`);
      setTarget(null);
    },
    onError: (error) => {
      showApiError(error);
    },
  });

  function confirmToggle() {
    if (!target) return;
    const newStatus = target.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    mutation.mutate({ id: target.id, status: newStatus });
  }

  if (isLoading) {
    return (
      <div className="pb-10">
        <h1 className="font-display text-3xl text-ink">Users</h1>
        <div className="mt-6 h-64 animate-pulse rounded-sm bg-paper-dim" />
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-3xl text-ink">Users</h1>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <Input
            className="pl-9"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search users"
          />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-sm border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper-dim text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {pageUsers.map((u) => (
              <tr key={u.id} className="border-t border-line">
                <td className="px-4 py-3 text-ink">{u.name}</td>
                <td className="px-4 py-3 text-ink-soft">{u.email}</td>
                <td className="px-4 py-3">
                  <Badge variant="neutral">{u.role}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={u.status === "ACTIVE" ? "moss" : "rust"}>{u.status}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    size="sm"
                    variant={u.status === "ACTIVE" ? "danger" : "outline"}
                    loading={mutation.isPending}
                    onClick={() => setTarget(u)}
                  >
                    {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                  </Button>
                </td>
              </tr>
            ))}
            {pageUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-soft">
                  No users match &ldquo;{search}&rdquo;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-ink-soft">
          <span>
            Page {page} of {totalPages} · {filteredUsers.length} user{filteredUsers.length === 1 ? "" : "s"}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!target}
        title={target?.status === "ACTIVE" ? "Suspend this user?" : "Activate this user?"}
        description={
          target?.status === "ACTIVE"
            ? `${target?.name} will lose access to GearUp until reactivated.`
            : `${target?.name} will regain access to GearUp.`
        }
        confirmLabel={target?.status === "ACTIVE" ? "Suspend" : "Activate"}
        danger={target?.status === "ACTIVE"}
        onConfirm={confirmToggle}
        onCancel={() => setTarget(null)}
      />
    </div>
  );
}
