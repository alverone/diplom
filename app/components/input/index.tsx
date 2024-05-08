import { ComponentPropsWithoutRef } from 'react';
import InputMask from 'react-input-mask';
import styles from './styles.module.css';

interface AppInputProps extends ComponentPropsWithoutRef<'input'> {
  label?: string;
  wrapperClassName?: string;
  error?: string | undefined;
  mask?: string;
  children?: React.ReactNode;
}

export default function Input({
  children,
  label,
  wrapperClassName,
  error,
  mask,
  ...rest
}: AppInputProps) {
  const inputClass = error
    ? `${styles.input} ${styles.inputError}`
    : styles.input;
  if (label) {
    return (
      <div className={wrapperClassName}>
        {label && (
          <label className={styles.label} htmlFor={rest.name}>
            {label}
          </label>
        )}

        {(mask && (
          <InputMask
            mask={mask}
            alwaysShowMask={true}
            className={inputClass}
            {...rest}
          />
        )) || <input className={inputClass} {...rest} />}
        {children}
        {error && <label className={styles.errorLabel}>{error}</label>}
      </div>
    );
  }

  return (
    <>
      {label && (
        <label className={styles.label} htmlFor={rest.name}>
          {label}
        </label>
      )}

      {(mask && (
        <InputMask
          mask={mask}
          alwaysShowMask={true}
          className={inputClass}
          {...rest}
        />
      )) || <input className={inputClass} {...rest} />}
      {children}
      {error && <label className={styles.errorLabel}>{error}</label>}
    </>
  );
}
