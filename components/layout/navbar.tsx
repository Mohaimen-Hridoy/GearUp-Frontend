"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Compass, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore, dashboardRootFor } from "@/lib/auth-store";

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearSession } = useAuthStore();

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className={cn(
        "text-sm text-ink/80 transition-colors hover:text-ink",
        pathname === href && "text-brass"
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line-canvas bg-canvas">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg text-ink">
          <span className="tag-hole tag-hole-dark dashed-border-canvas flex h-8 w-8 items-center justify-center rounded-sm bg-canvas-light pl-1">
            <Compass className="h-4 w-4 text-brass" />
          </span>
          GearUp
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLink("/gear", "Browse gear")}
          {user?.role === "PROVIDER" && navLink("/dashboard/provider/gear/new", "List your gear")}
          {user ? (
            <>
              {navLink(dashboardRootFor(user.role), "Dashboard")}
              <Button
                variant="outline"
                size="sm"
                className="border-line-canvas text-ink hover:bg-canvas-light"
                onClick={() => {
                  clearSession();
                  document.cookie = "gearup-session=; Max-Age=0; path=/";
                  router.push("/");
                }}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              {navLink("/auth/login", "Log in")}
              <Button size="sm" onClick={() => router.push("/auth/register")}>
                Sign up
              </Button>
            </>
          )}
        </nav>

        <button
          className="text-ink md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line-canvas bg-canvas-light px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLink("/gear", "Browse gear")}
            {user ? (
              <>
                {navLink(dashboardRootFor(user.role), "Dashboard")}
                <button
                  className="text-left text-sm text-ink/80"
                  onClick={() => {
                    clearSession();
                    document.cookie = "gearup-session=; Max-Age=0; path=/";
                    setOpen(false);
                    router.push("/");
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                {navLink("/auth/login", "Log in")}
                {navLink("/auth/register", "Sign up")}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
