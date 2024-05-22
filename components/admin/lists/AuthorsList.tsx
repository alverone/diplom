'use client';

import GenericEditTile from '@/components/admin/GenericEditTile';
import { deleteAuthor } from '@/lib/action';

export default function AuthorsList({ authors }: { authors: Author[] }) {
  return (
    authors &&
    authors.map((a) => (
      <GenericEditTile
        editUrl={`/admin/authors/${a.id}`}
        key={a.id}
        onDeleteCallback={() => deleteAuthor(a.id)}
        deleteTitle="Видалити автора"
        deleteDescription="Ви впевнені, що хочете видалити цього автора?"
      >
        <div className="flex flex-row items-center gap-x-4">
          <p className="line-clamp-2 text-ellipsis text-base font-medium text-neutral-950">
            {a.name}
          </p>
        </div>
      </GenericEditTile>
    ))
  );
}
