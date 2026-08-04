"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function GearImageGallery({ images, title }: { images: string[]; title: string }) {
  const gallery = images.length > 0 ? images : [""];
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeImage = gallery[Math.min(activeIndex, gallery.length - 1)];

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-line bg-paper-dim">
        <Image src={activeImage} alt={title} fill className="object-cover" priority />
      </div>

      {gallery.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {gallery.map((src, index) => (
            <button
              key={src + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show photo ${index + 1} of ${gallery.length}`}
              aria-current={index === activeIndex}
              className={cn(
                "relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-sm border-2 bg-paper-dim transition",
                index === activeIndex ? "border-brass" : "border-line hover:border-line-canvas"
              )}
            >
              <Image src={src} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
