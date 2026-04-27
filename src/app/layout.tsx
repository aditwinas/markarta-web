import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Markarta",
  description: "Dashboard internal ARTA Partners untuk memantau performa multi-brand."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
