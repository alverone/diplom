import UpdateBookForm from '@/components/admin/forms/UpdateBookForm';
import { getAllAuthors, getAllCategories, getAllPublishers } from '@/lib/data';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Редагування книги',
};

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
    getAllAuthors(),
    getAllPublishers(),
    getAllCategories(),
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
