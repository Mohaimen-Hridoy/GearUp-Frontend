import type { User } from "@/lib/types";

// TODO(API_INTEGRATION.md): replace with GET /admin/users.
export const USERS: User[] = [
  { id: "u1", name: "Priya N.", email: "priya@example.com", role: "CUSTOMER", status: "ACTIVE" },
  { id: "u2", name: "Mara O.", email: "mara@example.com", role: "PROVIDER", status: "ACTIVE" },
  { id: "u3", name: "Deshi K.", email: "deshi@example.com", role: "PROVIDER", status: "ACTIVE" },
  { id: "u4", name: "Owen R.", email: "owen@example.com", role: "CUSTOMER", status: "SUSPENDED" },
];
