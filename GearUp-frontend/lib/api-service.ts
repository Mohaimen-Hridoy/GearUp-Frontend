import { apiFetch, ApiError } from "./api";
import type { Gear, Category, RentalOrder, User } from "./types";
import { useAuthStore } from "./auth-store";

type BackendGear = Omit<Partial<Gear>, "available" | "categoryName" | "providerName" | "reviews"> & {
  pricePerDay?: number | string;
  isAvailable?: boolean;
  available?: boolean;
  images?: string[];
  categoryName?: string;
  providerName?: string;
  category?: Category;
  provider?: Pick<User, "id" | "name" | "email">;
  reviews?: Array<{
    id?: string;
    rating?: number;
    comment?: string | null;
    createdAt?: string;
    customer?: { id?: string; name?: string };
  }>;
};

type BackendRental = Partial<Omit<RentalOrder, "gear" | "totalCents">> & {
  gearItemId?: string;
  gearItem?: BackendGear;
  customer?: Pick<User, "id" | "name" | "email">;
  totalPrice?: number | string;
  totalCents?: number;
};

const fallbackImages: Record<string, string> = {
  camping: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
  cycling: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80",
  fitness: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
  "water-sports": "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=800&q=80",
  "winter-sports": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80",
};

function normalizeGear(item: BackendGear): Gear {
  const reviews = item.reviews ?? [];
  const apiPrice = Number(item.pricePerDay ?? 0);
  const rating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + Number(review.rating ?? 0), 0) / reviews.length
      : undefined;
  const categorySlug = item.category?.slug ?? "";
  const primaryImage =
    item.imageUrl ??
    fallbackImages[categorySlug] ??
    "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80";
  // Gallery = provider-uploaded images, deduped, primary image always first
  // so cards/thumbnails that only look at images[0] never break.
  const gallery = Array.from(new Set([primaryImage, ...(item.images ?? [])].filter(Boolean)));

  return {
    id: String(item.id),
    title: String(item.title ?? ""),
    description: String(item.description ?? ""),
    brand: String(item.brand ?? ""),
    categoryId: String(item.categoryId ?? item.category?.id ?? ""),
    categoryName: item.category?.name ?? item.categoryName ?? "Gear",
    pricePerDay: apiPrice > 0 && apiPrice < 1000 ? Math.round(apiPrice * 100) : apiPrice,
    stock: Number(item.stock ?? 0),
    imageUrl: primaryImage,
    images: gallery,
    available: item.isAvailable ?? item.available ?? false,
    providerId: String(item.providerId ?? item.provider?.id ?? ""),
    providerName: item.provider?.name ?? item.providerName ?? "GearUp Provider",
    rating,
    reviewCount: reviews.length,
    reviews: reviews.map((review, index) => ({
      id: review.id ?? String(index),
      rating: Number(review.rating ?? 0),
      comment: review.comment ?? null,
      createdAt: review.createdAt,
      customerName: review.customer?.name ?? "GearUp customer",
    })),
  };
}

function toBackendGearPayload(data: Partial<Gear>) {
  const { available, categoryName: _categoryName, providerName: _providerName, ...rest } = data;
  return {
    ...rest,
    ...(available !== undefined ? { isAvailable: available } : {}),
  };
}

function normalizeRental(order: BackendRental): RentalOrder {
  const gearItem = order.gearItem ?? {};
  const apiTotal = Number(order.totalCents ?? order.totalPrice ?? 0);
  const gear = normalizeGear({
    ...gearItem,
    id: gearItem.id ?? order.gearItemId,
  });

  return {
    id: String(order.id),
    gear: {
      id: gear.id,
      title: gear.title,
      imageUrl: gear.imageUrl,
    },
    customerName: order.customer?.name ?? order.customerName ?? "Customer",
    startDate: String(order.startDate ?? ""),
    endDate: String(order.endDate ?? ""),
    totalCents: apiTotal > 0 && apiTotal < 1000 ? Math.round(apiTotal * 100) : apiTotal,
    status: order.status ?? "PLACED",
  };
}

