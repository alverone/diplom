'use client';

import AppInput from '@/components/AppInput';
import AppTextarea from '@/components/AppTextarea';
import { ButtonPrimary, ButtonSecondary } from '@/components/Buttons';
import { ActionResponse, updatePublisher } from '@/lib/action';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';

export default function UpdatePublisherForm({
  publisher,
}: {
  publisher: Publisher;
}) {
  const [formState, setFormState] = useState<ActionResponse>({});

  async function action(fd: FormData) {
    const { name, description } = {
      name: fd.get('name') as string,
      description: fd.get('description') as string,
    };

    if (name == publisher.name && description == publisher.description) {
      return;
    }

    const res = await updatePublisher(fd);

    if (res.status !== 204) {
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
        Видавництво
      </h2>

      <AppInput
        label="Ідентифікатор"
        type="text"
        name="id"
        id="id"
        value={publisher.id}
        readOnly
      />
      <AppInput
        label="Назва *"
        type="text"
        name="name"
        id="name"
        placeholder="Назва видавництва"
        error={nameError}
        defaultValue={publisher.name}
      />
      <AppTextarea
        label="Опис"
        name="description"
        id="description"
        placeholder="Опис видавництва..."
        defaultValue={publisher.description ?? undefined}
        rows={4}
      />

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
