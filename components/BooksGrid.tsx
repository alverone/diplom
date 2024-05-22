'use client';

import { SortOrder } from '@/lib/data';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import BookCard from './BookCard';
import Pagination from './Pagination';

export default function BooksGrid({
  books,
  pagesCount,
  sortOrder,
}: {
  books?: BookSimplified[];
  pagesCount: number;
  sortOrder?: SortOrder | null;
}) {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const onOptionChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    const params = new URLSearchParams(searchParams);
    if (value === 'null') {
      params.delete('sortOrder');
    } else {
      params.set('sortOrder', value.toString());
    }
    router.push(`${pathName}?${params.toString()}`);
  };

  return (
    <>
      <div className="flex w-full flex-col items-start justify-stretch self-center py-4 xs:py-6 sm:py-8 md:py-12">
        <select
          onChange={onOptionChanged}
          defaultValue={sortOrder ?? 'null'}
          className="mb-3 cursor-pointer self-end rounded border-2 border-neutral-200 px-2 py-1 text-base font-medium text-neutral-800"
        >
          <option value="null" id="clear">
            За замовчуванням
          </option>
          <option value="price_asc">Від дешевих до дорогих</option>
          <option value="price_desc">Від дорогих до дешевих</option>
          <option value="title_asc">Від А до Я</option>
          <option value="title_desc">Від Я до А</option>
          <option value="time">Новинки</option>
        </select>
        <div className="mb-4 flex w-full flex-col justify-stretch gap-3 xs:grid xs:grid-cols-2 md:grid-cols-3">
          {books && books.map((e) => <BookCard book={e} key={e.id} />)}
        </div>
        <Pagination totalPages={pagesCount}></Pagination>
      </div>
    </>
  );
}
