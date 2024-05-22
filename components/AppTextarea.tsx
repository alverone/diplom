import { ComponentPropsWithoutRef } from 'react';

interface AppTextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  label?: string;
  wrapperClassName?: string;
  children?: React.ReactNode;
  defaultValue?: string;
  error?: string | null;
}

export default function AppTextarea({
  children,
  label,
  wrapperClassName,
  defaultValue,
  error,
  ...rest
}: AppTextareaProps) {
  const textareaClass =
    'w-full min-w-48 appearance-none rounded-md border-2 border-solid p-3 text-base text-slate-950 transition-colors duration-200 ease-in-out focus:outline-none border-orange-300 focus:border-orange-400';

  if (label) {
    return (
      <div className={wrapperClassName}>
        {label && <TextareaLabel text={label} name={rest.name} />}
        <textarea className={textareaClass} {...rest}>
          {defaultValue}
        </textarea>
        {error ? <ErrorLabel error={error} /> : children}
      </div>
    );
  }

  return (
    <textarea className={textareaClass} {...rest}>
      {defaultValue}
    </textarea>
  );
}

function TextareaLabel({
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
