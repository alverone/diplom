'use client';

import GenericEditTile from '@/components/admin/GenericEditTile';
import { deleteCategory } from '@/lib/action';

export default function CategoriesList({
  categories,
}: {
  categories: Category[];
}) {
  return categories.map((c) => (
    <GenericEditTile
      editUrl={`/admin/categories/${c.id}`}
      key={c.id}
      onDeleteCallback={() => deleteCategory(c.id)}
      deleteTitle="Видалити категорію"
      deleteDescription="Ви впевнені, що хочете видалити цю категорію?"
    >
      <div className="flex flex-row items-center gap-x-4">
        <p className="line-clamp-2 text-ellipsis text-base font-medium text-neutral-950">
          {c.title}
        </p>
      </div>
    </GenericEditTile>
  ));
}
