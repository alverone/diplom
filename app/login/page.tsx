'use client';

import SimpleLoginForm from '@/components/forms/SimpleLoginForm';
import { useAppSession } from '@/lib/hooks';
import { useRouter } from 'next/navigation';

export default function Page({
  searchParams,
}: {
  searchParams: { fromAdmin?: boolean | null };
}) {
  const { session } = useAppSession();
  const router = useRouter();
  const isFromAdmin = Boolean(searchParams.fromAdmin);
  const redirectUrl = isFromAdmin ? '/admin' : '/';

  if (session && session?.user) {
    router.push(redirectUrl);
  }

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="w-full max-w-xl">
        <SimpleLoginForm onLogin={() => router.push(redirectUrl)} />
      </div>
    </main>
  );
}
