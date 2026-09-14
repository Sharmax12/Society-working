function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-muted/70 ${className}`} />
}

export default function DashboardLoading() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8" aria-busy="true" aria-label="Loading dashboard">
        <section className="rounded-[2rem] border bg-card p-6 shadow-sm sm:p-9">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-5 h-12 w-64 max-w-full" />
          <Skeleton className="mt-3 h-5 w-full max-w-xl" />
        </section>

        <div className="grid gap-3 py-7 sm:grid-cols-3">
          {[1, 2, 3].map((item) => <Skeleton key={item} className="h-36 rounded-2xl" />)}
        </div>

        <section className="mt-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-72 max-w-full" />
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => <Skeleton key={item} className="h-56 rounded-[1.6rem]" />)}
          </div>
        </section>
      </div>
    </main>
  )
}
