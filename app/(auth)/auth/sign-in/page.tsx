import SignInFormClient from '@/modules/auth/components/sign-in-form-client'
import Image from 'next/image'
import React from 'react'

const Page = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-5 text-center sm:mb-7">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border bg-card shadow-lg shadow-primary/10">
          <Image src="/login.svg" alt="" height={34} width={34} className="object-contain" priority />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">HallWayLoop</p>
      </div>
      <SignInFormClient />
    </div>
  )
}

export default Page