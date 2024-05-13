import BooksGrid from '@/components/BooksGrid';
import LoadingView from '@/components/LoadingView';

import {
  fetchPublisherById,
  fetchSimpleBooksByPublisher,
  fetchSimpleBooksCountByPublisher,
} from '@/lib/data';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: string };
}) {
  const { id } = params;
  const { page } = searchParams;
  const currentPage = Number(page ?? '1');
  const publisher = await fetchPublisherById(id);

  if (!publisher) {
    notFound();
  }

  const [pageCount, books] = await Promise.all([
    fetchSimpleBooksCountByPublisher(publisher.id),
    fetchSimpleBooksByPublisher(currentPage, publisher.id),
  ]);

  if (!books || books.length == 0) {
    notFound();
  }

  return (
    <main>
      <h1 className="text-3xl font-bold text-neutral-950">{publisher.name}</h1>
      <Suspense
        fallback={<LoadingView />}
        key={`${publisher.id}/${currentPage}`}
      >
        <BooksGrid books={books} pagesCount={pageCount} />
      </Suspense>
    </main>
  );
}
