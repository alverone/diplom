'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';

export default function CrossIcon({
  width,
  height,
  className = '',
  onClick,
}: {
  width: number;
  height: number;
  className: string;
  onClick: () => void;
}) {
  const resultClassName = `cursor-pointer rounded-full transition-colors duration-200 ease-in-out hover:bg-neutral-200 focus:bg-neutral-200 ${className}`;

  return (
    <a href="#" className={resultClassName} onClick={onClick}>
      <XMarkIcon width={width} height={height} />
    </a>
  );
}
