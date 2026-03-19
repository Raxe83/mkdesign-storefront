import type { FabricConf } from "../types";

export function ShapeIcon({ fc }: { fc: FabricConf }) {
  const vb = "-70 -70 140 140";
  const s  = { fill: "none", stroke: "currentColor", strokeWidth: 5 } as const;

  if (fc.k === "rect")
    return <svg viewBox={vb}><rect x={-fc.w / 2} y={-fc.h / 2} width={fc.w} height={fc.h} rx={fc.rx ?? 0} {...s} /></svg>;
  if (fc.k === "circle")
    return <svg viewBox={vb}><circle cx={0} cy={0} r={fc.r} {...s} /></svg>;
  if (fc.k === "ellipse")
    return <svg viewBox={vb}><ellipse cx={0} cy={0} rx={fc.rx} ry={fc.ry} {...s} /></svg>;
  if (fc.k === "triangle")
    return <svg viewBox={vb}><polygon points={`0,${-fc.h / 2} ${-fc.w / 2},${fc.h / 2} ${fc.w / 2},${fc.h / 2}`} {...s} /></svg>;
  if (fc.k === "line")
    return <svg viewBox={vb}><line x1={-55} y1={0} x2={55} y2={0} {...s} /></svg>;
  if (fc.k === "poly")
    return <svg viewBox={vb}><polygon points={fc.pts.map((p) => `${p.x},${p.y}`).join(" ")} {...s} /></svg>;
  return <svg viewBox={vb}><path d={(fc as any).d} {...s} /></svg>;
}
