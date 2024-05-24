'use client';

import AppInput from '@/components/AppInput';
import AppTextarea from '@/components/AppTextarea';
import { ButtonPrimary, ButtonSecondary } from '@/components/Buttons';
import { ActionResponse, updateOrder } from '@/lib/action';
import { formatDateToLocal } from '@/lib/utils';
import { OrderStatus } from '@prisma/client';
import Image from 'next/image';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';

export default function UpdateOrderForm({
  books,
  order,
}: {
  books: Book[] | undefined | null;
  order: Order;
}) {
  const [formState, setFormState] = useState<ActionResponse>({});

  async function action(fd: FormData) {
    const res = await updateOrder(fd);

    if (res.status == 204) {
      setFormState({});
    } else {
      setFormState(res);
    }
  }

  const { message, errors } = formState;
  const priceError = errors?.price?.at(0);
  const fullNameError = errors?.fullName?.at(0);
  const emailError = errors?.email?.at(0);
  const phoneError = errors?.phone?.at(0);
  const addressError = errors?.address?.at(0);

  return (
    <form
      action={action}
      className="flex max-h-full w-full max-w-2xl flex-col gap-y-5"
    >
      <h2 className="mb-1 text-lg font-semibold text-neutral-950 sm:text-xl md:text-2xl">
        Замовлення
      </h2>

      <div className="flex flex-row items-center gap-x-3 overflow-x-auto sm:px-2 sm:pr-3">
        {books?.map((book) => (
          <Image
            src={book.coverUrl ?? 'images/placeholder_book.jpg'}
            width={64}
            height={64}
            key={book.id}
            alt=""
            className="h-16 w-auto"
          />
        ))}
      </div>

      <AppInput
        label="Ідентифікатор"
        type="text"
        name="id"
        id="id"
        value={order.id}
        readOnly
      />
      <AppInput
        label="Ціна *"
        type="text"
        name="price"
        id="price"
        placeholder="100"
        error={priceError}
        defaultValue={order.price ?? undefined}
      />
      <div className="flex w-full flex-col gap-x-3 gap-y-5 xs:flex-row">
        <AppInput
          label="Повне імʼя *"
          type="text"
          name="fullName"
          id="fullName"
          placeholder="Імʼя"
          error={fullNameError}
          defaultValue={order?.fullName ?? undefined}
          wrapperClassName="w-full"
        />
        <AppInput
          label="Поштова скринька *"
          type="email"
          name="email"
          id="email"
          placeholder="Пошта"
          error={emailError}
          defaultValue={order?.email ?? undefined}
          wrapperClassName="w-full"
        />
      </div>
      <AppInput
        label="Телефон *"
        type="text"
        name="phone"
        id="phone"
        placeholder="Телефон"
        error={phoneError}
        defaultValue={order.phone ?? undefined}
      />
      <AppInput
        label="Адреса *"
        type="text"
        name="address"
        id="address"
        placeholder="Адреса"
        error={addressError}
        defaultValue={order.address ?? undefined}
      />
      <AppTextarea
        label="Коментар"
        name="description"
        id="description"
        placeholder="Коментар"
        defaultValue={order.description ?? undefined}
        rows={8}
      />
      <div>
        <label
          htmlFor="type"
          className="mr-2 text-base font-medium text-neutral-950"
        >
          Статус замовлення:
        </label>
        <select
          defaultValue={OrderStatus.CREATED}
          name="status"
          id="status"
          className="mb-3 cursor-pointer rounded border-2 border-neutral-200 px-2 py-1 text-base font-medium text-neutral-800"
        >
          <option value="CREATED">Створено</option>
          <option value="ACCEPTED">Прийнято</option>
          <option value="PROCESSING">Обробляється</option>
          <option value="SHIPPED">Відправлено</option>
          <option value="COMPLETED">Завершено</option>
        </select>
      </div>

      <p>
        Дата створення: {formatDateToLocal(order.createdAt)} о&nbsp;
        {order.createdAt.toLocaleTimeString()}
      </p>
      <p>
        Дата оновлення: {formatDateToLocal(order.updatedAt)} о&nbsp;
        {order.updatedAt.toLocaleTimeString()}
      </p>
      <p>Асоційований користувач: {order.userId ?? 'Немає'}</p>

      {message !== 'Ok' && !errors && (
        <label className="mt-1 text-sm font-medium text-red-500">
          {message}
        </label>
      )}

      <div className="flex flex-row gap-x-4">
        <ButtonSecondary
          type="reset"
          onClick={() => setFormState({})}
          label="Відмінити зміни"
          fullWidth
        />
        <SubmitButton text="Оновити" />
      </div>
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
      onClick={onClick}
      fullWidth
    />
  );
}
