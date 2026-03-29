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

const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

const getCookie = (name: string) => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

interface ImportantMessageProps {
  /** Server-fetched announcements from cms_announcement MetaObjects */
  announcements: CmsAnnouncement[];
}

const ImportantMessage = ({ announcements }: ImportantMessageProps) => {
  const importantItem = announcements.find((a) => a.messageType === "important");
  const initialModal =
    importantItem && !getCookie("importantMessageShown")
      ? { title: importantItem.title, content: importantItem.content, type: "modal" as const }
      : null;

  const [modalMessage, setModalMessage] = useState<MessageType | null>(initialModal);

  const stickyMessages: MessageType[] = announcements
    .filter((a) => a.messageType === "sticky" || a.messageType === "promo")
    .map((a) => ({ title: a.title, content: a.content, type: a.messageType }));

  const closeModal = () => {
    setModalMessage(null);
    setCookie("importantMessageShown", "true", 1);
  };

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
