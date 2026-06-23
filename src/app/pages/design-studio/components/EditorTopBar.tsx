import Image from "next/image";
import { Search, Undo2, Redo2, Minus, Plus, Share2, Save, Loader2 } from "lucide-react";

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
}

const BTN = "p-1.5 rounded hover:bg-white/[0.07] text-white/40 hover:text-white/80 transition-colors cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white/40";

export function EditorTopBar({ productName, zoom, onZoomIn, onZoomOut, onZoomReset, onUndo, onRedo, canUndo, canRedo, onSave, saving }: Props) {
  return (
    <header
      className="flex items-center h-11 px-3 gap-2 shrink-0"
      style={{ background: "#0f1117", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Logo + breadcrumb */}
      <div className="flex items-center gap-3 shrink-0">
        <Image
          src="/mkdesign-font-white.png"
          alt="MK Design"
          width={160}
          height={44}
          className="object-contain"
          priority
        />
        <span className="text-white/15 hidden sm:block text-lg leading-none">|</span>
        <span className="text-[13px] font-medium text-white/65 hidden sm:block">{productName}</span>
      </div>

      {/* Search */}
      <div className="flex-1 flex justify-center">
        <div
          className="flex items-center gap-2 px-3 h-7 rounded-full w-52 xl:w-64"
          style={{ background: "#1c2128", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <Search size={12} className="text-white/25 shrink-0" />
          <span className="text-[11px] text-white/25">Search components...</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button className={BTN} onClick={onUndo} disabled={!canUndo} title="Rückgängig (Strg+Z)"><Undo2 size={14} /></button>
        <button className={BTN} onClick={onRedo} disabled={!canRedo} title="Wiederholen (Strg+Y)"><Redo2 size={14} /></button>

        <div className="w-px h-4 mx-2" style={{ background: "rgba(255,255,255,0.08)" }} />

        <button className={BTN} onClick={onZoomOut} title="Zoom Out"><Minus size={14} /></button>
        <button
          onClick={onZoomReset}
          className="text-[11px] text-white/50 hover:text-white/80 w-9 text-center tabular-nums select-none cursor-pointer transition-colors"
          title="Zoom zurücksetzen"
        >
          {zoom}%
        </button>
        <button className={BTN} onClick={onZoomIn} title="Zoom In"><Plus size={14} /></button>

        <div className="w-px h-4 mx-2" style={{ background: "rgba(255,255,255,0.08)" }} />

        <button
          className="flex items-center gap-1.5 px-2.5 h-7 rounded text-[11px] font-medium text-white/55 hover:text-white/90 transition-all cursor-pointer"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
        >
          <Share2 size={12} /> Share
        </button>

        <button
          onClick={onSave}
          disabled={saving}
          title="Design speichern & in den Warenkorb"
          className="flex items-center gap-1.5 px-3 h-7 rounded text-[11px] font-semibold ml-1.5 cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-70"
          style={{ background: "var(--color-gold)", color: "#0f1117" }}
          onMouseEnter={e => { if (!saving) e.currentTarget.style.background = "#d4a840"; }}
          onMouseLeave={e => (e.currentTarget.style.background = "var(--color-gold)")}
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          {saving ? "Speichert…" : "Speichern"}
        </button>
      </div>
    </header>
  );
}
