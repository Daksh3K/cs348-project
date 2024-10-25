import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "@src/components/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CS348 Project",
  description: "Dakshesh Gupta's Project for CS348",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
