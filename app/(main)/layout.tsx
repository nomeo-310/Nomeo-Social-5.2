import type { Metadata } from "next";
import localFont from 'next/font/local'
import "../globals.css";
import NavBar from "./components/NavBar";
import { getCurrentUser } from "@/lib/authAction";
import { ThemeProvider } from 'next-themes'
import MenuBar from "./components/MenuBar";
import ToastProvider from "@/providers/ToastProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server";
import { fileRouter } from "../api/uploadthing/core";
import AuthProvider from "@/providers/AuthProvider";

export const metadata: Metadata = {
  title: {template: "%s | Nomeo Social", default: "Home Page | Nomeo Social"},
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

export default async function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={`${urbanist.variable} ${barlow.variable}`}>
        <AuthProvider>
          <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)}/>
          <ReactQueryProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange >
              <ToastProvider/>
              <div className="flex min-h-screen flex-col">
                <NavBar currentUser={currentUser}/>
                <div className="max-w-7xl p-4 mx-auto flex w-full grow gap-4">
                  <MenuBar className="cursor-pointer sticky top-[5rem] h-fit hidden sm:block flex-none space-y-3 rounded-md bg-card px-3 py-4 xl:px-4 shadow-sm xl:w-72"/>
                  {children}
                </div>
                <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden"/>
              </div>
            </ThemeProvider>
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
