import Image from "next/image";
import Link from "next/link";
import { cn } from "../utils/utils";
import { sanitizeInlineHtml } from "../utils/sanitizeHtml";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroCTA {
  label: string;
  href: string;
  variant?: "primary" | "outline";
}

export interface HeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  ctas?: [HeroCTA] | [HeroCTA, HeroCTA];
  image: { src: string; alt: string };
  stats?: HeroStat[];
  className?: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeroEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="block w-8 h-px bg-sand" />
      <span className="text-xs font-medium text-sand tracking-[0.15em] uppercase">{children}</span>
    </div>
  );
}

function HeroTitle({ html }: { html: string }) {
  const words = html.trim().split(" ");
  const last = words.slice(-1)[0];
  const rest = words.slice(0, -1).join(" ");
  return (
    <h1
      className={cn(
        "font-display font-bold leading-[1.08] tracking-tight",
        "text-[clamp(2.6rem,5vw,4.2rem)] text-white mb-6",
        "[&_em]:text-gold [&_em]:italic",
      )}
      dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(rest + " <em>" + last + "</em>") }}
    />
  );
}

function HeroCTAButton({ cta }: { cta: HeroCTA }) {
  const base =
    "inline-flex items-center justify-center px-8 py-3.5 rounded-sm text-sm font-medium tracking-[0.04em] uppercase transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rust";
  const variants: Record<NonNullable<HeroCTA["variant"]>, string> = {
    primary: "bg-rust text-white hover:bg-rust-dark",
    outline: "bg-transparent text-white/80 border border-white/25 hover:border-white/60 hover:text-white",
  };
  return (
    <Link href={cta.href} className={cn(base, variants[cta.variant ?? "primary"])}>
      {cta.label}
    </Link>
  );
}

function HeroStatStrip({ stats }: { stats: HeroStat[] }) {
  return (
    <div className="absolute bottom-0 inset-x-0 bg-charcoal/75 backdrop-blur-md px-6 py-4">
      <div className="flex items-center justify-center gap-8 flex-wrap">
        {stats.map((stat, i) => (
          <div key={stat.label} className={cn("text-center", i === 3 && "hidden md:block")}>
            <p className="font-display font-bold text-[1.35rem] leading-none text-white">{stat.value}</p>
            <p className="mt-1 text-[0.65rem] font-medium tracking-[0.08em] uppercase text-white/50">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export function Hero({
  eyebrow = "Handarbeit aus Norddeutschland",
  title,
  description,
  ctas,
  image,
  stats,
  className,
}: HeroProps) {
  return (
    <div className="w-full bg-charcoal relative overflow-hidden">
      <section
        className={cn(
          "max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 lg:min-h-[85vh]",
          className,
        )}
      >
        {/* ── Left: Content ── */}
        <div className="relative flex flex-col justify-end px-6 md:px-10 lg:px-16 py-10 sm:py-14 lg:py-16">
          <div className="animate-hero-in">
            {eyebrow && <HeroEyebrow>{eyebrow}</HeroEyebrow>}
            <HeroTitle html={title} />
            {description && (
              <p className="text-white/60 text-base leading-[1.75] max-w-[38ch] mb-10">{description}</p>
            )}
            {ctas && ctas.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {ctas.map((cta) => (
                  <HeroCTAButton key={cta.href} cta={cta} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Image ── */}
        <div className="relative overflow-hidden bg-rust-light min-h-[75vh] lg:min-h-0">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover saturate-[0.85]"
          />
          <div className="absolute inset-0 bg-cream/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-rust/20 via-transparent to-charcoal/25 pointer-events-none" />
          {stats && stats.length > 0 && <HeroStatStrip stats={stats} />}
        </div>
      </section>
    </div>
  );
}

export default Hero;
