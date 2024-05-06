import styles from '@/app/book/[id]/styles.module.css';
import { fetchBookById } from '@/app/lib/data';
import Book from '@/app/ui/book';
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
