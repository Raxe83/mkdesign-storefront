import FireHighlight, { FireHighlightProps } from "./Firehighlight";

const DEFAULT_FEATURES = [
  { text: "Präzise Laser-Gravuren auf Holz, Acryl, Leder & Metall – millimetergenau" },
  { text: "3D-Druck in PLA, PETG & Resin – auch für individuelle Sonderwünsche" },
  { text: "Nachtlichter, Schilder & Dekorationen auf Maß gefertigt" },
  { text: "Dein eigenes Motiv oder Logo – vom Entwurf bis zum fertigen Stück" },
];

export interface PrintLaserHighlightProps
  extends Omit<FireHighlightProps, "sectionLabel" | "title" | "description" | "features" | "cta" | "imagePosition"> {
  image: { src: string; alt: string };
}

export default function PrintLaserHighlight({ image, className }: PrintLaserHighlightProps) {
  return (
    <FireHighlight
      sectionLabel="Moderne Fertigung"
      title="3D-Druck &amp;<br/><em>Laser-Gravur</em>"
      description="Von präzisen Laser-Gravuren bis hin zu individuellen 3D-Drucken – wir setzen deine Ideen mit modernster Technik um. Persönliche Nachtlichter, Schilder oder Unikate nach deinem Wunsch."
      features={DEFAULT_FEATURES}
      cta={{ label: "Jetzt entdecken", href: "/pages/products?collection=laser-3d-druck" }}
      image={image}
      imagePosition="right"
      className={className}
    />
  );
}
