'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ProfileTab({
  text,
  href,
  icon,
  onClick,
}: {
  text: string;
  href: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const shouldHighlight = href ? pathname.includes(href) : false;
  const className =
    'flex flex-row gap-x-2 items-center justify-start px-1 py-2 lg:text-lg text-base font-medium no-underline transition-colors ease-in-out hover:text-orange-700 focus:text-orange-500 leading-none ' +
    (shouldHighlight ? 'text-orange-600' : 'text-neutral-950');

  return (
    <Link className={className} href={href} onClick={onClick}>
      {icon}
      <span>{text}</span>
    </Link>
  );
}
