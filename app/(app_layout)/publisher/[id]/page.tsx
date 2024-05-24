import BooksGrid from '@/components/BooksGrid';
import LoadingView from '@/components/LoadingView';

import {
  CatalogBookLimit,
  fetchSimpleBooksPaginatedWithCount,
  getPublisherDetails,
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

  const sortOrder = sortOrderFromString(searchParams.sortOrder);
  const currentPage = Number(page ?? '1');
  const publisher = await getPublisherDetails(id);

  if (!publisher) {
    notFound();
  }

  const { data: books, count: pageCount } =
    await fetchSimpleBooksPaginatedWithCount(
      currentPage,
      sortOrder,
      CatalogBookLimit.DEFAULT,
      {
        publisherId: publisher.id,
      },
    );

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
