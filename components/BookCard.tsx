import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function BookCard({ book }: { book: BookSimplified }) {
  return (
    <Link
      className="rounded bg-neutral-100 text-sm text-neutral-950 no-underline outline-none transition-colors duration-200 ease-in-out hover:bg-neutral-200 focus:bg-neutral-300"
      href={`/book/${book.id}`}
    >
      <div className="flex flex-col items-center justify-center">
        <Image
          key={book.id}
          className="fit-contain xs:max-h-64 xs:max-w-64 aspect-square h-auto max-h-96 w-full max-w-96 object-contain"
          src={`/books/${book.id}.jpg`}
          alt={book.title}
          width={256}
          height={256}
          priority={true}
        />
        <div className="flex w-full flex-col items-start p-3">
          <p className="text-xl font-semibold text-neutral-950">{book.title}</p>
          <p className="mt-1 text-base font-medium text-neutral-800">
            {book.author.name}
          </p>
          <p className="mt-0.5 text-lg font-semibold text-orange-700">
            {formatCurrency(book.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}
