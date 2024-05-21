import { formatCurrency, formatDateToLocal } from '@/lib/utils';
import OrderBooks from './OrderBooks';
import OrderStatusText from './OrderStatusText';

export default function OrderTile({ order }: { order: Order }) {
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
        <div className="flex flex-col items-end justify-center">
          <p className="text-medium text-center text-sm text-neutral-800">
            Сплачено
          </p>
          <p className="text-center text-base font-medium text-orange-600">
            {formatCurrency(order.price)}
          </p>
        </div>
      </div>
    </div>
  );
}
