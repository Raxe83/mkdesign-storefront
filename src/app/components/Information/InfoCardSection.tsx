'use client'

import React from "react";
import DynamicIconComponent from "../../utils/GetIcon";
import { IconName } from "lucide-react/dynamic";
import { recolorText } from "../../utils/recolorString";
import { useTranslation } from "react-i18next";

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
  const [t] = useTranslation();

  const InfoValues = [
    {
      title: t("infoCard.safe.header"),
      description: t("infoCard.safe.desc"),
      icon: "shield" as IconName,
    },
    {
      title: t("infoCard.stil.header"),
      description: t("infoCard.stil.desc"),
      icon: "flower" as IconName,
    },
    {
      title: t("infoCard.place.header"),
      description: t("infoCard.place.desc"),
      icon: "search" as IconName,
    },
  ];

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
        {recolorText({
          text: t("infoCard.header"),
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
