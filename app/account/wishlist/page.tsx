import BooksGrid from '@/components/BooksGrid';
import LoadingView from '@/components/LoadingView';
import { getAuthSession } from '@/lib/auth';
import { fetchWishedBooks, fetchWishedBooksCount } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export default async function Page({ searchParams }: PaginatedSearchParams) {
  const { page } = searchParams;
  const currentPage = Number(page ?? '1');
  const session = await getAuthSession();
  const userId = session?.user?.id ?? '';

  const [pageCount, books] = await Promise.all([
    fetchWishedBooksCount(userId),
    fetchWishedBooks(currentPage, userId),
  ]);

  console.log(Date.now(), currentPage);

  if (!books || books.length == 0) {
    notFound();
  }

  return (
    <Suspense fallback={<LoadingView />} key={`wishlist/${currentPage}`}>
      <BooksGrid books={books} pagesCount={pageCount} />
    </Suspense>
  );
}
