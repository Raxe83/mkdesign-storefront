"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const JoinUs = () => {
  const [t] = useTranslation();

  return (
    <div className="w-full bg-background border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 py-16 lg:py-20">
        <div className="max-w-xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="block w-8 h-px bg-rust" />
            <span className="text-xs font-medium text-rust tracking-[0.15em] uppercase">Newsletter</span>
            <span className="block w-8 h-px bg-rust" />
          </div>
          <h2 className="font-display font-bold tracking-tight text-[clamp(1.75rem,3.5vw,2.4rem)] text-primary mb-3">
            Nichts verpassen
          </h2>
          <p className="text-sm text-muted leading-relaxed mb-8 max-w-[38ch] mx-auto">
            Neue Produkte, Rabattcodes &amp; Angebote direkt in Euer Postfach.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mb-4"
          >
            <input
              type="email"
              placeholder={t("common.enterMail")}
              className="flex-1 px-4 py-2.5 text-sm rounded-sm border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-primary placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-rust focus:border-rust/40 transition-colors duration-200"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-sm bg-rust text-white text-sm font-medium tracking-[0.04em] uppercase hover:bg-rust/90 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust focus-visible:ring-offset-2 shrink-0"
            >
              Anmelden <ArrowRight size={14} />
            </button>
          </form>
          <p className="text-xs text-muted">
            {t("joinUs.agreement")}{" "}
            <Link href="/pages/tos" className="hover:text-primary underline underline-offset-2 transition-colors duration-150">{t("common.tos")}</Link>
            {" "}{t("common.and")}{" "}
            <Link href="/pages/privacy" className="hover:text-primary underline underline-offset-2 transition-colors duration-150">{t("common.privacy")}</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinUs;
