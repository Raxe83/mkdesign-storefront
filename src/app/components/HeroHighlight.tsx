import { CirclePlay, Mail, Play, Star, Truck } from "lucide-react";
import { title } from "process";
import React from "react";
import ComponentLayout from "./ComponentLayout";

const items = [
  {
    title: "Handarbeit",
    description:
      "Jedes Produkt wird von Markus persönlich in Handarbeit gefertigt",
    icon: CirclePlay,
  },
  {
    title: "Wunschmotiv",
    description:
      "Euer eigenes Motiv oder Gravur auf fast allen Produkten möglich",
    icon: Mail,
  },
  {
    title: "Schneller Versand",
    description: "GLS & UPS Versand direkt ab Werkstatt in Bleckede",
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
    <ComponentLayout className="relative overflow-hidden bg-charcoal">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-gray-500/30 rounded-lg shadow p-6 text-center"
            >
              <item.icon className="mx-auto mb-4 text-accent" size={48} />
              <h3 className="text-xl font-semibold mb-2 text-white">
                {item.title}
              </h3>
              <p className="text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </ComponentLayout>
  );
}

export default HeroHighlight;
