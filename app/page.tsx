import BooksGrid from '@/components/BooksGrid';
import LoadingView from '@/components/LoadingView';
import { fetchBookPagesCount, fetchSimpleBooks } from '@/lib/data';
import { Suspense } from 'react';

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
    fetchSimpleBooks(currentPage),
    fetchBookPagesCount(),
  ]);

  return (
    <main>
      <h1 className="text-3xl text-neutral-950">Каталог</h1>
      <Suspense fallback={<LoadingView />} key={`catalog/${currentPage}`}>
        <BooksGrid books={books} pagesCount={pageCount} />
      </Suspense>
    </main>
  );
}
