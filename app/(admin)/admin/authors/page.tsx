import CreateButton from '@/components/admin/CreateButton';
import AuthorsList from '@/components/admin/lists/AuthorsList';
import Pagination from '@/components/Pagination';
import {
  CatalogBookLimit,
  fetchAuthorsCount,
  fetchAuthorsPaginated,
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
        <CreateButton />
      </div>
      <div className="mb-6 flex flex-col gap-y-4">
        <AuthorsList authors={authors} />
      </div>
      <Pagination totalPages={pageCount} />
    </>
  );
}
