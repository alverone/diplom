'use client';

import { createUser, CreateUserResponse } from '@/app/lib/action';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { signIn } from 'next-auth/react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { usePathname, useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { ButtonPrimary } from '../buttons';
import Input from '../input';
import styles from './styles.module.css';

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
      <div className={styles.modal}>
        <div className={styles.modalInner}>
          <XMarkIcon
            width="24"
            height="24"
            className={styles.closeButton}
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
  const pathname = usePathname();
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
      router.push(pathname);
    } else {
      setErrorMessage('Перевірте правильність введених даних');
    }
    setIsPending(false);
  }

  return (
    <>
      <h2 className={styles.modalHeading}>Вхід до акаунту</h2>
      <form className={styles.form} onSubmit={trySignIn}>
        <Input
          label="Електронна пошта"
          type="email"
          name="email"
          id="email"
          placeholder="Введіть email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
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
          <label className={styles.errorLabel}>{errorMessage}</label>
        )}
        <SubmitButton text="Увійти" isPending={pending} />
      </form>
      <div className={styles.modalNotice}>
        Немає акаунту?{' '}
        <span
          className={styles.changeForm}
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

  const nameError = formState?.errors?.name?.at(0);
  const surnameError = formState?.errors?.surname?.at(0);
  const phoneError = formState?.errors?.phone?.at(0);
  const emailError = formState?.errors?.email?.at(0);
  const passwordError = formState?.errors?.password?.at(0);

  return (
    <>
      <h2 className={styles.modalHeading}>Реєстрація</h2>
      <form action={action} className={styles.form}>
        <Input
          label="Ваше імʼя *"
          type="text"
          name="name"
          id="text"
          placeholder="Введіть ваше імʼя"
          autoComplete="given-name"
          error={nameError}
        />
        <Input
          label="Ваше прізвище *"
          type="text"
          name="surname"
          id="surname"
          placeholder="Введіть ваше прізвище"
          autoComplete="family-name"
          error={surnameError}
        />
        <Input
          mask="+38 (999) 999 9999"
          label="Номер телефону *"
          name="phone"
          autoComplete="tel-national"
          id="phone"
          error={phoneError}
        />
        <Input
          label="Електронна пошта *"
          type="email"
          name="email"
          id="email"
          placeholder="Введіть email"
          autoComplete="email"
          error={emailError}
        />
        <Input
          label="Пароль *"
          type="password"
          name="password"
          id="password"
          placeholder="Введіть пароль"
          autoComplete="new-password"
          error={passwordError}
        >
          <label className={styles.notification}>
            Пароль повинен містити не менше 8 символів, без урахування пробілів
          </label>
        </Input>
        {formState.message != 'ok' && !formState.errors && (
          <label className={styles.errorLabel}>{formState?.message}</label>
        )}
        <SubmitButton text="Зареєструватися" />
      </form>
      <div className={styles.modalNotice}>
        Маєте акаунт?{' '}
        <span onClick={() => onFormChanged(true)} className={styles.changeForm}>
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
function onEmailChanged(e: any, arg1: any) {
  throw new Error('Function not implemented.');
}
