import BooksGrid from '@/components/BooksGrid';
import LoadingView from '@/components/LoadingView';
import { getAuthSession } from '@/lib/auth';
import { fetchWishedBooks, fetchWishedBooksCount } from '@/lib/data';
import { sortOrderFromString } from '@/lib/utils';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function Page({ searchParams }: PaginatedSearchParams) {
  const { page, sortOrder } = searchParams;
  const currentPage = Number(page ?? '1');
  const session = await getAuthSession();
  const userId = session?.user?.id ?? '';

  const [pageCount, books] = await Promise.all([
    fetchWishedBooksCount(userId),
    fetchWishedBooks(currentPage, userId, sortOrderFromString(sortOrder)),
  ]);

  if (currentPage > pageCount) {
    redirect('/account/wishlist');
  }

  if (!books || books.length == 0) {
    notFound();
  }

  return (
    <Suspense fallback={<LoadingView />} key={`wishlist/${currentPage}`}>
      <h2 className="text-lg font-semibold text-neutral-950 xs:text-xl">
        <span className="md:invisible md:hidden">Мій кабінет | </span>Список
        обраного
      </h2>
      <BooksGrid books={books} pagesCount={pageCount} />
    </Suspense>
  );
}
