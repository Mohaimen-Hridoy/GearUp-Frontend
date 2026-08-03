export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";

export type RentalStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED"
  | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "ACTIVE" | "SUSPENDED";
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt?: string;
  customerName: string;
}

export interface Gear {
  id: string;
  title: string;
  description: string;
  brand: string;
  categoryId: string;
  categoryName: string;
  pricePerDay: number; // cents
  stock: number;
  imageUrl: string;
  images: string[];
  available: boolean;
  providerId: string;
  providerName: string;
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];
}

export interface RentalOrder {
  id: string;
  gear: Pick<Gear, "id" | "title" | "imageUrl">;
  customerName: string;
  startDate: string;
  endDate: string;
  totalCents: number;
  status: RentalStatus;
}
