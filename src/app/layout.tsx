import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Med-Life - Sistema de Gestión Médica",
  description: "Plataforma médica integral para la gestión de consultorios y clínicas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} ${montserrat.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
