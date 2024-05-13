'use client';

import { createUser, CreateUserResponse } from '@/lib/action';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { signIn } from 'next-auth/react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useFormStatus } from 'react-dom';
import AppInput from './AppInput';
import { ButtonPrimary } from './Buttons';

function openModal(
  searchParams: URLSearchParams,
  pathname: String,
  router: AppRouterInstance,
  setModalOpen: (arg0: boolean) => void,
) {
  searchParams.set('showLoginModal', 'true');

  const search = searchParams.toString();
  const query = search ? `?${search}` : '';
  router.push(`${pathname}${query}`);
  setModalOpen(true);
}

export default function closeModal(
  searchParams: URLSearchParams,
  pathname: String,
  router: AppRouterInstance,
  setModalOpen: (arg0: boolean) => void,
) {
  searchParams.delete('showLoginModal');

  const search = searchParams.toString();
  const query = search ? `?${search}` : '';
  router.push(`${pathname}${query}`);
  setModalOpen(false);
}

function LoginModal({ onModalClosed }: { onModalClosed: () => void }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <style jsx global>{`
        body {
          overflow: hidden;
        }
      `}</style>
      <div className="fixed inset-x-0 inset-y-0 z-50 flex h-screen w-screen items-center justify-center bg-neutral-950/35 p-4 md:p-9">
        <div className="relative flex max-h-full w-full max-w-[550px] flex-col gap-y-3 rounded-xl bg-white p-4 md:p-6">
          <XMarkIcon
            width="24"
            height="24"
            className="z-60 absolute right-3 top-3 h-6 w-6 cursor-pointer rounded-full transition-colors duration-200 hover:bg-neutral-200"
            onClick={() => onModalClosed()}
          />
          {isLogin ? (
            <LoginForm
              onFormChanged={setIsLogin}
              onModalClosed={onModalClosed}
            />
          ) : (
            <RegistrationForm onFormChanged={setIsLogin} />
          )}
        </div>
      </div>
    </>
  );
}

function LoginForm({
  onFormChanged,
  onModalClosed,
}: {
  onFormChanged: (arg0: boolean) => void;
  onModalClosed: () => void;
}) {
  const router = useRouter();
  const [pending, setIsPending] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function trySignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);

    if (!email) {
      setErrorMessage('Введіть email');
      setIsPending(false);
      return;
    } else if (!password) {
      setErrorMessage('Введіть пароль');
      setIsPending(false);
      return;
    }

    const result = await signIn('credentials', {
      redirect: false,
      password: password,
      email: email,
    });

    if (result?.ok ?? false) {
      setErrorMessage(null);
      onModalClosed();
      router.refresh();
    } else {
      setErrorMessage('Перевірте правильність введених даних');
    }
    setIsPending(false);
  }

  return (
    <>
      <h2 className="text-center text-2xl font-semibold text-neutral-950">
        Вхід до акаунту
      </h2>
      <form
        className="flex max-h-full w-full flex-col gap-y-5 overflow-y-scroll"
        onSubmit={trySignIn}
      >
        <AppInput
          label="Електронна пошта"
          type="email"
          name="email"
          id="email"
          placeholder="Введіть email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <AppInput
          label="Пароль"
          type="password"
          name="password"
          id="password"
          placeholder="Введіть пароль"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && (
          <label className="mt-1 text-sm font-medium text-red-500">
            {errorMessage}
          </label>
        )}
        <SubmitButton text="Увійти" isPending={pending} />
      </form>
      <div className="text-center text-base font-medium text-neutral-950">
        Немає акаунту?&nbsp;
        <span
          className="cursor-pointer text-orange-600 no-underline"
          onClick={() => onFormChanged(false)}
        >
          Зареєструватись
        </span>
      </div>
    </>
  );
}

function RegistrationForm({
  onFormChanged,
}: {
  onFormChanged: (arg0: boolean) => void;
}) {
  const [formState, setFormState] = useState<CreateUserResponse>({});

  async function action(fd: FormData) {
    const res = await createUser(fd);
    if (res.status == 201) {
      onFormChanged(true);
    } else {
      setFormState(res);
    }
  }
  const { message, errors } = formState;
  const nameError = errors?.name?.at(0);
  const surnameError = errors?.surname?.at(0);
  const phoneError = errors?.phone?.at(0);
  const emailError = errors?.email?.at(0);
  const passwordError = errors?.password?.at(0);

  return (
    <>
      <h2 className="text-center text-2xl font-semibold text-neutral-950">
        Реєстрація
      </h2>
      <form
        action={action}
        className="flex max-h-full w-full flex-col gap-y-5 overflow-y-scroll"
      >
        <AppInput
          label="Ваше імʼя *"
          type="text"
          name="name"
          id="text"
          placeholder="Введіть ваше імʼя"
          autoComplete="given-name"
          error={nameError}
        />
        <AppInput
          label="Ваше прізвище *"
          type="text"
          name="surname"
          id="surname"
          placeholder="Введіть ваше прізвище"
          autoComplete="family-name"
          error={surnameError}
        />
        <AppInput
          mask="+38 (999) 999 9999"
          label="Номер телефону *"
          name="phone"
          autoComplete="tel-national"
          id="phone"
          error={phoneError}
        />
        <AppInput
          label="Електронна пошта *"
          type="email"
          name="email"
          id="email"
          placeholder="Введіть email"
          autoComplete="email"
          error={emailError}
        />
        <AppInput
          label="Пароль *"
          type="password"
          name="password"
          id="password"
          placeholder="Введіть пароль"
          autoComplete="new-password"
          error={passwordError}
        >
          <label className="mt-1 block text-sm font-medium text-neutral-700">
            Пароль повинен містити не менше 8 символів, без урахування пробілів
          </label>
        </AppInput>
        {message != 'ok' && !errors && (
          <label className="mt-1 text-sm font-medium text-red-500">
            {message}
          </label>
        )}
        <SubmitButton text="Зареєструватися" />
      </form>
      <div className="text-center text-base font-medium text-neutral-950">
        Маєте акаунт?&nbsp;
        <span
          onClick={() => onFormChanged(true)}
          className="cursor-pointer text-orange-600 no-underline"
        >
          Увійти
        </span>
      </div>
    </>
  );
}

function SubmitButton({
  text,
  onClick,
  isPending,
}: {
  text: string;
  onClick?: () => void;
  isPending?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <ButtonPrimary
      type="submit"
      label={text}
      isLoading={isPending || pending}
      fullWidth={true}
      onClick={onClick}
    />
  );
}

export { closeModal, LoginModal, openModal };
