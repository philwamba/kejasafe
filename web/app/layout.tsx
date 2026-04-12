import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://kejasafe.co.ke"),
  title: {
    default: "Kejasafe",
    template: "%s | Kejasafe",
  },
  description: "Modern rental, property, and tenant operations platform.",
  openGraph: {
    title: "Kejasafe",
    description: "Modern rental, property, and tenant operations platform.",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://kejasafe.co.ke",
    siteName: "Kejasafe",
    locale: "en_KE",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
