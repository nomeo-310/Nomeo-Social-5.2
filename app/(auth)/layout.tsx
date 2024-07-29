import type { Metadata } from "next";
import localFont from 'next/font/local'
import "../globals.css";
import ToastProvider from "@/providers/ToastProvider";

export const metadata: Metadata = {
  title: {template: "%s | Nomeo Social", default: "Nomeo Social"},
  description: "A social media webapp built with nextjs. A webapp designed by Salomi Afolabi of Nomeo Consults. The app was initially built but a second version is created to include new features.",
};

const urbanist = localFont({
  src:[{path: "../../public/fonts/Urbanist-Regular.ttf", weight: '400' }],
  variable: '--font-urbanist',
})

const barlow = localFont({
  src:[{path: "../../public/fonts/Barlow-Regular.ttf", weight: '400' }],
  variable: '--font-barlow',
});

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body className={`${urbanist.variable} ${barlow.variable}`}>
        <div className="absolute">
          <ToastProvider />
        </div>
        {children}
      </body>
    </html>
  );
}