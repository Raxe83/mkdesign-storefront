'use client'
import Link from "next/link";
import Button from "../components/ui/Button";
import { useTranslation } from "react-i18next";

export default function AgeRestrictedPage() {
  const [t] = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">{t("age.header")}</h1>
      <p className="mb-6 max-w-md">{t("age.desc")}</p>
      <Link href="/">
        <Button
          color={"primary"}
          onClick={() => {}}
          text={t("common.backToHome")}
        />
      </Link>
    </div>
  );
}
