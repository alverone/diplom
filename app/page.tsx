import BooksGrid from './ui/books_grid';
import { fetchBookPagesCount, fetchBooksSimplified } from './lib/data';
import styles from '@/app/home.module.css';

export default async function Page({
  searchParams,
}: {
  searchParams: { query?: string; page?: string };
}) {
  const currentPage = Number(searchParams.page || '1');
  const [books, pagesCount] = await Promise.all([
    fetchBooksSimplified(currentPage),
    fetchBookPagesCount(),
  ]);

  return (
    <main>
      <h1 className={styles.catalogue}>Каталог</h1>
      <BooksGrid books={books} pagesCount={pagesCount} />
    </main>
  );
}
