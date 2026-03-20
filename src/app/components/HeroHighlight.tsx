import { CirclePlay, Mail, Star, Truck } from "lucide-react";

const items = [
  {
    title: "Handarbeit",
    description: "Jedes Produkt wird mit Liebe zum Detail in Handarbeit gefertigt",
    icon: CirclePlay,
  },
  {
    title: "Wunschmotiv",
    description: "Euer eigenes Motiv oder Gravur auf fast allen Produkten möglich",
    icon: Mail,
  },
  {
    title: "Schneller Versand",
    description: "DHL & GLS Versand direkt nach fertigung an Euch",
    icon: Truck,
  },
  {
    title: "4.9 von 5 Sternen",
    description: "Über 874 begeisterte Kunden – Qualität die überzeugt",
    icon: Star,
  },
];

function HeroHighlight() {
  return (
    <div className="w-full bg-charcoal border-b border-white/[0.06]">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 px-5 py-5 rounded-sm border border-white/[0.08] bg-white/[0.03]"
            >
              <div className="w-9 h-9 rounded-sm bg-rust/15 flex items-center justify-center shrink-0">
                <item.icon className="text-rust w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white mb-1">{item.title}</h3>
                <p className="text-xs text-white/45 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroHighlight;
