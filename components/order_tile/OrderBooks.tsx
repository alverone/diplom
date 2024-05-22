import prisma from '@/lib/prisma';
import Image from 'next/image';

export default async function OrderBooks({ bookIds }: { bookIds: string[] }) {
  const books = Array.from(new Set(bookIds).values());
  const booksToDisplay = books.slice(0, 2);
  const extraBooksCount = books.length - booksToDisplay.length;

  const booksWithCovers = await prisma.book.findMany({
    where: {
      id: {
        in: booksToDisplay,
      },
    },
    select: {
      id: true,
      coverUrl: true,
    },
  });

  return (
    <div className="flex flex-row items-center gap-x-3 sm:px-2 sm:pr-3">
      {booksWithCovers.map((book) => (
        <Image
          src={book.coverUrl ?? 'images/placeholder_book.jpg'}
          width={48}
          height={48}
          key={book.id}
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
