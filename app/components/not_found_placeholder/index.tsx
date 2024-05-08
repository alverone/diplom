'use client';

import styles from '@/app/components/not_found_placeholder/styles.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ButtonPrimary } from '../buttons';

export default function NotFoundPlaceholder() {
  const router = useRouter();

  return (
    <div className={styles.centered}>
      <Image
        src="/404.jpg"
        width={480}
        height={342}
        alt="The requsted page could not be found"
      />
      <div className={styles.headings}>
        <h1>Упс!</h1>
        <p>
          Сторінку, яку ви шукаєте, більше не існує. <br />
          Вона могла бути видалена або переміщена.
        </p>
      </div>
      <ButtonPrimary
        text="На головну"
        onClick={() => {
          router.replace('/');
        }}
      />
    </div>
  );
}
