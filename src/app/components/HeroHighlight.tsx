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
      <div className="container mx-auto py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-gray-500/30 rounded-lg shadow p-5 md:p-6 flex sm:flex-col items-center sm:text-center gap-4 sm:gap-0"
            >
              <item.icon className="shrink-0 sm:mx-auto sm:mb-4 text-accent w-8 h-8 md:w-10 md:h-10" />
              <div>
                <h3 className="text-base md:text-xl font-semibold mb-1 sm:mb-2 text-white">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-gray-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ComponentLayout>
  );
}

export default HeroHighlight;
