import { apiFetch, ApiError } from "./api";

/**
 * Enhanced API client with retry logic and caching
 */
export class ApiClient {
  private maxRetries = 3;
  private retryDelay = 1000;

  async fetchWithRetry<T>(
    path: string,
    options?: RequestInit & { auth?: boolean },
    retryCount = 0
  ): Promise<T> {
    try {
      return await apiFetch<T>(path, options);
    } catch (error) {
      if (error instanceof ApiError && retryCount < this.maxRetries) {
        // Retry on server errors (5xx)
        if (error.status >= 500 && error.status < 600) {
          await this.delay(this.retryDelay * (retryCount + 1));
          return this.fetchWithRetry<T>(path, options, retryCount + 1);
        }
      }
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Batch multiple API calls
   */
  async batch<T>(requests: Array<() => Promise<T>>): Promise<T[]> {
    return Promise.allSettled(requests.map((req) => req())).then((results) =>
      results.map((result, index) => {
        if (result.status === "fulfilled") {
          return result.value;
        }
        console.error(`Batch request ${index} failed:`, result.reason);
        throw result.reason;
      })
    );
  }
}

export const apiClient = new ApiClient();
