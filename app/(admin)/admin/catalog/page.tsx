import CreateButton from '@/components/admin/CreateButton';
import CatalogList from '@/components/admin/lists/CatalogList';
import Pagination from '@/components/Pagination';
import {
  CatalogBookLimit,
  fetchBookPagesCount,
  fetchSimpleBooks,
} from '@/lib/data';
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
        <CreateButton />
      </div>
      <div className="mb-6 flex flex-col gap-y-4">
        <CatalogList books={books} />
      </div>
      <Pagination totalPages={pageCount} />
    </>
  );
}
