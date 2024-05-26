import BooksGrid from '@/components/BooksGrid';
import LoadingView from '@/components/LoadingView';
import { fetchSimpleBooksPaginatedWithCount } from '@/lib/data';
import { sortOrderFromString } from '@/lib/utils';
import { Metadata } from 'next';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Каталог',
};

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page?: string;
    sortOrder?: string;
  };
}) {
  const { page } = searchParams;
  const currentPage = Number(page ?? '1');
  const sortOrder = sortOrderFromString(searchParams.sortOrder);

  const { data: books, count: pageCount } =
    await fetchSimpleBooksPaginatedWithCount(currentPage, sortOrder);

  if (currentPage > pageCount) {
    revalidatePath('/');
    redirect('/');
  }

  return (
    <main>
      <h1 className="text-2xl font-bold text-neutral-950">Каталог</h1>
      <Suspense fallback={<LoadingView />} key={`catalog/${currentPage}`}>
        <BooksGrid books={books} pagesCount={pageCount} sortOrder={sortOrder} />
      </Suspense>
    </main>
  );
}
