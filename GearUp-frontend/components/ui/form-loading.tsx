export function FormLoading() {
  return (
    <div className="mx-auto max-w-md animate-pulse px-4 py-10">
      <div className="h-9 w-48 rounded-sm bg-paper-dim" />
      <div className="mt-6 space-y-4 rounded-sm border border-line p-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 rounded-sm bg-paper-dim" />
        ))}
        <div className="h-12 w-32 rounded-sm bg-paper-dim" />
      </div>
    </div>
  );
}
