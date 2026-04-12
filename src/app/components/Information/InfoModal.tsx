'use client'

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, title, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" aria-hidden="true">
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-modal-title"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 id="info-modal-title" className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
            <p className="mt-4 text-gray-700 dark:text-gray-300">{message}</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="rounded-sm bg-rust px-5 py-2.5 text-sm font-medium tracking-[0.04em] uppercase text-white hover:bg-rust/90 focus:outline-none focus:ring-2 focus:ring-rust focus:ring-offset-2"
              >
                Verstanden
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InfoModal;
