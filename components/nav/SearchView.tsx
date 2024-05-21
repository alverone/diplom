'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SearchView({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const previousSearch = searchParams.get('query') || '';
  const { replace } = useRouter();
  const [text, setText] = useState(previousSearch);

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);

    params.set('query', term);
    params.set('page', '1');

    replace(`/search/?${params.toString()}`);
  }

  return (
    <form
      className="flex max-w-xl grow flex-row items-stretch justify-center"
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch(text);
      }}
    >
      <input
        className="w-full min-w-36 appearance-none rounded-l border-2 border-r-0 border-solid border-orange-300 p-3 text-base text-slate-950 transition-colors duration-200 ease-in-out focus:border-orange-400 focus:outline-none"
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <button
        type="submit"
        onClick={() => handleSearch(text)}
        className="flex cursor-pointer appearance-none flex-row items-center justify-center gap-x-1.5 rounded-r border-none bg-orange-500 px-4 py-3 text-base font-semibold text-neutral-50 transition-colors duration-200 ease-in-out hover:bg-orange-600 focus:bg-orange-400"
      >
        <MagnifyingGlassIcon width={24} height={24} color="#0d0d0d" />
      </button>
    </form>
  );
}
