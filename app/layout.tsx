import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oblio Manager - API & Webhooks Management",
  description: "Open-source interface for managing Oblio API and webhooks. Easily create, manage, and monitor your Oblio integrations with a modern UI.",
  keywords: ["Oblio", "API", "Webhooks", "Invoice Management", "Romanian Invoicing", "E-Factura", "SPV"],
  authors: [{ name: "Oblio Manager Contributors" }],
  openGraph: {
    title: "Oblio Manager - API & Webhooks Management",
    description: "Open-source interface for managing Oblio API and webhooks",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
