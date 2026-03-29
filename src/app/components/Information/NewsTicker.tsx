'use client'

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageType } from "../ImportantMessages";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Theme configuration inspired by button styles
const themes = {
  default: {
    container: "bg-blue-500 border-t border-blue-600 text-white",
    text: "text-white",
    button: "text-white/80 hover:text-white hover:bg-blue-600/50 rounded-full",
    indicator: "bg-white",
    closeButton: "bg-blue-600 hover:bg-blue-700 text-white"
  },
  danger: {
    container: "bg-red-500 border-t border-red-600 text-white",
    text: "text-white",
    button: "text-white/80 hover:text-white hover:bg-red-600/50 rounded-full",
    indicator: "bg-white",
    closeButton: "bg-red-600 hover:bg-red-700 text-white"
  },
  secondary: {
    container: "bg-gray-200 border-t border-gray-300 text-gray-700",
    text: "text-gray-700",
    button: "text-gray-600 hover:text-gray-800 hover:bg-gray-300/70 rounded-full",
    indicator: "bg-gray-700",
    closeButton: "bg-gray-300 hover:bg-gray-400 text-gray-700"
  },
  outline_dark: {
    container: "bg-white border-t border-gray-700 text-gray-700",
    text: "text-gray-700",
    button: "text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full",
    indicator: "bg-gray-700",
    closeButton: "bg-gray-200 hover:bg-gray-300 text-gray-700"
  },
  outline_primary: {
    container: "bg-white border-t border-blue-600 text-blue-600",
    text: "text-blue-600",
    button: "text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full",
    indicator: "bg-blue-600",
    closeButton: "bg-blue-100 hover:bg-blue-200 text-blue-600"
  },
  daily_ui: {
    container: "bg-gradient-to-r from-blue-400 to-purple-600 border-t border-blue-500 text-white",
    text: "text-white",
    button: "text-white/80 hover:text-white hover:bg-white/10 rounded-full",
    indicator: "bg-white",
    closeButton: "bg-purple-600 hover:bg-purple-700 text-white"
  },
  weed_green: {
    container: "bg-green-600 border-t border-green-700 text-white",
    text: "text-white",
    button: "text-white/80 hover:text-white hover:bg-green-700/50 rounded-full",
    indicator: "bg-white",
    closeButton: "bg-green-700 hover:bg-green-800 text-white"
  },
  rasta_vibes: {
    container: "bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 border-t border-yellow-500 text-white",
    text: "text-white",
    button: "text-white/80 hover:text-white hover:bg-black/10 rounded-full",
    indicator: "bg-white",
    closeButton: "bg-green-600 hover:bg-green-700 text-white"
  },
  earthy: {
    container: "bg-teal-600 border-t border-emerald-800 text-white",
    text: "text-white",
    button: "text-white/80 hover:text-white hover:bg-emerald-700/50 rounded-full",
    indicator: "bg-white",
    closeButton: "bg-emerald-700 hover:bg-emerald-800 text-white"
  },
  stoner_dark: {
    container: "bg-gray-900 border-t border-green-600 text-green-400",
    text: "text-green-400",
    button: "text-green-400/80 hover:text-green-400 hover:bg-gray-800/80 rounded-full",
    indicator: "bg-green-400",
    closeButton: "bg-gray-800 hover:bg-gray-700 text-green-400 border border-green-500"
  },
  chill_mode: {
    container: "bg-gray-800 border-t border-gray-700 text-lime-300",
    text: "text-lime-300",
    button: "text-lime-300/80 hover:text-lime-300 hover:bg-gray-700/80 rounded-full",
    indicator: "bg-lime-300",
    closeButton: "bg-gray-700 hover:bg-gray-600 text-lime-300 border border-gray-600"
  },
  daily_ui_rasta: {
    container: "bg-gradient-to-r from-red-400 via-yellow-500 to-green-600 border-t border-yellow-500 text-white",
    text: "text-white",
    button: "text-white/80 hover:text-white hover:bg-black/10 rounded-full",
    indicator: "bg-white",
    closeButton: "bg-green-700 hover:bg-green-800 text-white"
  },
  highlife: {
    container: "bg-gradient-to-r from-green-400 to-teal-600 border-t border-green-500 text-white",
    text: "text-white",
    button: "text-white/80 hover:text-white hover:bg-white/10 rounded-full",
    indicator: "bg-white",
    closeButton: "bg-teal-600 hover:bg-teal-700 text-white"
  }
};

