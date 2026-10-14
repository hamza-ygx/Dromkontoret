import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"] });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Drömboendet – RKJH",
  description: "Välj typ, rum och stil – se ditt drömboende byggas i 3D med pris och inköpslista.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#071222" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
