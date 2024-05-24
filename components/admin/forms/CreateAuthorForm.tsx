'use client';

import AppInput from '@/components/AppInput';
import AppTextarea from '@/components/AppTextarea';
import { ButtonPrimary } from '@/components/Buttons';
import { ActionResponse, createAuthor } from '@/lib/action';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';

export default function CreateAuthorForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<ActionResponse>({});

  async function action(fd: FormData) {
    const res = await createAuthor(fd);

    if (res.status == 204) {
      setFormState({});
      router.push('/admin/authors');
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
        Новий автор
      </h2>

      <AppInput
        label="Імʼя *"
        type="text"
        name="name"
        id="name"
        placeholder="Імʼя автора"
        error={nameError}
      />
      <AppTextarea
        label="Про автора"
        name="description"
        id="description"
        placeholder="Про автора..."
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
