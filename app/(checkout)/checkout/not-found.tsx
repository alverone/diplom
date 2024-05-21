'use client';

import { ButtonPrimary } from '@/components/Buttons';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex h-full max-h-screen min-h-[512px] flex-col items-center justify-center gap-y-6 px-6">
      <h2 className="font text-center text-xl text-neutral-950">
        Кошик порожній. <br />
        Ваші товари зʼявляться тут.
      </h2>
      <ButtonPrimary label="До каталогу" onClick={() => router.push('/')} />
    </div>
  );
}
