# MK-Design Shopify Storefront 

Eine hochperformante, **Headless Shopify Storefront** für [M.K.Design](https://mkdesign.rayden-studio.com/) – spezialisiert auf personalisierte Werkstatt-Produkte wie Feuertonnen, Nachtlichter und Gravuren.

[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20|%20TS%20|%20Tailwind-blue)](https://nextjs.org/)
[![Performance](https://img.shields.io/badge/Lighthouse-95%2B-green)](#)

> **Case Study: Solo-Entwicklung eines Fullstack-Systems.** Dieses Projekt demonstriert die Umsetzung einer komplexen E-Commerce-Architektur im Alleingang – von der API-Integration bis hin zum kundenspezifischen Design-Editor. Der Fokus liegt auf **Pragmatismus, Wartbarkeit und exzellenter User Experience**.

---

## 🛠 Tech Stack

| Ebene | Technologien |
| :--- | :--- |
| **Framework** | **Next.js 15** (App Router), TypeScript 5 (Strict Mode) |
| **Styling** | Tailwind CSS 3, Framer Motion (Animationen) |
| **Backend** | Shopify Storefront & Admin API (Headless CMS) |
| **Editor** | **Fabric.js 7** (Canvas-basierter Produkt-Konfigurator) |
| **Services** | Resend (Mail), Cloudinary (Assets), Judge.me (Reviews) |
| **Quality** | Vitest (Unit Testing), Lucide React (Icons) |

---

##  Highlights & Features

* **Custom Design Editor:** Ein mächtiger, Fabric.js-basierter Konfigurator, der es Kunden ermöglicht, Gravuren und Nachtlichter direkt im Browser zu gestalten.
* **Headless Commerce:** Vollständige Integration der Shopify-Logik (Cart, Checkout, Customer Auth) über eine entkoppelte Frontend-Architektur.
* **Data-driven CMS:** Dynamische Steuerung von Inhalten und Lieferzeiten über **Shopify Metaobjects**, wodurch der Shop ohne Code-Änderungen durch den Betreiber gepflegt werden kann.
* **Performance-Optimiert:** Serverseitiges Daten-Fetching, optimierte Image-Pipelines via Cloudinary und minimales Client-seitiges JavaScript.
* **Responsive & Accessibility:** Konsequenter Mobile-First-Ansatz und Unterstützung für Dark Mode.

---

##  Architektur & Struktur

Das Projekt folgt einer modularen Struktur, um Logik und Darstellung strikt zu trennen:

```text
src/
├── app/
│   ├── actions/        # Type-safe Server Actions (Auth, Form-Handling)
│   ├── api/            # Route Handler für Webhooks & externe Services
│   ├── components/     # Modulare UI-Komponenten (Atomic Design Ansatz)
│   │   └── design/     # Komplexe Editor-Logik & Fabric.js Hooks
│   ├── hooks/          # Domain-spezifische Custom Hooks
│   ├── services/       # Abstraktionsschicht für Shopify API & Queries
│   ├── types/          # Zentrale TypeScript-Definitionen
│   └── utils/          # Pure Functions & Hilfslogik (Unit-tested)
└── middleware.ts       # Edge-Runtime Auth-Guard & Session-Handling