// Auth API
export const authApi = {
  async login(email: string, password: string) {
    return apiFetch<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    role: "CUSTOMER" | "PROVIDER";
  }) {
    return apiFetch<{ token: string; user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getMe() {
    return apiFetch<User>("/api/auth/me");
  },
};

// Gear API
export const gearApi = {
  async getAll(params?: { category?: string; search?: string; brand?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.category && /^c[a-z0-9]{20,}$/i.test(params.category)) {
      searchParams.set("categoryId", params.category);
    }
    if (params?.search) searchParams.set("search", params.search);
    if (params?.brand) searchParams.set("brand", params.brand);
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : "";
    const data = await apiFetch<BackendGear[]>(`/api/gear${queryString}`);
    return data.map(normalizeGear);
  },

  async getById(id: string) {
    const data = await apiFetch<BackendGear>(`/api/gear/${id}`);
    return normalizeGear(data);
  },

  async getCategories() {
    return apiFetch<Category[]>("/api/categories");
  },

  async getBookedDates(id: string) {
    return apiFetch<{ stock: number; bookedRanges: { startDate: string; endDate: string }[] }>(
      `/api/gear/${id}/booked-dates`
    );
  },

  // Provider gear management
  async createGear(data: Partial<Gear>) {
    const created = await apiFetch<BackendGear>("/api/provider/gear", {
      method: "POST",
      body: JSON.stringify(toBackendGearPayload(data)),
    });
    return normalizeGear(created);
  },

  async updateGear(id: string, data: Partial<Gear>) {
    const updated = await apiFetch<BackendGear>(`/api/provider/gear/${id}`, {
      method: "PUT",
      body: JSON.stringify(toBackendGearPayload(data)),
    });
    return normalizeGear(updated);
  },

  async deleteGear(id: string) {
    return apiFetch<void>(`/api/provider/gear/${id}`, {
      method: "DELETE",
    });
  },

  async getProviderGear() {
    const data = await apiFetch<BackendGear[]>("/api/provider/gear");
    const currentUserId = useAuthStore.getState().user?.id;
    return data
      .map(normalizeGear)
      .filter((gear) => !currentUserId || gear.providerId === currentUserId);
  },
};

// Rental API
export const rentalApi = {
  async createRental(data: {
    gearId: string;
    startDate: string;
    endDate: string;
  }) {
    const rental = await apiFetch<BackendRental>("/api/rentals", {
      method: "POST",
      body: JSON.stringify({
        gearItemId: data.gearId,
        startDate: data.startDate,
        endDate: data.endDate,
      }),
    });
    return normalizeRental(rental);
  },

  async getCustomerRentals() {
    const data = await apiFetch<BackendRental[]>("/api/rentals");
    return data.map(normalizeRental);
  },

  async getRentalById(id: string) {
    const data = await apiFetch<BackendRental>(`/api/rentals/${id}`);
    return normalizeRental(data);
  },

  // Provider order management
  async getProviderOrders() {
    const data = await apiFetch<BackendRental[]>("/api/provider/orders");
    return data.map(normalizeRental);
  },

  async updateOrderStatus(id: string, status: string) {
    const data = await apiFetch<BackendRental>(`/api/provider/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return normalizeRental(data);
  },
};

// Payment API
export const paymentApi = {
  async createPayment(data: { rentalOrderId: string }) {
    const response = await apiFetch<{ clientSecret?: string; payment?: unknown }>("/api/payments/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return { clientSecret: response.clientSecret ?? "" };
  },

  async confirmPayment(data: { payment_intent: string; rentalOrderId: string }) {
    return apiFetch<RentalOrder>("/api/payments/confirm", {
      method: "POST",
      body: JSON.stringify({
        rentalOrderId: data.rentalOrderId,
        paymentIntentId: data.payment_intent,
      }),
    });
  },

  async getPayments() {
    return apiFetch<any[]>("/api/payments");
  },
};

// Review API
export const reviewApi = {
  async createReview(data: {
    gearItemId: string;
    rating: number;
    comment: string;
  }) {
    return apiFetch<any>("/api/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// Admin API
export const adminApi = {
  async getUsers() {
    return apiFetch<User[]>("/api/admin/users");
  },

  async updateUserStatus(id: string, status: "ACTIVE" | "SUSPENDED") {
    return apiFetch<User>(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async getAllGear() {
    const data = await apiFetch<BackendGear[]>("/api/admin/gear");
    return data.map(normalizeGear);
  },

  async getAllRentals() {
    const data = await apiFetch<BackendRental[]>("/api/admin/rentals");
    return data.map(normalizeRental);
  },
};

// Error handling helper
export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    console.error(`API Error ${error.status}:`, error.message);
    return error.message;
  }
  if (error instanceof Error) {
    console.error("Error:", error.message);
    return error.message;
  }
  console.error("Unknown error:", error);
  return "An unexpected error occurred";
}

// Export showApiError from api.ts
export { showApiError } from "./api";
