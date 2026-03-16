'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";

interface ToastData {
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  addToast: (message: string, type: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (message: string, type: "success" | "error" | "info") => {
    setToasts((prevToasts) => [
      ...prevToasts,
      { message, type },
    ]);
  };

  const removeToast = (index: number) => {
    setToasts((prevToasts) => prevToasts.filter((_, i) => i !== index));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 space-y-4 z-50">
        {toasts.map((toast, index) => (
          <Toast
            key={index}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(index)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const Toast: React.FC<{ message: string; type: "success" | "error" | "info"; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // Toast verschwindet nach 5 Sekunden
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeClasses = {
    success: "bg-emerald-600 border-emerald-700 text-emerald-100",
    error: "bg-red-600 border-red-700 text-red-100",
    info: "bg-sky-600 border-sky-700 text-sky-100",
  };

  const Icon = {
    success: <CheckCircle className="h-6 w-6" />,
    error: <XCircle className="h-6 w-6" />,
    info: <Info className="h-6 w-6" />,
  };

  return (
    <div
      className={`px-4 py-2 mb-4 max-w-xs w-full rounded-lg text-white border-2 ${typeClasses[type]} shadow-lg flex items-center space-x-3 transition-all duration-300 ease-in-out`}
    >
      <div className="flex-shrink-0">
        {Icon[type]}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold">{message}</p>
      </div>
      <button onClick={onClose} className="ml-4 -mt-2 hover:text-opacity-75">
        <span className="text-xl">&times;</span>
      </button>
    </div>
  );
};
