import styles from '@/app/categories/styles.module.css';
import { fetchAllCategories } from '@/app/lib/data';
import Link from 'next/link';

export default async function Page() {
  const categories = await fetchAllCategories();

  if (!categories || categories.length == 0) {
    return (
      <main className={styles.empty}>
        <h2>Категорій не знайдено.</h2>
      </main>
    );
  }

  return (
    <main>
      <div className={styles.categories}>
        {categories &&
          categories.map((c) => (
            <Link
              className={styles.categoryHeading}
              href={`/category/${c.id}`}
              key={c.id}
            >
              <h1>{c.title}</h1>
            </Link>
          ))}
      </div>
    </main>
  );
}
