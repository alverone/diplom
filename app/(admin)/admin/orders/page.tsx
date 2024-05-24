import OrderTile from '@/components/order_tile/OrderTile';
import Pagination from '@/components/Pagination';
import { getPaginatedOrdersWithCount } from '@/lib/data';
import { redirect } from 'next/navigation';

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page?: string;
  };
}) {
  const { page } = searchParams;
  const currentPage = Number(page ?? '1');

  const { data: orders, count: pageCount } =
    await getPaginatedOrdersWithCount(currentPage);

  if (currentPage > pageCount) {
    redirect('/admin/orders?page=1');
  }

  return (
    <>
      <div className="mb-6 flex flex-row items-end justify-between ">
        <h1 className="text-2xl font-semibold text-neutral-950">Замовлення</h1>
      </div>
      <div className="mb-6 flex flex-col gap-y-4">
        {orders.map((order) => (
          <a href={`/admin/orders/${order.id}`} key={order.id}>
            <OrderTile order={order} />
          </a>
        ))}
      </div>

      <Pagination totalPages={pageCount} />
    </>
  );
}
