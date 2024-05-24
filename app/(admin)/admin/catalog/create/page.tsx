import CreateBookForm from '@/components/admin/forms/CreateBookForm';
import { getAllAuthors, getAllCategories, getAllPublishers } from '@/lib/data';

export default async function Page() {
  const [authors, publishers, categories] = await Promise.all([
    getAllAuthors(),
    getAllPublishers(),
    getAllCategories(),
  ]);

  return (
    <CreateBookForm
      categories={categories}
      authors={authors}
      publishers={publishers}
    />
  );
}
