"use client";

import { House, Menu, Package, ShoppingCart, Users } from "lucide-react";
import { useCart } from "../context/CartContext";
import { recolorText } from "../utils/recolorString";
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
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const [t] = useTranslation();
  const [path, setPath] = useState("");

  useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  return (
    <header className="bg-background px-16 shadow fixed top-0 left-0 w-full z-40">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <Link
          href="/"
          className="text-2xl gap-2 items-center flex flex-row font-bold"
        >
          {shopDetails.shopname.split(" ").map((word, index) => (
            <span key={index} className="text-black font-serif ">
              {word === "Design" ? (
                <span className="text-accent relative italic font-bold">
                  {word.replace(" ", " ")}
                </span>
              ) : (
                <span className="font-thin">{word}</span>
              )}
            </span>
          ))}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block ml-4 flex-1 ">
          <ul className="flex space-x-8">
            {/* <LanguageSwitcher /> */}
            <NavLink
              url={"/"}
              title={t("nav.home")}
              // icon={
              //   <div className="w-5 h-5">
              //     <House />
              //   </div>
              // }
            />
            <NavLink
              url={"/pages/products"}
              title={t("nav.products")}
              // icon={
              //   <div className="w-5 h-5">
              //     <Package />
              //   </div>
              // }
            />
            <NavLink
              url={"/pages/aboutus"}
              title={t("nav.aboutUs")}
              // icon={
              //   <div className="w-5 h-5">
              //     <Users />
              //   </div>
              // }
            />
          </ul>
        </nav>

        <div className="ml-auto">
          <ul>
            <NavLink
              url={"/pages/cart"}
              title={t("nav.cart")}
              icon={
                <div className="relative">
                  {/* <ShoppingCart size={24} /> */}
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
              }
            />
          </ul>
        </div>

        {/* Burger Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center justify-center p-2 text-gray-700"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Navigation */}
      <ClickOutsideHandler onClickOutside={() => setIsMenuOpen(false)}>
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:hidden bg-white p-4 absolute top-16 left-0 right-0 shadow-lg`}
        >
          <ul className="space-y-4">
            <NavLink
              url={"/"}
              title={t("nav.home")}
              customFunction={() => {
                setIsMenuOpen(false); // Menü schließen
              }}
              icon={
                <div className="w-5 h-5">
                  <House />
                </div>
              }
            />
            <NavLink
              url={"/pages/products"}
              title={t("nav.products")}
              customFunction={() => {
                setIsMenuOpen(false); // Menü schließen
              }}
              icon={
                <div className="w-5 h-5">
                  <Package />
                </div>
              }
            />
            <NavLink
              url={"/pages/aboutus"}
              title={t("nav.aboutUs")}
              customFunction={() => {
                setIsMenuOpen(false); // Menü schließen
              }}
              icon={
                <div className="w-5 h-5">
                  <Users />
                </div>
              }
            />
            <NavLink
              url={"/pages/cart"}
              title={t("nav.cart")}
              customFunction={() => {
                setIsMenuOpen(false); // Menü schließen
              }}
              icon={
                <div className="relative">
                  <ShoppingCart size={24} />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
              }
            />
            <LanguageSwitcher />
          </ul>
        </div>
        <CartPopup />
      </ClickOutsideHandler>
    </header>
  );
};

export default Header;
