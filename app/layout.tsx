import type { Metadata } from "next"
import { Inter, Newsreader } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
})

const newsreader = Newsreader({
  subsets: ["latin", "vietnamese"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "Artify Design — Creative Team",
  description:
    "Artify Design là một creative team tại Ho Chi Minh City chuyên về branding, key visual, social media, POSM và motion design.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={cn(
        "scroll-smooth antialiased",
        inter.variable,
        newsreader.variable,
        "font-sans"
      )}
    >
      <body className="flex min-h-screen min-h-dvh flex-col">
        <ThemeProvider>
          <div className="flex min-h-screen min-h-dvh flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
