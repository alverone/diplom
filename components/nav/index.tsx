'use client';

import styles from '@/components/nav/styles.module.css';
import { UserIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { LoginModal, closeModal, openModal } from '..';
import { ButtonTertiary } from '../Buttons';
import NavLinkItem from '../NavLinkItem';
import SearchView from '../SearchView';

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = new URLSearchParams(useSearchParams());
  const showLoginModal = searchParams.get('showLoginModal');
  const [isModalOpen, setModalOpen] = useState(Boolean(showLoginModal));

  return (
    <nav className={styles.nav}>
      <div className={styles.innerContainer}>
        <Link href="/">
          <Image src="/logo.svg" width={128} height={53.53} alt="" />
        </Link>
        <Suspense>
          <SearchView placeholder="Пошук..." />
        </Suspense>
        <div className={`${styles.links} ${styles.linksDesktop}`}>
          <ol>
            <NavLinkItem text="Автори" href="/authors" />
            <NavLinkItem text="Категорії" href="/categories" />
            <NavLinkItem text="Видавництва" href="/publishers" />
            <LoginButton
              closeLoginModal={() =>
                openModal(searchParams, pathname, router, setModalOpen)
              }
            />
          </ol>
        </div>
      </div>
      <div className={`${styles.links} ${styles.linksMobile}`}>
        <ol>
          <NavLinkItem text="Автори" href="/authors" />
          <NavLinkItem text="Категорії" href="/categories" />
          <NavLinkItem text="Видавництва" href="/publishers" />
          <LoginButton
            closeLoginModal={() =>
              openModal(searchParams, pathname, router, setModalOpen)
            }
          />
        </ol>
      </div>
      {isModalOpen && (
        <LoginModal
          onModalClosed={() =>
            closeModal(searchParams, pathname, router, setModalOpen)
          }
        />
      )}
    </nav>
  );
}

function LoginButton({ closeLoginModal }: { closeLoginModal: () => void }) {
  const { data: session } = useSession();
  const router = useRouter();

  const label = session ? 'Кабінет' : 'Увійти';
  const onClick = session ? () => router.push('/account') : closeLoginModal;

  return (
    <ButtonTertiary
      icon={<UserIcon width={20} height={20} />}
      label={label}
      onClick={onClick}
    />
  );
}
