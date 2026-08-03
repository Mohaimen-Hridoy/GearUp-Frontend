export function DashboardLoading({ tiles = 3 }: { tiles?: number }) {
  return (
    <div className="animate-pulse pb-10">
      <div className="h-9 w-56 rounded-sm bg-paper-dim" />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: tiles }).map((_, i) => (
          <div key={i} className="h-24 rounded-sm border border-line bg-paper-dim/60" />
        ))}
      </div>
      <div className="mt-10 h-64 rounded-sm border border-line bg-paper-dim/40" />
    </div>
  );
}
