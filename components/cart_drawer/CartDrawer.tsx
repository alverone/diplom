'use client';

import { toggleCart } from '@/lib/features/drawers/drawers_slice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Suspense, useEffect, useState } from 'react';
import { ButtonPrimary } from '../Buttons';
import CrossIcon from '../CrossIcon';
import LoadingView from '../LoadingView';
import BookTile from './BookTile';
import EmptyView from './EmptyView';

export default function CartDrawer() {
  const dispatch = useAppDispatch();
  const { books } = useAppSelector((state) => state.reducer.checkout);

  const [loadedBooks, setLoadedBooks] = useState<BookSimplified[] | null>(null);

  useEffect(() => {
    const uniqueBookIds = Array.from(new Set(books.map((b) => b.id)).values());

    fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookIds: uniqueBookIds }),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoadedBooks(res.data);
      })
      .catch((e) => console.error(e));
  }, [books]);

  const price =
    loadedBooks?.reduce(
      (acc, book) =>
        acc +
        book.price * (books.find((inner) => book.id == inner.id)?.count ?? 1),
      0,
    ) ?? 0;

  return (
    <div className="flex h-full w-screen max-w-[512px] flex-col bg-neutral-100">
      <div className="align-center flex w-full grow-0 flex-row justify-between gap-x-6 bg-white px-6 py-4">
        <h2 className="text-2xl font-bold text-neutral-950">Кошик</h2>
        <CrossIcon
          className="p-1"
          width={24}
          height={24}
          onClick={() => dispatch(toggleCart(false))}
        />
      </div>

      <div className="h-full w-full grow overflow-y-scroll p-6">
        <Suspense fallback={<LoadingView />}>
          {loadedBooks === null && <LoadingView />}
          {(loadedBooks?.length ?? 0) > 0 &&
            loadedBooks!.map((book) => (
              <BookTile
                key={book.id}
                book={book}
                count={books.find((b) => b.id == book.id)?.count ?? 1}
              />
            ))}
          {loadedBooks?.length == 0 && (
            <EmptyView onBtnClicked={() => dispatch(toggleCart(false))} />
          )}
        </Suspense>
      </div>

      {(loadedBooks?.length ?? 0) > 0 && (
        <div className="flex w-full flex-col justify-between gap-y-3 bg-white px-6 py-4">
          <div className="flex flex-row justify-between gap-x-6">
            <span className="text-xl font-bold text-orange-950">Всього:</span>
            <Suspense>
              <span className="text-xl font-semibold text-orange-600">
                {price} грн.
              </span>
            </Suspense>
          </div>
          <ButtonPrimary
            label="Оформити замовлення"
            onClick={function () {}}
            fullWidth={true}
          />
        </div>
      )}
    </div>
  );
}
