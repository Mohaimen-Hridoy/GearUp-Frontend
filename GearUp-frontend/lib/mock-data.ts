import type { Gear, Category, RentalOrder } from "@/lib/types";

// TODO(API_INTEGRATION.md): replace every export here with real calls —
// GET /gear, GET /categories, GET /rentals — once the backend is deployed.
// Kept isomorphic (no fetch) so pages render in the sandbox with no network.

export const CATEGORIES: Category[] = [
  { id: "c1", name: "Camping", slug: "camping" },
  { id: "c2", name: "Climbing", slug: "climbing" },
  { id: "c3", name: "Water sports", slug: "water-sports" },
  { id: "c4", name: "Winter", slug: "winter" },
];

export const GEAR: Gear[] = [
  {
    id: "g1",
    title: "4-Person Blackout Tent",
    description:
      "A weatherproof, four-season tent with a blackout inner for sleeping past sunrise. Sets up in under six minutes and packs down to the size of a loaf of bread.",
    brand: "Northfell",
    categoryId: "c1",
    categoryName: "Camping",
    pricePerDay: 3200,
    stock: 3,
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
    images: [],
    available: true,
    providerId: "p1",
    providerName: "Mara O.",
    rating: 4.8,
    reviewCount: 34,
  },
  {
    id: "g2",
    title: "Alpine Trad Rack (Full Set)",
    description:
      "A full trad rack — cams, nuts, slings, and two 60m dry-treated ropes. Recently retired from guided use, still well within safe working life.",
    brand: "Craghold",
    categoryId: "c2",
    categoryName: "Climbing",
    pricePerDay: 4500,
    stock: 1,
    imageUrl: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&q=80",
    images: [],
    available: true,
    providerId: "p2",
    providerName: "Deshi K.",
    rating: 5.0,
    reviewCount: 12,
  },
  {
    id: "g3",
    title: "Touring Kayak, 14ft",
    description:
      "A stable, tracks-straight sea kayak built for day-touring on lakes and calm coastline. Comes with paddle, spray skirt, and roof straps.",
    brand: "Driftline",
    categoryId: "c3",
    categoryName: "Water sports",
    pricePerDay: 5500,
    stock: 2,
    imageUrl: "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=800&q=80",
    images: [],
    available: true,
    providerId: "p3",
    providerName: "Owen R.",
    rating: 4.6,
    reviewCount: 21,
  },
  {
    id: "g4",
    title: "Backcountry Split Board Set",
    description:
      "Split board, skins, and poles for backcountry touring. Mounted with adjustable bindings to fit most boot sizes.",
    brand: "Ridgehaus",
    categoryId: "c4",
    categoryName: "Winter",
    pricePerDay: 6000,
    stock: 2,
    imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80",
    images: [],
    available: true,
    providerId: "p1",
    providerName: "Mara O.",
    rating: 4.9,
    reviewCount: 18,
  },
  {
    id: "g5",
    title: "Camp Kitchen Box",
    description:
      "A stocked chuck box: two-burner stove, cookware for four, cutting board, and a full utensil roll. Everything smells like campfire, in a good way.",
    brand: "Northfell",
    categoryId: "c1",
    categoryName: "Camping",
    pricePerDay: 1800,
    stock: 4,
    imageUrl: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80",
    images: [],
    available: true,
    providerId: "p4",
    providerName: "Lina S.",
    rating: 4.7,
    reviewCount: 40,
  },
  {
    id: "g6",
    title: "Bouldering Crash Pad",
    description:
      "Dual-density foam crash pad, tri-fold for easy carry. Reinforced corners and a wipeable shell.",
    brand: "Craghold",
    categoryId: "c2",
    categoryName: "Climbing",
    pricePerDay: 2200,
    stock: 3,
    imageUrl: "https://images.unsplash.com/photo-1516592066896-8c2c1b7c8d5c?w=800&q=80",
    images: [],
    available: false,
    providerId: "p2",
    providerName: "Deshi K.",
    rating: 4.4,
    reviewCount: 9,
  },
];

export const ORDERS: RentalOrder[] = [
  {
    id: "o1",
    gear: { id: "g1", title: "4-Person Blackout Tent", imageUrl: GEAR[0].imageUrl },
    customerName: "Priya N.",
    startDate: "2026-08-02",
    endDate: "2026-08-05",
    totalCents: 9600,
    status: "CONFIRMED",
  },
  {
    id: "o2",
    gear: { id: "g3", title: "Touring Kayak, 14ft", imageUrl: GEAR[2].imageUrl },
    customerName: "Priya N.",
    startDate: "2026-07-10",
    endDate: "2026-07-12",
    totalCents: 11000,
    status: "RETURNED",
  },
];

export function getFeaturedGear(count = 6) {
  return GEAR.slice(0, count);
}

export function getGearById(id: string) {
  return GEAR.find((g) => g.id === id);
}
