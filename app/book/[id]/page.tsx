import styles from '@/app/book/[id]/styles.module.css';
import Book from '@/app/components/book';
import { fetchBookById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const bookId = params.id;
  const book = await fetchBookById(bookId);

  if (!book) {
    notFound();
  }

  return (
    <main className={styles.centred}>
      <Book book={book} />
    </main>
  );
}
