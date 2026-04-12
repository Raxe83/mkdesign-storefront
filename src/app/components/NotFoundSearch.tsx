'use client'

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type FormEvent, useRef } from 'react';

export default function NotFoundSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = inputRef.current?.value.trim();
    if (q) router.push(`/pages/products?q=${encodeURIComponent(q)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 max-w-md mx-auto"
    >
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Produkt suchen…"
          className="w-full pl-9 pr-4 py-2.5 bg-transparent border border-border rounded text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors duration-200"
          autoFocus
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2.5 bg-accent hover:bg-rustMid text-white text-sm font-medium rounded transition-colors duration-200 whitespace-nowrap"
      >
        Suchen
      </button>
    </form>
  );
}
