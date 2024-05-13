import { ComponentPropsWithoutRef } from 'react';
import Loader from './Loader';

interface AppButtonProps extends ComponentPropsWithoutRef<'button'> {
  label: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const buttonStyle =
  'flex cursor-pointer appearance-none flex-row items-center justify-center gap-x-1.5 rounded border-none transition-colors duration-200 ease-in-out';
const fullWidthStyle = 'w-full max-w-full';

export function ButtonPrimary({
  label,
  icon,
  fullWidth,
  isLoading,
  ...props
}: AppButtonProps) {
  const className =
    'font-semibold text-neutral-50 bg-orange-500 hover:bg-orange-600 focus:bg-orange-400 px-4 py-3 text-base ' +
    `${buttonStyle} ${fullWidth ? fullWidthStyle : ''}`;

  return (
    <button className={className} disabled={isLoading} {...props}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {icon} {label}
        </>
      )}
    </button>
  );
}

export function ButtonSecondary({
  label,
  fullWidth,
  icon,
  isLoading,
  ...props
}: AppButtonProps) {
  const className =
    'font-semibold text-neutral-950 bg-neutral-200 hover:bg-neutral-300 focus:bg-neutral-100 px-4 py-3 text-base ' +
    `${buttonStyle} ${fullWidth ? fullWidthStyle : ''}`;

  return (
    <button className={className} disabled={isLoading} {...props}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {icon} {label}
        </>
      )}
    </button>
  );
}

export function ButtonTertiary({
  label,
  isLoading,
  icon,
  ...props
}: AppButtonProps) {
  const className =
    'hover:bg-neutral-200 focus:bg-neutral-100 p-3 font-semibold text-base ' +
    buttonStyle;

  return (
    <button className={className} disabled={isLoading} {...props}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {icon} {label}
        </>
      )}
    </button>
  );
}
