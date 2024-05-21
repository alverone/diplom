'use client';

import { toggleNav } from '@/lib/features/drawers/drawers_slice';
import { useWindowDimensions } from '@/lib/hooks';
import { UserIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ButtonPrimary } from '../Buttons';
import LoginForm from '../forms/LoginForm';
import RegistrationForm from '../forms/RegistrationForm';
import {
  closeModal,
  GenericModalWrapper,
  openModal,
} from '../GenericModalWrapper';

const loginModalParamName = 'showLoginModal';

export default function CheckoutNav() {
  const dispatch = useDispatch();
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

  return (
    <>
      <nav className="md:p-y-6 md:p-x-9 top-0 mb-4 flex w-screen flex-col items-center justify-center gap-y-3 p-3 md:mb-6 md:gap-y-6">
        <div className="flex w-full max-w-[1248px] flex-row flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b-[1px] border-orange-400/25 pb-3">
          <Link href="/" className="min-w-[100px]">
            <Image src="/logo.svg" width={100} height={41.4} alt="" />
          </Link>

          <h1 className="invisible hidden text-center text-xl font-bold text-neutral-800 sm:visible sm:inline-block md:text-2xl">
            Оформлення замовлення
          </h1>

          <ButtonPrimary
            icon={<UserIcon width={20} height={20} />}
            label={session ? 'Кабінет' : 'Увійти'}
            onClick={onLoginBtnClick}
          />
        </div>
        <h1 className="visible inline-block text-center text-2xl font-bold text-neutral-800 sm:invisible sm:hidden">
          Оформлення замовлення
        </h1>
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
    </>
  );
}
