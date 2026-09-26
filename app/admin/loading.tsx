function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-muted/70 ${className}`} />
}

export default function AdminLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8" aria-busy="true" aria-label="Loading admin workspace">
      <section className="rounded-[2rem] border bg-card p-6 shadow-sm sm:p-9">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="mt-5 h-12 w-full max-w-2xl" />
        <Skeleton className="mt-3 h-5 w-full max-w-xl" />
        <div className="mt-7 flex gap-3"><Skeleton className="h-11 w-32" /><Skeleton className="h-11 w-32" /></div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => <Skeleton key={item} className="h-32 rounded-2xl" />)}
      </div>

      <section className="mt-10">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="mt-2 h-4 w-72" />
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-32 rounded-2xl" />)}
        </div>
      </section>
    </main>
  )
}
