import { setSocietyVerification } from "@/modules/platform/actions"

export function VerificationControls({
  societyId,
  status,
}: {
  societyId: string
  status: "PENDING" | "VERIFIED" | "SUSPENDED"
}) {
  return (
    <div className="flex shrink-0 flex-wrap justify-end gap-2">
      {status !== "VERIFIED" && (
        <form action={async () => { "use server"; await setSocietyVerification(societyId, "VERIFIED") }}>
          <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground">
            Verify
          </button>
        </form>
      )}
      {status !== "SUSPENDED" && (
        <form action={async () => { "use server"; await setSocietyVerification(societyId, "SUSPENDED") }}>
          <button type="submit" className="rounded-lg border px-3 py-2 text-xs font-bold text-muted-foreground hover:text-destructive">
            Suspend
          </button>
        </form>
      )}
    </div>
  )
}
