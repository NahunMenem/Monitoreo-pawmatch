import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "PawMatch Admin",
  description: "Centro de monitoreo PawMatch",
  icons: { icon: "https://res.cloudinary.com/dqsacd9ez/image/upload/v1776960686/PawMatch_mts0wd.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
