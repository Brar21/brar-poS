
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import useStore from "@/hooks/useStore";
import StoreTitle from "@/components/StoreTitle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "POS-Billing-System",
  description: "Free Pos - system for every shopkeeper for easy billing and sales tracking in real time.",
  manifest:"/manifest.json",
  themeColor:"#000000"
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">  <StoreTitle />
      <script
  dangerouslySetInnerHTML={{
    __html: `
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then((reg) => {

          // 🔥 CHECK FOR UPDATE
          reg.onupdatefound = () => {
            const newWorker = reg.installing;

            newWorker.onstatechange = () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // NEW UPDATE AVAILABLE
                  window.dispatchEvent(new Event('app-update'));
                }
              }
            };
          };
        });
      }
    `,
  }}
/>
        {children}</body>
    </html>
  );
}
