'use client';

import { ActionResponse, updateUser, UpdateUserErrors } from '@/lib/action';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import AppInput from '../AppInput';
import { ButtonPrimary, ButtonSecondary } from '../Buttons';

export default function UserInfoForm({
  user,
}: {
  user: {
    id: string;
    name: string | null;
    surname: string | null;
    phone: string | null;
    email: string | null;
  };
}) {
  const [formState, setFormState] = useState<ActionResponse<UpdateUserErrors>>(
    {},
  );

  async function action(fd: FormData) {
    const res = await updateUser(user.id, fd);
    if (res.status != 204) {
      setFormState(res);
    }
  }
  const { message, errors } = formState;
  const nameError = errors?.name?.at(0);
  const surnameError = errors?.surname?.at(0);
  const phoneError = errors?.phone?.at(0);
  const emailError = errors?.email?.at(0);

  return (
    <form
      action={action}
      className="flex w-full max-w-xl flex-col gap-y-5 overflow-y-scroll"
    >
      <AppInput
        label="Імʼя"
        type="text"
        name="name"
        id="text"
        placeholder="Ваше імʼя"
        autoComplete="given-name"
        defaultValue={user.name ?? undefined}
        error={nameError}
      />
      <AppInput
        label="Прізвище"
        type="text"
        name="surname"
        id="surname"
        placeholder="Ваше прізвище"
        autoComplete="family-name"
        defaultValue={user.surname ?? undefined}
        error={surnameError}
      />
      <AppInput
        mask="+38 (999) 999 9999"
        label="Номер телефону"
        name="phone"
        autoComplete="tel-national"
        defaultValue={user.phone ?? undefined}
        id="phone"
        error={phoneError}
      />
      <AppInput
        label="Електронна пошта"
        type="email"
        name="email"
        id="email"
        placeholder="Ваш email"
        autoComplete="email"
        defaultValue={user.email ?? undefined}
        error={emailError}
      />
      <div className="flex flex-row gap-x-3">
        <SubmitButton />
        <ButtonSecondary label="Відмінити зміни" type="reset" />
      </div>
      {message != 'ok' && !errors && (
        <label className="mt-1 text-sm font-medium text-red-500">
          {message}
        </label>
      )}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <ButtonPrimary type="submit" label="Оновити дані" isLoading={pending} />
  );
}
