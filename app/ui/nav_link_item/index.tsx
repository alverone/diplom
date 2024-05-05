'use client';

import { usePathname } from 'next/navigation';
import styles from '@/app/ui/nav_link_item/styles.module.css';
import Link from 'next/link';

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
      className={`${styles.navLink} ${shouldHighlight && styles.highlighted}`}
    >
      <li>{text}</li>
    </Link>
  );
}
