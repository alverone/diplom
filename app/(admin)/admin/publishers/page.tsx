import { ButtonPrimary } from '@/components/Buttons';

import Pagination from '@/components/Pagination';
import {
  CatalogBookLimit,
  fetchPublishersCount,
  fetchPublishersPaginated,
} from '@/lib/data';
import { PlusIcon } from '@heroicons/react/20/solid';
import { redirect } from 'next/navigation';
import PublishersList from './PublishersList';

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page?: string;
  };
}) {
  const { page } = searchParams;
  const currentPage = Number(page ?? '1');

  const [publishers, pageCount] = await Promise.all([
    fetchPublishersPaginated(currentPage, null, CatalogBookLimit.Admin),
    fetchPublishersCount(CatalogBookLimit.Admin),
  ]);

  if (currentPage > pageCount) {
    redirect('/admin/publishers');
  }

  return (
    <>
      <div className="mb-6 flex flex-row items-end justify-between ">
        <h1 className="text-2xl font-semibold text-neutral-950">Видавництва</h1>
        <ButtonPrimary
          label="Створити"
          icon={<PlusIcon width={20} height={20} />}
        />
      </div>
      <div className="mb-6 flex flex-col gap-y-4">
        <PublishersList publishers={publishers} />
      </div>
      <Pagination totalPages={pageCount} />
    </>
  );
}
