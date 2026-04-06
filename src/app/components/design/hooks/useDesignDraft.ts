"use client";

import { useCallback } from "react";

const DRAFT_KEY   = "mk_design_draft";
const TTL_MS      = 24 * 60 * 60 * 1000; // 24 Stunden

export interface DesignDraft {
  productId:    string;
  sideAJson:    object | null;
  sideBJson:    object | null;
  sideBEnabled: boolean;
  savedAt:      number;
}

type DraftPayload = Pick<DesignDraft, "sideAJson" | "sideBJson" | "sideBEnabled">;

export function useDesignDraft() {
  const save = useCallback((
    productId: string,
    sideAJson: object | null,
    sideBJson: object | null,
    sideBEnabled: boolean,
  ) => {
    try {
      const data: DesignDraft = { productId, sideAJson, sideBJson, sideBEnabled, savedAt: Date.now() };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch { /* localStorage blocked */ }
  }, []);

  const load = useCallback((productId: string): DraftPayload | null => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      const data: DesignDraft = JSON.parse(raw);
      if (data.productId !== productId) return null;
      if (Date.now() - data.savedAt > TTL_MS) {
        localStorage.removeItem(DRAFT_KEY);
        return null;
      }
      return { sideAJson: data.sideAJson, sideBJson: data.sideBJson, sideBEnabled: data.sideBEnabled };
    } catch {
      return null;
    }
  }, []);

  const clear = useCallback(() => {
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
  }, []);

  return { save, load, clear };
}
