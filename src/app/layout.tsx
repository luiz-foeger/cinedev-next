import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CineDev - Seu Catálogo de Cinema",
  description: "Desenvolvido por Luiz Felipe",
};

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SearchProvider } from "@/context/SearchContext";
import Header from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SearchProvider>
          <Header />
          {children}
        </SearchProvider>
      </body>
    </html>
  );
}
