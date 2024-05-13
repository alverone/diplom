import '@/app/globals.css';
import ProfileTab from '@/components/ProfileTab';
import { getAuthSession } from '@/lib/auth';
import { redirect, RedirectType } from 'next/navigation';

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session) {
    redirect('/', RedirectType.replace);
  }

  return (
    <main>
      <h1 className="text-3xl font-semibold text-neutral-950">Мій кабінет</h1>
      <div className="flex flex-row gap-x-4 overflow-x-scroll py-4">
        <ProfileTab text="Особисті дані" href="/account/user" />
        <ProfileTab text="Список бажаних" href="/account/wishlist" />
        <ProfileTab text="Історія замовлень" href="/account/orders" />
        <ProfileTab text="Вихід" href="/signout" />
      </div>
      {children}
    </main>
  );
}
