import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import { trpc } from '../_trpc/client'

const Page = async () => {
    const { getUser } = getKindeServerSession();
    const currentUser = await getUser();

    if (currentUser === null || currentUser.id === null) {
        console.log("User redirected to auth callback")
        redirect('/auth-callback?origin=dashboard')
    }



  return (
    <div>Email: {currentUser?.email}</div>
  )
}

export default Page