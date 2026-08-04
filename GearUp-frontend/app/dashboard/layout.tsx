"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  PlusCircle,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/auth-store";
import type { Role } from "@/lib/types";

type NavItem = { label: string; href: string; icon: React.ComponentType<{ className?: string }> };

const NAV: Record<Role, NavItem[]> = {
  CUSTOMER: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { label: "Orders", href: "/dashboard/customer/orders", icon: ShoppingBag },
  ],
  PROVIDER: [
    { label: "Overview", href: "/dashboard/provider", icon: LayoutDashboard },
    { label: "My gear", href: "/dashboard/provider/gear", icon: Package },
    { label: "Orders", href: "/dashboard/provider/orders", icon: ClipboardList },
    { label: "List new gear", href: "/dashboard/provider/gear/new", icon: PlusCircle },
  ],
  ADMIN: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Gear", href: "/dashboard/admin/gear", icon: Package },
    { label: "Rentals", href: "/dashboard/admin/rentals", icon: ClipboardList },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
  ],
};

const ROLE_LABEL: Record<Role, string> = {
  CUSTOMER: "Your account",
  PROVIDER: "Provider",
  ADMIN: "Admin",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const role = user?.role ?? "CUSTOMER";
  const items = NAV[role];

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="dashed-border sticky top-24 rounded-sm bg-paper-dim/40 p-3">
          <p className="px-2.5 pb-2 font-tag text-[11px] uppercase tracking-[0.15em] text-ink-soft">
            {ROLE_LABEL[role]}
          </p>
          <nav className="flex flex-col gap-0.5">
            {items.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm transition-colors",
                    active
                      ? "bg-moss font-medium text-ink"
                      : "text-ink-soft hover:bg-paper-dim hover:text-ink"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile: horizontal scroll tab strip instead of a sidebar */}
      <nav className="fixed inset-x-0 top-16 z-30 flex gap-1 overflow-x-auto border-b border-line bg-paper/95 px-4 py-2 backdrop-blur-sm lg:hidden">
        {items.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                active ? "bg-moss text-ink" : "bg-paper-dim text-ink-soft"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="min-w-0 flex-1 pt-12 lg:pt-0">{children}</div>
    </div>
  );
}
