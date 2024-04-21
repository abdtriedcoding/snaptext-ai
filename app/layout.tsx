import "./globals.css";
import { Toaster } from "sonner";
import { constructMetadata } from "@/lib";
import { Poppins } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/react";

const font = Poppins({ subsets: ["latin"], weight: ["500"] });

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Header />
        <main className="flex flex-1 max-w-2xl mx-auto w-full flex-col items-center justify-center text-center px-4 py-10">
          <Toaster richColors theme="system" />
          {children}
          <Analytics />
        </main>
        <Footer />
      </body>
    </html>
  );
}
