import BooksGrid from '@/components/BooksGrid';
import LoadingView from '@/components/LoadingView';
import NotFoundPlaceholder from '@/components/NotFoundPlaceholder';
import {
  fetchAuthorById,
  fetchSimpleBooksByAuthor,
  fetchSimpleBooksCountByAuthor,
} from '@/lib/data';
import { sortOrderFromString } from '@/lib/utils';
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
  const author = await fetchAuthorById(id);

  if (!author) {
    return <NotFoundPlaceholder />;
  }

  const [pageCount, books] = await Promise.all([
    fetchSimpleBooksCountByAuthor(author.id),
    fetchSimpleBooksByAuthor(
      currentPage,
      author.id,
      sortOrderFromString(sortOrder),
    ),
  ]);

  return (
    <main>
      <h1 className="text-3xl font-bold text-neutral-950">{author.name}</h1>
      <Suspense fallback={<LoadingView />}>
        <BooksGrid books={books} pagesCount={pageCount} sortOrder={sortOrder} />
      </Suspense>
    </main>
  );
}
