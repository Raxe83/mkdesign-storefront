"use client";

import { useEffect, useRef, useState } from "react";

export function useEditorZoomPan(
  wrapperRef: React.RefObject<HTMLDivElement | null>,
  svgW: number,
  svgH: number,
  selectedProductId: string | undefined,
) {
  const [cssZoom, setCssZoom] = useState(1);
  const [cssTx, setCssTx]     = useState(0);
  const [cssTy, setCssTy]     = useState(0);
  const [panMode, setPanMode]   = useState(false);
  const [midPanning, setMidPanning] = useState(false);

  // Refs so event handlers always read fresh values (no stale closures)
  const cssZoomRef  = useRef(1);
  const cssTxRef    = useRef(0);
  const cssTyRef    = useRef(0);
  const panModeRef  = useRef(false);
  cssZoomRef.current  = cssZoom;
  cssTxRef.current    = cssTx;
  cssTyRef.current    = cssTy;
  panModeRef.current  = panMode;

  // Reset on product change
  useEffect(() => {
    setCssZoom(1);
    setCssTx(0);
    setCssTy(0);
    setPanMode(false);
  }, [selectedProductId]);

  // Wheel → zoom to cursor (non-passive so preventDefault works)
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect   = wrapper.getBoundingClientRect();
      const px     = e.clientX - rect.left;
      const py     = e.clientY - rect.top;
      const zoom   = cssZoomRef.current;
      const focalX = (px - cssTxRef.current) / zoom;
      const focalY = (py - cssTyRef.current) / zoom;
      const factor = 0.999 ** e.deltaY;
      const nz     = Math.max(0.25, Math.min(8, zoom * factor));
      const nx     = px - focalX * nz;
      const ny     = py - focalY * nz;
      cssZoomRef.current = nz;
      cssTxRef.current   = nx;
      cssTyRef.current   = ny;
      setCssZoom(nz);
      setCssTx(nx);
      setCssTy(ny);
    };
    wrapper.addEventListener("wheel", onWheel, { passive: false });
    return () => wrapper.removeEventListener("wheel", onWheel);
  }, [wrapperRef]);

  // Alt+drag / panMode drag / middle-mouse drag → pan
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    let panning = false, lx = 0, ly = 0;

    const onDown = (e: MouseEvent) => {
      const isMid = e.button === 1;
      if (!e.altKey && !panModeRef.current && !isMid) return;
      if (isMid) e.preventDefault();
      panning = true;
      lx = e.clientX;
      ly = e.clientY;
      wrapper.style.cursor = "grabbing";
      if (isMid) setMidPanning(true);
      e.preventDefault();
      e.stopPropagation();
    };
    const onMove = (e: MouseEvent) => {
      if (!panning) return;
      const nx = cssTxRef.current + e.clientX - lx;
      const ny = cssTyRef.current + e.clientY - ly;
      lx = e.clientX;
      ly = e.clientY;
      cssTxRef.current = nx;
      cssTyRef.current = ny;
      setCssTx(nx);
      setCssTy(ny);
    };
    const onUp = (e: MouseEvent) => {
      if (!panning) return;
      panning = false;
      if (e.button === 1) setMidPanning(false);
      wrapper.style.cursor = panModeRef.current ? "grab" : "";
    };

    wrapper.addEventListener("mousedown", onDown, { capture: true });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      wrapper.removeEventListener("mousedown", onDown, { capture: true });
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [wrapperRef]);

  const zoomTo = (nz: number) => {
    const cx = svgW / 2;
    const cy = svgH / 2;
    const fx = (cx - cssTxRef.current) / cssZoomRef.current;
    const fy = (cy - cssTyRef.current) / cssZoomRef.current;
    setCssZoom(nz);
    setCssTx(cx - fx * nz);
    setCssTy(cy - fy * nz);
  };

  return {
    cssZoom, cssTx, cssTy, panMode, midPanning,
    setPanMode,
    zoomIn:    () => zoomTo(Math.min(8, cssZoom * 1.25)),
    zoomOut:   () => zoomTo(Math.max(0.25, cssZoom / 1.25)),
    zoomReset: () => { setCssZoom(1); setCssTx(0); setCssTy(0); },
  };
}
