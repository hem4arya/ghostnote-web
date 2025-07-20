import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
// Import Navbar global styles AFTER main globals.css - CRITICAL for styling
import "@ghostnote/navbar/src/styles/global.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GhostNote - Anonymous Creative Writing Marketplace",
  description:
    "Write. Sell. Clone. Defend Your Ghost. Marketplace for original thought in the digital underground.",
  keywords: [
    "writing",
    "marketplace",
    "anonymous",
    "creative",
    "remix",
    "notes",
    "ghost",
  ],
  authors: [{ name: "GhostNote" }],
  creator: "GhostNote",
  publisher: "GhostNote",
  openGraph: {
    title: "GhostNote - Anonymous Creative Writing Marketplace",
    description:
      "Write. Sell. Clone. Defend Your Ghost. Marketplace for original thought in the digital underground.",
    type: "website",
    locale: "en_US",
    siteName: "GhostNote",
  },
  twitter: {
    card: "summary_large_image",
    title: "GhostNote - Anonymous Creative Writing Marketplace",
    description:
      "Write. Sell. Clone. Defend Your Ghost. Marketplace for original thought in the digital underground.",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-ghost-black text-white`}
      >
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
