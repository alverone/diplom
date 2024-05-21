'use client';

import AppInput from '@/components/AppInput';
import AppTextarea from '@/components/AppTextarea';
import { ButtonPrimary } from '@/components/Buttons';
import { ActionResponse, createOrder, MakeOrderErrors } from '@/lib/action';
import { clearCart } from '@/lib/features/checkout/checkout_slice';
import { useAppDispatch, useAppSelector, useAppSession } from '@/lib/hooks';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';

export default function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const { books } = useAppSelector((state) => state.reducer.checkout);
  const dispatch = useAppDispatch();
  const { session } = useAppSession();

  const [formState, setFormState] = useState<ActionResponse<MakeOrderErrors>>(
    {},
  );

  async function action(fd: FormData) {
    const res = await createOrder(session?.user?.id, books, fd);

    if (res.status == 201) {
      onSuccess();
      dispatch(clearCart());
    } else {
      setFormState(res);
    }
  }
  const { message, errors } = formState;
  const nameError = errors?.name?.at(0);
  const surnameError = errors?.surname?.at(0);
  const phoneError = errors?.phone?.at(0);
  const emailError = errors?.email?.at(0);
  const addressError = errors?.address?.at(0);

  return (
    <form
      action={action}
      className="flex max-h-full w-full max-w-2xl flex-col gap-y-5"
    >
      <h2 className="mb-1 text-lg font-semibold text-neutral-950 sm:text-xl md:text-2xl">
        1. Особисті дані
      </h2>
      <div className="flex w-full flex-col gap-x-3 gap-y-5 xs:flex-row">
        <AppInput
          label="Імʼя *"
          type="text"
          name="name"
          id="name"
          placeholder="Ваше імʼя"
          autoComplete="given-name"
          error={nameError}
          defaultValue={session?.user?.name ?? ''}
          wrapperClassName="w-full"
        />
        <AppInput
          label="Прізвище *"
          type="text"
          name="surname"
          id="surname"
          placeholder="Ваше прізвище"
          autoComplete="family-name"
          error={surnameError}
          defaultValue={session?.user?.surname ?? ''}
          wrapperClassName="w-full"
        />
      </div>
      <AppInput
        mask="+38 (999) 999 9999"
        label="Номер телефону *"
        name="phone"
        id="phone"
        autoComplete="tel-national"
        error={phoneError}
        defaultValue={session?.user?.phone ?? ''}
      />
      <AppInput
        label="Електронна пошта *"
        type="email"
        name="email"
        id="email"
        placeholder="Введіть email"
        autoComplete="email"
        error={emailError}
        defaultValue={session?.user?.email ?? ''}
      />
      <h2 className="mb-1 mt-3 text-lg font-semibold text-neutral-950 sm:text-xl md:text-2xl">
        2. Адреса доставки
      </h2>
      <AppInput
        label="Адреса *"
        type="text"
        name="address"
        id="address"
        placeholder="Введіть адресу"
        autoComplete="address"
        error={addressError}
      />
      <h2 className="mb-1 mt-3 text-lg font-semibold text-neutral-950 sm:text-xl md:text-2xl">
        3. Додаткова інформація
      </h2>
      <AppTextarea
        label="Коментар до замовлення"
        name="description"
        id="description"
        placeholder="Залиште коментар..."
        rows={4}
      />

      {message != 'ok' && !errors && (
        <label className="mt-1 text-sm font-medium text-red-500">
          {message}
        </label>
      )}
      <SubmitButton text="Оформити замовлення" />
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
