import Image from 'next/image';

export default function OrderBooks({ bookIds }: { bookIds: string[] }) {
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
