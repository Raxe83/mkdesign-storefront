'use client'

import React from "react";
import DynamicIconComponent from "../../utils/GetIcon";
import { IconName } from "lucide-react/dynamic";
import { recolorText } from "../../utils/recolorString";
// Separate Card-Komponente für eine sauberere Struktur
const InfoCard = ({
  icon,
  title,
  description,
}: {
  icon: IconName;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-center space-y-6 p-6 bg-white shadow-lg rounded-xl  hover:shadow-xl">
      <DynamicIconComponent name={icon} color="green" size={48} />
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-center text-sm text-gray-600">{description}</p>
    </div>
  );
};

const InfoCardSection = () => {
  const InfoValues = [
    {
      title: "Sicher & Vertrauenswürdig",
      description: "Alle Produkte werden sorgfältig geprüft und sicher verpackt.",
      icon: "shield" as IconName,
    },
    {
      title: "Einzigartiger Stil",
      description: "Handgefertigte Unikate mit persönlicher Note.",
      icon: "flower" as IconName,
    },
    {
      title: "Leicht zu finden",
      description: "Durchstöbere unser Sortiment und finde das Passende.",
      icon: "search" as IconName,
    },
  ];

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
        {recolorText({
          text: "Warum bei uns kaufen",
          wordsToRecolor: 2,
          styleVariant: "JohnnyGreen",
        })}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 container mx-auto">
        {InfoValues.map((info, index) => (
          <InfoCard
            key={index}
            icon={info.icon}
            title={info.title}
            description={info.description}
          />
        ))}
      </div>
    </section>
  );
};

export default InfoCardSection;
