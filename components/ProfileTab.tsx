'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ProfileTab({
  text,
  href,
}: {
  text: string;
  href: string;
}) {
  const pathname = usePathname();
  const shouldHighlight = href ? pathname.includes(href) : false;
  const className =
    'flex items-center justify-center p-3 text-lg font-semibold no-underline transition-colors ease-in-out ' +
    (shouldHighlight
      ? 'text-white bg-orange-600 hover:bg-orange-700 focus:bg-orange-500'
      : 'text-neutral-950 bg-neutral-200 hover:bg-neutral-300 focus:bg-neutral-100');

  return (
    <Link className={className} href={href}>
      {text}
    </Link>
  );
}
