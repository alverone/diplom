'use client';

import styles from '@/app/components/nav_link_item/styles.module.css';
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
      className={`${styles.navLink} ${shouldHighlight && styles.highlighted}`}
    >
      <li>{text}</li>
    </Link>
  );
}
