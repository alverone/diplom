'use client';

import { PlusIcon } from '@heroicons/react/20/solid';
import { usePathname, useRouter } from 'next/navigation';
import { ButtonPrimary } from '../Buttons';

export default function CreateButton() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <ButtonPrimary
      label="Створити"
      icon={<PlusIcon width={20} height={20} />}
      onClick={() => router.push(pathname + '/create')}
    />
  );
}
