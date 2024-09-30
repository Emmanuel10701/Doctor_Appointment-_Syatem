"use client";

import { usePathname } from "next/navigation";
import localFont from "next/font/local";

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
  const isDoctorPage = pathname === '/doctorpage'; // Adjust if the path is different

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      {/* Only show the navbar if it's not the admin or doctor page */}
      {!isAdminPage && !isDoctorPage && (
        <nav className="navbar">
          {/* Your navbar content here */}
        </nav>
      )}
      <main className="container mx-auto p-4">{children}</main>
      {/* Only show the footer if it's not the admin or doctor page */}
      {!isAdminPage && !isDoctorPage && (
        <footer className="footer">
          {/* Your footer content here */}
        </footer>
      )}
    </div>
  );
}
