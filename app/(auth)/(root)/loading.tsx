export default function Loading() {
  return (
    <main className="mx-auto flex min-h-[65vh] max-w-7xl items-center justify-center px-5 py-16 sm:px-8">
      <div className="w-full max-w-3xl space-y-5" aria-label="Loading">
        <div className="h-5 w-28 animate-pulse rounded-full bg-muted" />
        <div className="h-14 w-2/3 animate-pulse rounded-2xl bg-muted" />
        <div className="h-5 w-full max-w-xl animate-pulse rounded-full bg-muted" />
        <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => <div key={item} className="h-52 animate-pulse rounded-[1.6rem] border border-border bg-card" />)}
        </div>
      </div>
    </main>
  );
}
