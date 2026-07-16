import {
  BarrelSchale,
  BarrelSchaleXL,
  BarrelStehtisch,
  type BarrelColor
} from "@/app/components/illustrations/FireBarrels";
import type { ComponentType } from "react";
import { SlateCoasterRound, SlateCoasterSquare } from "../illustrations/SlateCoaster";
import { ZippoLighter } from "../illustrations/Zippolighter";

export type { BarrelColor };

export interface BarrelFit {
  /** Canvas display width as fraction of SVG display width. */
  widthFrac: number;
  /** SVG display height / SVG display width (viewBox aspect ratio). */
  svgAspect: number;
  /** Canvas top edge as fraction of SVG display height. */
  topFrac: number;
  /** Native Fabric.js canvas height in pixels. */
  canvasH: number;
}

export interface BarrelEntry {
  keywords: string[];
  Component: ComponentType<{
    showBackground?: boolean;
    showFloorShadow?: boolean;
    color?: BarrelColor;
  }>;
  fit: BarrelFit;
}

// DEV: Adjust widthFrac / topFrac to align canvas with the engraving zone.
const BARREL_ENTRIES: BarrelEntry[] = [
  {
    keywords: ["stehtisch", "tisch", "table", "platte"],
    Component: BarrelStehtisch,
    fit: { widthFrac: 0.31, svgAspect: 0.8, topFrac: 0.2, canvasH: 1240 },
  },
  {
    keywords: ["schale xl", "xl schale"],
    Component: BarrelSchaleXL,
    fit: { widthFrac: 0.53, svgAspect: 262 / 300, topFrac: 0.13, canvasH: 560 },
  },
  {
    keywords: ["schale", "feuerschale", "bowl"],
    Component: BarrelSchale,
    fit: { widthFrac: 0.38, svgAspect: 120 / 300, topFrac: 0.19, canvasH: 250 },
  },
  {
    keywords: ["zippo", "feuerzeug", "zippo original"],
    Component: ZippoLighter,
    fit: { widthFrac: 0.33, svgAspect: 0.8, topFrac: 0.32, canvasH: 980 },
  },
  {
    keywords: [
      "Schieferuntersetzer-Rund",
      "runder schieferuntersetzer",
      "runde coaster",
      "runde untersetzer",
      "Schieferuntersetzer Rund",
    ],
    Component: SlateCoasterRound,
    fit: { widthFrac: 0.27, svgAspect: 0.77, topFrac: 0.38, canvasH: 350 },
  },
];

export const BARREL_DEFAULT: BarrelEntry = {
  keywords: [],
  Component: SlateCoasterSquare,
  fit: { widthFrac: 0.36, svgAspect: 0.8, topFrac: 0.2, canvasH: 1140 },
};

export function getBarrelEntry(title: string): BarrelEntry {
  const lower = title.toLowerCase();
  for (const entry of BARREL_ENTRIES) {
    if (entry.keywords.some((kw) => lower.includes(kw))) return entry;
  }
  return BARREL_DEFAULT;
}
