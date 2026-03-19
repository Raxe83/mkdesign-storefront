import Image from "next/image";
import Link from "next/link";
import { cn } from "../utils/utils";

export interface FireHighlightFeature { text: string }

export interface FireHighlightProps {
  sectionLabel?: string;
  title?: string;
  description?: string;
  features?: FireHighlightFeature[];
  cta?: { label: string; href: string };
  image: { src: string; alt: string };
  imagePosition?: "left" | "right";
  className?: string;
}

const DEFAULT_FEATURES: FireHighlightFeature[] = [
  { text: "Handarbeit aus gebrauchten Stahlblechtonnen – jedes Stück ein Unikat" },
  { text: "Beheizbare Stehtische für warme Abende auf Terrasse & Garten" },
  { text: "Individuelle Motive auf Wunsch eingestanzt oder graviert" },
  { text: "Feuerschalen in Klein und XL – faszinierendes Flammenspiel" },
];

export function FireHighlight({
  sectionLabel = "Das Herzstück",
  title = "Feuertonnen &amp;<br/><em>Stehtische</em>",
  description = "Unsere Feuertonnen und beheizbaren Stehtische werden in aufwendiger Handarbeit aus gebrauchten Stahlblechtonnen gefertigt. Robuster Industriestil trifft gemütliche Feuerstelle.",
  features = DEFAULT_FEATURES,
  cta = { label: "Feuertonnen entdecken", href: "/pages/products?collection=feuertonne" },
  image,
  imagePosition = "left",
  className,
}: FireHighlightProps) {
  const isImageLeft = imagePosition === "left";

  return (
    <div className={cn("w-full bg-charcoal", className)}>
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
        {/* ── Bild ── */}
        <div
          className={cn(
            "relative overflow-hidden min-h-[320px] lg:min-h-0 order-first",
            isImageLeft ? "lg:order-first" : "lg:order-last",
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover brightness-75"
          />
          <div
            className={cn(
              "absolute inset-0 pointer-events-none",
              isImageLeft
                ? "bg-gradient-to-r from-transparent via-transparent to-charcoal/60"
                : "bg-gradient-to-l from-transparent via-transparent to-charcoal/60",
            )}
          />
        </div>

        {/* ── Content ── */}
        <div
          className={cn(
            "flex flex-col justify-center px-6 py-16 lg:px-16 lg:py-20",
            isImageLeft ? "lg:order-last" : "lg:order-first",
          )}
        >
          <span className="block mb-3 text-xs font-medium tracking-[0.15em] uppercase text-gold">
            {sectionLabel}
          </span>
          <h2
            className={cn(
              "font-display font-bold leading-[1.1] tracking-tight",
              "text-[clamp(2rem,4vw,3rem)] text-white mb-5",
              "[&_em]:italic [&_em]:text-rust-mid",
            )}
            dangerouslySetInnerHTML={{ __html: title }}
          />
          {description && (
            <p className="text-white/60 text-sm leading-[1.85] mb-8 max-w-[44ch]">{description}</p>
          )}
          {features.length > 0 && (
            <ul className="flex flex-col gap-3.5 mb-10">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-[0.35rem] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-rust" />
                  <span className="text-white/70 text-sm leading-relaxed">{feature.text}</span>
                </li>
              ))}
            </ul>
          )}
          {cta && (
            <div>
              <Link
                href={cta.href}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-sm bg-rust text-white text-sm font-medium tracking-[0.04em] uppercase transition-colors duration-200 hover:bg-rust-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
              >
                {cta.label}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FireHighlight;
