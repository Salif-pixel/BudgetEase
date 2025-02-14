import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/src/components/ui/toaster";
import { EdgeStoreProvider } from "@/src/lib/edgestore";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "💰 BudgetEase",
  description: "BudgetEase est une app permmettant de vous aider a gerer vos budgetisation universitaire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
      <meta property="og:title" content="Budgetease" />
      <meta property="og:description" content="Découvrez notre plateforme de budgetisation" />
      <meta property="og:image" content="/dashboard.png" />
      <meta property="og:url" content="/dashboard.png" />
      <meta property="og:type" content="website" />
      <link rel="icon" href="/salary.png" sizes="any" />
    </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans  antialiased `}
      >
        <Toaster />
        <EdgeStoreProvider>{children}</EdgeStoreProvider>

      </body>
    </html>
  );
}
