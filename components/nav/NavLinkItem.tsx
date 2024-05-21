'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinkItem({
  text,
  href,
}: {
  text: string;
  href: string;
}) {
  const pathname = usePathname();
  const shouldHighlight = pathname.includes(href);

  return (
    <Link
      href={href}
      className={`flex flex-row items-center justify-center p-2 text-base font-semibold ${shouldHighlight ? 'text-orange-600' : 'text-neutral-950'} no-underline transition-colors duration-200 ease-in-out hover:text-orange-600`}
    >
      <li>{text}</li>
    </Link>
  );
}
