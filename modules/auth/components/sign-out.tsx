"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { signOutAction } from "@/modules/auth/actions/sign-out"
import { useTransition } from "react"

export function SignOutButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <form action={() => startTransition(() => signOutAction())}>
      <Button
        type="submit"
        variant="outline"
        disabled={isPending}
        className="gap-2"
      >
        <LogOut className="w-4 h-4" />
        {isPending ? "Signing out..." : "Sign out"}
      </Button>
    </form>
  )
}