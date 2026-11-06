import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Caveat } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const caveat = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BeautyAura.ai — AI Virtual Try-On, Skin, Hair & Photo Studio",
  description:
    "AI Photo Editor for Skin and Face Body, Fashion, Virtual Try-On, Hair and Beard, Image Editing, and all kinds of fashion and beauty-related photo editing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn(
        "h-full scroll-smooth antialiased",
        geistSans.variable,
        geistMono.variable,
        inter.variable,
        caveat.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 selection:bg-orange-500 selection:text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
