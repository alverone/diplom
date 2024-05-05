'use client';

import styles from '@/app/ui/books_grid/styles.module.css';
import BookCard from '../book_card';
import Pagination from '../pagination';
import { BookSimplified } from '@/app/lib/definitions';

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
        <Pagination totalPages={1}></Pagination>
      </>
    );
  }

  return (
    <div className={styles.booksGridContainer}>
      <div className={styles.booksGrid}>
        {books && books.map((e) => <BookCard book={e} key={e.id} />)}
      </div>
      <Pagination totalPages={pagesCount}></Pagination>
    </div>
  );
}
