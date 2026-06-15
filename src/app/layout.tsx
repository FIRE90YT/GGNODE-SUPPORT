import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "GGNODES Support",
  description: "Premium Hosting Support System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${plusJakartaSans.variable}`}>
      <body
        className={`min-h-screen flex flex-col font-sans antialiased bg-[#020617] text-[#F8FAFC] selection:bg-[#22C55E]/30 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
