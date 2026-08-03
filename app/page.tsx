import Link from "next/link";
import { Tent, Mountain, Waves, Snowflake, ArrowRight, Star, Shield, Truck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { GearCard } from "@/components/gear/gear-card";
import { Badge } from "@/components/ui/badge";
import { gearApi } from "@/lib/api-service";

const CATEGORY_STRIP = [
  { icon: Tent, label: "Camping", href: "/gear?category=camping", count: 12 },
  { icon: Mountain, label: "Climbing", href: "/gear?category=climbing", count: 8 },
  { icon: Waves, label: "Water sports", href: "/gear?category=water-sports", count: 15 },
  { icon: Snowflake, label: "Winter", href: "/gear?category=winter", count: 6 },
];

const FEATURES = [
  {
    icon: Shield,
    title: "Verified Providers",
    description: "Every gear is inspected and verified by our team",
  },
  {
    icon: Star,
    title: "Top-Rated Gear",
    description: "Real reviews from real adventurers like you",
  },
  {
    icon: Truck,
    title: "Easy Pickup",
    description: "Convenient locations, flexible scheduling",
  },
];

async function getFeaturedGear() {
  try {
    const allGear = await gearApi.getAll();
    return allGear.slice(0, 6);
  } catch (error) {
    console.error("Failed to fetch featured gear:", error);
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedGear();

  return (
    <>
      {/* ---- Hero (canvas / dark shell) ---- */}
      <section className="relative overflow-hidden bg-canvas">
        <div className="contour-field" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="max-w-2xl animate-fade-up">
            <Badge variant="moss" className="mb-4">
              🎉 New: Winter sports gear now available
            </Badge>
            <span className="font-tag text-xs uppercase tracking-[0.2em] text-brass">
              Field-tested gear, catalogued
            </span>
            <h1 className="mt-4 font-display text-4xl leading-tight text-ink md:text-6xl">
              Rent the gear.
              <br />
              Skip the closet.
            </h1>
            <p className="mt-5 max-w-lg text-base text-ink/70 md:text-lg">
              Tents, ropes, boards, and boats — listed by people who actually
              use them. Book by the day, picked up ready to go.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/gear" className={buttonVariants({ size: "lg" })}>
                Browse gear <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/provider/gear/new"
                className={buttonVariants({
                  size: "lg",
                  variant: "outline",
                  className: "border-line-canvas text-ink hover:bg-canvas-light",
                })}
              >
                List your gear
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap gap-6 text-ink/60">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-brass text-brass" />
                <span className="text-sm">4.8 avg rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Verified providers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">500+ gear items</span>
              </div>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4">
            {CATEGORY_STRIP.map(({ icon: Icon, label, href, count }) => (
              <Link
                key={label}
                href={href}
                className="tag-hole tag-hole-dark dashed-border-canvas group flex flex-col items-center gap-2 rounded-sm bg-canvas-light px-4 py-6 text-center transition-colors hover:bg-canvas-light/70"
              >
                <Icon className="h-6 w-6 text-brass transition-transform group-hover:scale-110" />
                <span className="font-tag text-sm text-ink/80">{label}</span>
                <span className="text-xs text-ink/50">{count} items</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Features Section ---- */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mb-12 text-center">
          <span className="font-tag text-xs uppercase tracking-[0.2em] text-brass-dark">
            Why GearUp
          </span>
          <h2 className="mt-2 font-display text-2xl text-ink md:text-3xl">
            Adventure gear, made simple
          </h2>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className="dashed-border rounded-sm bg-paper p-6 text-center">
              <feature.icon className="mx-auto h-8 w-8 text-moss" />
              <h3 className="mt-4 font-display text-lg text-ink">{feature.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Fresh off the rack (paper section) ---- */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="font-tag text-xs uppercase tracking-[0.2em] text-brass-dark">
              Latest listings
            </span>
            <h2 className="mt-2 font-display text-2xl text-ink md:text-3xl">
              Fresh off the rack
            </h2>
          </div>
          <Link
            href="/gear"
            className="hidden items-center gap-1 text-sm font-medium text-moss-dark hover:text-moss md:flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((gear) => (
            <GearCard key={gear.id} gear={gear} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/gear" className={buttonVariants({ variant: "outline" })}>
            View all gear
          </Link>
        </div>
      </section>
    </>
  );
}
