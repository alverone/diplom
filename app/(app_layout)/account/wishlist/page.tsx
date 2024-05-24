import BooksGrid from '@/components/BooksGrid';
import LoadingView from '@/components/LoadingView';
import { getAppSession } from '@/lib/auth';
import { getUserWishedBooks } from '@/lib/data';
import { sortOrderFromString } from '@/lib/utils';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function Page({ searchParams }: PaginatedSearchParams) {
  const session = await getAppSession();
  const currentPage = Number(searchParams.page ?? '1');
  const userId = session?.user?.id ?? '';
  const sortOrder = sortOrderFromString(searchParams.sortOrder);

  const { data: books, count: pageCount } = await getUserWishedBooks(
    currentPage,
    userId,
    sortOrder,
  );

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
      <BooksGrid books={books} pagesCount={pageCount} sortOrder={sortOrder} />
    </Suspense>
  );
}
