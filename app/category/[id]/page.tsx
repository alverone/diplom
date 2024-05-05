import {
  fetchBooksSimplifiedByCategory,
  fetchBooksSimplifiedByCategoryCount,
  fetchCategoryById,
} from '@/app/lib/data';
import BooksGrid from '@/app/ui/books_grid';
import NotFoundPlaceholder from '@/app/ui/not_found_placeholder';
import styles from '@/app/category/[id]/styles.module.css';

export default async function Page({
  params,
}: {
  params: { id: string; page?: string };
}) {
  const category = await fetchCategoryById(params.id);

  if (!category) {
    return <NotFoundPlaceholder />;
  }

  const pageCount = await fetchBooksSimplifiedByCategoryCount(category.id);
  const books = await fetchBooksSimplifiedByCategory(1, category.id);

  return (
    <main>
      <h1 className={styles.heading}>{category.title}</h1>
      <BooksGrid books={books} pagesCount={pageCount ?? 1} />
    </main>
  );
}
