'use client';

import styles from '@/app/components/books_grid/styles.module.css';
import { BookSimplified } from '@/app/lib/definitions';
import { Suspense } from 'react';
import BookCard from '../book_card';
import Pagination from '../pagination';

export default function BooksGrid({
  books,
  pagesCount,
}: {
  books?: BookSimplified[];
  pagesCount: number;
}) {
  if (!books || books.length == 0) {
    return (
      <>
        <div className={styles.empty}>
          <h2>За цим пошуковим запитом товарів не знайдено.</h2>
        </div>
        <Suspense>
          <Pagination totalPages={1}></Pagination>
        </Suspense>
      </>
    );
  }

  return (
    <div className={styles.booksGridContainer}>
      <div className={styles.booksGrid}>
        {books && books.map((e) => <BookCard book={e} key={e.id} />)}
      </div>
      <Suspense>
        <Pagination totalPages={pagesCount}></Pagination>
      </Suspense>
    </div>
  );
}
