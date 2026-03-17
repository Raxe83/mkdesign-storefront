"use client";

import { House, LayoutGrid, Menu, Package, ShoppingCart, Users, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import ClickOutsideHandler from "../utils/ClickOutsideHandler";
import NavLink from "./NavLink";
import CartPopup from "./Information/CartPopup";
import LanguageSwitcher from "../language/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { shopDetails } from "../global";

const Header = () => {
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [t] = useTranslation();

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-backgroundTransparent dark:bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-200/60 dark:border-zinc-800">
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center">
        {/* ── Logo (left) ── */}
        <Link href="/" className="flex items-center gap-1.5 shrink-0">
          {shopDetails.shopname.split(" ").map((word, i) =>
            word.toLowerCase() === "design" ? (
              <span
                key={i}
                className="font-display italic font-medium text-accent text-xl"
              >
                {word}
              </span>
            ) : (
              <span
                key={i}
                className="font-display font-medium text-primary text-xl tracking-tight"
              >
                {word}
              </span>
            ),
          )}
        </Link>

        {/* ── Nav (center) ── */}
        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex items-center gap-8">
            <NavLink url="/" title={t("nav.home")} />
            <NavLink url="/pages/products" title={t("nav.products")} />
            <NavLink url="/pages/categories" title="Kategorien" />
            <NavLink url="/pages/aboutus" title={t("nav.aboutUs")} />
          </ul>
        </nav>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-3 ml-auto md:ml-0">
          <ul>
            {/* Cart */}
            <NavLink
              url="/pages/cart"
              title=""
              icon={
                <div className="relative">
                  <ShoppingCart size={20} />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-medium rounded-full h-4 w-4 flex items-center justify-center leading-none">
                      {itemCount}
                    </span>
                  )}
                </div>
              }
            />

            {/* Burger (mobile only) */}
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="md:hidden p-1.5 text-muted hover:text-primary transition-colors duration-200"
              aria-label={isMenuOpen ? "Menü schließen" : "Menü öffnen"}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </ul>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <ClickOutsideHandler onClickOutside={() => setIsMenuOpen(false)}>
        <div
          className={`md:hidden border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all duration-200 overflow-hidden ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="px-6 py-4 space-y-1">
            <NavLink
              url="/"
              title={t("nav.home")}
              customFunction={() => setIsMenuOpen(false)}
              icon={<House size={16} />}
            />
            <NavLink
              url="/pages/products"
              title={t("nav.products")}
              customFunction={() => setIsMenuOpen(false)}
              icon={<Package size={16} />}
            />
            <NavLink
              url="/pages/categories"
              title="Kategorien"
              customFunction={() => setIsMenuOpen(false)}
              icon={<LayoutGrid size={16} />}
            />
            <NavLink
              url="/pages/aboutus"
              title={t("nav.aboutUs")}
              customFunction={() => setIsMenuOpen(false)}
              icon={<Users size={16} />}
            />
            <NavLink
              url="/pages/cart"
              title={t("nav.cart")}
              customFunction={() => setIsMenuOpen(false)}
              icon={
                <div className="relative">
                  <ShoppingCart size={16} />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[9px] rounded-full h-3.5 w-3.5 flex items-center justify-center leading-none">
                      {itemCount}
                    </span>
                  )}
                </div>
              }
            />
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
          </ul>
        </div>
        <CartPopup />
      </ClickOutsideHandler>
    </header>
  );
};

export default Header;
