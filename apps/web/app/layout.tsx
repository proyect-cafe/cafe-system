import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Gestion Analitica de Cafeterias",
  description: "Frontend del monorepo para la gestion analitica de cafeterias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${font.className} h-full antialiased`}>{children}</body>
    </html>
  );
}
