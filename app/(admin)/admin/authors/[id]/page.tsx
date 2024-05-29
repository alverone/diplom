import UpdateAuthorForm from '@/components/admin/forms/UpdateAuthorForm';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Редагування автора',
};

export default async function Page({ params }: { params: { id: string } }) {
  const author = await prisma.author.findUnique({
    where: { id: params.id },
  });

  return <UpdateAuthorForm author={author!} />;
}
