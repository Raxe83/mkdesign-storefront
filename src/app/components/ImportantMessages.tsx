"use client";

import { useEffect, useState } from "react";
import type { CmsAnnouncement } from "../types/shopify";
import InfoModal from "./Information/InfoModal";
import NewsTicker from "./Information/NewsTicker";

export interface MessageType {
  content: string;
  title: string;
  type: string;
}

interface ImportantMessageProps {
  /** Server-fetched announcements from cms_announcement MetaObjects */
  announcements: CmsAnnouncement[];
}

const STORAGE_PREFIX = "announcement_dismissed_";

function isDismissed(id: string): boolean {
  try {
    return localStorage.getItem(STORAGE_PREFIX + id) === "1";
  } catch {
    return false;
  }
}

function markDismissed(id: string): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + id, "1");
  } catch {
    // localStorage not available (SSR, private mode) — silent fail
  }
}

const ImportantMessage = ({ announcements }: ImportantMessageProps) => {
  const importantItem = announcements.find((a) => a.messageType === "important");
  const initialModal = importantItem
    ? { title: importantItem.title, content: importantItem.content, type: "modal" as const }
    : null;

  const [modalMessage, setModalMessage] = useState<MessageType | null>(initialModal);

  // popup: check localStorage after mount (client-only)
  const [popupMessage, setPopupMessage] = useState<(MessageType & { id: string }) | null>(null);

  useEffect(() => {
    const popupItem = announcements.find(
      (a) => a.messageType === "popup" && !isDismissed(a.id),
    );
    if (popupItem) {
      setPopupMessage({ title: popupItem.title, content: popupItem.content, type: "popup", id: popupItem.id });
    }
  }, [announcements]);

  const closeModal = () => setModalMessage(null);

  const closePopup = () => {
    if (popupMessage) {
      markDismissed(popupMessage.id);
    }
    setPopupMessage(null);
  };

  const stickyMessages: MessageType[] = announcements
    .filter((a) => a.messageType === "sticky" || a.messageType === "promo")
    .map((a) => ({ title: a.title, content: a.content, type: a.messageType }));

  // important-modal has priority; popup only shows when no important-modal is active
  const activeModal = modalMessage ?? null;
  const activePopup = !activeModal && popupMessage ? popupMessage : null;

  return (
    <>
      {activeModal && (
        <InfoModal
          isOpen={true}
          onClose={closeModal}
          title={activeModal.title}
          message={activeModal.content}
        />
      )}
      {activePopup && (
        <InfoModal
          isOpen={true}
          onClose={closePopup}
          title={activePopup.title}
          message={activePopup.content}
        />
      )}
      {stickyMessages.length > 0 && (
        <NewsTicker items={stickyMessages} theme="earthy" size="sm" />
      )}
    </>
  );
};

export default ImportantMessage;
