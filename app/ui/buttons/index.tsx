import styles from '@/app/ui/buttons/styles.module.css';
import { MouseEventHandler } from 'react';

export function ButtonPrimary({
  text,
  onClick,
}: {
  text: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button type="button" className={styles.buttonPrimary} onClick={onClick}>
      {text}
    </button>
  );
}

export function ButtonSecondary({
  text,
  onClick,
}: {
  text: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button type="button" className={styles.buttonSecondary} onClick={onClick}>
      {text}
    </button>
  );
}
