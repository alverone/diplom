import styles from '@/app/category/[id]/styles.module.css';
import BooksGrid from '@/app/components/books_grid';
import NotFoundPlaceholder from '@/app/components/not_found_placeholder';
import {
  fetchCategoryById,
  fetchSimpleBooksByCategory,
  fetchSimpleBooksCountByCategory,
} from '@/app/lib/data';

export default async function Page({
  params,
}: {
  params: { id: string; page?: string };
}) {
  const category = await fetchCategoryById(params.id);

  if (!category) {
    return <NotFoundPlaceholder />;
  }

  const pageCount = await fetchSimpleBooksCountByCategory(category.id);
  const books = await fetchSimpleBooksByCategory(1, category.id);

  return (
    <main>
      <h1 className={styles.heading}>{category.title}</h1>
      <BooksGrid books={books} pagesCount={pageCount ?? 1} />
    </main>
  );
}
