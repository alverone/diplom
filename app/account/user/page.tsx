import UserInfoForm from '@/components/forms/UserInfoForm';
import LoadingView from '@/components/LoadingView';

import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function Page() {
  const session = await getAuthSession();

  if (!session || !session.user) {
    redirect('/');
  }

  const userId = session.user?.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      surname: true,
      phone: true,
      email: true,
    },
  });

  if (!user) {
    await signOut({ callbackUrl: '/' });
    return;
  }

  return (
    <Suspense fallback={<LoadingView />}>
      <h2 className="mb-8 text-lg font-semibold text-neutral-950 xs:text-xl">
        <span className="md:invisible md:hidden">Мій кабінет | </span>
        Особисті дані
      </h2>

      <UserInfoForm user={user} />
    </Suspense>
  );
}