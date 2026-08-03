import { GearCardSkeleton } from "@/components/gear/gear-card-skeleton";

export default function GearBrowseLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 h-9 w-48 animate-pulse rounded-sm bg-paper-dim" />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
        <div className="h-96 animate-pulse rounded-sm bg-paper-dim/50" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <GearCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
