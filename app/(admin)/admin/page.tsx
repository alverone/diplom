import LoadingView from '@/components/LoadingView';
import { getAppSession } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Панель адміністратора',
};

export default async function Page() {
  const session = await getAppSession();

  if (!session || !session.user || session.user.role !== UserRole.ADMIN) {
    redirect('/login?fromAdmin=true');
  } else {
    redirect('/admin/catalog');
  }

  return (
    <main className="flex max-h-screen min-h-[512px] flex-col items-center justify-center">
      <LoadingView />
    </main>
  );
}
