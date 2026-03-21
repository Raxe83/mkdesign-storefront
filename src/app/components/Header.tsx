"use client";

import {
  House,
  Instagram,
  LayoutGrid,
  Menu,
  Package,
  Palette,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import NavLink from "./NavLink";
import CartPopup from "./Information/CartPopup";
import HeaderSearch from "./HeaderSearch";
import Link from "next/link";
import { shopDetails } from "../global";
import { cn } from "../utils/utils";
import Image from "next/image";

// ─── Typen ────────────────────────────────────────────────────────────────────

interface HeaderCustomer {
  firstName: string | null;
  lastName: string | null;
}

// ─── Avatar (Initialen-Kreis) ─────────────────────────────────────────────────

function CustomerAvatar({ firstName, lastName }: HeaderCustomer) {
  const initials = [firstName?.[0], lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase() || "?";

  return (
    <div className="w-7 h-7 rounded-full bg-rust text-white text-[11px] font-semibold flex items-center justify-center leading-none shrink-0 ring-2 ring-rust/20">
      {initials}
    </div>
  );
}

// ─── Nav items config ──────────────────────────────────────────────────────────

const useNavItems = () => {
  return [
    { url: "/", title: "Startseite", icon: <House size={20} /> },
    {
      url: "/pages/products",
      title: "Produkte",
      icon: <Package size={20} />,
    },
    {
      url: "/pages/categories",
      title: "Kategorien",
      icon: <LayoutGrid size={20} />,
    },
    {
      url: "/pages/design",
      title: "Eigenes Design",
      icon: <Palette size={20} />,
    },
  ];
};

// ─── Header ───────────────────────────────────────────────────────────────────

const Header = ({ customer = null }: { customer?: HeaderCustomer | null }) => {
  const { itemCount, showCartPopup, setShowCartPopup } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();
  const navItems = useNavItems();

  // Close search on route change
  useEffect(() => { setShowSearch(false); }, [pathname]);

  // Shrink header on scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

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
      <header className="fixed top-0 left-0 w-full z-[9999] bg-backgroundTransparent dark:bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-200/60 dark:border-zinc-800 transition-all duration-300">
        <div
          className={cn(
            "max-w-screen-xl mx-auto px-4 sm:px-6 flex items-center relative transition-all duration-300",
            scrolled ? "h-14" : "h-20",
          )}
        >
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
              <ul className="flex items-center gap-3 lg:gap-7">
                <NavLink url="/" title="Startseite" />
                <NavLink url="/pages/products" title="Produkte" />
                <NavLink url="/pages/categories" title="Kategorien" />
                <NavLink url="/pages/design" title="Eigenes Design" />
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
              className={cn(
                "transition-all duration-300",
                scrolled ? "w-24 lg:w-32" : "w-28 lg:w-40",
              )}
            />
          </Link>

          {/* ── Rechts: Cart ── */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Search — mobile */}
            <button
              onClick={() => setShowSearch(true)}
              className="md:hidden relative p-2.5 text-muted hover:text-primary transition-colors duration-200"
              aria-label="Suche öffnen"
            >
              <Search size={22} />
            </button>
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

            {/* Cart — desktop: opens popup */}

            {/* Search — desktop */}
            <button
              onClick={() => setShowSearch(true)}
              aria-label="Suche öffnen"
              className="hidden md:flex relative p-2.5 text-muted hover:text-primary transition-colors duration-200"
            >
              <Search size={20} />
            </button>
            {/* User — desktop */}
            <Link
              href={customer ? "/pages/account" : "/pages/login"}
              aria-label={customer ? "Mein Konto" : "Anmelden"}
              className="hidden md:flex items-center justify-center relative p-2 text-muted hover:text-primary transition-colors duration-200"
            >
              {customer
                ? <CustomerAvatar firstName={customer.firstName} lastName={customer.lastName} />
                : <User size={20} />
              }
            </Link>
            <button
              onClick={() => setShowCartPopup((v) => !v)}
              aria-label="Warenkorb"
              aria-expanded={showCartPopup}
              className="hidden md:flex relative p-2.5 text-muted hover:text-primary transition-colors duration-200"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 bg-accent text-white text-[10px] font-medium rounded-full h-4 w-4 flex items-center justify-center leading-none">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer — startet bei top-16 (unter dem Header) ── */}

      {/* Backdrop — unter dem Header (z-[9998] < z-[9999]) */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-[9998] bg-black/50 md:hidden transition-all duration-300",
          scrolled ? "top-14" : "top-20",
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
          "fixed left-0 bottom-0 z-[9998] w-[80vw] max-w-[320px] md:hidden",
          scrolled ? "top-14" : "top-20",
          "bg-cream dark:bg-zinc-900 shadow-2xl",
          "flex flex-col",
          "transition-all duration-300 ease-out",
        )}
        style={{
          transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Close button row */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-sand/40 dark:border-zinc-800 shrink-0">
          <span className="text-xs font-medium text-stone dark:text-muted uppercase tracking-[0.12em]">
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

        {/* ── Scrollbarer Bereich ── */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col">

          {/* Haupt-Navigation */}
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
                        : "text-charcoal dark:text-primary hover:bg-sand/30 dark:hover:bg-zinc-800",
                    )}
                  >
                    <span className={cn("shrink-0", isActive ? "text-rust" : "text-muted")}>
                      {item.icon}
                    </span>
                    {item.title}
                    {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-rust shrink-0" />}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="my-3 mx-4 h-px bg-sand/40 dark:bg-zinc-800" />

          {/* Warenkorb + Anmelden */}
          <ul className="space-y-0.5">
            <li>
              <Link
                href="/pages/cart"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3.5 px-4 py-4 rounded-sm text-base font-medium text-charcoal dark:text-primary hover:bg-sand/30 dark:hover:bg-zinc-800 transition-colors duration-150"
              >
                <span className="relative shrink-0 text-muted">
                  <ShoppingCart size={20} />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[9px] font-medium rounded-full h-3.5 w-3.5 flex items-center justify-center leading-none">
                      {itemCount}
                    </span>
                  )}
                </span>
                Warenkorb
                {itemCount > 0 && (
                  <span className="ml-auto text-xs font-medium text-accent">{itemCount} Artikel</span>
                )}
              </Link>
            </li>
            <li>
              <Link
                href={customer ? "/pages/account" : "/pages/login"}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3.5 px-4 py-4 rounded-sm text-base font-medium text-charcoal dark:text-primary hover:bg-sand/30 dark:hover:bg-zinc-800 transition-colors duration-150"
              >
                <span className="shrink-0">
                  {customer
                    ? <CustomerAvatar firstName={customer.firstName} lastName={customer.lastName} />
                    : <span className="text-muted"><User size={20} /></span>
                  }
                </span>
                {customer
                  ? [customer.firstName, customer.lastName].filter(Boolean).join(" ") || "Mein Konto"
                  : "Anmelden"
                }
                {customer && (
                  <span className="ml-auto text-[10px] font-medium text-rust uppercase tracking-wide">
                    Konto
                  </span>
                )}
              </Link>
            </li>
          </ul>

          <div className="my-3 mx-4 h-px bg-sand/40 dark:bg-zinc-800" />

          {/* Sekundäre Links */}
          <div>
            <p className="px-4 pb-1.5 text-[10px] font-medium text-muted uppercase tracking-[0.14em]">
              Weitere Seiten
            </p>
            <ul className="space-y-0.5">
              {[
                { url: "/pages/contact", title: "Kontakt" },
                { url: "/pages/aboutus", title: "Über uns" },
                { url: "/pages/shipping", title: "Versand & Lieferung" },
                { url: "/pages/imprint", title: "Impressum" },
                { url: "/pages/privacy", title: "Datenschutz" },
                { url: "/pages/tos", title: "AGB" },
              ].map((item) => (
                <li key={item.url}>
                  <Link
                    href={item.url}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-4 py-2.5 rounded-sm text-sm text-stone dark:text-muted hover:text-primary dark:hover:text-primary hover:bg-sand/30 dark:hover:bg-zinc-800 transition-colors duration-150"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Spacer so footer is pushed down */}
          <div className="flex-1" />
        </nav>

        {/* ── Social Footer (pinned bottom) ── */}
        <div className="shrink-0 px-5 py-4 border-t border-sand/40 dark:border-zinc-800 flex items-center gap-3">
          <p className="text-[10px] font-medium text-muted uppercase tracking-[0.14em] mr-auto">
            Folg uns
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="p-2 text-muted hover:text-rust transition-colors duration-200 rounded-sm hover:bg-sand/30 dark:hover:bg-zinc-800"
          >
            <Instagram size={18} />
          </a>
        </div>
      </div>

      <CartPopup />
      <HeaderSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
};

export default Header;
