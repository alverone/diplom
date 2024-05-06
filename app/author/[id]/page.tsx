import styles from '@/app/author/[id]/styles.module.css';
import {
  fetchAuthorById,
  fetchSimpleBooksByAuthor,
  fetchSimpleBooksCountByAuthor,
} from '@/app/lib/data';
import BooksGrid from '@/app/ui/books_grid';
import NotFoundPlaceholder from '@/app/ui/not_found_placeholder';

export default async function Page({
  params,
}: {
  params: { id: string; page?: string };
}) {
  const author = await fetchAuthorById(params.id);

  if (!author) {
    return <NotFoundPlaceholder />;
  }

  const pageCount = await fetchSimpleBooksCountByAuthor(author.id);
  const books = await fetchSimpleBooksByAuthor(1, author.id);

  return (
    <main>
      <h1 className={styles.heading}>{author.name}</h1>
      <BooksGrid books={books} pagesCount={pageCount ?? 1} />
    </main>
  );
}
