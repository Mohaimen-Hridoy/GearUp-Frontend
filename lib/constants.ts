export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    ME: "/api/auth/me",
  },
  GEAR: {
    ALL: "/api/gear",
    BY_ID: (id: string) => `/api/gear/${id}`,
    CATEGORIES: "/api/categories",
    PROVIDER_GEAR: "/api/provider/gear",
    PROVIDER_GEAR_BY_ID: (id: string) => `/api/provider/gear/${id}`,
  },
  RENTALS: {
    ALL: "/api/rentals",
    BY_ID: (id: string) => `/api/rentals/${id}`,
    PROVIDER_ORDERS: "/api/provider/orders",
    PROVIDER_ORDER_BY_ID: (id: string) => `/api/provider/orders/${id}`,
  },
  PAYMENTS: {
    CREATE: "/api/payments/create",
    CONFIRM: "/api/payments/confirm",
    ALL: "/api/payments",
  },
  REVIEWS: {
    CREATE: "/api/reviews",
  },
  ADMIN: {
    USERS: "/api/admin/users",
    USER_BY_ID: (id: string) => `/api/admin/users/${id}`,
    GEAR: "/api/admin/gear",
    RENTALS: "/api/admin/rentals",
  },
} as const;

export const RENTAL_STATUS = {
  PLACED: "PLACED",
  CONFIRMED: "CONFIRMED",
  PAID: "PAID",
  PICKED_UP: "PICKED_UP",
  RETURNED: "RETURNED",
  CANCELLED: "CANCELLED",
} as const;

export const USER_ROLES = {
  CUSTOMER: "CUSTOMER",
  PROVIDER: "PROVIDER",
  ADMIN: "ADMIN",
} as const;
