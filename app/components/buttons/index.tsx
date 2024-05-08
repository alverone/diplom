import styles from '@/app/components/buttons/styles.module.css';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { ComponentPropsWithoutRef } from 'react';

interface AppButtonProps extends ComponentPropsWithoutRef<'button'> {
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  label: string;
}

export function ButtonPrimary({
  label,
  fullWidth,
  isLoading,
  ...props
}: AppButtonProps) {
  return (
    <button
      className={`${styles.buttonPrimary} ${fullWidth && styles.buttonFullWidth}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Loader /> : label}
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
  return (
    <button
      className={`${styles.buttonSecondary} ${fullWidth && styles.buttonFullWidth}`}
      disabled={isLoading}
      {...props}
    >
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
  return (
    <button className={styles.buttonTertiary} disabled={isLoading} {...props}>
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

function Loader() {
  return <ArrowPathIcon width={20} height={20} className={styles.loader} />;
}
