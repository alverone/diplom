import BooksGrid from '@/components/BooksGrid';
import Pagination from '@/components/Pagination';

import {
  fetchSimpleBooksFiltered,
  fetchSimpleFilteredBooksCount,
} from '@/lib/data';
import { redirect, RedirectType } from 'next/navigation';
import { Suspense } from 'react';

export default async function Page({
  searchParams,
}: {
  searchParams: { query: string; page?: string };
}) {
  const query = searchParams.query?.trim() ?? '';
  const currentPage = Number(searchParams.page || '1');

  const [pageCount, books] = await Promise.all([
    fetchSimpleFilteredBooksCount(query),
    fetchSimpleBooksFiltered(query, currentPage),
  ]);

  if (currentPage > pageCount) {
    redirect(`/search?query=${query}`, RedirectType.replace);
  }

  if (!books || books.length == 0) {
    return (
      <>
        <div className="px-12 py-32">
          <h2 className="text-center text-xl">
            За цим пошуковим запитом товарів не знайдено.
          </h2>
        </div>
        <Suspense>
          <Pagination totalPages={1}></Pagination>
        </Suspense>
      </>
    );
  }

  return (
    <main>
      <h1 className="text-3xl font-bold text-neutral-950">Пошук</h1>
      <BooksGrid books={books} pagesCount={pageCount ?? 1} />
    </main>
  );
}
