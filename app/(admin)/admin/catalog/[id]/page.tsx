import UpdateBookForm from '@/components/admin/forms/UpdateBookForm';
import {
  fetchAllAuthors,
  fetchAllCategories,
  fetchAllPublishers,
} from '@/lib/data';
import prisma from '@/lib/prisma';

export default async function Page({ params }: { params: { id: string } }) {
  const [book, authors, publishers, categories] = await Promise.all([
    (await prisma.book.findUnique({
      where: { id: params.id },
      include: {
        author: true,
        publisher: true,
        category: true,
      },
    })) as Book | null,
    fetchAllAuthors(),
    fetchAllPublishers(),
    fetchAllCategories(),
  ]);

  return (
    <UpdateBookForm
      book={book!}
      authors={authors}
      publishers={publishers}
      categories={categories}
    />
  );
}
