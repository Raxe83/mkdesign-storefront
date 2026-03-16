'use client'

import { useEffect, useState } from "react";
import { fetchBlogPost } from "../services/shopify";
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

const ImportantMessage = () => {
  const [modalMessage, setModalMessage] = useState<MessageType | null>(null);
  const [stickyMessages, setStickyMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    const modalCookie = getCookie("importantMessageShown");

    const getMessages = async () => {
      const articles = await fetchBlogPost();
      if (!articles || articles.length === 0) return;

      // Sticky
      const sticky = articles
        .filter((article) => article.node.tags.includes("sticky"))
        .map(({ node }) => ({
          content: node.content,
          title: node.title,
          type: "sticky" as const,
        }));

      setStickyMessages(sticky);

      // Modal
      if (!modalCookie) {
        const important = articles.find((a) =>
          a.node.tags.includes("important")
        );
        if (important) {
          setModalMessage({
            content: important.node.content,
            title: important.node.title,
            type: "modal",
          });
        }
      }
    };

    getMessages();
  }, []);

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

      {stickyMessages.length > 0 && <NewsTicker items={stickyMessages} theme="earthy" size="sm"/>}
    </>
  );
};

export default ImportantMessage;
