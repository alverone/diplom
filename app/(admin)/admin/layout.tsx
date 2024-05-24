import AdminNav from '@/components/admin/AdminNav';
import SidebarTab from '@/components/SidebarTab';
import { getAppSession } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAppSession();

  if (!session || !session.user || session.user.role !== UserRole.ADMIN) {
    redirect('/login?fromAdmin=true');
  }

  return (
    <>
      <AdminNav />
      <div className="flex flex-col items-center justify-center">
        <div className="flex min-h-[70svh] w-full max-w-[1248px] flex-row justify-center px-4 md:px-6">
          <div className="mr-4 hidden w-full max-w-52 flex-col gap-1 overflow-y-scroll border-r-2 border-neutral-200 py-4 pr-4 md:flex lg:max-w-56 lg:pr-6">
            <h1 className="mb-4 text-2xl font-semibold text-neutral-950">
              Мій кабінет
            </h1>

            <SidebarTab text="Каталог книг" href="/admin/catalog" />
            <SidebarTab text="Автори" href="/admin/authors" />
            <SidebarTab text="Категорії" href="/admin/categories" />
            <SidebarTab text="Видавництва" href="/admin/publishers" />
            <SidebarTab text="Замовлення" href="/admin/orders" />
            <SidebarTab text="До основного сайту" href="/" />
            <SidebarTab text="Вихід" href="/signout" />
          </div>

          <main className="w-full p-0 xs:p-6">{children}</main>
        </div>
      </div>
    </>
  );
}
