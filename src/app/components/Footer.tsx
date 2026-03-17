"use client";

import { Phone, MapPin, Mail } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { shopDetails } from "../global";

const Footer = () => {
  const [t] = useTranslation();
  return (
    <footer className="bg-charcoal border-t border-gray-300 px-16 text-gray-700 py-12 flex mx-auto items-center justify-center">
      <div className="container mx-auhref px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Branding */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {shopDetails.shopname}
            </h3>
            <p className="text-gray-600">{shopDetails.promoText}</p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("footer.shop")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/pages/products"
                  className="hover:text-gray-900 transition"
                >
                  {t("product.allProducts")}
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/aboutus"
                  className="hover:text-gray-900 transition"
                >
                  {t("nav.aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-gray-900 transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Hilfe Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("common.privacy")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/pages/imprint"
                  className="hover:text-gray-900 transition"
                >
                  {t("footer.imprint")}
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/privacy"
                  className="hover:text-gray-900 transition"
                >
                  {t("footer.dataProtection")}
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/tos"
                  className="hover:text-gray-900 transition"
                >
                  {t("footer.tou")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("common.contact")}
            </h3>
            <address className="not-italic space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="text-gray-500 w-5 h-5" />{" "}
                <div className="flex flex-col">
                  <p>
                    {shopDetails.contact.address}, {shopDetails.contact.city},
                  </p>
                  <p>{shopDetails.contact.country}</p>
                </div>
              </div>
              <p className="flex items-center gap-2 text-gray-600">
                <Mail className="text-gray-500 w-5 h-5" />{" "}
                {shopDetails.contact.email}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Phone className="text-gray-500 w-5 h-5" />{" "}
                {shopDetails.contact.phone}
              </p>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 mt-10 pt-6 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} {shopDetails.shopname}.{" "}
            {t("footer.allRights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
