import LoadingView from '@/components/LoadingView';
import OrderTile from '@/components/order_tile/OrderTile';
import Pagination from '@/components/Pagination';
import { getAppSession } from '@/lib/auth';
import { fetchOrders, fetchOrdersPagesCount } from '@/lib/data';
import { notFound, redirect, RedirectType } from 'next/navigation';
import { Suspense } from 'react';

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
  const [orders, pageCount] = await Promise.all([
    fetchOrders(currentPage, userId),
    fetchOrdersPagesCount(userId),
  ]);

  if (currentPage > pageCount) {
    redirect('/account/orders', RedirectType.replace);
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
