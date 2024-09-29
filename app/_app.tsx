"use client";

import { usePathname } from "next/navigation";
import localFont from "next/font/local";
import Navbar from "./components/navbar";
import Footer from "./components/Footer/page";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname === '/admin';

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Navbar />
      <main className="container mx-auto p-4">{children}</main>
      {!isAdminPage && <Footer />}
    </div>
  );
}
