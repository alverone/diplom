import { OrderStatus } from '@prisma/client';

export default function OrderStatusText({ status }: { status: OrderStatus }) {
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
