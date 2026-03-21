"use client";

import { useFormStatus } from "react-dom";
import { cn } from "../../utils/utils";

interface SubmitButtonProps {
  label: string;
  pendingLabel?: string;
  className?: string;
}

export function SubmitButton({ label, pendingLabel = "Bitte warten…", className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className={cn(
        "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-sm",
        "text-sm font-medium tracking-[0.04em] uppercase text-white",
        "bg-rust hover:bg-rust-mid transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust focus-visible:ring-offset-2",
        "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-rust",
        className,
      )}
    >
      {pending && (
        <svg
          className="animate-spin h-3.5 w-3.5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {pending ? pendingLabel : label}
    </button>
  );
}
