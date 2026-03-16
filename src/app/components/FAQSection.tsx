'use client'

import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "Wie lange dauert es, bis ich eine Antwort auf meine Anfrage erhalte?",
    answer:
      "In der Regel erhalten Sie innerhalb von 24 bis 48 Stunden eine Antwort auf Ihre Anfrage. In dringenden Fällen können Sie uns auch telefonisch erreichen.",
  },
  {
    question: "Bietet ihr Support nach Projektabschluss an?",
    answer:
      "Ja, wir bieten auch nach Projektabschluss Support an. Wir sind für Sie da, wenn Sie Fragen haben oder Hilfe benötigen.",
  },
  {
    question: "Welche Technologien nutzt ihr?",
    answer:
      "Wir arbeiten mit dem React-Framework und verwenden moderne Technologien wie Tailwind CSS, um moderne und performante Webseiten zu erstellen.",
  },
  {
    question: "Kann ich meine bestehende Website/App von euch überarbeiten lassen?",
    answer:
      "Ja, wir überarbeiten auch bestehende Webseiten und Apps. Kontaktieren Sie uns einfach und wir besprechen die Details.",
  },
  {
    question: "Kann ich mein Projekt später erweitern lassen?",
    answer:
      "Ja, Sie können Ihr Projekt jederzeit erweitern lassen, um neue Funktionen hinzuzufügen oder bestehende zu verfeinern.",
  },
];

const FAQItem: React.FC<{ question: string; answer: string }> = ({
  question,
  answer,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <span className="text-lg font-semibold">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out mt-2 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
};

const FAQSection: React.FC = () => {
  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Allgemeine Fragen
        </h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
