import CreateBookForm from '@/components/admin/forms/CreateBookForm';
import {
  fetchAllAuthors,
  fetchAllCategories,
  fetchAllPublishers,
} from '@/lib/data';

export default async function Page() {
  const [authors, publishers, categories] = await Promise.all([
    fetchAllAuthors(),
    fetchAllPublishers(),
    fetchAllCategories(),
  ]);

  return (
    <CreateBookForm
      categories={categories}
      authors={authors}
      publishers={publishers}
    />
  );
}
