'use client';

import AppInput from '@/components/AppInput';
import AppTextarea from '@/components/AppTextarea';
import { ButtonPrimary, ButtonSecondary } from '@/components/Buttons';
import { ActionResponse, updateCategory } from '@/lib/action';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';

export default function UpdateCategoryForm({
  category,
}: {
  category: Category;
}) {
  const [formState, setFormState] = useState<ActionResponse>({});

  async function action(fd: FormData) {
    const { title, description } = {
      title: fd.get('title') as string,
      description: fd.get('description') as string,
    };

    if (title == category.title && description == category.description) {
      return;
    }

    const res = await updateCategory(fd);

    if (res.status !== 204) {
      setFormState(res);
    }
  }

  const { message, errors } = formState;
  const titleError = errors?.title?.at(0);

  return (
    <form
      action={action}
      className="flex max-h-full w-full max-w-2xl flex-col gap-y-5"
    >
      <h2 className="mb-1 text-lg font-semibold text-neutral-950 sm:text-xl md:text-2xl">
        Категорія
      </h2>

      <AppInput
        label="Ідентифікатор"
        type="text"
        name="id"
        id="id"
        value={category?.id}
        readOnly
      />
      <AppInput
        label="Назва *"
        type="text"
        name="title"
        id="title"
        placeholder="Назва категорії"
        error={titleError}
        defaultValue={category?.title}
      />
      <AppTextarea
        label="Опис категорії"
        name="description"
        id="description"
        placeholder="Опис категорії..."
        defaultValue={category?.description ?? undefined}
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
