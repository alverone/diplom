'use client';

import { generatePagination } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page') || 1);
  const allPages = generatePagination(currentPage, totalPages);

  function createPageURL(pageNumber: string | number): string {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathName}?${params.toString()}`;
  }

  return (
    <div className="flex w-full flex-row items-center justify-center gap-x-6">
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />
      <div className="flex flex-row gap-x-3">
        {allPages.map((page, index) => {
          let position: 'first' | 'last' | 'single' | 'middle' | undefined;

          if (index === 0) position = 'first';
          if (index === allPages.length - 1) position = 'last';
          if (allPages.length === 1) position = 'single';
          if (page === '...') position = 'middle';

          return (
            <PaginationNumber
              key={page === '...' ? index : page}
              href={createPageURL(page)}
              page={page}
              position={position}
              isActive={page !== '...' && currentPage === page}
            />
          );
        })}
      </div>
      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: 'first' | 'last' | 'middle' | 'single';
  isActive: boolean;
}) {
  const className =
    'text-xl font-semibold no-underline transition-colors duration-150 hover:text-orange-600 focus:text-orange-800' +
    (isActive || position == 'middle'
      ? ' text-orange-700'
      : ' text-neutral-950');

  return isActive && position === 'middle' ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}) {
  const icon =
    direction === 'left' ? (
      <ChevronLeftIcon width={24} height={24} color="#0d0d0d" />
    ) : (
      <ChevronRightIcon width={24} height={24} color="#0d0d0d" />
    );

  return isDisabled ? (
    <div className="flex h-9 w-9 items-center justify-center rounded bg-neutral-300 opacity-25">
      {icon}
    </div>
  ) : (
    <Link
      className="flex h-9 w-9 items-center justify-center rounded bg-neutral-300 transition-colors duration-200 hover:bg-neutral-400 focus:bg-neutral-200"
      href={href}
    >
      {icon}
    </Link>
  );
}
