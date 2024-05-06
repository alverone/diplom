import styles from '@/app/ui/book_edition/styles.module.css';
import { BookType } from '@prisma/client';

export default function BookEdition({ edition }: { edition: BookType }) {
  return (
    <p className={styles.edition}>
      {edition == BookType.ELECTRONIC ? 'Електронне' : 'Паперове'} видання
    </p>
  );
}
