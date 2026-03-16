'use client'

import Link from "next/link";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
  const [t] = useTranslation();
  return (
    <div className="text-center py-16">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-medium mb-6">{t("404.header")}</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">{t("404.desc")}</p>
      <Link
        href="/"
        className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
      >
        {t("common.backToHome")}
      </Link>
    </div>
  );
};

export default NotFoundPage;
