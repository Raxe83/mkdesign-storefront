"use client";

import {
  House,
  LayoutGrid,
  Menu,
  Package,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ClickOutsideHandler from "../utils/ClickOutsideHandler";
import NavLink from "./NavLink";
import CartPopup from "./Information/CartPopup";
import LanguageSwitcher from "../language/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { shopDetails } from "../global";
import { cn } from "../utils/utils";
import Image from "next/image";

// ─── Nav items config ──────────────────────────────────────────────────────────

const useNavItems = () => {
  const [t] = useTranslation();
  return [
    { url: "/", title: t("nav.home"), icon: <House size={20} /> },
    {
      url: "/pages/products",
      title: t("nav.products"),
      icon: <Package size={20} />,
    },
    {
      url: "/pages/categories",
      title: "Kategorien",
      icon: <LayoutGrid size={20} />,
    },
    {
      url: "/pages/aboutus",
      title: t("nav.aboutUs"),
      icon: <Users size={20} />,
    },
  ];
};

// ─── Header ───────────────────────────────────────────────────────────────────

const Header = () => {
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [t] = useTranslation();
  const pathname = usePathname();
  const navItems = useNavItems();

  // Close on resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Header ist immer ganz oben — z-[9999] schlägt alle Dropdowns & Popups */}
      <header className="fixed top-0 left-0 w-full z-[9999] bg-backgroundTransparent dark:bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-200/60 dark:border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center relative">
          {/* ── Links: Burger (mobile) / Nav (desktop) ── */}
          <div className="flex items-center gap-1">
            {/* Burger — mobile */}
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="md:hidden p-2.5 text-muted hover:text-primary transition-colors duration-200"
              aria-label={isMenuOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={isMenuOpen}
            >
              <Menu size={22} />
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex">
              <ul className="flex items-center gap-8">
                <NavLink url="/" title={t("nav.home")} />
                <NavLink url="/pages/products" title={t("nav.products")} />
                <NavLink url="/pages/categories" title="Kategorien" />
                <NavLink url="/pages/aboutus" title={t("nav.aboutUs")} />
              </ul>
            </nav>
          </div>

          {/* ── Mitte: Logo (absolut zentriert) ── */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-center shrink-0"
          >
            <Image
              src={require("../../../public/mkdesign-font.svg")}
              alt={shopDetails.shopname}
              width={160}
              height={160}
            />
          </Link>

          {/* ── Rechts: Cart ── */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Cart — desktop */}
            <div className="hidden md:block">
              <ul>
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
              </ul>
            </div>

            {/* Cart — mobile */}
            <Link
              href="/pages/cart"
              className="md:hidden relative p-2.5 text-muted hover:text-primary transition-colors duration-200"
              aria-label="Warenkorb"
            >
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-accent text-white text-[9px] font-medium rounded-full h-4 w-4 flex items-center justify-center leading-none">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer — startet bei top-16 (unter dem Header) ── */}

      {/* Backdrop — unter dem Header (z-[9998] < z-[9999]) */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 top-16 z-[9998] bg-black/50 md:hidden transition-opacity duration-300",
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer panel — ebenfalls unter dem Header */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className={cn(
          "fixed top-16 right-0 bottom-0 z-[9998] w-[80vw] max-w-[320px] md:hidden",
          "bg-white dark:bg-zinc-950 shadow-2xl",
          "flex flex-col",
          "transition-transform duration-300 ease-out",
        )}
        style={{ transform: isMenuOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Close button row */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <span className="text-xs font-medium text-muted uppercase tracking-[0.1em]">
            Navigation
          </span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 -mr-1 text-muted hover:text-primary transition-colors duration-200 rounded"
            aria-label="Menü schließen"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.url;
              return (
                <li key={item.url}>
                  <Link
                    href={item.url}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3.5 px-4 py-4 rounded-sm",
                      "text-base font-medium transition-colors duration-150",
                      isActive
                        ? "bg-rust/[.08] text-rust dark:bg-rust/15"
                        : "text-charcoal dark:text-primary hover:bg-zinc-100 dark:hover:bg-zinc-900",
                    )}
                  >
                    <span
                      className={cn(
                        "shrink-0",
                        isActive ? "text-rust" : "text-muted",
                      )}
                    >
                      {item.icon}
                    </span>
                    {item.title}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-rust shrink-0" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Divider */}
          <div className="my-4 mx-4 h-px bg-zinc-100 dark:bg-zinc-800" />

          {/* Cart */}
          <ul>
            <li>
              <Link
                href="/pages/cart"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3.5 px-4 py-4 rounded-sm text-base font-medium text-charcoal dark:text-primary hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors duration-150"
              >
                <span className="relative shrink-0 text-muted">
                  <ShoppingCart size={20} />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[9px] font-medium rounded-full h-3.5 w-3.5 flex items-center justify-center leading-none">
                      {itemCount}
                    </span>
                  )}
                </span>
                {t("nav.cart")}
                {itemCount > 0 && (
                  <span className="ml-auto text-xs font-medium text-accent">
                    {itemCount} Artikel
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Drawer footer — language switcher */}
        <div className="shrink-0 px-5 py-5 border-t border-zinc-100 dark:border-zinc-800">
          <LanguageSwitcher />
        </div>
      </div>

      <ClickOutsideHandler onClickOutside={() => {}}>
        <CartPopup />
      </ClickOutsideHandler>
    </>
  );
};

export default Header;
