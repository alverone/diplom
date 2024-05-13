'use client';

import { addBookToWishes, removeBookFromWishes } from '@/lib/action';
import { addBook } from '@/lib/features/checkout/checkout_slice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { HeartIcon, PlusIcon } from '@heroicons/react/20/solid';
import { Book } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { ButtonPrimary, ButtonSecondary } from './Buttons';

export default function BookActions({
  book,
  wishesIds,
}: {
  book: Book;
  wishesIds: string[];
}) {
  const dispatch = useAppDispatch();
  const booksInCheckout = useAppSelector((state) => state.checkout.books);
  const { data: session } = useSession();
  const [isWishing, setIsWishing] = useState(false);

  const isBookInCheckout = booksInCheckout.includes(book.id);
  const isBookWished = wishesIds.includes(book.id);

  async function onWishClick() {
    try {
      setIsWishing(true);
      if (!isBookWished) {
        await addBookToWishes(book.id);
      } else {
        await removeBookFromWishes(book.id);
      }

      setIsWishing(false);
    } catch (e) {
      console.error(e);
      setIsWishing(false);
    }
  }

  function addToCheckout() {
    if (!isBookInCheckout) {
      dispatch(addBook(book.id));
    }
  }

  return (
    <div className="flex flex-row gap-x-4">
      <ButtonPrimary
        label={isBookInCheckout ? 'В кошику' : 'В кошик'}
        onClick={addToCheckout}
        icon={<PlusIcon width={20} height={20} />}
      />
      {session && (
        <ButtonSecondary
          label={isBookWished ? 'В обраному' : 'В обране'}
          onClick={onWishClick}
          icon={!isBookWished && <HeartIcon width={20} height={20} />}
          isLoading={isWishing}
        />
      )}
    </div>
  );
}
