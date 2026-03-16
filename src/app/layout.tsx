import type { Metadata } from "next";
import "./global.css";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import AgeVerification from "./components/age-verification";
import ScrollToTop from "./utils/ScrollToTop";
import ImportantMessage from "./components/ImportantMessages";
import CookieConsent from "./components/cookie-consent";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { shopDetails } from "./global";
import { env } from "process";

export const metadata: Metadata = {
  title: shopDetails.shopname,
  description: shopDetails.shopDescription,
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
    other: [{ rel: "icon", url: "/favicon.svg" }],
  },
  openGraph: {
    title: shopDetails.shopname,
    description: shopDetails.shopDescription,
    url: env.PUBLIC_URL,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: shopDetails.shopname,
      },
    ],
    siteName: shopDetails.shopname,
  },
  twitter: {
    card: "summary_large_image",
    site: "@" + shopDetails.shopname,
    title: shopDetails.shopname,
    description: shopDetails.shopDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="bg-background font-sans leading-relaxed">
        <CartProvider>
          <ToastProvider>
            {/* <AgeVerification /> */}
            <ScrollToTop />
            <ImportantMessage />
            <Header />
            {/* Main Content */}
            {/* Center the content and make sure it looks modern and responsive */}
            <div>{children}</div>
            <Footer />
            {/* Cookie Consent */}
            <CookieConsent />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
