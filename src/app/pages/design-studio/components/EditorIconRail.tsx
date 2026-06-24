import { MousePointer2, Hand, Type, Square, Image, Layers, Settings } from "lucide-react";
import type { ActiveTool } from "../StudioEditor";

interface Props {
  activeTool: ActiveTool;
  onToolChange: (t: ActiveTool) => void;
  layersOpen: boolean;
  onToggleLayers: () => void;
}

interface ToolItem {
  id: ActiveTool;
  icon: React.ReactNode;
  label: string;
}

const TOOLS: ToolItem[] = [
  { id: "select",  icon: <MousePointer2 size={17} />, label: "Auswählen" },
  { id: "move",    icon: <Hand size={17} />,           label: "Verschieben" },
  { id: "text",    icon: <Type size={17} />,           label: "Text" },
  { id: "shapes",  icon: <Square size={17} />,         label: "Formen" },
  { id: "images",  icon: <Image size={17} />,          label: "Bilder" },
];

export function EditorIconRail({ activeTool, onToolChange, layersOpen, onToggleLayers }: Props) {
  return (
    <nav
      className="flex flex-col items-center py-2 gap-0.5 shrink-0 w-[52px]"
      style={{ background: "#111318", borderRight: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Tool buttons */}
      {TOOLS.slice(0, 2).map((t) => (
        <RailButton
          key={t.id}
          active={activeTool === t.id}
          label={t.label}
          onClick={() => onToolChange(t.id)}
        >
          {t.icon}
        </RailButton>
      ))}

      <Divider />

      {TOOLS.slice(2).map((t) => (
        <RailButton
          key={t.id}
          active={activeTool === t.id}
          label={t.label}
          onClick={() => onToolChange(t.id)}
        >
          {t.icon}
        </RailButton>
      ))}

      {/* Layers toggle */}
      {/* <RailButton
        active={layersOpen}
        label="Ebenen"
        onClick={onToggleLayers}
      >
        <Layers size={17} />
      </RailButton> */}

      {/* Bottom: Settings */}
      <div className="flex-1" />
      <RailButton active={false} label="Einstellungen" onClick={() => {}}>
        <Settings size={17} />
      </RailButton>
    </nav>
  );
}

function RailButton({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      title={label}
      onClick={onClick}
      className="w-9 h-9 flex items-center justify-center rounded cursor-pointer transition-all duration-150"
      style={{
        color: active ? "var(--color-rust)" : "rgba(255,255,255,0.4)",
        background: active ? "rgba(184,92,42,0.12)" : "transparent",
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          e.currentTarget.style.color = "rgba(255,255,255,0.75)";
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "rgba(255,255,255,0.4)";
        }
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return (
    <div className="w-6 my-1" style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
  );
}
