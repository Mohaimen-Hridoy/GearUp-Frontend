import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorDetails?: any[];
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const token = auth ? useAuthStore.getState().token : null;

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!res.ok) {
    let message = "Something went wrong. Please try again.";
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch {
      // response wasn't JSON — keep the default message
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  
  const response: ApiResponse<T> = await res.json();
  
  if (!response.success) {
    throw new ApiError(response.message, res.status);
  }
  
  return response.data;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/** Central place every mutation/query error routes through — toast is the
 *  "so what" summary; inline field errors (via RHF) are the "which field". */
export function showApiError(error: unknown) {
  const message = error instanceof Error ? error.message : "Something went wrong.";
  toast.error(message);
}
