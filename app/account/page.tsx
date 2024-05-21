'use client';

import LoadingView from '@/components/LoadingView';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/account/user');
  });

  return <LoadingView />;
}
