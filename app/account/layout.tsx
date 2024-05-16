import ProfileTab from '@/components/ProfileTab';
import { getAuthSession } from '@/lib/auth';
import {
  ArchiveBoxIcon,
  HeartIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
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
    <div className="flex min-h-[70svh] w-full max-w-[1248px] flex-row px-4 md:px-6">
      <div className="mr-4 hidden w-full max-w-52 flex-col gap-1 overflow-y-scroll border-r-2 border-neutral-200 py-4 pr-4 md:flex lg:max-w-56 lg:pr-6">
        <h1 className="mb-4 text-2xl font-semibold text-neutral-950">
          Мій кабінет
        </h1>
        <ProfileTab
          icon={<UserCircleIcon width={24} height={24} />}
          text="Особисті дані"
          href="/account/user"
        />
        <ProfileTab
          icon={<HeartIcon width={24} height={24} />}
          text="Список бажаних"
          href="/account/wishlist"
        />
        <ProfileTab
          icon={<ArchiveBoxIcon width={24} height={24} />}
          text="Історія замовлень"
          href="/account/orders"
        />
        <ProfileTab text="Вихід" href="/signout" />
      </div>

      <main className="w-full justify-stretch p-0 xs:p-6">{children}</main>
    </div>
  );
}
