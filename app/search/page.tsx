import BooksGrid from '.@/app/components/books_grid';
import styles from '@/app/search/styles.module.css';
import {
  fetchSimpleBooksFiltered,
  fetchSimpleFilteredBooksCount,
} from '../lib/data';

export default async function Page({
  searchParams,
}: {
  searchParams: { query: string; page?: string };
}) {
  const query = searchParams.query?.trim() ?? '';
  const currentPage = Number(searchParams.page || '1');

  const count = await fetchSimpleFilteredBooksCount(query);
  const books = await fetchSimpleBooksFiltered(query, currentPage);

  return (
    <main>
      <h1 className={styles.heading}>Пошук</h1>
      <BooksGrid books={books} pagesCount={count ?? 1} />
    </main>
  );
}
