import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home (FTS)",
  description: "A file tracking system for BRUR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F6F7F7] mx-2`}
      >
        <NextTopLoader height={10} color={"red"} />
        <div className="background-image"></div>
        <div
          className={
            "min-h-[94vh] md:min-h-[100vh] flex flex-col justify-between"
          }
        >
          <div>
            <Navbar />
            <div className={"mt-2"}>
              <p
                className={
                  "text-xl md:text-3xl text-blue-400 font-bold text-center "
                }
              >
                Begum Rokeya University, Rangpur
              </p>
              <p
                className={
                  "text-xl md:text-3xl text-blue-400 font-bold text-center "
                }
              >
                File Tracking System
              </p>
              {children}
            </div>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
