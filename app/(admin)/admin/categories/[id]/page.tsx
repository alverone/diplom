import UpdateCategoryForm from '@/components/admin/forms/UpdateCategoryForm';
import prisma from '@/lib/prisma';

export default async function Page({ params }: { params: { id: string } }) {
  const category = await prisma.category.findUnique({
    where: { id: params.id },
  });

  return <UpdateCategoryForm category={category!} />;
}
