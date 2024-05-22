'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useFormStatus } from 'react-dom';
import AppInput from '../AppInput';
import { ButtonPrimary } from '../Buttons';

export default function SimpleLoginForm({ onLogin }: { onLogin?: () => void }) {
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
      router.refresh();
      onLogin && onLogin();
    } else {
      setErrorMessage('Перевірте правильність введених даних');
    }
    setIsPending(false);
  }

  return (
    <form
      className="flex max-h-full w-full flex-col gap-y-5"
      onSubmit={trySignIn}
    >
      <h2 className="text-center text-2xl font-semibold text-neutral-950">
        Вхід до акаунту
      </h2>
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
