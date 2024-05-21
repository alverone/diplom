'use client';

import { ButtonPrimary } from '@/components/Buttons';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-96 flex-col items-center justify-center gap-y-6 p-12">
      <h2 className="text-center text-2xl">
        Ваші бажані товари будуть відображені тут.
      </h2>
      <ButtonPrimary label="До каталогу" onClick={() => router.push('/')} />
    </div>
  );
}
