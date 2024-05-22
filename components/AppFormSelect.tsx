import { ComponentPropsWithoutRef } from 'react';

interface AppInputProps extends ComponentPropsWithoutRef<'select'> {
  wrapperClassName?: string;
  error?: string | undefined;
  children: React.ReactNode;
  label?: string;
}

export default function AppInput({
  children,
  label,
  wrapperClassName,
  error,
  ...rest
}: AppInputProps) {
  const className =
    'cursor-pointer rounded border-2 border-neutral-200 px-4 py-3 text-base font-medium text-neutral-800';

  if (label) {
    return (
      <div className={wrapperClassName}>
        {label && <InputLabel text={label} name={rest.name} />}
        <select {...rest} className={className}>
          {children}
        </select>
      </div>
    );
  }

  return (
    <select {...rest} className={className}>
      {children}
    </select>
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
