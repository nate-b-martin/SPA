import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/providers";
import { cn } from "@/lib/utils";
import { Inter, Playfair_Display } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ErrorBoundary from "@/components/error-boundary";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Nathan Martin - Tech Consultant",
  description: "Portfolio website of Nathan Martin, a Tech Consultant based in Minneapolis, Minnesota. Showcasing projects, blog posts, and technical expertise.",
  keywords: ["Nathan Martin", "Tech Consultant", "Portfolio", "Minneapolis", "Technology", "Software Development"],
  authors: [{ name: "Nathan Martin" }],
  creator: "Nathan Martin",
  openGraph: {
    title: "Nathan Martin - Tech Consultant",
    description: "Portfolio website of Nathan Martin, a Tech Consultant based in Minneapolis, Minnesota.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nathan Martin - Tech Consultant",
    description: "Portfolio website of Nathan Martin, a Tech Consultant based in Minneapolis, Minnesota.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'flex min-h-screen flex-col font-sans antialiased',
          inter.variable,
          playfair.variable 
        )}
      >
      <Providers>
        <ErrorBoundary>
          <Header/>
          <main className='grow'>{children}</main>
          <Footer/>
        </ErrorBoundary>
      </Providers>
      </body>
    </html>
  );
}
