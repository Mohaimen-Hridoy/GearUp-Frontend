import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/lib/types";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setSession: (token: string, user: AuthUser) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      clearSession: () => set({ token: null, user: null }),
    }),
    { name: "gearup-auth" }
  )
);

export function dashboardRootFor(role: Role) {
  switch (role) {
    case "CUSTOMER":
      return "/dashboard/customer";
    case "PROVIDER":
      return "/dashboard/provider";
    case "ADMIN":
      return "/dashboard/admin";
  }
}
