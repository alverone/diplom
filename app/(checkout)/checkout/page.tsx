'use client';

import { ButtonPrimary } from '@/components/Buttons';
import BookTile from '@/components/cart_drawer/BookTile';
import LoadingView from '@/components/LoadingView';
import { useAppSelector } from '@/lib/hooks';
import { notFound, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import CheckoutForm from './CheckoutForm';

export default function Page() {
  const router = useRouter();
  const { books } = useAppSelector((state) => state.reducer.checkout);
  const [loadedBooks, setLoadedBooks] = useState<BookSimplified[] | null>(null);
  const [success, setSuccess] = useState(false);

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

  if (!success && (!books || books.length === 0)) {
    notFound();
  }

  if (success) {
    return (
      <main className="flex min-h-[512px] flex-col items-center justify-center">
        <div className="max-w-xl p-6">
          <h2 className="text-center text-2xl font-bold text-neutral-950">
            Замовлення успішно створене!
          </h2>
          <p className="mb-6 mt-1 text-center text-lg text-neutral-700">
            Підтвердження замовлення буде відправлено на вказану електронну
            пошту.
          </p>
          <ButtonPrimary
            label="До каталогу"
            onClick={() => router.push('/')}
            fullWidth={true}
          />
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="flex w-full flex-col-reverse items-center justify-center gap-6 py-4 laptop:flex-row laptop:items-start lg:gap-x-8 xl:gap-x-12">
        <CheckoutForm onSuccess={() => setSuccess(true)} />

        <div className="flex h-auto w-full flex-col">
          <h2 className="invisible mb-4 hidden text-2xl font-semibold text-neutral-950 laptop:visible laptop:inline">
            4. Замовлення:
          </h2>
          <div className="flex h-auto w-full flex-col gap-y-4 rounded-md border-2 border-neutral-200 p-3 xs:p-6 sm:min-w-[420px]">
            <Suspense fallback={<LoadingView />}>
              {(loadedBooks?.length ?? 0) > 0 &&
                loadedBooks!.map((book, index) => (
                  <BookTile
                    key={book.id}
                    book={book}
                    count={books.find((b) => b.id == book.id)?.count ?? 1}
                    includeBorder={index !== loadedBooks!.length - 1}
                    size={48}
                  />
                ))}
              <div className="mt-4 flex flex-row justify-between gap-x-6 border-t-2 border-orange-400/25 pt-4">
                <span className="text-lg font-bold text-neutral-950 md:text-xl">
                  Вартість замовлення:
                </span>
                <span className="text-lg font-semibold text-orange-600 md:text-xl">
                  {price} грн.
                </span>
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
