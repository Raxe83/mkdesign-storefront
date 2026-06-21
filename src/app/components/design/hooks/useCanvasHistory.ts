"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Canvas } from "fabric";

const MAX = 50;

export function useCanvasHistory(
  fabricRef: React.MutableRefObject<Canvas | null>,
  canvasReady: boolean,
) {
  const past    = useRef<string[]>([]);
  const future  = useRef<string[]>([]);
  const prevJson = useRef<string>("{}");
  const busy    = useRef(false);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const sync = () => {
    setCanUndo(past.current.length > 0);
    setCanRedo(future.current.length > 0);
  };

  const push = useCallback(() => {
    if (busy.current || !fabricRef.current) return;
    past.current.push(prevJson.current);
    if (past.current.length > MAX) past.current.shift();
    prevJson.current = JSON.stringify(fabricRef.current.toJSON());
    future.current = [];
    sync();
  }, [fabricRef]);

  useEffect(() => {
    const fab = fabricRef.current;
    if (!fab || !canvasReady) return;

    past.current    = [];
    future.current  = [];
    prevJson.current = JSON.stringify(fab.toJSON());
    sync();

    fab.on("object:added",    push);
    fab.on("object:removed",  push);
    fab.on("object:modified", push);

    return () => {
      fab.off("object:added",    push);
      fab.off("object:removed",  push);
      fab.off("object:modified", push);
    };
  }, [canvasReady, push, fabricRef]);

  const undo = useCallback(async () => {
    const fab = fabricRef.current;
    if (!fab || past.current.length === 0) return;
    future.current.push(prevJson.current);
    prevJson.current = past.current.pop()!;
    busy.current = true;
    await fab.loadFromJSON(JSON.parse(prevJson.current));
    fab.backgroundColor = "transparent";
    fab.requestRenderAll();
    busy.current = false;
    sync();
  }, [fabricRef]);

  const redo = useCallback(async () => {
    const fab = fabricRef.current;
    if (!fab || future.current.length === 0) return;
    past.current.push(prevJson.current);
    prevJson.current = future.current.pop()!;
    busy.current = true;
    await fab.loadFromJSON(JSON.parse(prevJson.current));
    fab.backgroundColor = "transparent";
    fab.requestRenderAll();
    busy.current = false;
    sync();
  }, [fabricRef]);

  // Keyboard shortcuts (Ctrl/⌘ + Z / Y / Shift+Z)
  useEffect(() => {
    if (!canvasReady) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (document.activeElement as HTMLElement)?.isContentEditable) return;
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      if (e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if (e.key === "y" || (e.key === "z" && e.shiftKey)) { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canvasReady, undo, redo]);

  return { undo, redo, canUndo, canRedo };
}
