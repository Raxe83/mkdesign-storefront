'use client'

import React, { JSX } from "react";

interface RecolorProps {
  text: string;
  wordsToRecolor?: number;
  wordsToHighlight?: string[];
  position?: "start" | "middle" | "end" | "custom";
  styleVariant?:
    | "easter"
    | "primary"
    | "secondary"
    | "colorful"
    | "tealWater"
    | "cyanWater"
    | "water"
    | "JohnnyGreen"
    | "JohnnyGreen-light"
    | "freshGreen"
    | "glowGreen"
    | "luxuryGold"
    | "firestorm"
    | "aquaBreeze";
}

const getGradientClass = (variant: string): string => {
  switch (variant) {
    case "easter":
      return "bg-gradient-to-r from-yellow-500 via-pink-400 to-purple-400 text-transparent bg-clip-text";
    case "primary":
      return "bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 text-transparent bg-clip-text";
    case "secondary":
      return "bg-gradient-to-r from-gray-500 via-gray-700 to-black text-transparent bg-clip-text";
    case "colorful":
      return "bg-gradient-to-r from-red-500 via-green-500 to-blue-500 text-transparent bg-clip-text";
    case "water":
      return "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 text-transparent bg-clip-text";
    case "tealWater":
      return "bg-gradient-to-r from-teal-500 via-teal-400 to-teal-300 text-transparent bg-clip-text";
    case "cyanWater":
      return "bg-gradient-to-r from-cyan-800 via-cyan-700 to-cyan-600 text-transparent bg-clip-text";
    case "JohnnyGreen":
      return "bg-gradient-to-r from-green-700 via-green-600 to-green-500 text-transparent bg-clip-text";
    case "JohnnyGreen-light":
      return "bg-gradient-to-r from-green-400 to-green-500 text-transparent bg-clip-text";
    case "freshGreen":
      return "bg-gradient-to-r from-emerald-400 via-green-300 to-lime-400 text-transparent bg-clip-text";
    case "glowGreen":
      return "bg-gradient-to-r from-lime-300 via-lime-400 to-green-500 text-transparent bg-clip-text";
    case "luxuryGold":
      return "bg-gradient-to-r from-yellow-500 via-amber-500 to-black text-transparent bg-clip-text";
    case "firestorm":
      return "bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-transparent bg-clip-text";
    case "aquaBreeze":
      return "bg-gradient-to-r from-cyan-300 via-teal-300 to-blue-400 text-transparent bg-clip-text";
    case "mysticDream":
      return "bg-gradient-to-r from-purple-400 via-pink-500 to-rose-400 text-transparent bg-clip-text";
    default:
      return "bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 text-transparent bg-clip-text";
  }
};

export const recolorText = ({
  text,
  wordsToRecolor = 2,
  wordsToHighlight,
  position = "end",
  styleVariant = "primary",
}: RecolorProps): JSX.Element => {
  const words = text.split(" ");
  if (words.length < wordsToRecolor) {
    return <span className={getGradientClass(styleVariant)}>{text}</span>;
  }

  if (position === "custom" && wordsToHighlight) {
    return (
      <span>
        {words
          .map((word, index) =>
            wordsToHighlight.includes(word) ? (
              <span key={index} className={getGradientClass(styleVariant)}>
                {word}
              </span>
            ) : (
              word
            )
          )
          .reduce<React.ReactNode[]>((prev, curr) => [...prev, " ", curr], [])}
      </span>
    );
  }

  let startIdx = 0;
  if (position === "end") {
    startIdx = words.length - wordsToRecolor;
  } else if (position === "middle") {
    startIdx = Math.max(0, Math.floor((words.length - wordsToRecolor) / 2));
  } else if (position === "start") {
    startIdx = 0;
  }

  return (
    <span>
      {words.slice(0, startIdx).join(" ")}{" "}
      <span className={getGradientClass(styleVariant)}>
        {words.slice(startIdx, startIdx + wordsToRecolor).join(" ")}
      </span>{" "}
      {words.slice(startIdx + wordsToRecolor).join(" ")}
    </span>
  );
};
