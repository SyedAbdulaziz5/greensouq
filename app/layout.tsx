import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "./components/SessionProvider";
import ConditionalLayout from "./components/ConditionalLayout";

export const metadata: Metadata = {
  title: {
    default: "GreenSouq - Your Plant Paradise",
    template: "%s | GreenSouq",
  },
  description: "Discover a wide variety of indoor and outdoor plants, gardening tools, and accessories at GreenSouq. Your one-stop shop for all your gardening needs.",
  keywords: ["plants", "gardening", "indoor plants", "outdoor plants", "succulents", "garden tools"],
  authors: [{ name: "GreenSouq" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://greensouq.com",
    siteName: "GreenSouq",
    title: "GreenSouq - Your Plant Paradise",
    description: "Discover a wide variety of indoor and outdoor plants, gardening tools, and accessories.",
  },
  robots: {
    index: true,
    follow: true,
  },
  
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <SessionProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
