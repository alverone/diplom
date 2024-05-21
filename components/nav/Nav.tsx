'use client';

import { toggleCart, toggleNav } from '@/lib/features/drawers/drawers_slice';
import {
  useAppDispatch,
  useAppSelector,
  useWindowDimensions,
} from '@/lib/hooks';
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';
import { Drawer } from '@mui/material';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ButtonTertiary } from '../Buttons';
import CartDrawer from '../cart_drawer/CartDrawer';
import LoginForm from '../forms/LoginForm';
import RegistrationForm from '../forms/RegistrationForm';
import {
  closeModal,
  GenericModalWrapper,
  openModal,
} from '../GenericModalWrapper';
import ProfileNavDrawer from './ProfileNavDrawer';
import SearchView from './SearchView';

const loginModalParamName = 'showLoginModal';

export default function Nav() {
  const dispatch = useAppDispatch();
  const { navOpen, cartOpen } = useAppSelector((state) => state.drawers);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { width: windowWidth } = useWindowDimensions();
  const [isLoginModalSelected, setLoginModalSelected] = useState(true);
  const searchParams = useSearchParams();
  const urlSearchParams = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams],
  );
  const showLoginModal = searchParams.get(loginModalParamName);
  const [isModalOpen, setModalOpen] = useState(Boolean(showLoginModal));

  const showBtnLabels = windowWidth > 768 || windowWidth < 480;

  useEffect(() => {
    if (session && showLoginModal) {
      closeModal(
        loginModalParamName,
        urlSearchParams,
        pathname,
        router,
        setModalOpen,
      );
    }
  }, [session, showLoginModal, pathname, router, urlSearchParams]);

  const onLoginBtnClick = () => {
    if (session) {
      if (windowWidth < 768) {
        dispatch(toggleNav(true));
      } else {
        router.push('/account/user');
      }
    } else {
      openModal(
        loginModalParamName,
        urlSearchParams,
        pathname,
        router,
        setModalOpen,
      );
    }
  };

  const onLoginModalClosed = () => {
    setLoginModalSelected(true);
    closeModal(
      loginModalParamName,
      urlSearchParams,
      pathname,
      router,
      setModalOpen,
    );
  };
  /*
<ol>
  <NavLinkItem text="Автори" href="/authors" />
  <NavLinkItem text="Категорії" href="/categories" />
  <NavLinkItem text="Видавництва" href="/publishers" />
</ol>
*/

  return (
    <>
      <nav className="md:p-y-6 md:p-x-9 top-0 mb-4 flex w-screen flex-col items-center justify-center gap-y-3 p-3 md:mb-6 md:gap-y-6">
        <div className="flex w-full max-w-[1248px] flex-row flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <Link href="/" className="min-w-[100px]">
            <Image src="/logo.svg" width={100} height={41.4} alt="" />
          </Link>

          <SearchView placeholder="Пошук..." />

          <div className="flex basis-full flex-row justify-end gap-x-2 xs:basis-auto xs:justify-start">
            <ButtonTertiary
              icon={<ShoppingCartIcon width={20} height={20} />}
              label={showBtnLabels ? 'Кошик' : null}
              onClick={() => dispatch(toggleCart(true))}
            />
            <ButtonTertiary
              icon={<UserIcon width={20} height={20} />}
              label={showBtnLabels ? (session ? 'Кабінет' : 'Увійти') : null}
              onClick={onLoginBtnClick}
            />
          </div>
        </div>
      </nav>
      {isModalOpen && (
        <GenericModalWrapper onModalClosed={onLoginModalClosed}>
          {isLoginModalSelected ? (
            <LoginForm
              onFormChanged={setLoginModalSelected}
              onModalClosed={onLoginModalClosed}
            />
          ) : (
            <RegistrationForm onFormChanged={setLoginModalSelected} />
          )}
        </GenericModalWrapper>
      )}
      <Drawer
        open={cartOpen}
        onClose={() => dispatch(toggleCart(false))}
        anchor="right"
      >
        <CartDrawer />
      </Drawer>
      <Drawer
        open={navOpen}
        onClose={() => dispatch(toggleNav(false))}
        anchor="right"
      >
        <ProfileNavDrawer />
      </Drawer>
    </>
  );
}
