'use client'

import { useEffect, useRef } from "react";

interface ClickOutsideHandlerProps {
  children: React.ReactNode;
  onClickOutside: () => void;
}

const ClickOutsideHandler = ({ children, onClickOutside }: ClickOutsideHandlerProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        onClickOutside();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClickOutside]);

  return <div ref={wrapperRef}>{children}</div>;
};

export default ClickOutsideHandler;
