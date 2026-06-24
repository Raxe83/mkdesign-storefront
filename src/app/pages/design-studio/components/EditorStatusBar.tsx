"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[80vh] overflow-y-auto rounded flex flex-col"
        style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.08)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-5 py-3.5 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white/50">{title}</span>
          <button onClick={onClose} className="text-white/25 hover:text-white/70 transition-colors cursor-pointer">
            <X size={14} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

const SHORTCUTS = [
  { keys: ["Strg", "Z"],        label: "Rückgängig" },
  { keys: ["Strg", "Y"],        label: "Wiederherstellen" },
  { keys: ["Strg", "C"],        label: "Objekt kopieren" },
  { keys: ["Strg", "V"],        label: "Objekt einfügen" },
  { keys: ["Entf"],             label: "Auswahl löschen" },
  { keys: ["Strg", "+"],        label: "Zoom vergrößern" },
  { keys: ["Strg", "−"],        label: "Zoom verkleinern" },
  { keys: ["Mittlere Maus"],    label: "Canvas verschieben" },
  { keys: ["Alt", "Ziehen"],    label: "Canvas verschieben" },
  { keys: ["Doppelklick"],      label: "Text bearbeiten" },
];

const HELP_SECTIONS = [
  {
    title: "Text hinzufügen",
    body: 'Klicke im linken Panel auf "Text" und dann auf "Text hinzufügen". Doppelklick auf ein Textobjekt öffnet den Bearbeitungsmodus.',
  },
  {
    title: "Formen & Shapes",
    body: 'Im Panel "Formen" findest du vorgefertigte Shapes. Klicke auf ein Shape um es auf den Canvas zu legen.',
  },
  {
    title: "Bilder hochladen",
    body: 'Unter "Bilder" kannst du eigene Bilder oder Logos hochladen. Sie werden automatisch auf dem Canvas platziert.',
  },
  {
    title: "Ebenen verwalten",
    body: 'Der "Ebenen"-Tab zeigt alle Objekte auf dem Canvas. Klicke auf eine Ebene um sie auszuwählen — auch wenn sie von anderen Objekten verdeckt ist.',
  },
  {
    title: "Verschieben & Zoomen",
    body: "Nutze das Scrollrad zum Zoomen und die mittlere Maustaste zum Verschieben der Ansicht. Der Hand-Modus (Move-Tool) deaktiviert die Objektauswahl temporär.",
  },
  {
    title: "Rückgängig & Wiederherstellen",
    body: "Die Pfeil-Buttons oben im Header (oder Strg+Z / Strg+Y) machen Änderungen rückgängig. Bis zu 50 Schritte werden gespeichert.",
  },
];

function Key({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-medium text-white/70"
      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", minWidth: 24 }}
    >
      {label}
    </span>
  );
}

export function EditorStatusBar() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showHelp,      setShowHelp]      = useState(false);

  return (
    <>
      <footer
        className="flex items-center justify-between px-4 h-7 text-[10px] shrink-0 select-none"
        style={{ background: "#0a0d12", borderTop: "1px solid rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#22c55e" }} />
            SYSTEM ONLINE
          </span>
          <span style={{ color: "rgba(255,255,255,0.12)" }}>|</span>
          <span>ID: FT-2024-X9</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowShortcuts(true)}
            className="hover:text-white/60 cursor-pointer transition-colors"
          >
            Keyboard Shortcuts
          </button>
          <span style={{ color: "rgba(255,255,255,0.12)" }}>|</span>
          <button
            onClick={() => setShowHelp(true)}
            className="hover:text-white/60 cursor-pointer transition-colors"
          >
            Help Center
          </button>
        </div>
      </footer>

      {showShortcuts && (
        <Modal title="Keyboard Shortcuts" onClose={() => setShowShortcuts(false)}>
          <div className="flex flex-col gap-1.5">
            {SHORTCUTS.map(({ keys, label }) => (
              <div key={label} className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-[12px] text-white/55">{label}</span>
                <div className="flex items-center gap-1">
                  {keys.map((k, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <Key label={k} />
                      {i < keys.length - 1 && <span className="text-white/20 text-[10px]">+</span>}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {showHelp && (
        <Modal title="Help Center" onClose={() => setShowHelp(false)}>
          <div className="flex flex-col gap-5">
            {HELP_SECTIONS.map(({ title, body }) => (
              <div key={title}>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-1.5"
                  style={{ color: "var(--color-rust)" }}
                >
                  {title}
                </p>
                <p className="text-[12px] leading-relaxed text-white/50">{body}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}
