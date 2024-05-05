import {
  fetchBooksSimplifiedFiltered,
  fetchBooksSimplifiedFilteredCount,
} from '../lib/data';
import BooksGrid from '../ui/books_grid';
import styles from '@/app/search/styles.module.css';

export default async function Page({
  searchParams,
}: {
  searchParams: { query: string; page?: string };
}) {
  const query = searchParams.query?.trim() ?? '';
  const currentPage = Number(searchParams.page || '1');
  const count = await fetchBooksSimplifiedFilteredCount(query);
  const books = await fetchBooksSimplifiedFiltered(query, currentPage);

  return (
    <main>
      <h1 className={styles.heading}>Пошук</h1>
      <BooksGrid books={books} pagesCount={count ?? 1} />
    </main>
  );
}
