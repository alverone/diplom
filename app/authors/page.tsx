import styles from '@/app/authors/styles.module.css';
import { fetchAllAuthors } from '@/app/lib/data';
import Link from 'next/link';

export default async function Page() {
  const authors = await fetchAllAuthors();

  if (!authors || authors.length == 0) {
    return (
      <main className={styles.empty}>
        <h2>Авторів не знайдено.</h2>
      </main>
    );
  }

  return (
    <main>
      <div className={styles.authors}>
        {authors &&
          authors.map((a) => (
            <Link
              className={styles.authorHeading}
              href={`/author/${a.id}`}
              key={a.id}
            >
              <h1>{a.name}</h1>
            </Link>
          ))}
      </div>
    </main>
  );
}
