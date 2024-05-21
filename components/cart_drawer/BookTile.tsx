'use client';

import {
  decrementBookCount,
  incrementBookCount,
  removeBook,
} from '@/lib/features/checkout/checkout_slice';
import { useAppDispatch } from '@/lib/hooks';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { BookType } from '@prisma/client';
import Image from 'next/image';
import CrossIcon from '../CrossIcon';

export default function BookTile({
  book,
  count,
}: {
  book: BookSimplified;
  count: number;
}) {
  const dispatch = useAppDispatch();

  return (
    <div className="relative mb-5 flex flex-row items-center gap-x-2 border-b-2 border-neutral-200 pb-5">
      <Image
        width="64"
        height="64"
        src={`/books/${book.id}.jpg`}
        alt=""
        className="self-center"
      />
      <div className="flex grow flex-col gap-y-2">
        <span className="text-base font-bold text-neutral-950">
          {book.title}
        </span>
        {book?.author && (
          <span className="text-sm font-medium leading-none text-neutral-700">
            {book.author.name}
          </span>
        )}
        <span className="text-base font-semibold leading-5 text-orange-600">
          {book.price} грн.
          <span className="font-normal text-neutral-600">&nbsp;•&nbsp;</span>
          <span className="rounded text-sm font-medium text-green-700">
            {book.type == BookType.ELECTRONIC ? 'Електронна' : 'Паперова'}
          </span>
        </span>
      </div>
      <div className="align-end flex h-full flex-row items-center justify-center gap-x-0.5 self-end">
        <a
          href="#"
          className="inline text-sm leading-none"
          onClick={() => dispatch(decrementBookCount(book.id))}
        >
          <MinusIcon width={20} height={20} />
        </a>
        <input
          type="number"
          className="w-12 min-w-12 max-w-12 rounded-md border-2 border-solid border-orange-300 p-0 text-center text-base text-slate-950 transition-colors duration-200 ease-in-out focus:border-orange-400 focus:outline-none"
          value={count}
          readOnly
        />
        <a
          href="#"
          className="inline text-sm leading-none"
          onClick={() => dispatch(incrementBookCount(book.id))}
        >
          <PlusIcon width={20} height={20} />
        </a>
      </div>
      <CrossIcon
        width={24}
        height={24}
        className="absolute -right-1 -top-1 p-1 text-neutral-500"
        onClick={() => dispatch(removeBook(book.id))}
      />
    </div>
  );
}
