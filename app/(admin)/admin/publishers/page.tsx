import CreateButton from '@/components/admin/CreateButton';
import PublishersList from '@/components/admin/lists/PublishersList';
import Pagination from '@/components/Pagination';
import { CatalogBookLimit, getPaginatedPublishersWithCount } from '@/lib/data';
import { redirect } from 'next/navigation';

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page?: string;
  };
}) {
  const { page } = searchParams;
  const currentPage = Number(page ?? '1');

  const { data: publishers, count: pageCount } =
    await getPaginatedPublishersWithCount(
      currentPage,
      null,
      CatalogBookLimit.ADMIN,
    );

  if (currentPage > pageCount) {
    redirect('/admin/publishers?page=1');
  }

  return (
    <>
      <div className="mb-6 flex flex-row items-end justify-between ">
        <h1 className="text-2xl font-semibold text-neutral-950">Видавництва</h1>
        <CreateButton />
      </div>
      <div className="mb-6 flex flex-col gap-y-4">
        <PublishersList publishers={publishers} />
      </div>
      <Pagination totalPages={pageCount} />
    </>
  );
}
