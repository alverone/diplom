import styles from '@/app/ui/nav/styles.module.css';
import Search from '@/app/ui/search';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import NavLinkItem from '../nav_link_item';

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.innerContainer}>
        <Link href="/">
          <Image src="/logo.svg" width={128} height={53.53} alt="" />
        </Link>
        <Suspense>
          <Search placeholder="Пошук..." />
        </Suspense>
        <div className={`${styles.links} ${styles.linksDesktop}`}>
          <ol>
            <NavLinkItem text="Автори" href="/authors" />
            <NavLinkItem text="Категорії" href="/categories" />
            <NavLinkItem text="Видавництва" href="/publishers" />
          </ol>
        </div>
      </div>
      <div className={`${styles.links} ${styles.linksMobile}`}>
        <ol>
          <NavLinkItem text="Автори" href="/authors" />
          <NavLinkItem text="Категорії" href="/categories" />
          <NavLinkItem text="Видавництва" href="/publishers" />
        </ol>
      </div>
    </nav>
  );
}
