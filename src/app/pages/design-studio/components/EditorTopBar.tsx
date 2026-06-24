import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Undo2, Redo2, Minus, Plus, Share2, Save, Loader2, ShoppingCart, User } from "lucide-react";
import type { SessionCustomer } from "@/app/hooks/useSessionCustomer";

interface Props {
  productName: string;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onSave: () => void;
  saving: boolean;
  onBack: () => void;
  cartItemCount: number;
  customer: SessionCustomer | null;
}

function AccountAvatar({ firstName, lastName }: SessionCustomer) {
  const initials = [firstName?.[0], lastName?.[0]].filter(Boolean).join("").toUpperCase() || "?";
  return (
    <div
      className="w-6 h-6 rounded-full text-white text-[10px] font-semibold flex items-center justify-center leading-none shrink-0"
      style={{ background: "var(--color-rust)" }}
    >
      {initials}
    </div>
  );
}

const BTN = "p-2 rounded hover:bg-white/[0.07] text-white/40 hover:text-white/80 transition-colors cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white/40";

export function EditorTopBar({
  productName, zoom, onZoomIn, onZoomOut, onZoomReset, onUndo, onRedo, canUndo, canRedo,
  onSave, saving, onBack, cartItemCount, customer,
}: Props) {
  return (
    <header
      className="flex items-center h-16 px-4 gap-3 shrink-0"
      style={{ background: "#0f1117", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Produktwechsel + Logo + Produktname */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onBack}
          title="Produkt wechseln"
          className="flex items-center gap-1.5 pl-1.5 pr-3 h-9 rounded text-white/45 hover:text-white/85 hover:bg-white/[0.07] transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} />
          <span className="text-[12px] font-medium hidden sm:block">Produkt</span>
        </button>

        <div className="w-px h-6 shrink-0" style={{ background: "rgba(255,255,255,0.1)" }} />

        <Link
          href="/"
          title="Zurück zum Shop"
          className="flex items-center shrink-0 opacity-90 hover:opacity-100 transition-opacity"
        >
          <Image
            src="/mkdesign-font-white.png"
            alt="MK Design — zurück zum Shop"
            width={200}
            height={55}
            className="object-contain"
            priority
          />
        </Link>

        <span className="text-white/15 hidden md:block text-lg leading-none">|</span>
        <span className="text-[14px] font-medium text-white/65 hidden md:block">{productName}</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Controls */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button className={BTN} onClick={onUndo} disabled={!canUndo} title="Rückgängig (Strg+Z)"><Undo2 size={16} /></button>
        <button className={BTN} onClick={onRedo} disabled={!canRedo} title="Wiederholen (Strg+Y)"><Redo2 size={16} /></button>

        <div className="w-px h-6 mx-2.5" style={{ background: "rgba(255,255,255,0.08)" }} />

        <button className={BTN} onClick={onZoomOut} title="Zoom Out"><Minus size={16} /></button>
        <button
          onClick={onZoomReset}
          className="text-[12px] text-white/50 hover:text-white/80 w-10 text-center tabular-nums select-none cursor-pointer transition-colors"
          title="Zoom zurücksetzen"
        >
          {zoom}%
        </button>
        <button className={BTN} onClick={onZoomIn} title="Zoom In"><Plus size={16} /></button>

        <div className="w-px h-6 mx-2.5" style={{ background: "rgba(255,255,255,0.08)" }} />

        <button
          className="flex items-center gap-1.5 px-3.5 h-9 rounded text-[12px] font-medium text-white/55 hover:text-white/90 transition-all cursor-pointer"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
        >
          <Share2 size={14} /> Share
        </button>

        <Link
          href="/pages/cart"
          title="Zum Warenkorb"
          className="relative flex items-center justify-center w-9 h-9 ml-1 rounded text-white/55 hover:text-white/90 hover:bg-white/[0.07] transition-colors cursor-pointer"
        >
          <ShoppingCart size={17} />
          {cartItemCount > 0 && (
            <span
              className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 rounded-full text-[9px] font-semibold leading-none"
              style={{ background: "var(--color-rust)", color: "white" }}
            >
              {cartItemCount}
            </span>
          )}
        </Link>

        <Link
          href={customer ? "/pages/account" : "/pages/login"}
          title={customer ? "Mein Konto" : "Anmelden"}
          className="flex items-center justify-center w-9 h-9 ml-0.5 rounded text-white/55 hover:text-white/90 hover:bg-white/[0.07] transition-colors cursor-pointer"
        >
          {customer ? <AccountAvatar firstName={customer.firstName} lastName={customer.lastName} /> : <User size={17} />}
        </Link>

        <button
          onClick={onSave}
          disabled={saving}
          title="Design speichern & in den Warenkorb"
          className="flex items-center gap-1.5 px-4 h-9 rounded text-[12px] font-semibold ml-1.5 cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-70"
          style={{ background: "var(--color-gold)", color: "#0f1117" }}
          onMouseEnter={e => { if (!saving) e.currentTarget.style.background = "#d4a840"; }}
          onMouseLeave={e => (e.currentTarget.style.background = "var(--color-gold)")}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Speichert…" : "Speichern"}
        </button>
      </div>
    </header>
  );
}
