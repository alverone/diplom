import LoadingView from '@/components/LoadingView';
import OrderTile from '@/components/order_tile/OrderTile';
import Pagination from '@/components/Pagination';
import { getAppSession } from '@/lib/auth';
import { getPaginatedOrdersWithCount } from '@/lib/data';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Мої замовлення',
};

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const { page } = searchParams;
  const currentPage = Number(page ?? '1');
  const session = await getAppSession();

  if (!session || !session.user) {
    redirect('/');
  }

  const userId = session.user?.id;
  const { data: orders, count: pageCount } = await getPaginatedOrdersWithCount(
    currentPage,
    userId,
  );

  if (currentPage > pageCount) {
    redirect('/account/orders?page=1');
  } else if (!orders || orders.length === 0) {
    notFound();
  }

  return (
    <Suspense fallback={<LoadingView />}>
      <div className="mb-6 flex flex-col gap-y-4">
        <h2 className="mb-4 text-lg font-semibold text-neutral-950 xs:text-xl">
          <span className="md:invisible md:hidden">Мій кабінет | </span>
          Замовлення
        </h2>
        {orders.map((order) => (
          <OrderTile order={order} key={order.id} />
        ))}
      </div>
      <Pagination totalPages={pageCount}></Pagination>
    </Suspense>
  );
}
