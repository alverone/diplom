import BooksGrid from '@/app/components/books_grid';
import styles from '@/app/home.module.css';
import { fetchBookPagesCount, fetchSimpleBooks } from './lib/data';

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug?: string };
  searchParams: {
    page?: string;
    showLoginModal?: string | boolean;
  };
}) {
  const { page, showLoginModal } = searchParams;
  const currentPage = Number(page ?? '1');
  const [books, pagesCount] = await Promise.all([
    fetchSimpleBooks(currentPage),
    fetchBookPagesCount(),
  ]);

  //console.log(`params: ${JSON.stringify(params)}`);
  //console.log(`searchParams: ${JSON.stringify(searchParams)}`);

  return (
    <main className={showLoginModal ? styles.modalShown : ''}>
      <h1 className={styles.catalogue}>Каталог</h1>
      <BooksGrid books={books} pagesCount={pagesCount} />
    </main>
  );
}
