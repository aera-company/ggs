import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const archivo = localFont({
  src: "./fonts/Archivo-wdth.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMono-wght.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GAVEA Global Services · Concept experience",
  description:
    "Conceito estratégico e protótipo demonstrativo. Apresentação privada para a liderança da GAVEA GROUP, concebida pela AERA.",
  // Conceito privado: não indexar até aprovação.
  robots: { index: false, follow: false, nocache: true },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#030a12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${geistMono.variable}`}>
      <body className="grain">{children}</body>
    </html>
  );
}
