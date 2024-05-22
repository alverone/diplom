import UpdatePublisherForm from '@/components/admin/forms/UpdatePublisherForm';
import prisma from '@/lib/prisma';

export default async function Page({ params }: { params: { id: string } }) {
  const publisher = await prisma.publisher.findUnique({
    where: { id: params.id },
  });

  return <UpdatePublisherForm publisher={publisher!} />;
}
