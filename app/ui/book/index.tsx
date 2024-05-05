import styles from '@/app/ui/book/styles.module.css';
import Link from 'next/link';
import { formatCurrency } from '@/app/lib/utils';
import { ButtonPrimary, ButtonSecondary } from '../buttons';
import { Book } from '@/app/lib/definitions';
import Image from 'next/image';
import BookEdition from '../book_edition';

export default function BookView({ book }: { book: Book }) {
  return (
    <>
      {book && (
        <div className={`${styles.rwflx} ${styles.container}`}>
          <Image
            className={styles.image}
            src={`/books/${book.id}.jpg`}
            alt={book.description}
            width={580}
            height={915}
          />
          <div className={`${styles.clflx} ${styles.description}`}>
            <div className={`${styles.clflx} ${styles.headingSection}`}>
              <Link
                href={`/publisher/${book.publisher.id}`}
                className={`${styles.publisher} ${styles.link}`}
              >
                <h2>{book.publisher.name}</h2>
              </Link>
              <Link href={`/author/${book.author.id}`}>
                <p className={styles.authorName}>{book.author.name}</p>
              </Link>
              <h1 className={styles.title}>{book.title}</h1>
            </div>

            {book.description.split('\n').map((pa, index) => (
              <p className={styles.textDescription} key={index}>
                {pa}
              </p>
            ))}

            <div className={`${styles.clflx} ${styles.detailedDescription}`}>
              <p className={styles.detailedDescriptionHeading}>
                Детальніше про книгу:
              </p>

              <div
                className={`${styles.clflx} ${styles.detailedDescriptionTable}`}
              >
                <p>
                  Категорія:{' '}
                  {
                    <Link href={`/category/${book.category.id}`}>
                      {book.category.title}
                    </Link>
                  }
                </p>
                <p>Кількість сторінок: {book.page_length}</p>
                <p>Рік видання: {book.publish_date.getFullYear()}</p>
              </div>
            </div>

            <BookEdition edition={book.type} />

            <div className={`${styles.clflx} ${styles.availabilityContainer}`}>
              <p className={styles.availability}>У наявності</p>
              <p className={styles.price}>{formatCurrency(book.price)}</p>
              <div className={`${styles.rwflx} ${styles.buttonContainer}`}>
                <ButtonPrimary text="В кошик" />
                <ButtonSecondary text="В обране" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
