import LoadingView from '@/components/LoadingView';
import Pagination from '@/components/Pagination';
import { getAuthSession } from '@/lib/auth';
import { fetchOrders, fetchOrdersPagesCount } from '@/lib/data';
import { formatCurrency, formatDateToLocal } from '@/lib/utils';
import { OrderStatus } from '@prisma/client';
import Image from 'next/image';
import { notFound, redirect, RedirectType } from 'next/navigation';
import { Suspense } from 'react';

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const { page } = searchParams;
  const currentPage = Number(page ?? '1');
  const session = await getAuthSession();

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
    return;
  } else if (!orders || orders.length === 0) {
    notFound();
    return;
  }

  return (
    <Suspense fallback={<LoadingView />}>
      <div className="mb-6 flex flex-col gap-y-4">
        {orders.map((o) => (
          <OrderTile order={o} key={o.id} />
        ))}
      </div>
      <Pagination totalPages={pageCount}></Pagination>
    </Suspense>
  );
}

function OrderTile({ order }: { order: Order }) {
  return (
    <div className="align-center flex flex-col justify-between gap-y-6 rounded-md border-[1.5px] border-neutral-300 px-4 py-3 sm:flex-row sm:gap-y-0">
      <div>
        <div className="mb-1 flex w-fit flex-row items-baseline justify-start">
          <h3 className="text-lg font-semibold text-neutral-950">
            №&nbsp;{order.id}
          </h3>
          <span className="text-medium text-sm text-neutral-800">
            &nbsp;від {formatDateToLocal(order.createdAt)}
          </span>
        </div>
        <OrderStatusText status={order.status} />
      </div>
      <div className="flex flex-row justify-between gap-x-4 sm:justify-end">
        <div className="flex flex-row">
          <OrderBooks bookIds={order.bookIds} />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-medium text-center text-sm text-neutral-800">
            Сплачено
          </p>
          <p className="text-center text-base font-medium text-neutral-950">
            {formatCurrency(order.price)}
          </p>
        </div>
      </div>
    </div>
  );
}

function OrderStatusText({ status }: { status: OrderStatus }) {
  const statusText = {
    [OrderStatus.CREATED]: 'Створено',
    [OrderStatus.ACCEPTED]: 'Прийнято',
    [OrderStatus.PROCESSING]: 'Обробляється',
    [OrderStatus.SHIPPED]: 'Відправлено',
    [OrderStatus.COMPLETED]: 'Завершено',
  }[status];
  const statusColorClass = {
    [OrderStatus.CREATED]: 'text-yellow-600',
    [OrderStatus.ACCEPTED]: 'text-yellow-600',
    [OrderStatus.PROCESSING]: 'text-yellow-600',
    [OrderStatus.SHIPPED]: 'text-blue-600',
    [OrderStatus.COMPLETED]: 'text-green-600',
  }[status];

  const className = 'text-base font-medium ' + statusColorClass;

  return <p className={className}>{statusText}</p>;
}

function OrderBooks({ bookIds }: { bookIds: string[] }) {
  const books = Array.from(new Set(bookIds).values());
  const booksToDisplay = books.slice(0, 2);
  const extraBooksCount = books.length - booksToDisplay.length;

  return (
    <div className="flex flex-row items-center gap-x-3 sm:px-2 sm:pr-3">
      {booksToDisplay.map((id) => (
        <Image
          src={`/books/${id}.jpg`}
          width={48}
          height={48}
          key={id}
          alt=""
          className="h-12 w-auto"
        />
      ))}
      {extraBooksCount > 0 && (
        <p className="w-6 text-center text-lg font-semibold text-neutral-700">
          +{extraBooksCount}
        </p>
      )}
    </div>
  );
}
