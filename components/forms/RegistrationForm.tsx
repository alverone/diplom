'use client';

import { ActionResponse, createUser } from '@/lib/action';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import AppInput from '../AppInput';
import { ButtonPrimary } from '../Buttons';

export default function RegistrationForm({
  onFormChanged,
}: {
  onFormChanged: (arg0: boolean) => void;
}) {
  const [formState, setFormState] = useState<ActionResponse>({});

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
    <form action={action} className="flex max-h-full w-full flex-col gap-y-5">
      <h2 className="text-center text-2xl font-semibold text-neutral-950">
        Реєстрація
      </h2>
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
      {message !== 'Ok' && !errors && (
        <label className="mt-1 text-sm font-medium text-red-500">
          {message}
        </label>
      )}
      <SubmitButton text="Зареєструватися" />
      <p className="text-center text-base font-medium text-neutral-950">
        Маєте акаунт?&nbsp;
        <a
          href="#"
          onClick={() => onFormChanged(true)}
          className="cursor-pointer text-orange-600 no-underline"
        >
          Увійти
        </a>
      </p>
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
