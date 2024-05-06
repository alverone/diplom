import styles from '@/app/home.module.css';
import { fetchBookPagesCount, fetchSimpleBooks } from './lib/data';
import BooksGrid from './ui/books_grid';

export default async function Page({
  searchParams,
}: {
  searchParams: { query?: string; page?: string };
}) {
  const currentPage = Number(searchParams.page || '1');
  const [books, pagesCount] = await Promise.all([
    fetchSimpleBooks(currentPage),
    fetchBookPagesCount(),
  ]);

  return (
    <main>
      <h1 className={styles.catalogue}>Каталог</h1>
      <BooksGrid books={books} pagesCount={pagesCount} />
    </main>
  );
}
