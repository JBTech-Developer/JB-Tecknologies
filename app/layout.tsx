import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileLeadButton from "@/components/MobileLeadButton";

export const metadata: Metadata = {
  title: "JB Technologies - Network Cabling Services",
  description: "Professional network cabling installation and low-voltage services across the United States",
  icons: {
    icon: "/assets/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        <Header />
        <main className="min-h-screen pb-20 md:pb-0">{children}</main>
        <Footer />
        <MobileLeadButton />
      </body>
    </html>
  );
}

