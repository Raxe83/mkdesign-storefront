import FireHighlight, { type FireHighlightFeature } from "./Firehighlight";

const DEFAULT_FEATURES: FireHighlightFeature[] = [
  { text: "Präzise Laser-Gravuren auf Holz, Acryl, Leder & Metall – millimetergenau" },
  { text: "3D-Druck in PLA, PETG & Resin – auch für individuelle Sonderwünsche" },
  { text: "Nachtlichter, Schilder & Dekorationen auf Maß gefertigt" },
  { text: "Dein eigenes Motiv oder Logo – vom Entwurf bis zum fertigen Stück" },
];

export interface PrintLaserHighlightProps {
  image: { src: string; alt: string };
  className?: string;
  /** CMS overrides — fall back to component defaults when omitted */
  sectionLabel?: string;
  title?: string;
  description?: string;
  features?: FireHighlightFeature[];
  cta?: { label: string; href: string };
}

export default function PrintLaserHighlight({
  image,
  className,
  sectionLabel,
  title,
  description,
  features,
  cta,
}: PrintLaserHighlightProps) {
  return (
    <FireHighlight
      sectionLabel={sectionLabel ?? "Moderne Fertigung"}
      title={title ?? "3D-Druck &amp;<br/><em>Laser-Gravur</em>"}
      description={
        description ??
        "Von präzisen Laser-Gravuren bis hin zu individuellen 3D-Drucken – wir setzen deine Ideen mit modernster Technik um. Persönliche Nachtlichter, Schilder oder Unikate nach deinem Wunsch."
      }
      features={features ?? DEFAULT_FEATURES}
      cta={cta ?? { label: "Jetzt entdecken", href: "/pages/products?collection=laser-3d-druck" }}
      image={image}
      imagePosition="right"
      className={className}
    />
  );
}
