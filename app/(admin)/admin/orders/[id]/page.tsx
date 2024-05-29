import UpdateOrderForm from '@/components/admin/forms/UpdateOrderForm';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Редагування замовлення',
};

export default async function Page({ params }: { params: { id: string } }) {
  const order = (await prisma.order.findUnique({
    where: { id: Number(params.id) },
  })) as Order;

  const books = await prisma.book.findMany({
    where: {
      id: {
        in: Array.from(new Set(order.bookIds).values()),
      },
    },
    include: {
      author: true,
      category: true,
      publisher: true,
    },
  });

  if (!order) {
    notFound();
  }

  return <UpdateOrderForm order={order} books={books} />;
}
