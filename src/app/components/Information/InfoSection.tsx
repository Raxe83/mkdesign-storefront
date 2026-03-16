'use client'

import React from "react";
import { recolorText } from "../../utils/recolorString";

interface InfoSectionProps {
  title: string;
  description: string;
  styleVariant?:
    | "easter"
    | "primary"
    | "secondary"
    | "colorful"
    | "tealWater"
    | "cyanWater"
    | "water"
    | "JohnnyGreen";
}

const InfoSection = ({
  title,
  description,
  styleVariant,
}: InfoSectionProps) => {
  return (
    <div id="collection" className="relative w-full my-28 text-center py-12 px-8 bg-white rounded-lg">
      <h1 className="text-3xl font-bold mb-4">
        {recolorText({
          text: title,
          wordsToRecolor: 2,
          styleVariant: "JohnnyGreen",
        })}
      </h1>
      <p className="text-gray-700 text-lg">{description}</p>
    </div>
  );
};

export default InfoSection;
