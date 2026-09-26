import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luvéra — Wear the night.",
  description:
    "Modern fashion, after dark. Premium clothing, accessories and footwear delivered to your door.",
  keywords: ["fashion", "clothing", "luxury", "modern", "Luvéra", "Pakistan"],
  openGraph: {
    title: "Luvéra — Wear the night.",
    description: "Modern fashion, after dark.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0B0A14] text-[#F5EFE7]">
        {children}
      </body>
    </html>
  );
}