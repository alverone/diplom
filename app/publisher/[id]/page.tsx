import {
  fetchBooksSimplifiedByPublisher,
  fetchBooksSimplifiedByPublisherCount,
  fetchPublisherById,
} from '@/app/lib/data';
import BooksGrid from '@/app/ui/books_grid';
import NotFoundPlaceholder from '@/app/ui/not_found_placeholder';
import styles from '@/app/publisher/[id]/styles.module.css';

export default async function Page({
  params,
}: {
  params: { id: string; page?: string };
}) {
  const publisher = await fetchPublisherById(params.id);

  if (!publisher) {
    return <NotFoundPlaceholder />;
  }

  const pageCount = await fetchBooksSimplifiedByPublisherCount(publisher.id);
  const books = await fetchBooksSimplifiedByPublisher(1, publisher.id);

  return (
    <main>
      <h1 className={styles.heading}>{publisher.name}</h1>
      <BooksGrid books={books} pagesCount={pageCount ?? 1} />
    </main>
  );
}
