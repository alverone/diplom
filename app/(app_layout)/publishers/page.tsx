import { getAllPublishers } from '@/lib/data';
import { Metadata } from 'next';
import Link from 'next/link';
import styles from './styles.module.css';

export const metadata: Metadata = {
  title: 'Видавництва',
};

export default async function Page() {
  const publishers = await getAllPublishers();

  if (!publishers || publishers.length == 0) {
    return (
      <main className={styles.empty}>
        <h2>Видавництв не знайдено.</h2>
      </main>
    );
  }

  return (
    <main>
      <div className={styles.publishers}>
        {publishers &&
          publishers.map((p) => (
            <Link
              className={styles.publisherHeading}
              href={`/publisher/${p.id}`}
              key={p.id}
            >
              <h1>{p.name}</h1>
            </Link>
          ))}
      </div>
    </main>
  );
}
