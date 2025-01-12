import "./globals.css";
import { Outfit } from "next/font/google";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner"

export const metadata = {};

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={outfit.className}>
          <Provider>{children}</Provider>
          <Toaster />
        </body>
      </ClerkProvider>
    </html>
  );
}
