import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Roboto_Slab } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const slab = Roboto_Slab({ subsets: ["latin"], variable: "--font-slab" });

export const metadata: Metadata = {
  title: "CBVT Kitchen · Operations",
  description:
    "A clear view of your kitchen operations, inventory, and purchasing.",
};
export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#203b61",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${geist.variable} ${slab.variable} antialiased`}>
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
