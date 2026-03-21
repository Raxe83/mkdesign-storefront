import { cn } from "../../utils/utils";

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
  minLength?: number;
  required?: boolean;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormField({
  id,
  name,
  label,
  type = "text",
  error,
  autoComplete,
  placeholder,
  minLength,
  required,
  defaultValue,
  onChange,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium text-charcoal dark:text-primary tracking-wide"
      >
        {label}
        {required && <span className="ml-0.5 text-rust" aria-hidden="true">*</span>}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        minLength={minLength}
        required={required}
        defaultValue={defaultValue}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "w-full px-3.5 py-2.5 text-sm rounded-sm bg-white dark:bg-zinc-900",
          "border text-primary placeholder:text-muted",
          "outline-none transition-colors duration-150",
          "focus-visible:ring-2 focus-visible:ring-rust focus-visible:ring-offset-1",
          error
            ? "border-red-400 dark:border-red-500 focus-visible:ring-red-400"
            : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600",
        )}
      />

      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
          <span aria-hidden="true">✕</span>
          {error}
        </p>
      )}
    </div>
  );
}
