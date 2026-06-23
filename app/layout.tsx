import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Space_Grotesk, Bebas_Neue } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/AuthProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas-neue",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SagarFlix",
    template: "%s | SagarFlix",
  },
  description: "A cinematic career operating system for Sagar Patel.",
  keywords: [
    "Sagar Patel",
    "career OS",
    "portfolio",
    "embedded linux",
    "robotics",
    "AI",
    "software engineering",
  ],
  openGraph: {
    title: "SagarFlix",
    description: "A cinematic career operating system for Sagar Patel.",
    url: siteUrl,
    siteName: "SagarFlix",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SagarFlix",
    description: "A cinematic career operating system for Sagar Patel.",
  },
};

export const viewport = {
  themeColor: "#080808",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(spaceGrotesk.variable, bebasNeue.variable)}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
