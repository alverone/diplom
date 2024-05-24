'use client';

import AppInput from '@/components/AppInput';
import AppTextarea from '@/components/AppTextarea';
import { ButtonPrimary } from '@/components/Buttons';
import { ActionResponse, createPublisher } from '@/lib/action';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';

export default function CreatePublisherForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<ActionResponse>({});

  async function action(fd: FormData) {
    const res = await createPublisher(fd);

    if (res.status == 204) {
      setFormState({});
      router.push('/admin/publishers');
    } else {
      setFormState(res);
    }
  }

  const { message, errors } = formState;
  const nameError = errors?.name?.at(0);

  return (
    <form
      action={action}
      className="flex max-h-full w-full max-w-2xl flex-col gap-y-5"
    >
      <h2 className="mb-1 text-lg font-semibold text-neutral-950 sm:text-xl md:text-2xl">
        Нове видавництво
      </h2>

      <AppInput
        label="Назва *"
        type="text"
        name="name"
        id="name"
        placeholder="Назва видавництва"
        error={nameError}
      />
      <AppTextarea
        label="Опис видавництва"
        name="description"
        id="description"
        placeholder="Опис видавництва..."
        rows={4}
      />

      {message !== 'Ok' && !errors && (
        <label className="mt-1 text-sm font-medium text-red-500">
          {message}
        </label>
      )}

      <SubmitButton text="Створити" />
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
