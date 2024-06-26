import CreateButton from '@/components/admin/CreateButton';
import CategoriesList from '@/components/admin/lists/CategoriesList';
import Pagination from '@/components/Pagination';
import { CatalogBookLimit, getPaginatedCategoriesWithCount } from '@/lib/data';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Категорії',
};

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page?: string;
  };
}) {
  const { page } = searchParams;
  const currentPage = Number(page ?? '1');

  const { data: categories, count: pageCount } =
    await getPaginatedCategoriesWithCount(
      currentPage,
      null,
      CatalogBookLimit.ADMIN,
    );

  if (currentPage > pageCount) {
    redirect('/admin/categories?page=1');
  }

  return (
    <>
      <div className="mb-6 flex flex-row items-end justify-between ">
        <h1 className="text-2xl font-semibold text-neutral-950">Категорії</h1>
        <CreateButton />
      </div>
      <div className="mb-6 flex flex-col gap-y-4">
        <CategoriesList categories={categories} />
      </div>
      <Pagination totalPages={pageCount} />
    </>
  );
}
