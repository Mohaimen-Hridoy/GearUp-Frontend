import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export formatters for convenience
export { formatCurrency, formatDate, formatDateRange, formatRelativeTime } from "./formatters";
