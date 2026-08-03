import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GearImageGallery } from "@/components/gear/gear-image-gallery";
import { RentalDatePicker } from "@/components/gear/rental-date-picker";
import { formatCurrency } from "@/lib/utils";
import { gearApi } from "@/lib/api-service";

export default async function GearDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let gear;
  try {
    gear = await gearApi.getById(id);
  } catch (error) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <GearImageGallery images={gear.images} title={gear.title} />

          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="neutral">{gear.categoryName}</Badge>
              {gear.rating != null && (
                <span className="flex items-center gap-1 text-sm text-ink-soft">
                  <Star className="h-4 w-4 fill-brass text-brass" />
                  {gear.rating.toFixed(1)} ({gear.reviewCount} reviews)
                </span>
              )}
            </div>
            <h1 className="mt-3 font-display text-3xl text-ink">{gear.title}</h1>
            <p className="mt-1 text-ink-soft">
              {gear.brand} · Listed by {gear.providerName}
            </p>
            <p className="mt-5 max-w-2xl text-ink">{gear.description}</p>
            <p className="mt-4 font-tag text-sm text-ink-soft">
              {gear.stock} in stock · {gear.available ? "Available now" : "Currently unavailable"}
            </p>
          </div>

          {/* Reviews */}
          <section className="mt-12 border-t border-line pt-8">
            <h2 className="font-display text-xl text-ink">Reviews</h2>
            <div className="mt-4 space-y-5">
              {gear.reviews && gear.reviews.length > 0 ? (
                gear.reviews.map((review) => (
                  <ReviewRow
                    key={review.id}
                    name={review.customerName}
                    rating={review.rating}
                    text={review.comment || "No comment left."}
                  />
                ))
              ) : (
                <p className="text-sm text-ink-soft">
                  No reviews yet — be the first to rent and review this gear.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Sticky rent panel */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-3 font-tag text-2xl text-brass-dark">
            {formatCurrency(gear.pricePerDay)}
            <span className="text-sm text-ink-soft">/day</span>
          </div>
          <RentalDatePicker gearId={gear.id} pricePerDay={gear.pricePerDay} />
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ name, rating, text }: { name: string; rating: number; text: string }) {
  return (
    <div className="border-b border-line pb-5 last:border-0">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-ink">{name}</span>
        <span className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i < rating ? "fill-brass text-brass" : "text-line"}`}
            />
          ))}
        </span>
      </div>
      <p className="mt-1 text-sm text-ink-soft">{text}</p>
    </div>
  );
}
