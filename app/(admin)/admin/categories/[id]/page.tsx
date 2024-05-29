import UpdateCategoryForm from '@/components/admin/forms/UpdateCategoryForm';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Редагування категорії',
};

export default async function Page({ params }: { params: { id: string } }) {
  const category = await prisma.category.findUnique({
    where: { id: params.id },
  });

  return <UpdateCategoryForm category={category!} />;
}
