import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import React from "react";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Master rad - Dražen Simonović",
  description: "Razvoj obrazovnog veb portala za učitelje i nastavnike",
  icons: {
    icon: [{ url: "/stack-of-books.png", type: "image/png", sizes: "32x32" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
