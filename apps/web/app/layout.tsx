import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const font =Poppins({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
})

export const metadata: Metadata = {
  title: "Gestion Analítica de Cafeterías",
  description: "Gestion Analítica de Cafeterías",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <body className={`${font.className} h-full antialiased`}>{children}</body>
    </html>
  );
}
