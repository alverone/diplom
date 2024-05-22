import GenericEditTile from '@/components/admin/GenericEditTile';
import { ButtonPrimary } from '@/components/Buttons';
import Pagination from '@/components/Pagination';
import { deleteAuthor } from '@/lib/action';
import {
  CatalogBookLimit,
  fetchAuthorsCount,
  fetchAuthorsPaginated,
} from '@/lib/data';
import { PlusIcon } from '@heroicons/react/20/solid';
import { redirect } from 'next/navigation';

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page?: string;
  };
}) {
  const { page } = searchParams;
  const currentPage = Number(page ?? '1');

  const [authors, pageCount] = await Promise.all([
    fetchAuthorsPaginated(currentPage, null, CatalogBookLimit.Admin),
    fetchAuthorsCount(CatalogBookLimit.Admin),
  ]);

  if (currentPage > pageCount) {
    redirect('/admin/authors');
  }

  return (
    <>
      <div className="mb-6 flex flex-row items-end justify-between ">
        <h1 className="text-2xl font-semibold text-neutral-950">Автори</h1>
        <ButtonPrimary
          label="Створити"
          icon={<PlusIcon width={20} height={20} />}
        />
      </div>
      <div className="mb-6 flex flex-col gap-y-4">
        {authors &&
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
          ))}
      </div>
      <Pagination totalPages={pageCount} />
    </>
  );
}
