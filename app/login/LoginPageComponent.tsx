'use client';

import SimpleLoginForm from '@/components/forms/SimpleLoginForm';
import { useAppSession } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPageComponent({
  fromAdmin,
}: {
  fromAdmin: boolean;
}) {
  const { session } = useAppSession();
  const isAdmin = session?.user?.role === 'ADMIN';
  const router = useRouter();
  const redirectUrl = fromAdmin && isAdmin ? '/admin' : '/';

  useEffect(() => {
    if (session && session?.user) {
      router.replace(redirectUrl);
    }
  }, [session]);

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="w-full max-w-xl">
        <SimpleLoginForm />
      </div>
    </main>
  );
}
