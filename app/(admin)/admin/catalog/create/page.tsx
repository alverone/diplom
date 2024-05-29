import CreateBookForm from '@/components/admin/forms/CreateBookForm';
import { getAllAuthors, getAllCategories, getAllPublishers } from '@/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Додавання книги',
};

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
