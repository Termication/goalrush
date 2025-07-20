import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/navbar";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/common/footer";


const inter =
 Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-inter", 
});


const poppins = Poppins({
  subsets: ["latin"],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "GoalRush - Your Daily Football Fix",
  description: "The latest football news, live scores, and in-depth analysis from around the world. Your home for everything football.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased min-h-screen bg-gradient-to-br from-neutral-100 via-neutral-200 to-white`}
      >
        <Navbar />
        <NextAuthProvider>
          <Toaster position="top-right" reverseOrder={false} />
          {/* The {children} prop will be the content of our pages */}
          {children}
        </NextAuthProvider>
        <Footer />
      </body>
    </html>
  );
}

