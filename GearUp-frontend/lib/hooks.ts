import { useAuthStore } from "./auth-store";

/**
 * Hook to check if user has required role
 */
export function useRequireRole(allowedRoles: string[]) {
  const user = useAuthStore((s) => s.user);
  return user && allowedRoles.includes(user.role);
}

/**
 * Hook to get current user role
 */
export function useUserRole() {
  const user = useAuthStore((s) => s.user);
  return user?.role;
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated() {
  const token = useAuthStore((s) => s.token);
  return !!token;
}
