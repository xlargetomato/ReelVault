import "./globals.css";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

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
