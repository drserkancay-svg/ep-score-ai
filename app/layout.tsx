import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EP-SCORE AI",
  description: "Cardiac Electrophysiology Risk Calculators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}