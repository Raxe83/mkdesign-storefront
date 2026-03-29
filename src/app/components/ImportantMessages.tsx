"use client";

import { useState } from "react";
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

const ImportantMessage = ({ announcements }: ImportantMessageProps) => {
  const importantItem = announcements.find((a) => a.messageType === "important");
  const initialModal = importantItem
    ? { title: importantItem.title, content: importantItem.content, type: "modal" as const }
    : null;

  const [modalMessage, setModalMessage] = useState<MessageType | null>(initialModal);

  const stickyMessages: MessageType[] = announcements
    .filter((a) => a.messageType === "sticky" || a.messageType === "promo")
    .map((a) => ({ title: a.title, content: a.content, type: a.messageType }));

  const closeModal = () => setModalMessage(null);

  return (
    <>
      {modalMessage && (
        <InfoModal
          isOpen={true}
          onClose={closeModal}
          title={modalMessage.title}
          message={modalMessage.content}
        />
      )}
      {stickyMessages.length > 0 && (
        <NewsTicker items={stickyMessages} theme="earthy" size="sm" />
      )}
    </>
  );
};

export default ImportantMessage;
