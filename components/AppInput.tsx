import { ComponentPropsWithoutRef } from 'react';
import InputMask from 'react-input-mask';

interface AppInputProps extends ComponentPropsWithoutRef<'input'> {
  label?: string;
  wrapperClassName?: string;
  error?: string | undefined;
  mask?: string;
  children?: React.ReactNode;
}

export default function AppInput({
  children,
  label,
  wrapperClassName,
  error,
  mask,
  ...rest
}: AppInputProps) {
  const inputClass =
    'w-full min-w-48 appearance-none rounded-md border-2 border-solid p-3 text-base text-slate-950 transition-colors duration-200 ease-in-out focus:outline-none ' +
    (error
      ? 'border-red-300 focus:border-red-400'
      : 'border-orange-300 focus:border-orange-400');

  if (label) {
    return (
      <div className={wrapperClassName}>
        {label && <InputLabel text={label} name={rest.name} />}
        {(mask && (
          <InputMask
            mask={mask}
            alwaysShowMask={true}
            className={inputClass}
            defaultValue={rest.defaultValue}
            {...rest}
          />
        )) || <input className={inputClass} {...rest} />}
        {error ? <ErrorLabel error={error} /> : children}
      </div>
    );
  }

  return (
    <>
      {label && <InputLabel text={label} name={rest.name} />}
      {(mask && (
        <InputMask
          mask={mask}
          alwaysShowMask={true}
          className={inputClass}
          defaultValue={rest.defaultValue}
          {...rest}
        />
      )) || <input className={inputClass} {...rest} />}
      {children}
      {error ? <ErrorLabel error={error} /> : children}
    </>
  );
}

function InputLabel({
  text,
  name,
}: {
  text: string;
  name?: string | undefined;
}) {
  return (
    <label className="mb-2 block text-base font-semibold" htmlFor={name}>
      {text}
    </label>
  );
}

function ErrorLabel({ error }: { error: string }) {
  return (
    <label className="mt-1.5 block text-sm font-medium text-red-500">
      {error}
    </label>
  );
}
