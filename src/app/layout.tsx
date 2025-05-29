import type { Metadata } from "next";
import { Montserrat } from "next/font/google"; // Import Montserrat font
import "./globals.css";
import React from "react";

// Define the Montserrat font with different weights
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Master rad - Drazen Simonovic",
  description: "Razvoj obrazovnog veb portala za ucitelje i nastavnike",
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
