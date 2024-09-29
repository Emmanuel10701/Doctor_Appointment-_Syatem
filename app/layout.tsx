import type { Metadata } from "next";
import ClientLayout from "../app/_app";
import "./globals.css";


export const metadata: Metadata = {
  title: "Appointments",
  description: "Doctors Appointment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
