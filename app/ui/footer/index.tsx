import styles from '@/app/ui/footer/styles.module.css';
import Image from 'next/image';
import Link from 'next/link';
import NavLinkItem from '../nav_link_item';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.innerContainer}>
        <Link href="/">
          <Image src="/logo.svg" width={128} height={53.53} alt="" />
        </Link>
        <div className={styles.links}>
          <ol>
            <NavLinkItem text="Автори" href="/authors" />
            <NavLinkItem text="Категорії" href="/categories" />
            <NavLinkItem text="Видавництва" href="/publishers" />
          </ol>
        </div>
      </div>
    </footer>
  );
}