type ThemeOption = keyof typeof themes;

interface NewsTickerProps {
  items: MessageType[];
  theme?: ThemeOption;
  size?: "sm" | "md" | "lg";
  showIndicators?: boolean;
  autoSlideInterval?: number;
}

const NewsTicker: React.FC<NewsTickerProps> = ({
  items,
  theme = "default",
  size = "md",
  showIndicators = true,
  autoSlideInterval = 7000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const selectedTheme = themes[theme] || themes.default;
  
  // Size configurations
  const sizeClasses = {
    sm: "h-14 md:h-10",
    md: "h-16",
    lg: "h-24",
  };

  // Automatic slide change
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [items.length, autoSlideInterval]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };
  
  // Responsive content based on size
  const renderContent = () => {
    switch (size) {
      case "sm":
        return (
          <span className={`text-base md:text-sm ${selectedTheme.text} font-medium text-center truncate max-w-full`}>
            {items[currentIndex].title
              ? `${items[currentIndex].title} – ${items[currentIndex].content}`
              : items[currentIndex].content}
          </span>
        );
      case "md":
        return (
          <>
            <span className={`text-base ${selectedTheme.text} font-semibold text-center`}>
              {items[currentIndex].title}
            </span>
            <span className={`text-sm ${selectedTheme.text} text-center mt-0.5 opacity-90 line-clamp-1`}>
              {items[currentIndex].content}
            </span>
          </>
        );
      case "lg":
        return (
          <>
            <span className={`text-lg ${selectedTheme.text} font-bold text-center`}>
              {items[currentIndex].title}
            </span>
            <span className={`text-base ${selectedTheme.text} text-center mt-1 opacity-90 line-clamp-2 max-w-3xl`}>
              {items[currentIndex].content}
            </span>
          </>
        );
      default:
        return null;
    }
  };

  // Button size based on ticker size
  const getButtonSize = () => {
    switch (size) {
      case "sm": return 20;
      case "md": return 24;
      case "lg": return 28;
      default: return 24;
    }
  };

  // Indicators position based on ticker size
  const getIndicatorPosition = () => {
    switch (size) {
      case "sm": return "bottom-1";
      case "md": return "bottom-1.5";
      case "lg": return "bottom-2";
      default: return "bottom-1.5";
    }
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className={`fixed bottom-0 left-0 w-full z-50 ${selectedTheme.container} ${sizeClasses[size]} flex items-center justify-center px-4 shadow-md transition-all duration-300`}
    >
      <button
        onClick={handlePrev}
        className={`${selectedTheme.button} p-1.5 transition-colors duration-200`}
        aria-label="Previous message"
      >
        <ChevronLeft size={getButtonSize()} />
      </button>

      <div className="relative w-full flex items-center justify-center max-w-5xl overflow-hidden px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col items-center w-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center">
        <button
          onClick={handleNext}
          className={`${selectedTheme.button} p-1.5 transition-colors duration-200`}
          aria-label="Next message"
        >
          <ChevronRight size={getButtonSize()} />
        </button>
        
      </div>

      {showIndicators && items.length > 1 && (
        <div className={`absolute ${getIndicatorPosition()} left-1/2 transform -translate-x-1/2 flex space-x-1`}>
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 rounded-full transition-all duration-300 ${selectedTheme.indicator} ${
                index === currentIndex 
                  ? `w-4 opacity-100` 
                  : `w-1 opacity-40`
              }`}
              aria-label={`Go to message ${index + 1}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default NewsTicker;