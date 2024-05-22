import GenericEditTile from '@/components/admin/GenericEditTile';
import { ButtonPrimary } from '@/components/Buttons';
import Pagination from '@/components/Pagination';
import {
  CatalogBookLimit,
  fetchBookPagesCount,
  fetchSimpleBooks,
} from '@/lib/data';
import { PlusIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
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

  const [books, pageCount] = await Promise.all([
    fetchSimpleBooks(currentPage, null, CatalogBookLimit.Admin),
    fetchBookPagesCount(CatalogBookLimit.Admin),
  ]);

  if (currentPage > pageCount) {
    redirect('/admin/catalog');
  }

  return (
    <>
      <div className="mb-6 flex flex-row items-end justify-between ">
        <h1 className="text-2xl font-semibold text-neutral-950">Каталог</h1>
        <ButtonPrimary
          label="Створити"
          icon={<PlusIcon width={20} height={20} />}
        />
      </div>
      <div className="mb-6 flex flex-col gap-y-4">
        {books &&
          books.map((b) => (
            <GenericEditTile
              editUrl={`/admin/catalog/${b.id}`}
              key={b.id}
              onDeleteCallback={() => { }}
              deleteTitle="Видалити книгу"
              deleteDescription="Ви впевнені, що хочете видалити цю книгу?"
            >
              <div className="flex flex-row items-center gap-x-4">
                <div className="flex h-16 w-16 flex-col items-center justify-center">
                  <Image
                    src={b.coverUrl ?? 'images/placeholder_book.jpg'}
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
          ))}
      </div>
      <Pagination totalPages={pageCount} />
    </>
  );
}
