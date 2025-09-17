import { Geist, Geist_Mono, Cedarville_Cursive } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import Why from "@/components/Layout/Why";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const cursive = Cedarville_Cursive({
  variable: "--font-cedarville_cursive-cursive",
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` font-mono antialiased bg-white`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
