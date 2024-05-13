import styles from '@/app/publishers/styles.module.css';
import { fetchAllPublishers } from '@/lib/data';
import Link from 'next/link';

export default async function Page() {
  const publishers = await fetchAllPublishers();

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
