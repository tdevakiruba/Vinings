import type { Metadata } from "next"
import { DM_Sans, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { PlatformShell } from "@/components/platform-shell"
import "./globals.css"

const _dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] })
const _inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Transformer Hub Institute | Leadership Development Platform",
    template: "%s | Transformer Hub Institute",
  },
  description:
    "Structured, research-backed leadership programs for executives, students, faith leaders, youth, and enterprise teams.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <PlatformShell>{children}</PlatformShell>
        <Analytics />
      </body>
    </html>
  )
}
