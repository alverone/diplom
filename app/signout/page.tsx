'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      signOut({ callbackUrl: '/' });
    } else {
      router.replace('/');
    }
  }, [router, session]);

  return <></>;
}
