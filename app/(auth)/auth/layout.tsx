import React from "react"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 surface-grid opacity-70" />
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <Link href="/" className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border bg-background/75 px-3 py-2 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur-xl transition hover:text-foreground sm:left-8 sm:top-8">
        <ArrowLeft className="h-3.5 w-3.5" /> Back home
      </Link>
      <div className="relative z-10 w-full max-w-md">{children}</div>
      <div className="absolute bottom-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60"><Sparkles className="h-3 w-3" /> Your campus, connected</div>
    </main>
  )
}

export default AuthLayout