import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";
import "@/components/theme/theme.css";

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
  description: "Write. Sell. Clone. Defend Your Ghost. Marketplace for original thought in the digital underground.",
  keywords: ["writing", "marketplace", "anonymous", "creative", "remix", "notes", "ghost"],
  authors: [{ name: "GhostNote" }],
  creator: "GhostNote",
  publisher: "GhostNote",
  openGraph: {
    title: "GhostNote - Anonymous Creative Writing Marketplace",
    description: "Write. Sell. Clone. Defend Your Ghost. Marketplace for original thought in the digital underground.",
    type: "website",
    locale: "en_US",
    siteName: "GhostNote",
  },
  twitter: {
    card: "summary_large_image",
    title: "GhostNote - Anonymous Creative Writing Marketplace",
    description: "Write. Sell. Clone. Defend Your Ghost. Marketplace for original thought in the digital underground.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider defaultTheme="dark">
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
