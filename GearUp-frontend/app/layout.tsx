import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { QueryProvider } from "@/components/query-provider";
import "./globals.css";

// The "Field Journal" design system names Fraunces / Inter / JetBrains Mono
// as its display, body, and tag faces — load them for real via next/font
// (self-hosted, zero layout-shift) rather than relying on the browser to
// silently fall back to Georgia/system-ui.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GearUp — Rent outdoor gear from real people",
  description:
    "Browse and rent camping, climbing, and water sports gear listed by providers near you.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="paper-grain relative flex min-h-screen flex-col bg-paper font-body text-ink">
        <QueryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--canvas)",
                color: "var(--ink)",
                border: "1px solid var(--line-canvas)",
                borderRadius: "3px",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
              },
              classNames: {
                error: "!border-rust/50 [&_[data-icon]]:!text-rust",
                success: "!border-moss/50 [&_[data-icon]]:!text-moss-dark",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
