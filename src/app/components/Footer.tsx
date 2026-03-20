"use client";

import { Phone, MapPin, Mail } from "lucide-react";
import Link from "next/link";
import { shopDetails } from "../global";

const Footer = () => {
  return (
    <footer className="bg-[#18181b] border-t border-zinc-800 text-zinc-400">
      <div className="max-w-screen-xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Branding */}
          <div className="lg:col-span-1">
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">
              Shop
            </p>
            <Link href="/">
              <h3 className="text-base font-semibold text-white mb-3">
                {shopDetails.shopname}
              </h3>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed">
              {shopDetails.promoText}
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">
              Sortiment
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/pages/products"
                  className="text-sm hover:text-white transition-colors duration-150"
                >
                  Produkte
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/categories"
                  className="text-sm hover:text-white transition-colors duration-150"
                >
                  Kategorien
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/reviews"
                  className="text-sm hover:text-white transition-colors duration-150"
                >
                  Bewertungen
                </Link>
              </li>
            </ul>
          </div>

          {/* Service */}
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">
              Service
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/pages/shipping"
                  className="text-sm hover:text-white transition-colors duration-150"
                >
                  Versandkosten
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/delivery-time"
                  className="text-sm hover:text-white transition-colors duration-150"
                >
                  Aktuelle Lieferzeiten
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/contact"
                  className="text-sm hover:text-white transition-colors duration-150"
                >
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">
              Kontakt
            </p>
            <address className="not-italic space-y-3">
              <div className="flex items-start gap-2.5 text-sm">
                <MapPin size={15} className="text-zinc-600 shrink-0 mt-0.5" />
                <span>
                  {shopDetails.contact.address}, {shopDetails.contact.city},{" "}
                  {shopDetails.contact.country}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Mail size={15} className="text-zinc-600 shrink-0" />
                <a
                  href={`mailto:${shopDetails.contact.email}`}
                  className="hover:text-white transition-colors duration-150"
                >
                  {shopDetails.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Phone size={15} className="text-zinc-600 shrink-0" />
                <a
                  href={`tel:${shopDetails.contact.phone}`}
                  className="hover:text-white transition-colors duration-150"
                >
                  {shopDetails.contact.phone}
                </a>
              </div>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-zinc-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-600">
          <p>
            &copy; {new Date().getFullYear()} {shopDetails.shopname}.{" "}
            Alle Rechte vorbehalten
          </p>
          <div className="flex gap-4">
            <Link
              href="/pages/privacy"
              className="hover:text-zinc-400 transition-colors duration-150"
            >
              Datenschutz
            </Link>
            <Link
              href="/pages/tos"
              className="hover:text-zinc-400 transition-colors duration-150"
            >
              Nutzungsbedingungen
            </Link>
            <Link
              href="/pages/imprint"
              className="hover:text-zinc-400 transition-colors duration-150"
            >
              Impressum
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
