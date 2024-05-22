'use client';

import GenericEditTile from '@/components/admin/GenericEditTile';
import { deleteBook } from '@/lib/action';
import Image from 'next/image';

export default function CatalogList({ books }: { books: BookSimplified[] }) {
  return (
    books &&
    books.map((b) => (
      <GenericEditTile
        editUrl={`/admin/catalog/${b.id}`}
        key={b.id}
        onDeleteCallback={() => deleteBook(b.id)}
        deleteTitle={b.title}
        deleteDescription="Ви впевнені, що хочете видалити цю книгу?"
      >
        <div className="flex flex-row items-center gap-x-4">
          <div className="flex h-16 w-16 flex-col items-center justify-center">
            <Image
              src={b.coverUrl ?? '/placeholder_book.jpg'}
              width={64}
              height={64}
              key={b.id}
              alt={b.title}
              className="h-16 w-auto"
            />
          </div>
          <p className="line-clamp-2 text-ellipsis text-base font-medium text-neutral-950">
            {b.title}
          </p>
        </div>
      </GenericEditTile>
    ))
  );
}
