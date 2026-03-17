"use client";

import React from "react";
import Button from "./ui/Button";
import { Input } from "./ui/Input";
import { recolorText } from "../utils/recolorString";
import { useTranslation } from "react-i18next";
import Link from "next/link";

const JoinUs = () => {
  const [t] = useTranslation();
  return (
    <section className="bg-background py-12 md:py-16 lg:py-20">
      <div className="container px-4 sm:px-6">
        <div className="mx-auto max-w-[800px] text-center">
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-tight">
            {/* {recolorText({
              text: "Nichts verpassen",
              wordsToRecolor: 1,
              styleVariant: "firestorm",
            })} */}
            Nichts verpassen
          </h2>
          <p className="mt-2 text-muted-foreground">Neue Produkte, Rabattcodes & Angebote direkt in Euer Postfach.</p>
          <div className="max-w-lg mx-auto mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center ">
            <Input
              id="email"
              type="email"
              placeholder={t("common.enterMail")}
            />
          </div>
          <span className="max-w-lg mx-auto mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center">
            <Button onClick={() => console.log("Subscribe")}>Abonniere</Button>
          </span>
          <p className="mt-2 text-xs text-muted-foreground">
            {t("joinUs.agreement")}{" "}
            <Link
              href="/tos"
              className="hover:underline cursor-pointer font-semibold"
            >
              {t("common.tos")}
            </Link>{" "}
            {t("common.and")}{" "}
            <Link
              href="/privacy"
              className="hover:underline cursor-pointer font-semibold"
            >
              {t("common.privacy")}
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default JoinUs;
