"use client";

import Link from "next/link";
import { cn } from "../utils/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GiftCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: {
    label: string;
    href: string;
  };
}

export interface GiftFinderProps {
  sectionLabel?: string;
  title?: string;
  description?: string;
  cards?: GiftCard[];
  className?: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconGift = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
    />
  </svg>
);

const IconSparkles = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"
    />
  </svg>
);

const IconHome = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    />
  </svg>
);

const IconPaw = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
    />
  </svg>
);

const IconCalendar = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
    />
  </svg>
);

const IconWrench = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
    />
  </svg>
);

// ─── Default Cards ─────────────────────────────────────────────────────────────

const DEFAULT_CARDS: GiftCard[] = [
  {
    id: "maenner",
    icon: <IconGift />,
    title: "Für Männer & Väter",
    description:
      "Zippos mit Gravur, Flachmänner, Feuertonnen, Untersetzer mit Spruch – robuste Geschenke mit Charakter.",
    cta: { label: "Jetzt stöbern", href: "/pages/products" },
  },
  {
    id: "frauen",
    icon: <IconSparkles />,
    title: "Für Sie & Frauen",
    description:
      "Schmuck mit Gravur, Halsketten, Schieferuhren, Schlummerlichter – persönliche Geschenke mit Herz.",
    cta: { label: "Schmuck ansehen", href: "/pages/products?collection=schmuck" },
  },
  {
    id: "zuhause",
    icon: <IconHome />,
    title: "Für Zuhause & Garten",
    description:
      "Schieferschilder, Nachtlichter, 3D-Druck Vasen, Fassmöbel – Deko mit Geschichte und Persönlichkeit.",
    cta: { label: "Deko entdecken", href: "/pages/products" },
  },
  {
    id: "tiere",
    icon: <IconPaw />,
    title: "Für Tier-Liebhaber",
    description:
      "Hundemarken aus Edelstahl, Untersetzer mit Tier-Motiven – für alle, die ihre Tiere lieben.",
    cta: { label: "Jetzt ansehen", href: "/pages/products?collection=schlusselanhanger" },
  },
  {
    id: "anlaesse",
    icon: <IconCalendar />,
    title: "Für besondere Anlässe",
    description:
      "Hochzeiten, Geburtstage, Jubiläen – personalisierte Produkte mit eigenem Datum und Namen.",
    cta: {
      label: "Personalisieren",
      href: "/pages/products?collection=wunschmotiv-und-personalisierung",
    },
  },
  {
    id: "wunsch",
    icon: <IconWrench />,
    title: "Wunschmotiv bestellen",
    description:
      "Euer eigenes Motiv oder Logo? Kontaktiert uns direkt – fast alles ist machbar.",
    cta: { label: "Anfrage stellen", href: "/pages/contact" },
  },
];

// ─── GiftCardItem ─────────────────────────────────────────────────────────────

interface GiftCardItemProps {
  card: GiftCard;
  index: number;
}

function GiftCardItem({ card, index }: GiftCardItemProps) {
  return (
    <div
      className={cn(
        "group relative",
        "bg-cream dark:bg-zinc-900",
        "border border-sand/60 dark:border-zinc-800 rounded",
        "p-6 flex flex-col gap-4",
        "transition-all duration-300 ease-out",
        "hover:border-rust dark:hover:border-rust hover:-translate-y-0.5 hover:shadow-sm",
        "animate-gift-in",
      )}
      style={{
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded bg-rust-light dark:bg-rust/15 text-rust flex items-center justify-center flex-shrink-0 transition-colors duration-200 group-hover:bg-rust group-hover:text-white">
        {card.icon}
      </div>

      {/* Text */}
      <div className="flex-1">
        <h3 className="font-display font-medium text-charcoal dark:text-primary text-base leading-snug mb-1.5">
          {card.title}
        </h3>
        <p className="text-stone dark:text-muted text-sm leading-relaxed">
          {card.description}
        </p>
      </div>

      {/* CTA */}
      <Link
        href={card.cta.href}
        className="inline-flex items-center gap-1.5 self-start text-rust text-xs font-medium tracking-wide uppercase hover:gap-3 transition-all duration-200"
      >
        {card.cta.label}
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

// ─── GiftFinder ───────────────────────────────────────────────────────────────

export function GiftFinder({
  sectionLabel = "Geschenkideen",
  title = "Das <em>perfekte Geschenk</em><br/>für jeden",
  description = "Personalisierte Produkte für jeden Anlass – Weihnachten, Geburtstag, Hochzeit oder einfach so.",
  cards = DEFAULT_CARDS,
  className,
}: GiftFinderProps) {
  return (
    <div className={cn("w-full", className)}>
    <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 py-16 lg:py-24">
      {/* Header */}
      <div className="max-w-xl mb-10">
        <span className="block mb-2 text-xs font-medium tracking-[0.15em] uppercase text-rust">
          {sectionLabel}
        </span>
        <h2
          className="font-display font-medium leading-tight tracking-tight text-[clamp(1.75rem,3.5vw,2.5rem)] text-charcoal dark:text-primary [&_em]:italic [&_em]:text-rust"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        {description && (
          <p className="mt-3 text-stone dark:text-muted text-sm leading-relaxed max-w-prose">
            {description}
          </p>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <GiftCardItem key={card.id} card={card} index={index} />
        ))}
      </div>
    </div>
    </div>
  );
}

export default GiftFinder;
