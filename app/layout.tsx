import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "DEAL | Connecting Global Capital",
  description: "Strategic investment opportunities connecting global capital with Iran's high-growth sectors.",
  openGraph: {
    title: "DEAL | Connecting Global Capital",
    description: "Strategic investment opportunities connecting global capital with Iran's high-growth sectors.",
    siteName: "DEAL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" data-theme="dark" className="dark min-w-80 scroll-smooth" suppressHydrationWarning>
      <body className="min-w-80 overflow-x-hidden bg-background font-[var(--font-persian)] text-foreground antialiased">{children}</body>
    </html>
  );
}
