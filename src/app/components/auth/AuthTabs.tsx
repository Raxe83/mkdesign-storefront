"use client";

import { useState } from "react";
import { cn } from "../../utils/utils";
import { EmailCodeForm } from "./EmailCodeForm";
import { LoginForm } from "./LoginForm";

type Mode = "code" | "password";

export function AuthTabs() {
  const [mode, setMode] = useState<Mode>("code");

  return (
    <div>
      <div className="flex border-b border-zinc-200 dark:border-zinc-700 mb-6">
        <TabButton active={mode === "code"} onClick={() => setMode("code")}>
          Per Code anmelden
        </TabButton>
        <TabButton active={mode === "password"} onClick={() => setMode("password")}>
          Mit Passwort
        </TabButton>
      </div>

      {mode === "code" ? <EmailCodeForm /> : <LoginForm />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 py-2.5 text-xs font-medium tracking-wide transition-colors duration-150",
        active
          ? "text-rust border-b-2 border-rust"
          : "text-muted hover:text-primary border-b-2 border-transparent",
      )}
    >
      {children}
    </button>
  );
}
