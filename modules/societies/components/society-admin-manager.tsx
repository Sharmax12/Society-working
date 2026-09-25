import { addSocietyAdminFromForm, removeSocietyAdminFromForm } from "@/modules/societies/admin-queries"

type Admin = {
  user: { id: string; name: string | null; email: string; image: string | null }
  createdAt: Date
}

export function SocietyAdminManager({
  societyId,
  admins,
}: {
  societyId: string
  admins: Admin[]
}) {
  return (
    <section className="rounded-2xl border bg-card/80 p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Tenant access</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight">Society admins</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Only these admins can manage this society&apos;s applications and events.
          </p>
        </div>
        <span className="text-xs font-semibold text-muted-foreground">{admins.length} admin{admins.length === 1 ? "" : "s"}</span>
      </div>

      <form action={addSocietyAdminFromForm} className="mt-5 flex flex-col gap-2 sm:flex-row">
        <input type="hidden" name="societyId" value={societyId} />
        <input
          name="email"
          type="email"
          required
          placeholder="admin@college.edu"
          className="h-11 min-w-0 flex-1 rounded-xl border bg-background px-3 text-sm"
          aria-label="Admin email"
        />
        <button type="submit" className="h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5">
          Add admin
        </button>
      </form>

      <div className="mt-5 divide-y rounded-xl border">
        {admins.map(({ user }, index) => (
          <div key={user.id} className="flex items-center justify-between gap-4 p-3.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name || user.email}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            {index === 0 ? (
              <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                Primary owner
              </span>
            ) : (
              <form action={removeSocietyAdminFromForm}>
                <input type="hidden" name="societyId" value={societyId} />
                <input type="hidden" name="userId" value={user.id} />
                <button type="submit" className="text-xs font-semibold text-muted-foreground transition hover:text-destructive">
                  Remove
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
