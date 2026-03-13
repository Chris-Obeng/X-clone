import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/lib/Provider";
import { chirp } from "@/src/app/fonts";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { ClerkProvider } from "@clerk/nextjs";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

// Prevent Font Awesome from inserting its CSS automatically.
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "X-clone",
  description: "A clone of X built with Next.js and TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={chirp.variable}>
      <body
        className={`${chirp.className} antialiased bg-black text-white min-h-screen`}
      >
        <ClerkProvider>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <Provider>{children}</Provider>
        </ClerkProvider>

      </body>
    </html>
  );
}
