import SignInFormClient from "@/modules/auth/components/sign-in-form-client";
import Image from "next/image";

type SignInPageProps = {
  searchParams: Promise<{ error?: string; registered?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;

  return (
    <div className="flex flex-col items-center">
      <div className="mb-5 text-center sm:mb-7">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border bg-card shadow-lg shadow-primary/10">
          <Image src="/login.svg" alt="" height={34} width={34} className="object-contain" priority />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">HallWayLoop</p>
      </div>
      <SignInFormClient
        showCredentialsError={params.error === "CredentialsSignin"}
        registered={params.registered === "1"}
      />
    </div>
  );
}
