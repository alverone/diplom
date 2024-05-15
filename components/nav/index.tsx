'use client';

import styles from '@/components/nav/styles.module.css';
import { useWindowDimensions } from '@/lib/hooks';
import {
  ArchiveBoxIcon,
  HeartIcon,
  UserCircleIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Drawer } from '@mui/material';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { LoginModal, closeModal, openModal } from '..';
import { ButtonTertiary } from '../Buttons';
import NavLinkItem from '../NavLinkItem';
import ProfileTab from '../ProfileTab';
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
        <div className={styles.linksDesktop}>
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
      <div className={styles.linksMobile}>
        <ol>
          <NavLinkItem text="Автори" href="/authors" />
          <NavLinkItem text="Категорії" href="/categories" />
          <NavLinkItem text="Видавництва" href="/publishers" />
        </ol>
        <LoginButton
          closeLoginModal={() =>
            openModal(searchParams, pathname, router, setModalOpen)
          }
        />
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
  const { width } = useWindowDimensions();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const isInAccount = pathname.includes('/account');
  const router = useRouter();

  const label = session ? 'Кабінет' : 'Увійти';
  const onClick = session
    ? () => {
        if (isInAccount && width < 768) {
          setDrawerOpen(true);
        } else {
          router.push('/account/user');
        }
      }
    : closeLoginModal;

  return (
    <>
      <ButtonTertiary
        icon={<UserIcon width={20} height={20} />}
        label={label}
        onClick={onClick}
      />
      <Drawer
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        anchor="right"
      >
        <Sidebar onModalClosed={() => setDrawerOpen(false)} />
      </Drawer>
    </>
  );
}

function Sidebar({ onModalClosed }: { onModalClosed?: () => void }) {
  return (
    <div className="flex w-screen max-w-[300px] flex-col gap-4 overflow-y-scroll p-4">
      <div className="mb-4 flex flex-row items-center justify-between gap-x-4">
        <h1 className="text-2xl font-semibold text-neutral-950">Мій кабінет</h1>
        <XMarkIcon onClick={onModalClosed} width={24} height={24} />
      </div>
      <ProfileTab
        icon={<UserCircleIcon width={24} height={24} />}
        text="Особисті дані"
        href="/account/user"
        onClick={onModalClosed}
      />
      <ProfileTab
        icon={<HeartIcon width={24} height={24} />}
        text="Список бажаних"
        href="/account/wishlist"
        onClick={onModalClosed}
      />
      <ProfileTab
        icon={<ArchiveBoxIcon width={24} height={24} />}
        text="Історія замовлень"
        href="/account/orders"
        onClick={onModalClosed}
      />
      <ProfileTab text="Вихід" href="/signout" onClick={onModalClosed} />
    </div>
  );
}
