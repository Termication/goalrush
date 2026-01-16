import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import { Toaster } from "react-hot-toast";
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import WebSiteJsonLd from "@/components/seo/WebSiteJsonLd";

const inter = Inter({
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

// Using your detailed metadata for better SEO
export const metadata: Metadata = {
  metadataBase: new URL("https://www.goal-rush.live"),
  title: "GoalRush - Your Daily Football Fix",
  description:
    "Stay updated with the latest football news, live scores, match highlights, transfer rumors, and expert analysis from all leagues around the world.",
  keywords: [
    "football news", "soccer news", "live scores", "match highlights", "football analysis",
    "Premier League", "La Liga", "Champions League", "Serie A", "Bundesliga", "Ligue 1",
    "psl", "south africa football", "football updates", "football scores", "south africa mtn8",
    "football transfers", "football articles", "football blog", "sports news", "GoalRush"
  ],
  authors: [{ name: "GoalRush Team", url: "https://www.goal-rush.live" }],
  openGraph: {
    title: "GoalRush - Your Daily Football Fix",
    description: "Breaking football news, live match updates, and expert commentary. Join GoalRush for your daily dose of world football.",
    url: "https://www.goal-rush.live",
    siteName: "GoalRush",
    locale: "en_ZA",
    type: "website",
    images: [{
      url: "https://www.goal-rush.live/OG-image.png",
      height: 630,
      alt: "GoalRush - Football News and Highlights",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GoalRush - Your Daily Football Fix",
    description: "All the latest football news, results, and expert insights on GoalRush.",
    images: ["https://www.goal-rush.live/OG-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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
        {/* --- GOOGLE ADSENSE SCRIPT --- */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6954056820104129"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* ------------------------------------------- */}
        
        {/* Organization & WebSite Structured Data */}
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        
        <NextAuthProvider>
          <Navbar />
          <Toaster />
          {children}
          <Footer />
          <Analytics />
        </NextAuthProvider>
      </body>
    </html>
  );
}
