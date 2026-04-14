"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";

import BackToTopButton from "@/components/scroll/ToTopBtn";
import { ThemeProvider } from "next-themes";
import { Swinger } from "@/components/Animate/Swing";
import StoreProvider from "@/providers/StoreProvider";
import MainNavbar from "@/components/MainNavbar";

import Footer from "./Footer";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <MainNavbar />
        <div className={`min-h-screen overflow-x-hidden _page`}>
          {children}
          <Swinger className="fixed bottom-6 right-6 z-30">
            <BackToTopButton />
          </Swinger>
          <Toaster position="top-right" richColors />
        </div>
        <Footer />
      </ThemeProvider>
    </StoreProvider>
  );
}
