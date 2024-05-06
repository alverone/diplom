import { BookSimplified } from '@/app/lib/definitions';
import { formatCurrency } from '@/app/lib/utils';
import styles from '@/app/ui/book_card/styles.module.css';
import Image from 'next/image';
import Link from 'next/link';
import BookEdition from '../book_edition';

export default function BookCard({ book }: { book: BookSimplified }) {
  return (
    <Link className={styles.link} href={`/book/${book.id}`}>
      <div className={styles.card}>
        <Image
          key={book.id}
          className={styles.image}
          src={`/books/${book.id}.jpg`}
          alt={book.title}
          width={256}
          height={256}
          priority={true}
        />
        <div className={styles.cardDescription}>
          <BookEdition edition={book.type} />
          <p className={styles.author}>{book.author.name}</p>
          <p className={styles.title}>{book.title}</p>
          <p className={styles.price}>{formatCurrency(book.price)}</p>
        </div>
      </div>
    </Link>
  );
}
