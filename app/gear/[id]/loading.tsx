export default function GearDetailsLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="aspect-[4/3] w-full rounded-sm bg-paper-dim" />
          <div className="mt-6 space-y-3">
            <div className="h-4 w-24 rounded-sm bg-paper-dim" />
            <div className="h-8 w-2/3 rounded-sm bg-paper-dim" />
            <div className="h-4 w-1/2 rounded-sm bg-paper-dim" />
            <div className="h-20 w-full rounded-sm bg-paper-dim" />
          </div>
        </div>
        <div className="h-96 rounded-sm bg-paper-dim" />
      </div>
    </div>
  );
}
