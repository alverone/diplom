import { ComponentPropsWithoutRef } from 'react';

interface AppTextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  label?: string;
  wrapperClassName?: string;
  children?: React.ReactNode;
  defaultValue?: string;
}

export default function AppTextarea({
  children,
  label,
  wrapperClassName,
  defaultValue,
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
