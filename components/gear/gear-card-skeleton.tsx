export function GearCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-sm border border-line bg-paper">
      <div className="aspect-[4/3] w-full bg-paper-dim" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-20 rounded-sm bg-paper-dim" />
        <div className="h-5 w-3/4 rounded-sm bg-paper-dim" />
        <div className="h-4 w-1/2 rounded-sm bg-paper-dim" />
        <div className="h-4 w-1/3 rounded-sm bg-paper-dim" />
      </div>
    </div>
  );
}
