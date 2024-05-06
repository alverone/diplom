import {
  fetchPublisherById,
  fetchSimpleBooksByPublisher,
  fetchSimpleBooksCountByPublisher,
} from '@/app/lib/data';
import styles from '@/app/publisher/[id]/styles.module.css';
import BooksGrid from '@/app/ui/books_grid';
import NotFoundPlaceholder from '@/app/ui/not_found_placeholder';

export default async function Page({
  params,
}: {
  params: { id: string; page?: string };
}) {
  const publisher = await fetchPublisherById(params.id);

  if (!publisher) {
    return <NotFoundPlaceholder />;
  }

  const pageCount = await fetchSimpleBooksCountByPublisher(publisher.id);
  const books = await fetchSimpleBooksByPublisher(1, publisher.id);

  return (
    <main>
      <h1 className={styles.heading}>{publisher.name}</h1>
      <BooksGrid books={books} pagesCount={pageCount ?? 1} />
    </main>
  );
}
