import BookActions from '@/components/BookActions';
import BookEdition from '@/components/BookEdition';
import { getAuthSession } from '@/lib/auth';
import { fetchBookById } from '@/lib/data';
import prisma from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getAuthSession();

  const userId = session?.user?.id ?? '';
  const bookId = params.id;

  const [book, user] = await Promise.all([
    fetchBookById(bookId),
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, wishesIds: true },
    }),
  ]);
  const wishesIds = user?.wishesIds ?? [];

  if (!book) {
    notFound();
  }

  return (
    <main className="flex flex-col items-center justify-center">
      {book && (
        <div className="flex w-full max-w-[1248px] flex-col items-start justify-center gap-y-6 py-4 text-base text-neutral-950 md:flex-row md:gap-x-6 md:py-6 lg:gap-x-12 lg:py-12">
          <Image
            className="w-full grow-0 md:w-auto md:min-w-72 md:max-w-[30vw] lg:min-w-96"
            src={`/books/${book.id}.jpg`}
            alt={book.title}
            width={580}
            height={915}
          />
          <div className="flex w-full grow flex-col items-start gap-y-5 whitespace-pre-wrap">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-bold text-neutral-950">
                {book.title}
              </h1>
              <Link
                className="text-xl font-semibold text-orange-700 no-underline transition-colors hover:text-orange-800 focus:text-orange-600"
                href={`/author/${book.author.id}`}
              >
                <h2>{book.author.name}</h2>
              </Link>
            </div>

            {book.description.split('\n').map((pa, index) => (
              <p
                className="whitespace-pre-wrap text-lg text-neutral-800"
                key={index}
              >
                {pa}
              </p>
            ))}

            <div className="flex flex-col gap-y-3">
              <div className="flex flex-col gap-x-2 text-base">
                <p>
                  Видавництво:&nbsp;
                  <Link
                    href={`/publisher/${book.publisher.id}`}
                    className="font-semibold text-orange-700 no-underline transition-colors hover:text-orange-800 focus:text-orange-600"
                  >
                    {book.publisher.name}
                  </Link>
                </p>
                <p>
                  Категорія:&nbsp;
                  <Link
                    href={`/category/${book.category.id}`}
                    className="font-semibold text-orange-700 no-underline transition-colors hover:text-orange-800 focus:text-orange-600"
                  >
                    {book.category.title}
                  </Link>
                </p>
                <p>Кількість сторінок: {book.pageLength}</p>
                <p>Рік видання: {book.publishDate.getFullYear()}</p>
              </div>
            </div>
            <BookEdition edition={book.type} />
            <div className="flex flex-row items-end justify-center gap-x-4">
              <p className="inline-block text-3xl font-bold">
                {formatCurrency(book.price)}
              </p>
              <p className="inline-block text-lg font-semibold text-green-700">
                У наявності
              </p>
            </div>
            <BookActions book={book} wishesIds={wishesIds} />
          </div>
        </div>
      )}
    </main>
  );
}
