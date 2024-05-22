'use client';

import AppFormSelect from '@/components/AppFormSelect';
import AppInput from '@/components/AppInput';
import AppTextarea from '@/components/AppTextarea';
import { ButtonPrimary, ButtonSecondary } from '@/components/Buttons';
import { ActionResponse, updateBook, ValidateBookErrors } from '@/lib/action';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';

export default function UpdateBookForm({
  book,
  authors,
  publishers,
  categories,
}: {
  book: Book;
  authors: Author[];
  publishers: Publisher[];
  categories: Category[];
}) {
  const router = useRouter();
  const [formState, setFormState] = useState<
    ActionResponse<ValidateBookErrors>
  >({});

  async function action(fd: FormData) {
    const res = await updateBook(book.id, fd);

    if (res.status == 204) {
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
  const typeError = errors?.type?.at(0);
  const publishDateError = errors?.publishDate?.at(0);
  const coverError = errors?.cover?.at(0);

  return (
    <form
      action={action}
      className="flex max-h-full w-full max-w-2xl flex-col gap-y-5"
    >
      <h2 className="mb-1 text-lg font-semibold text-neutral-950 sm:text-xl md:text-2xl">
        Книга
      </h2>
      <Image
        key={book.id}
        className="fit-contain aspect-square h-auto max-h-64 w-full max-w-64 self-center object-contain"
        src={book.coverUrl ?? 'images/placeholder_book.jpg'}
        alt={book.title}
        width={256}
        height={256}
        priority={true}
      />
      <AppInput
        label="Нова обкладинка"
        type="file"
        name="cover"
        id="cover"
        error={coverError}
      />
      <AppInput
        label="Ідентифікатор"
        type="text"
        name="id"
        id="id"
        value={book.id}
        readOnly
      />
      <AppInput
        label="Назва *"
        type="text"
        name="title"
        id="title"
        placeholder="Назва книги"
        error={titleError}
        defaultValue={book.title}
      />
      <div className="flex w-full flex-col gap-x-3 gap-y-5 xs:flex-row">
        <AppInput
          label="Ціна *"
          type="number"
          name="price"
          id="price"
          placeholder="100"
          error={priceError}
          defaultValue={book.price}
          wrapperClassName="w-full"
        />
        <AppInput
          label="Кількість сторінок *"
          type="text"
          name="pageLength"
          id="pageLength"
          placeholder="0"
          error={pageLengthError}
          defaultValue={book.pageLength}
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
        defaultValue={book.publishDate.toISOString().substring(0, 10)}
        wrapperClassName="w-full"
      />
      <AppTextarea
        label="Опис *"
        name="description"
        id="description"
        placeholder="Опис книги..."
        defaultValue={book.description ?? undefined}
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
          defaultValue={book.type}
          name="type"
          id="type"
          className="mb-3 cursor-pointer rounded border-2 border-neutral-200 px-2 py-1 text-base font-medium text-neutral-800"
        >
          <option value="PAPER">Паперова</option>
          <option value="ELECTRONIC">Електронна</option>
        </select>
      </div>

      <div className="flex w-full flex-col gap-y-2">
        <h2 className="text-lg font-medium text-neutral-950">Автор:</h2>
        <AppFormSelect defaultValue={book.type} name="authorId" id="authorId">
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </AppFormSelect>
      </div>

      <div className="flex w-full flex-col gap-y-2">
        <h2 className="text-lg font-medium text-neutral-950">Видавництво:</h2>
        <AppFormSelect
          defaultValue={book.type}
          name="publisherId"
          id="publisherId"
        >
          {publishers.map((publisher) => (
            <option key={publisher.id} value={publisher.id}>
              {publisher.name}
            </option>
          ))}
        </AppFormSelect>
      </div>

      <div className="flex w-full flex-col gap-y-2">
        <h2 className="text-lg font-medium text-neutral-950">Категорія:</h2>
        <AppFormSelect
          defaultValue={book.type}
          name="categoryId"
          id="categoryId"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </AppFormSelect>
      </div>

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
