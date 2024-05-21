'use client';

import { addBookToWishes, removeBookFromWishes } from '@/lib/action';
import { addBook } from '@/lib/features/checkout/checkout_slice';
import { toggleCart } from '@/lib/features/drawers/drawers_slice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { HeartIcon } from '@heroicons/react/20/solid';
import { CheckIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
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
  const booksInCheckout = useAppSelector(
    (state) => state.reducer.checkout.books,
  );
  const { data: session } = useSession();
  const [isWishing, setIsWishing] = useState(false);

  const isBookInCheckout =
    booksInCheckout.filter((b) => b.id === book.id).length > 0;
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
      dispatch(addBook({ id: book.id, count: 1 }));
    }
    dispatch(toggleCart(true));
  }

  return (
    <div className="flex flex-row gap-x-4">
      <ButtonPrimary
        label={isBookInCheckout ? 'В кошику' : 'В кошик'}
        onClick={addToCheckout}
        icon={
          isBookInCheckout ? (
            <CheckIcon width={20} height={20} />
          ) : (
            <ShoppingCartIcon width={20} height={20} />
          )
        }
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
