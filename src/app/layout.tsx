import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import "./global.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
});
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import ScrollToTop from "./utils/ScrollToTop";
import ImportantMessage from "./components/ImportantMessages";
import CookieConsent from "./components/cookie-consent";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { shopDetails } from "./global";
import { env } from "process";
import { getSessionToken } from "./lib/session";
import { getCustomerData } from "./services/shopifyCustomer";

export const metadata: Metadata = {
  title: shopDetails.shopname,
  description: shopDetails.shopDescription,
  icons: {
    icon: "/mkdesign-logo.png",
    apple: "/mkdesign-logo.png",
    other: [{ rel: "icon", url: "/mkdesign-logo.png" }],
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Session-Check — schlägt lautlos fehl, Header zeigt dann Login-Icon
  let customer = null;
  try {
    const token = await getSessionToken();
    if (token) {
      const { customer: c } = await getCustomerData(token);
      customer = c ? { firstName: c.firstName, lastName: c.lastName } : null;
    }
  } catch {
    // Session ungültig oder Shopify nicht erreichbar — kein Fehler werfen
  }

  return (
    <html className={`${playfairDisplay.variable} ${dmSans.variable}`}>
      <body className="bg-background font-sans leading-relaxed">
        <CartProvider>
          <ToastProvider>
            {/* <AgeVerification /> */}
            <ScrollToTop />
            <ImportantMessage />
            <Header customer={customer} />
            {/* Main Content */}
            <div className="pt-16 min-h-screen">{children}</div>
            <Footer />
            <CookieConsent />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
