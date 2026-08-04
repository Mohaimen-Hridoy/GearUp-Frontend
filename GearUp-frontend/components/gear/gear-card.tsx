"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Heart } from "lucide-react";
import { TagCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { Gear } from "@/lib/types";

export function GearCard({ gear }: { gear: Gear }) {
  return (
    <Link href={`/gear/${gear.id}`} className="block group">
      <TagCard interactive className="flex h-full flex-col p-0 pl-0 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-[4/3] w-full bg-paper-dim overflow-hidden">
          <Image
            src={gear.imageUrl}
            alt={gear.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <button 
            className="absolute top-3 right-3 rounded-sm bg-paper/80 p-2 text-ink-soft backdrop-blur-sm transition-colors hover:bg-paper hover:text-rust"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Add wishlist functionality
            }}
          >
            <Heart className="h-4 w-4" />
          </button>
          {!gear.available && (
            <div className="absolute inset-0 flex items-center justify-center bg-canvas/70 backdrop-blur-sm">
              <Badge variant="rust" className="text-sm">Unavailable</Badge>
            </div>
          )}
          {gear.stock <= 2 && gear.available && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="brass" className="text-xs">
                Only {gear.stock} left
              </Badge>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5 pl-6">
          <div className="flex items-start justify-between gap-2">
            <Badge variant="neutral" className="text-xs">{gear.categoryName}</Badge>
            {gear.rating != null && (
              <div className="flex items-center gap-1 text-xs text-ink-soft">
                <Star className="h-3.5 w-3.5 fill-brass text-brass" />
                <span className="font-medium">{gear.rating.toFixed(1)}</span>
                <span className="text-ink-soft">({gear.reviewCount})</span>
              </div>
            )}
          </div>

          <h3 className="font-display text-lg leading-snug text-ink group-hover:text-moss-dark transition-colors">
            {gear.title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-ink-soft">
            <span>{gear.brand}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {gear.providerName}
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between pt-3 border-t border-line">
            <div>
              <span className="font-tag text-lg text-brass-dark">
                {formatCurrency(gear.pricePerDay)}
              </span>
              <span className="text-xs text-ink-soft">/day</span>
            </div>
            <div className="text-xs text-ink-soft">
              {gear.stock > 0 ? `${gear.stock} available` : 'Out of stock'}
            </div>
          </div>
        </div>
      </TagCard>
    </Link>
  );
}
