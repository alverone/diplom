'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '@/app/ui/search/styles.module.css';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const previousSearch = searchParams.get('query') || '';
  const { push, replace } = useRouter();
  const [text, setText] = useState(previousSearch);

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);

    params.set('query', term);
    params.set('page', '1');

    replace(`/search/?${params.toString()}`);
  }

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch(text);
      }}
    >
      <input
        className={styles.input}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
    </form>
  );
}
