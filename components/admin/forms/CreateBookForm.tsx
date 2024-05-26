'use client';

import AppFormSelect from '@/components/AppFormSelect';
import AppInput from '@/components/AppInput';
import AppTextarea from '@/components/AppTextarea';
import { ButtonPrimary } from '@/components/Buttons';
import { ActionResponse, createBook } from '@/lib/action';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';

export default function CreateBookForm({
  authors,
  publishers,
  categories,
}: {
  authors: Author[];
  publishers: Publisher[];
  categories: Category[];
}) {
  const router = useRouter();
  const [formState, setFormState] = useState<ActionResponse>({});

  async function action(fd: FormData) {
    const res = await createBook(fd);

    if (res.status == 201) {
      setFormState({});
      router.push('/admin/catalog');
    } else {
      setFormState(res);
    }
  }

  const { message, errors } = formState;
  const titleError = errors?.title?.at(0);
  const pageLengthError = errors?.pageLength?.at(0);
  const descriptionError = errors?.description?.at(0);
  const priceError = errors?.price?.at(0);
  const publishDateError = errors?.publishDate?.at(0);
  const coverError = errors?.cover?.at(0);

  return (
    <form
      action={action}
      className="flex max-h-full w-full max-w-2xl flex-col gap-y-5"
    >
      <h2 className="mb-1 text-lg font-semibold text-neutral-950 sm:text-xl md:text-2xl">
        Нова книга
      </h2>
      <AppInput
        label="Обкладинка *"
        type="file"
        name="cover"
        id="cover"
        error={coverError}
      />
      <AppInput
        label="Назва *"
        type="text"
        name="title"
        id="title"
        placeholder="Назва книги"
        error={titleError}
      />
      <div className="flex w-full flex-col gap-x-3 gap-y-5 xs:flex-row">
        <AppInput
          label="Ціна *"
          type="number"
          name="price"
          id="price"
          placeholder="100"
          error={priceError}
          wrapperClassName="w-full"
        />
        <AppInput
          label="Кількість сторінок *"
          type="text"
          name="pageLength"
          id="pageLength"
          placeholder="0"
          error={pageLengthError}
          wrapperClassName="w-full"
        />
      </div>
      <AppInput
        label="Дата видання *"
        type="date"
        name="publishDate"
        id="publishDate"
        placeholder="0"
        error={publishDateError}
        wrapperClassName="w-full"
      />
      <AppTextarea
        label="Опис *"
        name="description"
        id="description"
        placeholder="Опис книги..."
        error={descriptionError}
        rows={8}
      />
      <div>
        <label
          htmlFor="type"
          className="mr-2 text-base font-medium text-neutral-950"
        >
          Тип видання:
        </label>
        <select
          name="type"
          id="type"
          className="mb-3 cursor-pointer rounded border-2 border-neutral-200 px-2 py-1 text-base font-medium text-neutral-800"
        >
          <option value="PAPER">Паперова</option>
          <option value="ELECTRONIC">Електронна</option>
        </select>
      </div>

      <div className="flex w-full flex-col gap-y-2">
        <h2 className="text-lg font-medium text-neutral-950">
          Автор (створити або обрати) *:
        </h2>
        <div className="flex flex-row gap-x-3 gap-y-5">
          <AppInput
            type="text"
            name="authorName"
            id="authorName"
            placeholder="Новий автор"
            wrapperClassName="w-full"
          />
          <AppFormSelect name="authorId" id="authorId">
            <option key={null} value="null">
              Оберіть... *
            </option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </AppFormSelect>
        </div>
      </div>

      <div className="flex w-full flex-col gap-y-2">
        <h2 className="text-lg font-medium text-neutral-950">
          Видавництво (створити або обрати) *:
        </h2>
        <div className="flex flex-row gap-x-3 gap-y-5">
          <AppInput
            type="text"
            name="publisherName"
            id="publisherName"
            placeholder="Нове видавництво"
            wrapperClassName="w-full"
          />
          <AppFormSelect name="publisherId" id="publisherId">
            <option key={null} value="null">
              Оберіть...
            </option>
            {publishers.map((publisher) => (
              <option key={publisher.id} value={publisher.id}>
                {publisher.name}
              </option>
            ))}
          </AppFormSelect>
        </div>
      </div>

      <div className="flex w-full flex-col gap-y-2">
        <h2 className="text-lg font-medium text-neutral-950">
          Категорія (створити або обрати) *:
        </h2>
        <div className="flex flex-row gap-x-3 gap-y-5">
          <AppInput
            type="text"
            name="categoryTitle"
            id="categoryTitle"
            placeholder="Нова категорія"
            wrapperClassName="w-full"
          />
          <AppFormSelect name="categoryId" id="categoryId">
            <option key={null} value="null">
              Оберіть...
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </AppFormSelect>
        </div>
      </div>

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
