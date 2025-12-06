import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QueryProvider from "@/components/QueryProvider";
import MobileMessagingButton from "@/components/MobileMessagingButton";

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VSO Clinic",
  description:
    "VSO Clinic - Professional physiotherapy and rehabilitation services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body suppressHydrationWarning>
        <QueryProvider>
          <Header />
          {children}
          <Footer />
          <MobileMessagingButton />
        </QueryProvider>
      </body>
    </html>
  );
}
