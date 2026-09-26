import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { CreateSocietyForm } from "@/modules/societies/components/create-society-form"

export default async function NewSocietyPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  if (session.user.role !== "ADMIN") redirect("/dashboard")

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Create a society</h1>
      <p className="text-muted-foreground mt-1 mb-8">
        Set up your society and define what applicants need to answer.
      </p>
      <CreateSocietyForm />
    </div>
  )
}