import { BookType } from '@/app/lib/definitions';
import styles from '@/app/ui/book_edition/styles.module.css';

export default function BookEdition({ edition }: { edition: BookType }) {
  return (
    <p className={styles.edition}>
      {edition == BookType.Electronic ? 'Електронне' : 'Паперове'} видання
    </p>
  );
}
