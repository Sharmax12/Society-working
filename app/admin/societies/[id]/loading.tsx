function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-muted/70 ${className}`} />
}

export default function SocietyApplicationsLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8" aria-busy="true" aria-label="Loading applications">
      <Skeleton className="h-5 w-32" />
      <section className="mt-5 rounded-[2rem] border bg-card p-6 shadow-sm sm:p-8">
        <Skeleton className="h-7 w-44" />
        <Skeleton className="mt-4 h-10 w-full max-w-md" />
        <Skeleton className="mt-3 h-5 w-full max-w-lg" />
        <div className="mt-6 flex gap-2"><Skeleton className="h-16 w-24 rounded-xl" /><Skeleton className="h-16 w-24 rounded-xl" /></div>
      </section>
      <div className="mt-8 flex justify-between"><Skeleton className="h-6 w-28" /><Skeleton className="h-4 w-40" /></div>
      <div className="mt-4 space-y-4">
        {[1, 2, 3].map((item) => <Skeleton key={item} className="h-64 rounded-2xl" />)}
      </div>
    </main>
  )
}
