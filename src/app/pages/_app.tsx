import "../global.css"; // Passe den Pfad an, falls deine Datei woanders liegt

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
