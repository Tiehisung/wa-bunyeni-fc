import { ReactNode } from "react";
import ClientLayout from "./ClientLayout";
import "./globals.css";
import { ENV } from "@/lib/env";

export const metadata = {
  title: "Konjiehi FC – Official Website",
  description: "Latest news, fixtures, player stats and match highlights.",
  keywords: [
    "Konjiehi FC",
    "football",
    "fixtures",
    "news",
    "players",
    "Wa",
    "Konjiehi",
    "konfc",
  ],
  openGraph: {
    title: "Konjiehi FC",
    description: "Official football club website.",
    url: "https://konjiehifc.vercel.app",
    images: [
      {
        url: "https://konjiehifc.vercel.app/favicon.ico",
        width: 1200,
        height: 630,
      },
    ],
  },
};
ENV
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative overflow-x-hidden">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

 