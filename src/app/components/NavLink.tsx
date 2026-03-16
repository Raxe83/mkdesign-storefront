import React, { useState, useEffect, JSX } from "react";
import { useRouter } from "next/navigation";

interface NavLinkProps {
  title: string;
  url: string;
  icon?: JSX.Element;
  customFunction?: () => void;
}

const NavLink = ({ title, url, icon, customFunction }: NavLinkProps) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Setze `mounted` auf `true`, wenn die Komponente im Client gerendert wird
  }, []);

  const handleClick = () => {
    customFunction && customFunction(); // Optional, falls eine Funktion übergeben wurde
    router.push(url); // Navigiere zur gewünschten URL
  };

  if (!mounted) {
    return null; // Verhindere das Rendern auf dem Server
  }

  return (
    <li>
      <button
        onClick={handleClick} // Button statt Link verwenden
        className={` hover:text-gray-900 uppercase text-gray-500 font-semibold flex flex-row cursor-pointer`}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </button>
    </li>
  );
};

export default NavLink;
