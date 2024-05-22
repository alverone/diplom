import BooksGrid from '@/components/BooksGrid';
import LoadingView from '@/components/LoadingView';
import {
  fetchCategoryById,
  fetchSimpleBooksByCategory,
  fetchSimpleBooksCountByCategory,
} from '@/lib/data';
import { sortOrderFromString } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: string; sortOrder?: string };
}) {
  const { id } = params;
  const { page } = searchParams;
  const currentPage = Number(page ?? '1');
  const category = await fetchCategoryById(id);
  const sortOrder = sortOrderFromString(searchParams.sortOrder);

  if (!category) {
    notFound();
  }

  const [pageCount, books] = await Promise.all([
    fetchSimpleBooksCountByCategory(category.id),
    fetchSimpleBooksByCategory(currentPage, category.id, sortOrder),
  ]);

  if (!books || books.length == 0) {
    notFound();
  }

  return (
    <main>
      <h1 className="text-3xl font-bold text-neutral-950">{category.title}</h1>
      <Suspense
        fallback={<LoadingView />}
        key={`${category.id}/${currentPage}`}
      >
        <BooksGrid books={books} pagesCount={pageCount} sortOrder={sortOrder} />
      </Suspense>
    </main>
  );
}
