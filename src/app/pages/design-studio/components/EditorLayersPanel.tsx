import { ChevronRight, ChevronDown, Circle, Square, Type, X } from "lucide-react";
import { useState } from "react";

interface Props {
  onClose: () => void;
}

interface Layer {
  id: string;
  label: string;
  type: "group" | "shape" | "text";
  children?: Layer[];
}

const LAYERS: Layer[] = [
  {
    id: "main",
    label: "Main Canvas",
    type: "group",
    children: [
      { id: "barrel-body", label: "Barrel Body",  type: "shape" },
      { id: "upper-ring",  label: "Upper Ring",   type: "shape" },
      { id: "lower-ring",  label: "Lower Ring",   type: "shape" },
      { id: "logo-text",   label: "Logo Text",    type: "text"  },
    ],
  },
];

export function EditorLayersPanel({ onClose }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["main"]));
  const [selected, setSelected] = useState<string>("main");

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <aside
      className="flex flex-col w-[200px] shrink-0"
      style={{ background: "#111318", borderRight: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 h-9 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="text-[10px] font-semibold tracking-[0.12em] text-white/40 uppercase">
          Layers
        </span>
        <button
          onClick={onClose}
          className="text-white/25 hover:text-white/60 transition-colors cursor-pointer"
        >
          <X size={13} />
        </button>
      </div>

      {/* Layer tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {LAYERS.map((layer) => (
          <LayerRow
            key={layer.id}
            layer={layer}
            depth={0}
            expanded={expanded}
            selected={selected}
            onToggle={toggle}
            onSelect={setSelected}
          />
        ))}
      </div>
    </aside>
  );
}

function LayerRow({
  layer,
  depth,
  expanded,
  selected,
  onToggle,
  onSelect,
}: {
  layer: Layer;
  depth: number;
  expanded: Set<string>;
  selected: string;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
}) {
  const isExpanded = expanded.has(layer.id);
  const isSelected = selected === layer.id;

  return (
    <>
      <button
        onClick={() => {
          onSelect(layer.id);
          if (layer.children) onToggle(layer.id);
        }}
        className="w-full flex items-center gap-1.5 px-2 h-7 text-left cursor-pointer transition-colors"
        style={{
          paddingLeft: `${8 + depth * 14}px`,
          background: isSelected ? "rgba(184,92,42,0.14)" : "transparent",
          color: isSelected ? "var(--color-rust)" : "rgba(255,255,255,0.6)",
        }}
        onMouseEnter={e => {
          if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        }}
        onMouseLeave={e => {
          if (!isSelected) e.currentTarget.style.background = "transparent";
        }}
      >
        {layer.children ? (
          isExpanded ? <ChevronDown size={11} className="shrink-0 opacity-50" /> : <ChevronRight size={11} className="shrink-0 opacity-50" />
        ) : (
          <LayerIcon type={layer.type} />
        )}
        <span className="text-[12px] truncate">{layer.label}</span>
      </button>

      {layer.children && isExpanded && layer.children.map((child) => (
        <LayerRow
          key={child.id}
          layer={child}
          depth={depth + 1}
          expanded={expanded}
          selected={selected}
          onToggle={onToggle}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

function LayerIcon({ type }: { type: Layer["type"] }) {
  const cls = "shrink-0 opacity-40";
  if (type === "text")  return <Type   size={10} className={cls} />;
  if (type === "shape") return <Square size={10} className={cls} />;
  return <Circle size={10} className={cls} />;
}
