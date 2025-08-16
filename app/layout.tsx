import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
export const metadata: Metadata = {
  title: "The Daily Express Kenya ",
  description: "The Daily Express Kenya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body ><Navbar />
        {children}

        <Footer />
      </body>
    </html>
  );
}
